
const app = getApp();
Page({
  data: {
    top: '',
    postion: true,
    group_list: [],
    tbarheight: 0,
    scrollhigh: 0,
    haslength:true,
    pw:375,
    bgheight:535,
    fsize: "80rpx",
    fsize2: "56rpx",
    titletop: "9.5%",
    titleft: "4%", //标题左边距
    extraClasses: '',
    model:"",//手机型号
    scrohigh: "100%",
    pageheight: 0, //屏幕高度
    upvalue: 0,    //上拉规定界限值
    lowvalue: 0, //下拉界限值
    noticheight: 0, //每个notic的高度
    cntext: "",
    entext: "",
    wonpic: "",
    supic: "",
    btnid: "",
    piclist:[]
  },
  scroll: function (e) {
    var that = this;
    var topnum ="";
    if (that.data.model == "iPhone X" || that.data.model == "iPhone XR" || that.data.model == "iPhone XS Max") {
      topnum="4.7%";
    } else if (that.data.model == "iPhone 6/7/8" || that.data.model ==  "iPhone 6 / 7 / 8 Plus") {
      topnum = "5.5%";
    } else if (that.data.model == "iPhone 6 / 7 / 8 Plus"){
       topnum = "5.7%";
    }else{
      topnum = "5.5%";
    }
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
          titletop: topnum,
          titleft: "10%"
        })

      }

    }).exec();
  },
  getpicdata: function () {//获取背景图
    var btnid = this.data.btnid;
    var opbg = app.globalData.fileurl + wx.getStorageSync("mylog");
    this.setData({
      wonpic: opbg
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
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
    var pbgheight=0;
     pbgheight=(that.data.pw)/0.7;
    that.setData({ bgheight:pbgheight}); //吧新的高度传给图片
    this.setData({ cntext: options.cntitle, entext: options.entitle, btnid: options.btnid, supic: app.globalData.fileurl });
    this.getpicdata()
    var pheight = wx.getSystemInfoSync().windowHeight;    // 获取当前窗口的高度
    var value1 = pheight * 0.24; //上拉标准值
    var value2 = pheight * 0.22; //下拉标准值
    var value3 = pheight * 0.115 + 10;  //顶部高度
    console.log("每个notic的高度为:" + value3);
    this.setData({
      pageheight: pheight,
      upvalue: value1,
      lowvalue: value2,
      tbarheight: value3
    });

    var uname = ""
    if (app.globalData.tel == "") {
      uname = app.globalData.username;
    } else { uname = app.globalData.teachername; }

    wx.request({ //获取我的心得
      url: app.globalData.serhttp + "/Diary/AllList ",
      method: 'GET',
      data: {"username":uname},
      header: { 'content-type': 'application/json' },
      success: function (res) {
       //  console.log(res.data.data);
        var datas = res.data.data; //全部的标题
        var tslist=[];//全部标题的数组
         var tlist=[]; //每一个标题下的日志数组
         var num=0; //记录实际
         var index=0;
        var plist = [];
        for(var i = 0; i < datas.length;i++){
          tlist = [];//每个标题进来都清空数组。 
            for (var j = 0; j < datas[i].diaryList.length;j++){
               var picslist = [];
                 var listaa={};//每个日志属性 
                 var ddata = datas[i].diaryList; //每个主题下的不同的日志
                 //console.log(ddata);
                 var times = ddata[j].createdate.substr(0, ddata[j].createdate.indexOf(" "));
                  var key1 = "time"; listaa[key1] = times;
                  var key2 = "title"; listaa[key2] = ddata[j].title;
                  var key3 = "name"; listaa[key3] = ddata[j].username;
                  var key4 = "descr"; listaa[key4] = ddata[j].descr;
                  var key5 = "piclist1"; listaa[key5] = ddata[j].filepath1;
                  var key6 = "piclist2"; listaa[key6] = ddata[j].filepath2;
                  var key7 = "piclist3"; listaa[key7] = ddata[j].filepath3;
                  var key8 = "piclist4"; listaa[key8] = ddata[j].filepath4;
                  var key9 = "piclist5"; listaa[key9] = ddata[j].filepath5;
                  var key10 = "piclist6"; listaa[key10] = ddata[j].filepath6;
              if (ddata[j].filepath1) { picslist.push(that.data.supic+ddata[j].filepath1);}
              if (ddata[j].filepath2) { picslist.push(that.data.supic +ddata[j].filepath2); }
              if (ddata[j].filepath3) { picslist.push(that.data.supic +ddata[j].filepath3); }
              if (ddata[j].filepath4) { picslist.push(that.data.supic +ddata[j].filepath4); }
              if (ddata[j].filepath5) { picslist.push(that.data.supic +ddata[j].filepath5); }
              if (ddata[j].filepath6) { picslist.push(that.data.supic +ddata[j].filepath6); }
              plist[num] = picslist;
            //  console.log(picslist);     //每个心得里的图片
              tslist.push(listaa);
              num++;
            }
             //console.log(plist);//所有心得里的图片
         // tslist[index] = tlist;
         // if (datas[i].diaryList.length != 0) { index++; }
          
        }
        if (num != 0) {
          that.setData({
            haslength: false,
            piclist: plist
          });
        }
        //console.log(tslist);

        that.setData({
          group_list: tslist
        });

      }
    })
 
  },
  ViewImage(e) {
   // console.log(e);
   // console.log(this.data.piclist);
    var index = e.currentTarget.dataset.inx;
    wx.previewImage({ //在新页面中全屏预览图片
      urls: this.data.piclist[index],
      current: e.currentTarget.dataset.url
    });
  }

})