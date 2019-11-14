//index.js
//获取应用实例
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');
Page({
  data: {
    disabled: false,
    bdisabled1: true,

    is_folded: 0,
    userBook: {},
    userInfo: {},
    bookInf: {},
    fuserInfo: {},
    is_exist: 0,
    isbn: '',
    isCatg: true,
    bookId: -1,
    ownerId: 0


  },
  onLoad: function (options) {
    var that = this;
    var bookId = options.bookId;
    var isbn = options.isbn;
    var ownerId = options.ownerId;

    that.setData({
      isbn: isbn,
      bookId: bookId,
      ownerId: ownerId
    })


  },

  onShow: function () {
    this.loaddata();
  },
  loaddata: function () {

    var that = this;
    var data = {
      isbn: that.data.isbn,
      bookId: that.data.bookId,
      ownerId: that.data.ownerId
    };
    var url = api.asecond.otherBook;
    app.checkSession({
      success: function () {
        app.request({
          url: url,
          data: data,
          success: function (res) {
            console.log(res);
            if (res.status.is_exist == 2) {
              var isCatg = false;
              var bdisabled1 = true;
      
              if (res.bookInf.categoryInfList != null && res.bookInf.categoryInfList.length != 0) {
                isCatg = true;
              } else {
                isCatg = false;
              }

              if (res.userBook.privacy == 1) {
                bdisabled1 = true; 
              } else {
                if (res.userBook.borrowState == 1) {
                  bdisabled1 = false;
                } else if (res.userBook.borrowState == 2) {
                  bdisabled1 = true;
                } else {
                  bdisabled1 = false;
                }
              }
              
            that.setData({
              bdisabled1: bdisabled1,
              fuserInfo: res.fuserInfo,
              userInfo: res.userInfo,
              userBook: res.userBook,
              bookInf: res.bookInf,
              is_exist: res.status.is_exist,

              isCatg: isCatg
            })
            console.log("iscATG", that.data)
            }
          },
        });

      }
    })

  },


  more: function (e) {
    var that = this;
    this.setData({
      is_folded: 1
    })
  },

  close: function (e) {
    var that = this;
    this.setData({
      is_folded: 0
    })
  },



  opt: function (e) {
    var that = this;
    var time = util.formatTime(new Date());
    var ownerId = this.data.ownerId;
 
    var mode = '';
    var data = {};
    var content = '';

    mode = 'apply';
    content = '确认要借阅本书籍?';
    data = {
      id: that.data.bookId, //bookId
      mode: mode,
      time: time,
      fid: ownerId,
    }

    wx.showModal({
      title: '提示',
      content: content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.checkSession({
            success: function () {
              app.request({
                url: api.asecond.bdother_opt,
                data: data,
                success: function (res) {
                  if (res.data.save_success == 0) {
                    //保存失败
                    wx.showToast({
                      title: '修改失败',
                      icon: 'none',
                      duration: 2000
                    })
                  } else {

                    that.onShow();

                    wx.showToast({
                      title: '修改成功',
                      duration: 2000
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

  goToShelf: function (e) {
    if (this.data.self) {
      wx.navigateTo({
        url: '/pages/shelf/othershelf/othershelf?fid=' + e.currentTarget.id
      })
    }

  },
  goToChat: function () {
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
  }
})