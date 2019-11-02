//index.js
//获取应用实例
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');
Page({
  data: {
    is_folded: 0,
    userBook: {},
    userInfo: {},
    bookInf: {},
    borrowState: '',
    privacy: '',
    time: '',
    is_exist: -1,
    switchChecked: true,
    bookId: -1,
    isPrivacy:false ,//不可设置公开与否
    isCatg:true,

  },
  onLoad: function(options) {
    var bookId = options.bookId;
    this.setData({
      bookId: bookId,

    })
    this.loaddata();

  },
  loaddata: function() {
    var that = this;
    app.checkSession({
      success: function() {
        app.request({
          url: api.asecond.bdself,
          data: {
            bookId: that.data.bookId,
          },
          success: function(res) {
            console.log("self", res);
            if (res.status.is_exist == 2) {

              var userBook = res.userBook;
              var bookInf = res.bookInf;
              var borrowState = '';
              var privacy = '';
              var switchChecked = true;
              var isPrivacy = false;
              var is = false;
              var isCatg = false;
              if (res.bookInf.categoryInfList != null && res.bookInf.categoryInfList.length != 0) {
                isCatg = true;
              } else {
                isCatg = false;
              }

              if (res.bookInf.briefIntro == '' || res.bookInf.briefIntro == null) {
                bookInf.briefIntro = '暂无简介'
              } else {
                bookInf.briefIntro = res.bookInf.briefIntro;
              }

              if (res.userBook.privacy == 0) {
                privacy = '公开';
                switchChecked = true;
              } else {
                privacy = '私密';
                switchChecked = false;
                isPrivacy = true; //允许设置是否公开
              }

              if (res.userBook.borrowState == 1) {
                borrowState = "待处理";
                isPrivacy = false;

              } else if (res.userBook.borrowState == 2){
                  borrowState = "借阅中";
                  isPrivacy = false;
              } else {
                  borrowState = "无申请";
                  isPrivacy = true;
                }
            
              var addTime = res.userBook.addTime;
              var time = addTime.split('.')[0].split('T')[0];

              that.setData({
                isPrivacy: isPrivacy,
                userInfo: res.userInfo,
                userBook: res.userBook,
                bookInf: res.bookInf,
                borrowState: borrowState,
                privacy: privacy,
                switchChecked: switchChecked,
                is_exist: res.status.is_exist,
                time: time,
                isCatg: isCatg
              })
            } else {
              that.setData({
                is_exist: res.status.is_exist
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

  switchChange: function(e) {
    var switchChange = e.detail.value;
    var privacy = '';
    var pr = 0;

    if (switchChange) {
      privacy = '公开';
      pr = 0;
    } else {
      privacy = '私密';
      pr = 1;
    }

    var that = this;
    app.request({
      url: api.asecond.privacy,
      data: {
        bookId: that.data.bookId,
        privacy: pr
      },
      success: function(res) {
        if (res.data.save_success == 0) {
          //保存失败
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            switchChange: switchChange,
            privacy: privacy
          });
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000

          })
        }
      },
    });
  },

  deleteBook:function(){
    var that = this;


    wx.showModal({
      title: '提示',
      content: '确认要删除本书籍?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          app.checkSession({
            success: function () {
              app.request({
                url: api.asecond.deletebook,
                data: {
                  bookId: that.data.bookId
                 
                },
                success: function (res) {
                  if (res.data.save_success == 1) {
                    var type = res.type.isList;
                    console.log("delete", res)
                    wx.showToast({
                      title: '删除成功',
                      icon: 'success',
                      duration: 3000,
                      success:function(){
                       
                        if (type==0){
                          wx.switchTab({
                            url: '/pages/shelf/shelf'
                          })
                        }else{
                          let pages = getCurrentPages();
                          let prevPage = pages[pages.length - 2];
                          prevPage.loadData();
                           wx.navigateBack({
                             delta:1
                           })
                        }
                       
                      }
                    })
                    
                  
                  } else {
                
                    wx.showToast({
                      title: '删除失败',
                      icon: 'none',
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
  applyBtn:function(e){
    var self = 'self'
    wx.navigateTo({
      url: '/pages/chat/chat?id=' + e.currentTarget.id + '&self=' + self
    })
  }

})