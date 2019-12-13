// pages/PC/PC.js

const app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');
Page({
  data: {
    userInfo: {},
    isSuccess:false
  },
  //事件处理函数
  toOrder: function () {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  onLoad: function () {
  },

  onShow:function(){
    this.loadData();
  },

  onGotUserInfo: function (e) {
    var that = this;
    var mode = "login";
    app.login(mode).then(function (res) {
      var isSuccess = false;
      if (res.data.result==0&&res.data.save_sucess==1){
        var userInfo = res.userInfo;
        isSuccess = true;
        app.globalData.is_login = 1;
        that.setData({
          userInfo : userInfo,
          isSuccess: isSuccess
        })
      }
    });
  },


  loadData:function(){
    var that = this;
    app.checkSession({
      success: function () {
        app.request({
          url: api.pc.pc,
          success: function (res) {
            var isSuccess = false;
            if (app.globalData.is_login == 1 && res.status.isSuccess==2){
              var userInfo = res.userInfo;
              isSuccess = true;
              that.setData({
                userInfo: userInfo,
                isSuccess: isSuccess
              })
            }
          }
        })
      }
    });
     
  },


  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  myAddress: function (e) {
    wx.navigateTo({ url: '../addressList/addressList' });
  }

})