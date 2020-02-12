//app.js
const request = require('./utils/request.js');
App({
  request: request,
  onLaunch: function (options) {//options  调用接口查看是否有权限
   var that=this;
    console.log(options);
    var sce = options.scene; //正常进来的场景值
    that.globalData.scene=sce;
    if (options.referrerInfo.extraData.phone == undefined) {
      wx.navigateTo({
        url: '/pages/register/register',
      })
    } else {
      var tel = options.referrerInfo.extraData.phone;
      that.globalData.tel = options.referrerInfo.extraData.phone;
      console.log(tel);
      wx.request({ //判断是否是美国行老师
        url: "*****?mobilePhone=" + tel,
        method: 'get',
        success: function (res) {
          console.log(res.data.data);
          var hasqx = res.data.data;
          that.globalData.qx = hasqx;
          if (!res.data.data) {//fanhui
            that.returnf();//就调用返回api
          } else {
            var myarray = res.data.data.split(",");
            console.log(myarray);
            that.globalData.qx = true;
            console.log(that.globalData.qx);
            that.globalData.teachername = myarray[1];
            that.globalData.userid = myarray[0];
            console.log("是30位老师之中的");
          }
        }
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.phonetype = res.model;
        console.log(res.model);
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  },
  returnf:function(){
    var that=this;
    console.log("应该返回");
    that.globalData.qx = false;
    console.log("showModal1");
        //  wx.showModal({
        //   title: '提示',
        //   content: '未找到您的注册信息，请联系活力校园主办方',
        //   showCancel: false,
        //   success(res) {
        //     if (res.confirm) {
        //       wx.navigateBackMiniProgram({
        //         // success(res) {
        //         //   console.log("返回成功");
        //         // }
        //       })
        //     }
        //   }
        //  })

  },
  onShow: function () {
    var that = this;
    console.log(that.globalData.tel);
    if (that.globalData.tel!=""){
      wx.request({ //判断是否是美国行老师
        url: "*****?mobilePhone=" + that.globalData.tel,
        method: 'get',
        success: function (res) {
          console.log(res.data.data);
          var hasqx = res.data.data;
          that.globalData.qx = hasqx;
          if (!res.data.data) {
            that.returnf();//就调用返回api
          } else {
            var myarray = res.data.data.split(",");
            console.log(myarray);
            that.globalData.qx = true;
            console.log(that.globalData.qx);
            that.globalData.teachername = myarray[1];
            that.globalData.userid = myarray[0];
            console.log("是30位老师之中的");
          }
        }
      })
    }
  },
  uploadimg: function (data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
      wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: 'file',
        formData: null,
        success: (resp) => {
          success++;
          var obj = JSON.parse(resp.data); 
          console.log(obj);
          if (obj.data =="图片内容违规-----------"){
            wx.showToast({
              title: '图片内容违规,请重新上传',
              icon: 'none',
              duration: 2000
            })
            that.globalData.picsave=false;
            return false;
          }else{
           // that.globalData.picsave = true;
            if (i == 0) {
              that.globalData.upim1 = obj.data;
            } else if (i == 1) {
              that.globalData.upim2 = obj.data;
            } else if (i == 2) {
              that.globalData.upim3 = obj.data;
            } else if (i == 3) {
              that.globalData.upim4 = obj.data;
            } else if (i == 4) {
              that.globalData.upim5 = obj.data;
            } else if (i == 5) {
              that.globalData.upim6 = obj.data;
            }
          }
        },
        fail: (res) => {
          fail++;
          console.log('fail:' + i + "fail:" + fail);
        },
        complete: () => {
          console.log(i);
          i++;
          if (i == data.path.length) { //当图片传完时，停止调用  
            console.log('执行完毕');
            console.log('成功：' + success + " 失败：" + fail);
            wx.hideLoading();
           // console.log(that.globalData.onlineimglist);
            console.log(that.globalData.upim1);
            console.log(that.globalData.upim2);
             console.log(that.globalData.upim3);
             console.log(that.globalData.upim4);
              console.log(that.globalData.upim5); 
              console.log(that.globalData.upim6);
          } else {
            //若图片还没有传完，则继续调用函数
            console.log(i);
            data.i = i;
            data.success = success;
            data.fail = fail;
            that.uploadimg(data);
          }

        }
      });
  },
  //多张图片
 
  apiUrl:'*********',
  allurlpic:{
    loaddingloao:"",
    returnbgp:"",
    indexbg:"",
    indexwelcome: "",
    opinions: "",
    group: "",
    agenda: "",
    history: "",
    hotel: "",
    weather: "",
    localtion: "",
    contacts: "",
    mylog: "",
    regbg: "",
    daillyreview: "",
    venue:""
  },
  globalData: {
    tel:"",
    picsave:true,
    textsave:true,
    scene:"",//场景值
    qx:false,
    userInfo: null,
    referrerInfo: {},
    username: "",
    phonetype: "",
    serhttp:"https://*****.com",
    openid: "",
    weisshow: null,
    myinfo: "",
    userid: 0,
    teachername:"",
    logopic: "",
    fileurl:"http://*****/admin/",
    cname: "",
    Model:"",
    alreg: '', //判断用户是否注册
    onlineimglist: [],//服务器上的图片路径
    upimg1:"",
    upimg2: "",
    upimg3: "",
    upimg4: "",
    upimg5: "",
    upimg6: "",
    upimg7: "",
    upimg8: "",
    upimg9: "",
  },
  comdata:"",
  
})