//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
    app.getToken().then(function (res) {

      console.log("授权成功")
      // url: "/pages/shelf/shelf"

      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        is_login: 1
      })
      wx.navigateBack({//返回
        delta: 1
      })




    });

  },


})
