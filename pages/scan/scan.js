//index.js
//获取应用实例

const app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');

Page({
  data: {
    //isbn: '10006-459', //测试
    isbn:'',
    isShowInputForm: false

  },

  onLoad: function () {

  },

  bindKeyInput:function(e){
    this.setData({
      isbn:e.detail.value
    })
  },
  search:function(){
    var isbn = this.data.isbn;
    this.queryBook();

  },

  getScancode: function () {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;

        _this.setData({
          isbn: result,
        });
        wx.showToast({
          title: '成功',
          duration: 2000
        })

        _this.queryBook();
      }

    });

  },

  //根据图书isbn从bookinf 中查询详情
  queryBook: function () {
    var that = this;
    var isbn = that.data.isbn;
    console.log("querybook", that.data.isbn);
    app.checkSession({success:function(){
      app.request({
        url: api.scan.querybook,
        data: {
          isbn: that.data.isbn
        },
        success: function (res) {

          wx.navigateTo({
            url: '/pages/scan/scResult/scResult?id=' + isbn
          });
        }
      });

    }})
    
  },

  //根据扫码录入控制手动输入的form是否显示
  screenInput: function (e) {
    this.setData({
      isShowInputForm: !e.detail.value
    })
  },



})
