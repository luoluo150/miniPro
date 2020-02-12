const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    cname:"",
    logopic:"",
    loadimg:"",
    serurl:"",
    noqx:false
  },
  getpicdata: function () {
    var that=this;
    var indexbg = that.data.serurl + wx.getStorageSync("indexbg");
    var loadlogo1 = that.data.serurl + wx.getStorageSync("loadlogo");
    var opinions = that.data.serurl + wx.getStorageSync("opinions");
    var group = that.data.serurl + wx.getStorageSync("group");
    var agenda = that.data.serurl + wx.getStorageSync("agenda");
    var history = that.data.serurl + wx.getStorageSync("history");
    var hotel = that.data.serurl + wx.getStorageSync("hotel");
    var weather = that.data.serurl + wx.getStorageSync("weather");
    var localtion = that.data.serurl + wx.getStorageSync("localtion");
    var contacts = that.data.serurl + wx.getStorageSync("contacts");
    var mylog = that.data.serurl + wx.getStorageSync("mylog");
    var regbg = that.data.serurl + wx.getStorageSync("regbg");
    var daillyreview = that.data.serurl + wx.getStorageSync("daillyreview");
    var venue = that.data.serurl + wx.getStorageSync("venue");
    var comdata =  wx.getStorageSync("comingsoondate");
    var returnbg = that.data.serurl + wx.getStorageSync("returnbg");
    app.allurlpic.loaddingloao = loadlogo1;
    app.allurlpic.returnbgp = returnbg;
    // app.globalData.weisshow = welcomeisshow;
    app.allurlpic.loaddingloao=loadlogo1,
    app.allurlpic.indexbg=indexbg,
    //app.allurlpic.indexwelcome=indexwelcome,
    app.allurlpic.opinions=opinions,
    app.allurlpic.group=group,
    app.allurlpic.agenda=agenda,
    app.allurlpic.history=history,
    app.allurlpic.hotel=hotel,
    app.allurlpic.weather=weather,
    app.allurlpic.localtion=localtion,
    app.allurlpic.contacts=contacts,
    app.allurlpic.mylog=mylog,
    app.allurlpic.regbg=regbg,
    app.allurlpic.daillyreview=daillyreview,
    app.allurlpic.venue=venue,
    app.comdata = comdata
  },
  onReady:function(){
    var that=this;

    wx.request({
      url: app.globalData.serhttp + '/ConfigText_Template/ConfigText_TemplateList',
      method: 'get',
      data: {
        "params": "",
        "pageNum": "",
        "pageSize": ""
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        //console.log(res.data.data.list);
        var list = res.data.data.list;
        for (var i = 0; i < list.length; i++) {
          wx.setStorageSync(list[i].key, list[i].value);
        }

      },
      complete: function () {
        that.getpicdata()
        wx.login({
          success: function (res) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            //console.log(res);
            if (res.code) {
              //发起网络请求
              wx.request({
                url: app.globalData.serhttp + '/user/userSign',
                method: 'get',
                data: { code: res.code },
                header: { 'content-type': 'application/json' },
                success: function (res) {
                   console.log(res.data.data);
                  app.globalData.openid = res.data.data; //拿到后将openid存入全局变量  以便其他页面使用
                 // app.globalData.openid ='oczjF5BIMzxeT83LBcgRK3JSsagg';
                  console.log(app.globalData.tel);
                   if(app.globalData.tel!=""){
                      if (app.globalData.qx){//有权限
                        wx.redirectTo({ //若是30个老师则直接跳转到首页
                           url: '/pages/center/center',
                          //url: '/pages/register/register',
                        })
                      }else{
                        that.setData({ noqx:true});
                      }
                  }else{
                    wx.request({ //登录接口
                      url: app.globalData.serhttp + '/user/login?openId=' + res.data.data,
                      method: 'POST',
                      header: { 'content-type': 'application/json' },
                      success: function (res) {
                        console.log(res);
                        if (res.data.data != "") {
                          app.globalData.userid = res.data.data.id;//吧userid存到全局变量
                         // app.globalData.userid='oczjF5BIMzxeT83LBcgRK3JSsagg';
                          app.globalData.myinfo = res.data.data; //用户信息存全局
                          app.globalData.username = res.data.data.username;
                          //var date = '2019/06/25 16:16:00';
                          var date = app.comdata;
                          // console.log(date);
                          var time1 = util.formatTime(new Date());
                          var time2 = util.formatTime(new Date(date));
                          //console.log(time1,time2);
                          if (time1 <= time2) {
                           // var times = setTimeout(function () {
                              wx.redirectTo({
                                url: '/pages/coming/coming',
                              })
                          //  }, 2000)
                          } else {
                           // var time = setTimeout(function () {
                              wx.redirectTo({
                               url: '/pages/center/center',
                              //  url: '/pages/register/register',
                              })
                           // }, 3000);
                          }
                        } else {
                          wx.redirectTo({
                            url: '/pages/register/register',
                          })
                        }
                      },
                      fail: function () {
                        //
                      }
                    })
                  }
                 
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })

      }
    })
  },
  returnminp: function () {
    wx.navigateBackMiniProgram({
      success(res) {
        console.log("返回成功");
      }
    })
  },
  successFun: function (res) {
    var loadbg = ""; var loadlogo = "";
    var list = res.data.list;
    for (var i = 0; i < list.length; i++) {
      if (list[i].key == "loadbg") {
        loadbg = this.data.serurl+list[i].value;
      }
      if (list[i].key == "loaddingloao") {
        loadlogo = this.data.serurl+ list[i].value;
      }
    }

    this.setData({
      logopic: loadlogo,
      loadimg: loadbg
    })

  },
  onLoad: function () {
   var that=this;
   that.setData({
     serurl: app.globalData.fileurl
   })
    var url = app.apiUrl + '/ConfigText_Template/ConfigText_TemplateList'
    var params = {
      "params": "",
      'pageNum': '',
      'pageSize': ''
    }
    app.request.requestGetApi(url, params, this, this.successFun);
   }, 
});
