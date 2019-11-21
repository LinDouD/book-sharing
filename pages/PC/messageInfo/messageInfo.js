// pages/PC/messageInfo/messageInfo.js
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');
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
    this.setData({
      input:''
    })
    this.loaddata();
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
    var url = api.pc.messageList;
    app.checkSession({
      success: function () {
        app.request({
          url: url,
          success: function (res) {
            console.log(res);
            if (res.status.is_exist == 1) {
              var list = res.data
              for(var i = 0;i<res.data.length;i++){
                list[i].dataTime = util.lcurrent(list[i].dateTime)
              }
             that.setData({
               list:list,
               exist: true
             })

            } else {
              
            }
          },
        });

      }
    })

  },


 
  goToSearch: function (e) {
    wx.navigateTo({
      url: '/pages/searchFriend/searchFriend'
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
 
})