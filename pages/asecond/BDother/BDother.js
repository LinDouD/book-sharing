//index.js
//获取应用实例
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');
Page({
  data: {
    disabled: false,
    bdisabled1: true,
    bdisabled2: true,
    returnName: "还书",
    type: 0,
    is_folded: 0,
    userBook: {},
    userInfo: {},
    bookInf: {},
    fuserInfo: {},
    is_exist: 0,
    isbn: '',
    isCatg: true,
    borrowId: -1,
    ownerId: 0


  },
  onLoad: function(options) {
    
    var that = this;

    if (JSON.stringify(options) != "{}") {
      var borrowId = options.borrowId;
      var isbn = options.isbn;
      var ownerId = options.ownerId;
      that.setData({
        isbn: isbn,
        borrowId: borrowId,
        ownerId: ownerId
      })

    }

   
   


  },

  onShow: function() {
    this.loaddata();
  },
  loaddata: function() {

    var that = this;
    var data = {
      isbn: that.data.isbn,
      borrowId: that.data.borrowId,
      ownerId: that.data.ownerId
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


              var bookInf = res.bookInf;

              var isCatg = false;
              var type = 0;
              var bdisabled1 = true;
              var bdisabled2 = true;
              if (res.bookInf.categoryInfList != null && res.bookInf.categoryInfList.length != 0) {
                isCatg = true;
              } else {
                isCatg = false;
              }
              if (res.userBook.usrBorrowState == 1) {

                type = 0; //取消申请btn
                bdisabled1 = false;
                that.setData({
                  type: type,
                  bdisabled1: bdisabled1,
                })

              } else if (res.userBook.usrBorrowState == 2) {

                type = 1; //归还
                bdisabled2 = false;
                that.setData({
                  type: type,
                  bdisabled2: bdisabled2,
                  returnName: "归还"
                })
              } else if (res.userBook.usrBorrowState == 3) {
                type = 1; //归还
                bdisabled2 = true;
                that.setData({
                  type: type,
                  bdisabled2: bdisabled2,
                  returnName: "还书中"

                })
              } else if (res.userBook.usrBorrowState == 4) {

                type = 1; //归还
                bdisabled2 = true;
                that.setData({
                  type: type,
                  bdisabled2: bdisabled2,
                  returnName: "已还书"
                })
              } else if (res.userBook.usrBorrowState == 5) {

                type = 0; //取消申请
                bdisabled1 = true;
                that.setData({
                  type: type,
                  bdisabled2: bdisabled2
                })
              } else {
                type = 0; //取消申请
                bdisabled1 = true;
                that.setData({
                  type: type,
                  bdisabled2: bdisabled2
                })
              }
            }
            that.setData({

              fuserInfo: res.fuserInfo,
              userInfo: res.userInfo,
              userBook: res.userBook,
              bookInf: res.bookInf,

              is_exist: res.status.is_exist,

              isCatg: isCatg
            })
            console.log("iscATG", that.data)

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



  opt: function(e) {
    var that = this;
    var time = util.formatTime(new Date());
    var ownerId = this.data.ownerId;
    var type = e.currentTarget.id;
    var mode = '';
    var data = {};
    var content = '';


    if (type == 0) {
      mode = 'cancel';
      content = '确认要取消申请本书籍?';
      data = {
        id: that.data.borrowId, //borrowId
        mode: mode,
        time: time,
        fid: ownerId
      }
    } else if (type == 1) {
      mode = 'return';
      content = '确认要归还本书籍?';
      data = {
        id: that.data.borrowId, //borrowId
        mode: mode,
        time: time,
        fid: ownerId
      }
    } 

    wx.showModal({
      title: '提示',
      content: content,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          app.checkSession({
            success: function() {
              app.request({
                url: api.asecond.bdother_opt,
                data: data,
                success: function(res) {
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

  goToShelf: function(e) {
    if (this.data.self) {
      wx.navigateTo({
        url: '/pages/shelf/othershelf/othershelf?fid=' + e.currentTarget.id
      })
    }

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
  }
})