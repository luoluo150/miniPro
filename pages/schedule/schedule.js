const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tbarheight: 0,
    scrollhigh:0,
    fsize:"80rpx",
    fsize2:"56rpx",
    titletop:"9.5%",
    titleft:"4%", //标题左边距
    extraClasses: '',
    sctr:"",
    pw: 375,
    bgheight: 535,
    scrohigh:"100%",
    pageheight:0, //屏幕高度
    upvalue:0,    //上拉规定界限值
    lowvalue:0, //下拉界限值
    noticheight:0, //每个notic的高度
    listall:[],
    cntext:"",
    entext:"",
    model:"",
    idnum:"",
    scpic:"",
    supic:"",
    selectedFlag: [false, false, false, false, false, false, false],
    choose: false,
    animationData: {},
    stopBtn: true,
    currentBtn:{},
    topnum:0,
    image1Height: 0,
    image2Height: 0,
    image3Height: 0,
    image4Height: 0,
    image5Height: 0,
    image6Height: 0,
    image7Height: 0,
  },
  changeToggle: function (e) {
    var that=this;
     var index = e.currentTarget.dataset.index;
    //console.log(e.currentTarget.dataset.index);//当前点击的哪一个
    that.setData({ idnum: index });

    var selstate = [false, false, false, false, false, false, false];
    var arrlength=that.data.selectedFlag.length; //日期数组的长度
    if (that.data.selectedFlag[index]) {
      if (index == 6||index == 5) selstate[index] = false;
      else selstate[index] = true;
      for (var i = 0; i < arrlength; i++) { //吧其他几个全部关闭
        if (i != index)
          selstate[i] = false;
      }
    } else {
      selstate[index] = true;
      var animation = wx.createAnimation({
        duration:400,
        timingFunction: 'linear'
      })
      that.animation = animation
      animation.height("0").opacity(0).step()
      that.setData({
        animationData: animation.export(),
        choose: true
      })
      if(index==0){
        setTimeout(function () { //给图片设置动效
          animation.height(that.data.image1Height/2).opacity(1).step({ duration: 400 })
          that.setData({
            animationData: animation.export(),
          })
        }, 50)
      }else if(index==1){
        setTimeout(function () { //给图片设置动效
          animation.height(that.data.image2Height/2).opacity(1).step({ duration: 400 })
          that.setData({
            animationData: animation.export(),
          })
        }, 50)
      } else if (index == 2){
        setTimeout(function () { //给图片设置动效
          animation.height(that.data.image3Height/2).opacity(1).step({ duration: 400 })
          that.setData({
            animationData: animation.export(),
          })
        }, 50)
      } else if (index == 3) {
        setTimeout(function () { //给图片设置动效
          animation.height(that.data.image4Height/2).opacity(1).step({ duration: 400 })
          that.setData({
            animationData: animation.export(),
          })
        }, 50)
      } else if (index == 4) {
        setTimeout(function () { //给图片设置动效
          animation.height(that.data.image5Height/2).opacity(1).step({ duration: 400 })
          that.setData({
            animationData: animation.export(),
          })
        }, 50)
      } else if (index == 5) {
        setTimeout(function () { //给图片设置动效
          animation.height(that.data.image6Height/2).opacity(1).step({ duration: 400 })
          that.setData({
            animationData: animation.export(),
          })
        }, 50)
      }else if (index == 6) {
        setTimeout(function () { //给图片设置动效
          animation.height(that.data.image7Height/2).opacity(1).step({ duration: 400 })
          that.setData({
            animationData: animation.export(),
          })
        }, 50)
      } 


      
    }
    that.setData({
      selectedFlag: selstate
    })
    
  },
  scroll: function (e) {
    var that=this;
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
    query.select('.scro').boundingClientRect(function (rect) {
      //console.log("距离顶部：" + rect.top,"scro高度: "+rect.height);
      if (rect.top > value1) { //顺序不能换
        //console.log("满足条件2");
        that.setData({
          extraClasses: 'bf-transition',
          fsize: "80rpx",
          fsize2: "56rpx",
          titletop: "9.5%",
          titleft:"4%"
        })
      }
      if (rect.top < value1 ){
       // console.log("满足条件1");
        that.setData({ 
          extraClasses: 'bf-transition',
          fsize:"37rpx",
          fsize2:"34rpx",
          titletop: topnum,
          titleft: "10%"
        })

      }
    }).exec();
   

  },
  successFun: function (res) { 
     console.log(res.data.list);
    this.setData({
      image1Height: parseInt(res.data.list[0].remark)+4,
      image2Height: parseInt(res.data.list[1].remark) + 4,
      image3Height: parseInt(res.data.list[2].remark) + 4,
      image4Height: parseInt(res.data.list[3].remark) + 4,
      image5Height: parseInt(res.data.list[4].remark) + 4,
      image6Height: parseInt(res.data.list[5].remark) + 4,
      image7Height: parseInt(res.data.list[6].remark) + 4
    }); 
    this.setData({ 
      listall: res.data.list
    }); 
  },
  a: function (e) {
    var that = this;
    var listarr = {
      "OpenId": app.globalData.openid,
      "FormIds": [{ "FormId": e.detail.formId }]
    };
    wx.request({ //发送formid
      url: app.globalData.serhttp + '/wechat',
      method: 'POST',
      data: JSON.stringify(listarr),
      header: { 'content-type': 'application/json' },
      success: function (res) {
       // console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({ cntext: options.cntitle, entext: options.entitle, supic:app.globalData.fileurl, scpic: app.allurlpic.agenda});
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          model: res.model,
          pw: res.windowWidth
        })
      }
    })
    console.log(that.data.model);

    var pbgheight = 0;
    pbgheight = (that.data.pw) / 0.7;
    that.setData({ bgheight: pbgheight }); //吧新的高度传给图片
    
    var pheight=wx.getSystemInfoSync().windowHeight;    // 获取当前窗口的高度
    var value1 = pheight * 0.24; //上拉标准值
    var value2 = pheight * 0.22; //下拉标准值
    var value3 = pheight*0.115+10;  //顶部高度
    var value4 = (44/pheight); 
    this.setData({
      pageheight: pheight,
      upvalue:value1,
      lowvalue:value2,
      tbarheight:value3,
      noticheight:value4
    });

    var url = app.apiUrl + "/Image_Template1/Image_TemplateList"
    var params = {
      "name": "",
      'pageNum': '',
      'pageSize': ''
    }
    app.request.requestGetApi(url, params, this, this.successFun);
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