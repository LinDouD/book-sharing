// pages/chat/chat.js
// pages/comment/comment.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');



Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    self: true,
    id: -1,
    applyType: 0,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //self --id ==borrowId
    //other --id == bookId
    var id = options.id;
    var self = options.self;
    var that = this;

    that.setData({

      self: self,
      id: id
    });
    that.getPageInfo();
  },



  getPageInfo() {
    var that = this;
    wx.showLoading({
      title: '',
      mask: true
    })
    console.log("getPageInfo");

    //self --id ==bookId
    //other --id == borrowId

    app.request({
      url: api.chat.chat,
      data: {
        // id :that.data.id,
        id: 39,
        mode: 'self',
      },

      success: function (res) {
        console.log(res);
        if (res.status.is_exist == 2) {

          var list = res.data;
          for (var i = 0; i < list.messageBookIdLists.length; i++) {
            list.messageBookIdLists[i].messageInfs.dateTime = list.messageBookIdLists[i].messageInfs.dateTime.split('T')[0];


          }
          that.setData({
            list: list
          })
        }
        wx.hideLoading();
      }
    })
  },


  pass: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var idx = e.currentTarget.dataset.idx;
    var mtype = e.currentTarget.dataset.mtype;
    var mode = '';
    var type = '';
    var time = util.formatTime(new Date());
    if (mtype == 0) {
      mode = "apply";
      type = "pass"
    } else if (mtype == 1) {
      mode = "return";
      type = "pass"
    }

    app.request({
      url: api.chat.chat_opt,
      data: {
        messageId: id,
        mode: mode,
        type: type,
        dateTime: time
      },
      success: function (res) {
        if (res.status.success == 1) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })


          var list = that.data.list;
          for (var i = 0; i < list.messageBookIdLists.length; i++) {
            if (i == idx) {
              list.messageBookIdLists[idx].messageInfs.borrowRes = 1;
              continue;
            }
            list.messageBookIdLists[i].messageInfs.borrowRes = 2;


          }

          that.setData({
            list: list
          })

        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 2000
          })
        }
      }

    })


  },


  reject: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var idx = e.currentTarget.dataset.idx;
    var mtype = e.currentTarget.dataset.mtype;
    var mode = '';
    var type = '';
    var time = util.formatTime(new Date());
    if (mtype == 0) {
      mode = "apply";
      type = "reject"
    } else if (mtype == 1) {
      mode = "return";
      type = "reject"
    }

    app.request({
      url: api.chat.chat_opt,
      data: {
        messageId: id,
        mode: mode,
        type: type,
        dateTime: time
      },
      success: function (res) {
        if (res.status.success == 1) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })


          var list = that.data.list;
          list.messageBookIdLists[idx].messageInfs.borrowRes = 2;
          that.setData({
            list: list
          })

        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 2000
          })
        }
      }

    })


  },

})

