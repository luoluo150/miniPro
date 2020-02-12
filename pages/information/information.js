// pages/information/information.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    titlevalue:"1",
    titleid:1,
    textvalue:"",
    disabled:false,
    titletop:"5.5%",
    pw: 375,
    bgheight: 535,
    model:"",
    cntext: "",
    entext: "",
    oppic:"",
    ishow:true,
    imgList:[],//存放图片的临时路径
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['美国自由行', '当地的文化差异', '自由女神像在什么地方呢要不要去看呢一行可以有多少字呢', '黑人英雄爱吃土豆', '活力校园', '国际交流奖', '案例评选', '获奖心得', '获奖心得', '获奖心得', '获奖心得', '获奖心得', '获奖心得', '获奖心得', '获奖心得', '获奖心得', '获奖心得', '获奖心得', '获奖心得', '20', '21'],//下拉列表的数据
    index: 0//选择的下拉列表下标
  },
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    console.log(e);
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    let value = e.currentTarget.dataset.value;//获取点击的下拉列表的值
    console.log(Index);
    console.log(value);
    this.setData({
      index: Index,
      show: !this.data.show,
      titlevalue: value,
      titleid:Index
    });
  },
  getpicdata: function () {//拿背景图片
    var opbg = app.globalData.fileurl + wx.getStorageSync("daillyreview");
    this.setData({
      oppic: opbg
    });
  },
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          model: res.model,
          pw: res.windowWidth  //屏幕宽度
        })
      }
    })

    var pbgheight = 0;
    pbgheight = (that.data.pw) / 0.7;
    that.setData({ bgheight: pbgheight }); //吧新的高度传给图片
    var topnum = "";
    if (that.data.model == "iPhone X" || that.data.model == "iPhone XR" || that.data.model == "iPhone XS Max") {
      topnum = "4.7%";
    } else if (that.data.model == "iPhone 6/7/8" || that.data.model == "iPhone 6 / 7 / 8 Plus") {
      topnum = "5.5%";
    } else if (that.data.model == "iPhone 6 / 7 / 8 Plus") {
      topnum = "5.7%";
    } else {
      topnum = "5.5%";
    }
    this.setData({ cntext: options.cntitle, entext: options.entitle, titletop: topnum});
    this.getpicdata()
    wx.request({ //获取标题
      url: app.globalData.serhttp +"/title/AlltitleList",
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data.data.list);
        var data = res.data.data.list;
        var titlelist = []; 
        for(var i=0;i<data.length;i++){
          var listaa = {};
          if(i==0){
            var key1 = "name"; listaa[key1] = data[i].title;
            var key2 = "value"; listaa[key2] = data[i].id;
            var key3 = "checked"; listaa[key3] = true;
            titlelist.push(listaa);
            that.setData({ titlevalue: data[i].title})
          }else{
            var key4 = "name"; listaa[key4] = data[i].title;
            var key5 = "value"; listaa[key5] = data[i].id;
            var key6 = "checked"; listaa[key6] = false;
            titlelist.push(listaa);
          }
          
        }
        console.log(titlelist);
        that.setData({
         items: titlelist
        })
      
      }
    })
  },
  getValue:function(e){//编辑日志
    console.log(e.detail.value);
    this.setData({ textvalue: e.detail.value });
  },
  ChooseImage() {//上传图片
    wx.chooseImage({
      count: 6, //默认9 最多可以选的图片张数
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从拍照或相册选择
      success: (res) => {
        //console.log(res.tempFilePaths);
        if (this.data.imgList.length != 0) { //concat用于连接多个数组
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
        this.uploadimg();
      }
    });
  },
  uploadimg:function () {//这里触发图片上传的方法
    var pics = this.data.imgList;
    app.globalData.upim1 = ""; app.globalData.upim2 = ""; app.globalData.upim3 = "";  
    app.globalData.upim4= ""; app.globalData.upim5 = ""; app.globalData.upim6 = ""; 

    //console.log(pics);
    app.uploadimg({
      url: app.globalData.serhttp +'/SubmitPhotoFile/uploadMusicFile ',//这里是你图片上传的接口
      path: pics,//这里是选取的图片的地址数组
    });
    wx.showLoading({
      title: '加载中',
      mask:true
    })
  },
  ViewImage(e) {
    wx.previewImage({ //在新页面中全屏预览图片
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {//删除图片
    wx.showModal({
      title: '提示',
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          app.globalData.picsave = true;
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  submit: function (){//提交按钮
    var that = this;
    that.setData({
      disabled:true
    });
    if (app.globalData.picsave==false){
      wx.showToast({
        title: '图片内容违规,请删除后重新上传',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        disabled: false
      });
      return false;
    }else{
      var uname = ""
      if (app.globalData.tel == "") {
        uname = app.globalData.username;
      } else { 
        uname = app.globalData.teachername; 
      }
      var choose = that.data.titlevalue;
      var tid = that.data.titleid;
      var textvalue = that.data.textvalue;
      console.log(app.globalData.userid);
      var diary = {
        descr: textvalue,
        filepath1: app.globalData.upim1,
        filepath2: app.globalData.upim2,
        filepath3: app.globalData.upim3,
        filepath4: app.globalData.upim4,
        filepath5: app.globalData.upim5,
        filepath6: app.globalData.upim6,
        title: choose,
        titleid: tid,
        userid: app.globalData.userid,
        username: uname
      };
      wx.request({ //提交成功
        url: app.globalData.serhttp + "/Diary/SubmitDiary",
        method: 'POST',
        data: JSON.stringify(diary),
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log(res);
          if (res.data.data!= "内容违规-----------") {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
            // that.setData({
            //   disabled: false
            // });
            var times = setTimeout(function () {
              wx.navigateBack({
                url: '/pages/center/center',
              })
            }, 2000)
          } else{
            wx.showToast({
              title: '提交失败，含有非法字符',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              disabled: false
            });
            // var times = setTimeout(function () {
            //   wx.navigateBack({
            //     url: '/pages/center/center',
            //   })
            // }, 2000)
          }
        }
      })
    }
   
  },
})