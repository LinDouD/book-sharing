// pages/shelf/list/list.js
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:'',
    booklist: {},
    isLoading: true,
    isbn: '',
    mode: '',
    type: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var flag = options.flag;
    var isbn = options.isbn;
    console.log(options)
    var that = this;
    if (flag =="shelf"){
      console.log("shelf")
      var ftype = options.type;
      var type = ftype === "false" ? false : true;
      var mode = '';
      if (type) {
        mode = 'owner'
      } else {
        mode = 'borrow'
      }
      var data = {
        isbn: isbn,
        mode: mode

      };
      var url = api.shelf.findBookList;
      that.setData({
        data: data,
        url: url,
        isbn: isbn,
        flag:flag,
        type:type
      })

    } else if (flag == "circle"){
      var bookCircleId = options.id;
      var data = {
        isbn: isbn,
        bookCircleId: bookCircleId
      };
      var url = api.bookcircle.findlist;
      that.setData({
        data: data,
        url: url,
        isbn: isbn,
        flag: flag
      })
    } else if (flag == "othershelf"){
      var mode = 'other';
      
      var ownerId = options.ownerId;
      var data = {
        isbn: isbn,
        mode: mode,
        ownerId: ownerId

      };
      var url = api.shelf.findBookList;
      that.setData({
        data: data,
        url: url,
        isbn: isbn,
        flag: flag
      })
    }else{

var data ={
  mode:"owner",
  isbn: "10019-2"
}
      var url = api.shelf.findBookList;
      that.setData({
        data: data,
        url: url,
        isbn: "10019-2",
        flag: "shelf"
      })

    }

    
   
   
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadData();
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
    var that = this;

    app.checkSession({
      success: function() {
        app.request({
          url: that.data.url,
          data: that.data.data,
          success: function(res) {
            console.log("list", res)
            wx.hideLoading();
            if (res.status.isSuccess == 1) {
              //加载成功
              var booklist = [];
              booklist = res.data;

              that.setData({
                booklist: booklist
              })
            }
            
          },
        });
      }
    })



  },

  goToDetailPage: function(e) {

    var id = e.currentTarget.id;
    var isbn = this.data.isbn;
   
    var ownerId = e.currentTarget.dataset.ownerid;
if(this.data.flag=='shelf'){
    if (this.data.type) {
      //我的书籍
      wx.navigateTo({
        url: '/pages/asecond/BDself/BDself?bookId=' + id + '&isbn=' + isbn + '&ownerId=' + ownerId
      })
    } else {
      //借阅书籍
      wx.navigateTo({
        url: '/pages/asecond/BDother/BDother?borrowId=' + id + '&isbn=' + isbn + '&ownerId=' + ownerId + '&flag=' + 'circle'
      })

    }
} else if (this.data.flag == 'circle'){
  var type = e.currentTarget.dataset.type;
  if (type ==1) {
    wx.navigateTo({
      url: '/pages/asecond/BDself/BDself?bookId=' + id + '&isbn=' + isbn + '&ownerId=' + ownerId
    })
  } else {
    wx.navigateTo({
      url: '/pages/asecond/BDother/BDother?bookId=' + id + '&isbn=' + isbn + '&ownerId=' + ownerId + '&flag=' + 'circle'
    })
  }
} else if (this.data.flag == 'othershelf'){
  wx.navigateTo({
    url: '/pages/asecond/BDother/BDother?bookId=' + id + '&isbn=' + isbn + '&ownerId=' + ownerId+'&flag='+'circle'
  })
}


  },

})