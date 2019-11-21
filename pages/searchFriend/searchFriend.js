// pages/searchFriend/searchFriend.js

var app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    exist: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  searchIcon(e) {
    var name = e.detail.value.replace(/\s+/g, '');
    this.setData({
      name: name
    })
    if(this.data.name==""){
      this.setData({
        list: []
      })
    }
  },
  search: function () {
    if (typeof (this.data.name) == "undefined" || this.data.name == '') {
     
    } else {
      var that = this;
      var name = this.data.name;
      app.checkSession({
        success: function () {
          app.request({
            url: api.search.friend,
            data: {
              name: name
            },
            success: function (res) {
              console.log(res);
              if (res.status.is_exist == 1) {
                var list = res.data
                that.setData({
                  list: list,
                  exist: true
                })
              }else{
                that.setData({
                  exist: false
                })
              }
            },
          });
        }
      })
    }
  },

  goDetail: function (e) {

    console.log("gotoDetail--fid", e.currentTarget.id)
    wx.navigateTo({
      url: '/pages/friendlist/friendinfo/friendinfo?fid=' + e.currentTarget.id
    })
  },

  chat: function (e) {
    var fid = e.currentTarget.id;
    var userId = e.currentTarget.dataset.userid;
    var that = this;
    wx.navigateTo({
      url: '/pages/contact/contact?userId=' + userId + '&fid=' + fid
    })

  },
  cancel: function (e) {

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.onShow();
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    wx.navigateBack({//返回
      delta: 1
    })
  
  },
})