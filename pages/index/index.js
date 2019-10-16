//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

  },


  onGotUserInfo: function (e) {
    var that = this;
    var mode = "login";
    app.login(mode).then(function (res) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; 
      prevPage.setData({
        is_login: 1
      })
      wx.navigateBack({
        delta: 1
      })
    });
  }

})
