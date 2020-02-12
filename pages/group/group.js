//var jsonData = require('../../data/group-json.js'); 
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // StatusBar: app.globalData.StatusBar,
    // CustomBar: app.globalData.CustomBar,
    // TabCur: 0,
    top: '',
    postion:true,
    pos_tit:false,
    group_list:[],
    fsize: "80rpx",
    fsize2: "56rpx",
    titletop: "9.5%",
    titleft: "4%", //标题左边距
    extraClasses: '',
    scrohigh: "100%",
    pageheight: 0, //屏幕高度
    upvalue: 0,    //上拉规定界限值
    lowvalue: 0, //下拉界限值
    cntext: "",
    entext: "",
    scrollhigh: 0,
    tbarheight:0,
    scrollTop: 20,
    opacity: 1,
    extraClasses: '',
    grpic:""
  },
  scroll: function (e) {
    var that = this;
    var value1 = that.data.upvalue; //上拉标准值
    var value2 = that.data.lowvalue; //下拉标准值
    var query = wx.createSelectorQuery();
    query.select('.scro').boundingClientRect(function (rect) {
      if (rect.top > value1) { //顺序不能换
        that.setData({
          extraClasses: 'bf-transition',
          fsize: "80rpx",
          fsize2: "56rpx",
          titletop: "9.5%",
          titleft: "4%"
        })
      }
      if (rect.top < value1) {
        that.setData({
          extraClasses: 'bf-transition',
          fsize: "37rpx",
          fsize2: "34rpx",
          titletop: "5.5%",
          titleft: "10%"
        })

      }

    }).exec();


  },
  successFun: function (res) { 
      console.log(res.data);
      this.setData({ //导入本地json数据
        group_list: res.data
      }); 
    if(res.data.length>3){
      var testhight = (res.data.length - 3) * 50 + 5;
      this.setData({
        scrollhigh: testhight
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getpicdata: function () {
    var opbg = app.globalData.fileurl + wx.getStorageSync("group");
    this.setData({
      grpic: opbg
    });
  },
  onLoad: function (options) {
    // this.setData({ //导入本地json数据
    //   group_list: jsonData.dataList
    // }); , grpic: app.allurlpic.group,
    this.setData({ cntext: options.cntitle, entext: options.entitle });
    this.getpicdata()
    var pheight = wx.getSystemInfoSync().windowHeight;    // 获取当前窗口的高度
    var value1 = pheight * 0.24; //上拉标准值
    var value2 = pheight * 0.22; //下拉标准值
    var value3 = pheight * 0.115 ;  //顶部高度
    //console.log("每个notic的高度为:"+value4);
    this.setData({
      pageheight: pheight,
      upvalue: value1,
      lowvalue: value2,
      tbarheight: value3,
    });

    var url = app.apiUrl + "/usergroup/MyGroupList"
    var params = {
      "userId": app.globalData.userid,
      'pageNum': '',
      'pageSize': ''
    }
    app.request.requestGetApi(url, params, this, this.successFun);

    var alldata = this.data.group_list;
 
   },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})