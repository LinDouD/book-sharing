const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');
Page({
  data: {
    /** 
      * 页面配置 
      */
      x1:0,
    winWidth: 100,
    winHeight: 0,
    // tab切换  
    currentTab: 0,  
    circleId: -1,
    circleName:'',
    createTime: '',
    intro: '',
    picPath: '',

    member:{},
    post:{},
    shelf:{}
   
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });      
      }
    });
    console.log("winWidth====!=======" + that.data.winWidth);
    console.log("winHeigh====xixixixi===" + that.data.winHeight);
    if (options.circleId) {
      var circleId = options.circleId;
      this.data.circleId = circleId;
    }
    this.getCircleInfo();
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (e.target.dataset.current==1){
        var data = {};
        app.request({
          url: api.bsecond.post,
          data:{
            bookCircleId:that.data.circleId
          },
          success:function(res){
            console.log(res)
            if (res.status.is_exist==1){
              data = res.data;
              for (var i = 0; i < data.length; i++) {
                data[i].pubTime = data[i].pubTime.split('T')[0];

              }

              that.setData({
                post:data
              })
            }else{

            }
          }
        })

      } else if (e.target.dataset.current == 2) {
        var data = {};
        app.request({
          url: api.bsecond.shelf,
          data: {
            bookCircleId: that.data.circleId
          },
          success: function (res) {
            console.log(res)
            if (res.status.is_exist == 1) {
              data = res.data;
              console.log(data[0])
              that.setData({
                shelf: data[0]
              })
            } else {

            }
          }
        })
      } else if (e.target.dataset.current == 0) {
        var data = {};
        app.request({
          url: api.bsecond.member,
          data: {
            bookCircleId: that.data.circleId
          },
          success: function (res) {
            console.log(res)
            if (res.status.is_exist == 1) {
              data = res.data;
              that.setData({
                member: data
              })
            } else {

            }
          }
        })
      }
    }
  },
  getCircleInfo: function(){
    var that = this;
    var data = {
      circleId: that.data.circleId,
      circleName: that.data.circleName,
      createTime: that.data.createTime,   
      intro: that.data.intro,
      picPath:that.data.picPath
    };
    console.log("data.cirleId="+this.data.circleId);
    var url = api.bsecond.cmember;
    app.checkSession({
      success: function () {
        app.request({
          url: url,
          data: data,
          success: function (res) {
            console.log("res=" + res.createTime);
            var creatTime = res.createTime.split('T')[0];
            that.setData({
              bcName: res.bcName,
              createTime: creatTime,
              intro: res.intro,
              picPath: res.picPath
            })
            if (res.status.is_exist == 1) {
              data = res.data;
              that.setData({
                member: data
              })
            } else {}
           
          
          }
        })
      }
    })
          

  }

})
