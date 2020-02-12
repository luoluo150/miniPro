// pages/integral/integral.js
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
    postion: true,
    pos_tit: false,
    inter_list: [],
    arr1:[],
    arr2:[],
    tbarheight: 0,
    scrollhigh: 0,
    fsize: "80rpx",
    fsize2: "56rpx",
    titletop: "9.5%",
    titleft: "4%", //标题左边距
    extraClasses: '',
    scrohigh: "100%",
    cntext: "",
    entext: "",
    pageheight: 0, //屏幕高度
    upvalue: 0,    //上拉规定界限值
    lowvalue: 0, //下拉界限值
    noticheight: 0, //每个notic的高度
    popic:""
  },
  scroll: function (e) {
    var that = this;
    var value1 = that.data.upvalue; //上拉标准值
    var value2 = that.data.lowvalue; //下拉标准值
    var query = wx.createSelectorQuery();
    query.select('.scro').boundingClientRect(function (rect) {
      //var cc = rect.top-65;
      // console.log("距离顶部：" + rect.top,"scro高度: "+rect.height);
      if (rect.top > value1) { //顺序不能换
        //console.log("满足条件2");
        that.setData({
          extraClasses: 'bf-transition',
          fsize: "80rpx",
          fsize2: "56rpx",
          titletop: "9.5%",
          titleft: "4%"
        })
      }
      if (rect.top < value1) {
        // console.log("满足条件1");
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
  getpicdata: function () {
    var opbg = app.globalData.fileurl + wx.getStorageSync("inteegral");
    this.setData({
      popic: opbg
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({ //导入本地json数据
    //   inter_list: jsonData.dataList
    // }); 
    var that=this;
    this.setData({ cntext: options.cntitle, entext: options.entitle });
    this.getpicdata()
    var pheight = wx.getSystemInfoSync().windowHeight;    // 获取当前窗口的高度
    var value1 = pheight * 0.24; //上拉标准值
    var value2 = pheight * 0.22; //下拉标准值
    var value3 = pheight * 0.115 + 10;  //顶部高度
    //console.log("每个notic的高度为:"+value4);
    this.setData({
      pageheight: pheight,
      upvalue: value1,
      lowvalue: value2,
      tbarheight: value3
    });
    var list1 = [];
    var list2 = [];
    var arr = [];
    wx.request({ //获取用户积分列表
      url: app.globalData.serhttp + '/Team/GroupPointList',
      method: 'get',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data.data.list);

        arr=res.data.data.list;
        for(var i=0;i<arr.length;i++){
            if(i<=2){
              list1.push(arr[i]);
            }else{
              list2.push(arr[i]);
            }
        }
        //console.log(list1,list2)
        that.setData({ arr1: list1, arr2: list2 });
        if(arr.length>3){
          var testhight = (arr.length+3 ) * 50 + 5;
          that.setData({
            scrollhigh: testhight
          })
        }
        
      },
      fail: function () {
      }
    })
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