const app = getApp();
Page({
  data: {
     timer:true,
    logotime:true,
    pw: 375,
    bgheight: 535,
     allbtn: [], //所有按钮
    formidlist: {
      "OpenId": "",
      "FormIds": [{
        "FormId": ""
      }]
    },
    view: {      //自定义按钮组标签元素高度、左边距等
      margintop: 0,
      left: 30,
      opacity:0
    },
    extraClasses: '',
    s:false,
    opacity:1,
    opacity2: 1,
    demoy:239,
    QRcodepic:"",
    lastid:null,
    lasttitle:"",
    lastcontent:"",
    welcomepic:"",
    blackpic:"",
    cname:"",
    logopic: "",
    username:"",
    serurl:"",
    zindex:80,
    wisshow:null,
    isdir:false
  },

  onReady: function () {//第一次加载时

  },
  successFun: function (res) { //获取按钮组接口成功后
    console.log(res.data.list);
    var datas = res.data.list;
    var btnlist = [];
    for (var i = 0; i < datas.length; i++) {
      if (datas[i].isdeleted == false) {
        btnlist.push(datas[i]);
      }
    }

    this.setData({ //导入本地json数据
      allbtn: btnlist
    }); 
  },
  getBase64ImageUrl: function (data) {//将base64转成图片
    var base64Data = data;
    base64Data =base64Data.replace(/[\r\n]/g, "");
    /// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
    base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
    /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
    const base64ImgUrl = "data:image/png;base64," + base64Data;
    /// 刷新数据
  
    return base64ImgUrl;
  },
  onLoad() {
    var that=this;
    var usname="";
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth);
        that.setData({
          model: res.model,
          pw: res.windowWidth  //屏幕宽度
        })
      }
    })
    var pbgheight = 0;
    pbgheight = (that.data.pw) / 0.7;
    that.setData({ bgheight: pbgheight }); //吧新的高度传给图片
    if (app.globalData.tel!=""){
      usname = app.globalData.teachername;//如果是30个老师，则使用老师姓名
    }else{
      usname = app.globalData.username;//否则使用注册是的名称
    }
    that.setData({ //导入本地json数据
      serurl: app.globalData.fileurl,
      blackpic: app.allurlpic.indexbg,
     // welcomepic: app.allurlpic.indexwelcome,
      logopic: app.allurlpic.loaddingloao,
     // wisshow: app.globalData.weisshow,
      username: usname
    }); 

    var url = app.apiUrl +"/MenuButton/MenuButtonList" //请求按钮组
    var params = {
        "name":"",
        'pageNum': '',
        'pageSize': ''
      }
    app.request.requestGetApi(url, params, this, this.successFun);
    var lid = that.data.lastid;
    wx.request({//那最新消息
      url: app.globalData.serhttp + '/message/messger',
      method: 'get',
      data: {
        "userId": app.globalData.userid
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        if (res.data.data) {
          var ltitie = res.data.data.title;
          var lcontent = res.data.data.content;
          var nowid = res.data.data.id;
          if (nowid != lid) {
            that.setData({
              lasttitle: ltitie,
              lastcontent: lcontent,
              lastid: nowid
            })
          } else {
            that.setData({
              lastid: nowid
            })
          }

        }


      }
    })
    setInterval(function () {//5秒拿一次最新消息
      wx.request({
        url: app.globalData.serhttp + '/message/messger',
        method: 'get',
        data: {
          "userId": app.globalData.userid
        },
        header: { 'content-type': 'application/json' },
        success: function (res) {
          // console.log(res);
          if (res.data.data) {
            var ltitie = res.data.data.title;
            var lcontent = res.data.data.content;
            var nowid = res.data.data.id;
            if (nowid != lid) {
              that.setData({
                lasttitle: ltitie,
                lastcontent: lcontent,
                lastid: nowid
              })
            } else {
              that.setData({
                lastid: nowid
              })
            }

          }

        }
      })
    }, 5000);
  },

  a: function (e) {
    var that=this;
    var listarr = {};
    that.setData({
      formidlist: {
        OpenId: app.globalData.openid,
        FormIds: [{ "FormId": e.detail.formId }]
      },
    })
    listarr = that.data.formidlist;
    wx.request({ //发送formid
      url: app.globalData.serhttp + '/wechat',
      method: 'POST',
      data: JSON.stringify(listarr),
      header: { 'content-type': 'application/json' },
      success: function (res) {
      }
    })
  },
  closewelcome:function(){
     
    this.setData({ wisshow:0});
  },
  onShow: function () {//页面监听 其他页面切换回来时
    var that=this;
    
  },
 endmove(e){
  //  console.log("结束");
    var that=this;
    var query = wx.createSelectorQuery();
    query.select('#slideview').boundingClientRect(function (rect) {
      if (rect.top < 409) {
        that.setData({
          opacity2: 0,
          extraClasses: 'box-transition',
          zindex:0,
          view: {
            margintop: that.data.view.margintop,
            left: that.data.view.left,
            opacity: 1
          },
          demoy:0
        })
      } 
      if (rect.top >= 409) {
       that.setData({
         opacity2: 1,
         zindex:80,
        extraClasses: 'box-transition',
        view: {
          margintop: that.data.view.margintop,
          left: that.data.view.left,
          opacity: 0,
        },
        demoy:239
      })
    }
    }).exec();
  },
 
})