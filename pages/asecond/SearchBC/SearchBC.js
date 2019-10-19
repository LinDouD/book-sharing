// pages/asecond/SearchBC/SearchBC.js
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bcName: '',
    searchBC:'',
    dataSource: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bcName = options.bcName;
    this.data.bcName = bcName;
    console.log(",bcName  serach:", this.data.bcName);
    this.loaddata();

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
  loaddata: function () {
    var that = this;
    var access_token = wx.getStorageSync("access_token");
    app.request({
      url: api.bookcircle.searchbookcircle,
      data: {
        bcName: that.data.bcName
      },
      success: function (res) {
        if (res.searchBCInf) {
          var dataSource = [];
          for (var i = 0; i < res.searchBCInf.length; i++) {
            dataSource.push(res.searchBCInf[i]);
          }
          that.setData({
            dataSource:dataSource
            
          })
          console.log("dataSource:", that.data.dataSource);
        } else {
          wx.showToast({
            title: '无相似结果',
            icon: 'none'
          })
        }
      }
    })
  },
  //跳转到图书圈详情界面
  goToDetailCircle: function (e) {
    var isbn = e.currentTarget.id;
    wx.navigateTo({
      // url: '/pages/asecond/BDetail/BDetail?id=' + isbn

      url: '/pages/asecond/BDself/BDself?id=' + isbn
    });
  },
  searchInput: function (e) {
    this.setData({ searchBC: e.detail.value })
  },

  //跳转到图书圈搜索结果页面
  goToSearchRes: function (e) {
    var bcName = this.data.searchBC;
    wx.navigateTo({
      url: '/pages/asecond/SearchBC/SearchBC?bcName=' + bcName
    });
  }
})