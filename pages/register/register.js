var util = require('../../utils/util.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    index: null,
    disabled: true,
    afclick:"",
    pw: 375,
    bgheight: 535,
    isclick: false,//验证码的按钮
    phonecode:"",
    btntext: 'SMS CODE',
    logopic:"",
    bo_end:false,//验证按钮是否禁用
    formidlist:{
      "OpenId":"",
      "FormIds":[{
        "FormId":""
      }]
    },
    select: false,
    grade_name: '86',
    //grades: ["86",'852', '853', '886'],
    grades:[{
      "value":'86',
      "name":"Mainland"
    },
    {
      "value": '852',
      "name": "HongKong"
    },
    {
      "value": '853',
      "name": "Macau"
    },
    {
      "value": '886',
      "name": "Taiwan"
    }
    ],
    userName: '',
    mobile: '',
    userEmail :'',
    idcard:'',
    code:"",
    tip:'',
    regbg:"",
    modalName:"'"
  },
 
  blurname:function(e){
    if (e.detail.value.length == 0) {
      this.setData({ tip: '*请输入您的名字' })
          return
        }else{
      this.setData({ tip: '', userName: e.detail.value})
          return
        }
  },
  bluremail: function (e) {
    var email = e.detail.value;
      email = email.replace(/(^\s*)|(\s*$)/g, "");
 
    var reg = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$');
    if (e.detail.value.length == 0) {
      this.setData({ tip: '*请输入正确的邮箱地址', userEmail:"" })
      return
    } else if (!reg.test(email)) {
      this.setData({ tip: '*请输入正确的邮箱格式', userEmail: "" })
      return
    } else {
      this.setData({ tip: '', userEmail: e.detail.value })
      return
    }
  },
  bluridcard: function (e) {
    if (e.detail.value.length == 0) {
      this.setData({ tip: '', idcard:"" })
      return
    } else {
      this.setData({ tip: '', idcard: e.detail.value  })
      return
    }
  },
  bindShowMsg() {

    this.setData({
      select: !this.data.select

  })},
  choosenum:function(e){
    var num = e.currentTarget.dataset.num;
    this.setData({
      grade_name:num
    });

  },
  formBindsubmit: function (e) {  
    let flist = this.data.formidlist.FormIds;
    flist.push({"FormId":e.detail.formId});
       this.setData({
         formidlist:{
           OpenId: app.globalData.openid,
           FormIds: flist
         },
    })
    var uname = e.detail.value.name;
    if (!e.detail.value.email || !e.detail.value.name) {
      this.setData({ tip: '*请将您的信息填写完整' })
      return
    }

    wx.request({ //注册
      url: app.globalData.serhttp + '/user/register?username=' + e.detail.value.name + "&openId=" + app.globalData.openid+"&wxnickname=" + app.globalData.userInfo.nickName  + "&email=" + e.detail.value.email,
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
        if (res.data.data == 1){ //注册成功

         wx.request({ //判断是否登录
           url: app.globalData.serhttp + '/user/login?openId=' + app.globalData.openid,
           method: 'POST',
           header: { 'content-type': 'application/json' },
           success: function (res) {
             //console.log(res);
             if (res.data.data) { //已经注册
               app.globalData.userid = res.data.data.id;//吧userid存到全局变量
               app.globalData.username = uname;
               app.globalData.myinfo = res.data.data; //用户信息存全局
              // var date = '2019/06/25 13:50:10';
               var date = app.comdata;
               var time1 = util.formatTime(new Date());
               var time2 = util.formatTime(new Date(date));
               //console.log(time1, time2);
               wx.showToast({
                 title: '成功',
                 icon: 'none',
                 duration: 2000
               })
               if (time1 < time2) {
                 var times = setTimeout(function () {
                   wx.redirectTo({
                      url: '/pages/coming/coming',
                   })
                 }, 2000)
               } else {
                 var times = setTimeout(function () {
                   wx.redirectTo({
                       url: '/pages/center/center',
                   })
                 }, 2000)
               }


             } else {
               wx.showToast({
                 title: 'fail to register',
                 icon: 'none',
                 duration: 2000
               })
               wx.redirectTo({
                 url: '/pages/register/register',
               })
             }
           },
           fail: function () {
             //
           }
         })
        } else{
          wx.showToast({
            title: '注册失败，请正确填写您的信息',
            icon: 'none',
            duration: 2000
          })
       }
        

      }
    })
  },
  testformid:function(e){
    var that = this;
    if (!that.data.userEmail || !that.data.userName) {
      that.setData({ tip: '*请将您的信息填写完整' })
      return
    }
    //console.log(that.data.formidlist);
    let flist = this.data.formidlist.FormIds;
    var listarr={};
    this.setData({
      formidlist: {
        OpenId: app.globalData.openid,
        FormIds: flist
      },
    })
    listarr = that.data.formidlist;
        wx.request({ //发送formid
          url: app.globalData.serhttp + '/wechat',
          method: 'POST',
          data: JSON.stringify(listarr),
          header: { 'content-type': 'application/json' },
          success: function (res) {
         //console.log(res);
            
          }
    })
  },
  getpicdata: function () {
    var loadlogo1 = this.data.serurl + wx.getStorageSync("loadlogo");
    var regbg1 = this.data.serurl + wx.getStorageSync("regbg");
    this.setData({
      logopic: loadlogo1,
      regbg: regbg1
    });
  },

  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth);
        that.setData({
          model: res.model,
          pw: res.windowWidth  //屏幕宽度
        })
      }
    })
    console.log(that.data.pw);
    var pbgheight = 0;
    pbgheight = (that.data.pw) / 0.7;
    this.setData({ bgheight: pbgheight }); //吧新的高度传给图片
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.setData({ logopic: app.globalData.logopic, serurl: app.globalData.fileurl });
    this.getpicdata()
  },

  abc:function(e){
    //console.log(e.detail.formId);
    let flist = this.data.formidlist.FormIds;
    flist.push({ "FormId": e.detail.formId });
    this.setData({
      formidlist: {
        OpenId: app.globalData.openid,
        FormIds: flist
      },
    })
    
  },
  getUserInfo: function (e) {
    this.setData({ 'disabled': false });
    app.globalData.userInfo = e.detail.userInfo;
   if(e.detail.userInfo){
     wx.showToast({
       title: '成功',
       icon: 'success',
       duration: 1300
     })
     this.setData({ //授权成功，获取授权框隐藏
       userInfo: e.detail.userInfo,
       hasUserInfo: true
     })
   }else{
     wx.showToast({//授权失败
       title: '失败',
       icon: "none",
       duration: 1300
     })
     this.setData({ 
       userInfo: "",
       hasUserInfo: true
     })

   }
  },

})

