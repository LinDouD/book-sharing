//获取应用实例  ——Sijar start
const app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');
//---Sijar end

Page({
  data: {
    //Sijar
    is_login: 0,
    nullView: [],
    mycircle_list: {},
    dataSource: [],
    height: 200,
    widHeight: 800 + 'px',
    //Sijar end

    hiddenModal2: true,
    input: null,
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
  //事件处理函数
  onLoad: function (options) {
    var that = this;
    app.login().then(function (res) {

      that.setData({
        is_login: res.data.result
      })
      if (res.data.result == 0) {

        console.log("用户不存在，跳转到授权界面");
        wx.navigateTo({
          url: "/pages/index/index"
        })
      }
      else {
        that.loadMyCircle();
      }
    })
  },
  onShow: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    let is_login = currPage.data.is_login;
    console.log("onshow", is_login)//为传过来的值
    if (is_login == 1) {
      this.loadMyCircle();
    }
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  input: function (e) {
    this.setData({ input: e.detail.value })
  },
  showModal2: function (e) {
    this.setData({ hiddenModal2: false })
  },
  model2confirm: function (e) {
    this.setData({ hiddenModal2: true })
    wx.showToast({
      title: '确定' + this.data.input,
      icon: 'none'
    })
  },
  model2cancel: function (e) {
    this.setData({ hiddenModal2: true })
    wx.showToast({
      title: '取消' + this.data.input,
      icon: 'none'
    })
  },
  //加载我的图书圈
  loadMyCircle: function(){
    var that = this;
    var access_token = wx.getStorageSync("access_token");
    app.request({
      url: api.bookcircle.mybookcircle,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': access_token
      },
      success: function (res) {
        if (res.code == 0) {
          var datasource = [];
          var nullview = [];
          var x = Math.ceil(res.my_book_circle_list.length / 3);
          var widheight = x * that.data.height + 'px';
          if (res.my_book_circle_list.length % 3 == 2) {  //页面最后一排只有两个
            nullview.push(1);
          }
          else {
            nullview.push(0);
          }
          for (var i = 0; i < res.my_book_circle_list.length; i++) {
            datasource.push(res.my_book_circle_list[i]);
          }      
          console.log("nullview:",nullview)   
          console.log("datasource:", datasource)
          that.setData({
            dataSource: datasource,
            nullView: nullview,
            widHeight: widheight
          })
        }
      },
      complete: function () {
        wx.stopPullDownRefresh();
      }
    })
  },
  //跳转到图书圈详情界面
  goToDetailCircle: function (e) {
    var isbn = e.currentTarget.id;
    wx.navigateTo({
      // url: '/pages/asecond/BDetail/BDetail?id=' + isbn

      url: '/pages/asecond/BDself/BDself?id=' + isbn
    });
  }



})
