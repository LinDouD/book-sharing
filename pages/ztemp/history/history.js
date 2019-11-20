// pages/ztemp/ztemp.js

//获取应用实例
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    exist: false,
    limit:10,
    offset:0


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (JSON.stringify(options) != "{}") {
      that.setData({
        isbn: options.isbn,
        bookId: options.bookId,
        ownerId: options.ownerId
      })
    } else {
      that.setData({
        bookId: 58,
        ownerId: 23,
        isbn: '9787121355950'
      })
    }
    that.loadData();

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
  loadData: function () {
    var that = this;
    wx.showLoading({
      title: '',
      mask: true
    })
    app.checkSession({
      success: function () {
        app.request({
          url: api.chat.chat_history,
          data: {
            isbn: that.data.isbn,
            ownerId: that.data.ownerId,
            bookId: that.data.bookId,
            limit:that.data.limit,
            offset: that.data.offset
          },
          success: function (res) {
            console.log("historylist", res)
            wx.hideLoading();
            if (res.status.is_exist == 1) {
              var message = res.data;
              for (var i = 0; i < message.length; i++) {
                var time = message[i].dateTime
                console.log(time)
                message[i].dateTime = time.split('T')[0]
                console.log(message[i].dateTime)
              }
              that.setData({
                message: message,
                book: res.book,
                exist: true
              })

            } else {
              that.setData({

                exist: false
              })
            }

          },
        });
      }
    })

  },
  goToContact: function (e) {
    var receiveId = e.currentTarget.dataset.receive;
    var senderId = e.currentTarget.dataset.send;
    console.log(e.currentTarget.dataset);

    wx.navigateTo({
      url: '/pages/contact/contact?userId=' + receiveId + '&fid=' + senderId
      //   url: '/pages/contact/contact?userId=' + 23 + '&fid=' + 25
    })
  },
  

 

})