var util = require('../../utils/util.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tbarheight: 0,
    scrollhigh: 0,
    top: '',
    postion: true,
    group_list: [], //最终处理后数据数组
    fsize: "80rpx",
    fsize2: "56rpx",
    titletop: "9.5%",
    titleft: "4%", //标题左边距
    extraClasses: '',
    scrohigh: "100%",
    pageheight: 0, //屏幕高度
    upvalue: 0,    //上拉规定界限值
    lowvalue: 0, //下拉界限值
    noticheight: 0, //每个notic的高度
    cntext: "",
    entext: "", //
    zt:[],   //每个时间段的状态
    votingpic:"" //投票的背景图片
  },
  scroll: function (e) {
    var that = this;
    var value1 = that.data.upvalue; //上拉标准值
    var value2 = that.data.lowvalue; //下拉标准值
    var query = wx.createSelectorQuery();
    query.select('.scro').boundingClientRect(function (rect) {
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
          fsize2: "24rpx",
          titletop: "5.5%",
          titleft: "10%"
        })

      }

    }).exec();


  },
  successmystate:function(res){ //读取状态并分组
    var that=this;
    console.log(res.data.list);//初始
    var arr = res.data.list; 
    var map = {}, dest = []; var stateall = []; 
    var isyour = false;
    for (var i = 0; i < arr.length; i++) {//分组
      var ai = arr[i];
      var st="",ch="";
      if (!map[ai.appointmentdate]){
        dest.push({
          time: ai.appointmentdate,
          isyour:false,
          order: [ai]
        });
        map[ai.appointmentdate] = ai;
      } else {
        for (var j = 0; j < dest.length; j++) {
          var dj = dest[j];
          if (dj.time == ai.appointmentdate) {
            dj.order.push(ai);
            break;
          }
        }
      }
    }
    this.setData({ 
      group_list: dest
    });

     for (var i = 0; i < dest.length; i++) {
       var num = 0;
        for(var j=0;j<dest[i].order.length;j++){
          if (dest[i].order[j].isyourself == 1){
            num++;
          }
          if(num>=2){
            dest[i].isyour = true;
          }
            
        }
    }
    console.log(dest);
    for (var i = 0; i < dest.length; i++){//所有大的小组
     // var boolsta = true;
        var list=dest[i].order; 
     // if (dest[i].isyour) boolsta = false; //console.log(dest[i].isyour);
      var num2 = 0;
      for(var j=0;j < list.length;j++){//每个小组下的队名分类
        console.log(list[j].isclose, num2, list[j].isyour);
        if (list[j].isyourself==1) { st = "date_mys"; ch = "circle2";  num2++;} //自己投得
        else if (list[j].isclose == false && num2 < 2 && dest[i].isyour == false) { st = "date_choices"; ch = "circle1"; }
         else { st = "date_fulls"; ch = "circle"; } 
         stateall.push({ state: st, choice:ch});
      }
    }
    console.log(stateall);

    var q = 0;
    var group_list = that.data.group_list;
    for (var y = 0; y < group_list.length; y++) { //添加样式
      for (var index1 = 0; index1 < group_list[y].order.length; index1++) {
        if (q < arr.length) {
          var state = "group_list[" + y + "].order[" + index1 + "].state";
          var choice = "group_list[" + y + "].order[" + index1 + "].choice";
          that.setData({
            [state]: stateall[q].state,
            [choice]: stateall[q].choice
          })
          q++;
        }else{
        //  console.log("不成立吗");
        }
      }
    }

    if ((stateall.length/2) > 10) {
      var testhight = (stateall.length / 2 - 10) * 60 + dest.length*44;
      that.setData({
        scrollhigh: testhight
      })
    }
  },
  appoit:function(e){
      var that=this;
      var apdate = e.currentTarget.dataset.date;
      //var aptime = e.currentTarget.dataset.time;
      var apid = e.currentTarget.dataset.apid;
      var isyour = e.currentTarget.dataset.your;
      var isfull = e.currentTarget.dataset.full;
      var gname = e.currentTarget.dataset.gname;
      var isstate = e.currentTarget.dataset.state;

    var date = '2019/07/01 00:00:00';
    var time1 = util.formatTime(new Date());
    var time2 = util.formatTime(new Date(date));
    

    if (time1 < time2) {
       wx.showToast({
          title: '时间未到，暂不可投票',
          icon: 'none',
          duration: 2000
        })
    } else {
      if (isyour) {
        wx.showToast({
          title: '您已经投过该队伍',
          icon: 'none',
          duration: 2000
        })
      } else if (isfull) {
        wx.showToast({
          title: '您已投过其他队伍',
          icon: 'none',
          duration: 2000
        })
      } else if (isstate == "date_fulls") {
        wx.showToast({
          title: '您已投过其他队伍',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showModal({
          title: '确认提示',
          content: '您选择了' + gname + " ",
          success(res) {
            if (res.confirm) {
             
              var listarr = {
                appointmentid: apid,
                userid: app.globalData.userid
              };
             
              wx.request({
                url: app.globalData.serhttp + '/AppointmentNote',//投票功能
                method: 'POST',
                data: JSON.stringify(listarr),
                header: { 'content-type': 'application/json' },
                success: function (res) {
                  
                  if (res.data.message == "OK") {
                    wx.showToast({
                      title: '您已成功投票',
                      icon: 'success',
                      duration: 2000
                    })
                  } else if (res.data.message == "已投票") {
                    wx.showToast({
                      title: '您已投过票',
                      icon: 'none',
                      duration: 2000
                    })
                  } else if (res.data.message == "无法投票，当前队伍已到限制人数") {
                    wx.showToast({
                      title: '您已投过其他队伍',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                  that.relist();
                }
              })

            } else if (res.cancel) {
              wx.showToast({
                title: '您取消了投票',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })

      }
    }
        

     
    },
  relist:function(){
    var url = app.apiUrl + "/Appointment/AppointmentList_wechat"
    var params = {
      'UserID': app.globalData.userid,
      'pageNum': '',
      'pageSize': ''
    }
    app.request.requestGetApi(url, params, this, this.successmystate);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      votingpic: app.allurlpic.venue, // 从全局读取图片
    })
    this.setData({ cntext: options.cntitle, entext: options.entitle });
    var pheight = wx.getSystemInfoSync().windowHeight;    // 获取当前窗口的高度
    var value1 = pheight * 0.24; //上拉标准值
    var value2 = pheight * 0.22; //下拉标准值
    var value3 = pheight * 0.115 + 10;  //顶部高度
    this.setData({
      pageheight: pheight, 
      upvalue: value1,
      lowvalue: value2,
      tbarheight: value3
    });
   //选项状态信息 
    this.relist();
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
