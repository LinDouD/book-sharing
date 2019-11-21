//index.js
//获取应用实例
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');
var socketOpen = false;
var SocketTask = false;


Page({
  data: {

    userBook: {},
    userInfo: {},
    bookInf: {},
    fuserInfo: {},
    is_exist: false,
    isbn: '',
    borrowId: -1,
    ownerId: 0


  },

  onLoad: function(options) {

    var that = this;

    if (JSON.stringify(options) != "{}") {
      var borrowId = '';
      var bookId = '';
      var isbn = options.isbn;
      var ownerId = 0;
      var userId = 0;
      var flag = options.flag;
      if (flag == 'circle') {
        bookId = options.bookId
        ownerId = options.ownerId
      } else if (flag = 'shelf') {
        borrowId = options.borrowId
        userId = options.userId
      }
      that.setData({
        isbn: isbn,
        bookId: bookId,
        borrowId: borrowId,
        ownerId: ownerId,
        bookId: bookId,
        userId: userId,
        flag: flag
      })

    } else {
      that.setData({
        isbn: '9789882161320',
        borrowId: 56,
        ownerId: 23
      })
    }

  },

  onShow: function() {
    if (this.data.flag == 'circle') {
      this.loaddataCircle();
    } else if (this.data.flag = 'shelf') {
      this.loaddata();
    }

  },
  loaddata: function() {

    var that = this;
    var data = {
      isbn: that.data.isbn,
      borrowId: that.data.borrowId,
      ownerId: that.data.userId
    };
    var url = api.asecond.bdother;
    app.checkSession({
      success: function() {
        app.request({
          url: url,
          data: data,
          success: function(res) {
            console.log(res);
            if (res.status.is_exist == 1) {
              if (res.userBook.borrowTime != null && res.userBook.borrowTime.length != 0) 
                res.userBook.borrowTime = res.userBook.borrowTime.split("T")[0]
              

              if (res.userBook.returnDateTime != null && res.userBook.returnDateTime.length != 0)
                res.userBook.returnDateTime = res.userBook.returnDateTime.split("T")[0]

              if (res.userBook.borrowDateTime != null && res.userBook.borrowDateTime.length != 0)
                res.userBook.borrowDateTime = res.userBook.borrowDateTime.split("T")[0]

              that.setData({
                fuserInfo: res.fuserInfo,
                userBook: res.userBook,
                bookInf: res.bookInf,
                flag: res.flag,
                is_exist: true,
                borrow: res.borrow,
                ownerId: res.fuserInfo.userId
              })

            } else {
              that.setData({
                is_exist: false
              })
            }
          },
        });

      }
    })

  },

  loaddataCircle: function() {

    var that = this;
    var data = {
      isbn: that.data.isbn,
      bookId: that.data.bookId,
      ownerId: that.data.ownerId
    };
    var url = api.asecond.otherBook
    app.checkSession({
      success: function() {
        app.request({
          url: url,
          data: data,
          success: function(res) {
            console.log(res);
            if (res.status.is_exist == 1) {
              if (res.borrow) {
                that.setData({
                  borrowId: res.userBook.borrowId
                })
              }
              that.setData({
                fuserInfo: res.fuserInfo,
                userBook: res.userBook,
                bookInf: res.bookInf,
                flag: res.flag,
                is_exist: true,
                borrow: res.borrow,
                userId: res.userId,

              })

            } else {
              that.setData({
                is_exist: false
              })
            }
          },
        });

      }
    })

  },


  more: function(e) {
    var that = this;
    this.setData({
      is_folded: 1
    })
  },

  close: function(e) {
    var that = this;
    this.setData({
      is_folded: 0
    })
  },

  goToChat: function() {
    //self --id ==borrowId
    //other --id == bookId
    var self = ''
    if (this.data.self) {
      self = 'oself';
    } else {
      self = 'other';
    }

    var that = this;
    wx.navigateTo({
      url: '/pages/chat/chat?id=' + e.currentTarget.id + '&self=' + self
    })
  },
  cancelApply: function() {
    var that = this;
    var data = {
      borrowId: that.data.borrowId, //borrowId
    }


    wx.showModal({
      title: '提示',
      content: '确认要取消申请本书籍?',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          app.checkSession({
            success: function() {
              app.request({
                url: api.asecond.bdother_cancelApply,
                data: data,
                success: function(res) {
                  if (res.status.save_success == 0) {
                    //保存失败
                    wx.showToast({
                      title: '取消失败',
                      icon: 'none',
                      duration: 2000,
                      success: function() {
                        that.onShow();
                      }

                    })
                  } else {
                    wx.showToast({
                      title: '取消成功',
                      duration: 2000,
                      success: function() {
                        that.onShow();
                      }
                    })
                  }

                },

              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  applyBook: function() {

    var that = this;
    var time = util.formatTime(new Date());
    wx.showModal({
      title: '提示',
      content: '确认要借阅本书籍?',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.checkSession({
            success: function() {
              app.request({
                url: api.asecond.applyBook,
                data: {
                  bookId: that.data.bookId,
                  time: time,
                  ownerId: that.data.ownerId,
                  userId: that.data.userId,
                },
                success: function(res) {
                  if (res.status.save_success == 0) {
                    //保存失败
                    wx.showToast({
                      title: '借阅失败',
                      icon: 'none',
                      duration: 2000
                    })
                  } else {
                    wx.showToast({
                      title: '借阅成功',
                      duration: 2000
                    })
                  }
                  that.onShow();

                },

              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  returnBook: function() {

    var that = this;
    var time = util.formatTime(new Date());
    wx.showModal({
      title: '提示',
      content: '确认归还本书籍?',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.checkSession({
            success: function() {
              app.request({
                url: api.asecond.returnBook,
                data: {
                  borrowId: that.data.borrowId,
                  time: time,
                  ownerId: that.data.ownerId,
                  userId: that.data.userId,
                },
                success: function(res) {
                  if (res.status.save_success == 0) {
                    //保存失败
                    wx.showToast({
                      title: '归还失败',
                      icon: 'none',
                      duration: 2000
                    })
                  } else {
                    wx.showToast({
                      title: '归还成功',
                      duration: 2000
                    })
                  }
                  that.onShow();

                },

              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  goToFriendInfo:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/friendlist/friendinfo/friendinfo?fid=' + that.data.ownerId
    })
  },

  chat:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/contact/contact?userId=' +that.data.userId+ '&fid=' + that.data.ownerId
    })

  }


})