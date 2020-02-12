const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    comingpic: "",
    serurl: ""
  },
  getpicdata: function () {
    var clogo = this.data.serurl + wx.getStorageSync("comingsoon");
    this.setData({
      comingpic: clogo,
    });
  },
  onLoad:function(){
    var that = this;
    that.setData({ //导入本地json数据
      serurl: app.globalData.fileurl
    });
    that.getpicdata()

    
  },
  onShow:function(){

    // var codeV = setInterval(function (){
    //   var date = '2019/06/28 13:53:30';
    //   var time1 = util.formatTime(new Date());
    //   var time2 = util.formatTime(new Date(date));
    //    console.log(time1,time2);
    //   if (time1 == time2) {
    //     wx.redirectTo({
    //       url: '/pages/center/center',
    //     })
    //     clearInterval(codeV)
    //   }
    // },1000);

  },
})


    