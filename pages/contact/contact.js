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
    model:"",
    postion: true,
    pw: 375,
    bgheight: 535,
    group_list: [{
      buttonid: 8,
      content: "",
      createdate: "2019-06-18 13:47:33",
      creator: 0,
      entitle: "仇雯 +86 18621552391",
      id: 4,
      imageurl: "",
      isdeleted: false,
      remark: "",
      reviser: 1,
      reviserddate: null,
      subtitle: "+8618621552391",
      tips: "",
      title: " "
    },
    {
        buttonid: 8,
        content: "",
        createdate: "2019-06-18 13:47:33",
        creator: 0,
        entitle: "王毓 +86 13501897028",
        id: 4,
        imageurl: "",
        isdeleted: false,
        remark: "",
        reviser: 1,
        reviserddate: null,
        subtitle: "+8613501897028",
        tips: "",
        title: " "
    }
      
    ],
    tbarheight: 0,
    scrollhigh: 0,
    fsize: "80rpx",
    fsize2: "56rpx",
    titletop: "9.5%",
    titleft: "4%", //标题左边距
    extraClasses: '',
    scrohigh: "100%",
    pageheight: 0, //屏幕高度
    upvalue: 0, //上拉规定界限值
    lowvalue: 0, //下拉界限值
    noticheight: 0, //每个notic的高度
    cntext: "",
    entext: "",
    wonpic: "",
    supic: "",
    btnid: "",
    iscall: "", // "telphone": "18118176246",

  },
  callPhone: function(e) { //点击拨打电话
    //console.log(e.target.dataset.tel);
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel,
      success: function (res) {
       // console.log("接口调用成功返回的回调")
      },
      fail: function (res) {
       // console.log("接口调用失败返回的回调")
      },
      complete: function (res) {
        //console.log("接口调用结束的回调函数（调用成功、失败都会执行）")
      }
    })
  },
  scroll: function(e) {
    var that = this;
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
    var value1 = that.data.upvalue; //上拉标准值
    var value2 = that.data.lowvalue; //下拉标准值
    var query = wx.createSelectorQuery();
    query.select('.scro').boundingClientRect(function(rect) {
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
          titletop: topnum,
          titleft: "10%"
        })

      }

    }).exec();
  },
  getpicdata: function() {//获取背景值
    var btnid = this.data.btnid;
    var opbg = app.globalData.fileurl + wx.getStorageSync("contacts");
    this.setData({
      wonpic: opbg
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this;
    this.setData({
      cntext: options.cntitle,
      entext: options.entitle,
      btnid: options.btnid,
      iscall: options.iscall,
      supic: app.globalData.fileurl
    });
    this.getpicdata()
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
    var pheight = wx.getSystemInfoSync().windowHeight; // 获取当前窗口的高度
    var value1 = pheight * 0.24; //上拉标准值
    var value2 = pheight * 0.22; //下拉标准值
    var value3 = pheight * 0.115 + 10; //顶部高度
    this.setData({
      pageheight: pheight,
      upvalue: value1,
      lowvalue: value2,
      tbarheight: value3
    });

  },

})
