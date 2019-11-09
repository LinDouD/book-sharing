// pages/shelf/list/list.js
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: {},
    isLoading: true,
    isbn: '',
    self: true,
    fid:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var isbn = options.isbn;
    var self = options.self;
    var fid = -1;
    var flag = self === "false" ? false : true;

    if (!flag) {
      fid = options.fid;
      that.setData({
        fid: fid
      })
    }
    this.setData({
      isbn: isbn,
      self: flag
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  loadData: function(isbn) {
    wx.showLoading({
      title: "查询中",
      mask: true,
    });
    console.log("fid",this.data)
    var that = this;
    var data = {};
    var url = '';
    if (!that.data.self) {
      url = api.shelf.otherbooklist;
      data = {
        isbn: that.data.isbn,
        fid: that.data.fid
      };
    } else {
      url = api.shelf.booklist;
      data = {
        isbn: that.data.isbn
      };
    }

    app.checkSession({
      success: function() {
        app.request({
          url: url,
          data: data,
          success: function(res) {
            console.log("list", res)
            wx.hideLoading();
            if (res.status.isSuccess == 2) {
              //加载成功
              var booklist = {};
              booklist = res.data;
              for (var i = 0; i < booklist.myShelfLists.length; i++) {
                booklist.myShelfLists[i].sortTime = booklist.myShelfLists[i].sortTime.split('T')[0];

              }
              that.setData({
                booklist: booklist
              })
            }
          },
        });
      }
    })



  },

  goToDetailPage: function (e) {
    var that = this;
    var bookId = e.currentTarget.id;
    var borrowId = e.currentTarget.dataset.borrowid;
    var is_Borrow = e.currentTarget.dataset.borrow;
    var self = this.data.self;
    var fid = this.data.fid;
    console.log("list555", e.currentTarget.dataset)
    if (self) {
      if (is_Borrow) {
        //借阅书籍
        wx.navigateTo({
          url: '/pages/asecond/BDother/BDother?id=' + borrowId + '&self=' + self +'&isbn='+that.data.isbn
        })
      } else {
        //我的书籍
        wx.navigateTo({
          url: '/pages/asecond/BDself/BDself?bookId=' + bookId
        })
      }
    } else {
      //借阅书籍
      wx.navigateTo({
        url: '/pages/asecond/BDother/BDother?id=' + bookId + '&self=' + self + '&fid=' + fid + '&isbn=' + that.data.isbn
      })
    }

  },

})