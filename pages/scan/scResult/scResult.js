// pages/scan/scResult/scResult.js

const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookName: '',
    is_exist:1,  //0:book不存在，1 存在
    author:'',
    briefIntro: '',
    picPath: '',
    isbn: '1001-1', //测试
    
    array: ['公开', '私密'],
    objectArray: [
      {
        id: 0,
        name: '公开'
      },
      {
        id: 1,
        name: '私密'
      }
    ],
    index: 0,

  },


  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      isbn: id
    })
    this.loaddata();
  },

  loaddata: function () {
    var that=this;
    var id = this.data.isbn
    app.checkSession({success:function(){
      app.request({
        url: api.scan.querybook,
        data: {
          isbn: id
        },
        success: function (res) {
          that.setData({
            is_exist: res.status.is_exist
          })
          if (res.status.is_exist == 1) {
            var briefIntro = res.book.briefIntro;

            if (res.book.briefIntro == '') {
              briefIntro = "无简介"
            }
            that.setData({
              bookName: res.book.bookName,
              picPath: res.book.picPath,
              briefIntro: briefIntro,
              author: res.book.author
            })
            console.log("scResult", res)
          }

        },

      });
    }})
   
  }



})