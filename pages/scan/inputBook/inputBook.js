// pages/scan/inputBook/inputBook.js

const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addBtn:false,
    bookName:'',
    isbn:'',
    author:'',
    publisher:'',
    pubTime:'',
    translator:'',

    price:'',
    briefInfo:'',
    number:1

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
  bookNameInput(e) {
    this.setData({
      bookName: e.detail.value.replace(/\s+/g, '')
    })
    this.check();
  },
  isbnInput(e) {
    this.setData({
      isbn: e.detail.value.replace(/\s+/g, '')
    })
    this.check();
  },
  authorInput(e) {
    this.setData({
      author: e.detail.value.replace(/\s+/g, '')
    })
    this.check();
  },
  publisherInput(e) {
    this.setData({
      publisher: e.detail.value.replace(/\s+/g, '')
    })
    this.check();
  },
 
  translatorInput(e) {
    this.setData({
      translator: e.detail.value.replace(/\s+/g, '')
    })
  },
  pubTimeInput(e) {
    this.setData({
      pubTime: e.detail.value.replace(/\s+/g, '')
    })
  },
  priceInput(e) {
    this.setData({
      price: e.detail.value.replace(/\s+/g, '')
    })
  },
  briefInput(e) {
    this.setData({
      briefInfo: e.detail.value.replace(/\s+/g, '')
    })
  },
  numberInput(e){
      this.setData({
        number: e.detail.value.replace(/\s+/g, '')
      })
      this.check();
  },


check:function(){
  console.log(this.data.number)
  if (this.data.isbn!=''&&this.data.bookName!=''&&this.data.author!=''&&this.data.publisher!=''&& this.data.number!=''){
    this.setData({
      addBtn:true
    })

  }else{
    this.setData({
      addBtn: false
    })
  }
},
addShelf:function(){
  var that = this;
  var time = util.formatTime(new Date());

  app.checkSession({
    success: function () {
      app.request({
        url: api.scan.addShelfByM,
        data: {
          isbn: that.data.isbn,
          addTime: time,
          bookName: that.data.bookName,
          author: that.data.author,
          publisher: that.data.publisher,
          pubTime: that.data.pubTime,
          translator: that.data.translator,
          price: that.data.price,
          briefInfo: that.data.briefInfo,
          number:that.data.number
        },
        success: function (res) {
          console.log(res);
          if (res.status.save_success == 1) {

            wx.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 2000
            })

          } else if (res.data.status == 0) {
            //保存失败
            wx.showToast({
              title: '添加失败',
              icon: 'none',
              duration: 2000
            })
          }
          that.loaddata();
        },

      })
    }
  })
}

})