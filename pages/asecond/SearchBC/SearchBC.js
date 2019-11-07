// pages/asecond/SearchBC/SearchBC.js
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bcName: '',
    searchBC:'',
    dataSource: [],
     options: [{
      city_id: '001',
      city_name: '圈名'
    }],
    selected: {
      id: '000',
      name: '书名'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.bcName){
      var bcName = options.bcName;
      this.data.bcName = bcName;
      this.setData({
        selected: {
          id: '001',
          name: '圈名'
        }
      })
      console.log("bcName  serach:", this.data.bcName);
      console.log("selected====", this.data.selected.name);
      this.loaddata1();
    }
    else if(options.bName){
      var bName = options.bName;
      this.data.bName = bName;
      this.setData({
        selected: {
          id: '000',
          name: '书名'
        }
      })
      console.log("bName  serach:", this.data.bName);
      console.log("selected====", this.data.selected.name);
      this.loaddata2();
    }else{
      wx.showToast({
        title: '搜索不为空！！' ,
        icon: 'none'
      })
    }
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
    wx.reLaunch({
      url: '/pages/BC/BC'
    })

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
  loaddata1: function () {//圈名
    var that = this;
    var access_token = wx.getStorageSync("access_token");
    app.request({
      url: api.bookcircle.searchbookcirclebcname,
      data: {
        bcName: that.data.bcName
      },
      success: function (res) {
        if (res.searchBCInf) {
          var dataSource = [];
          for (var i = 0; i < res.searchBCInf.length; i++) {
            dataSource.push(res.searchBCInf[i]);
          }
          that.setData({
            dataSource:dataSource
            
          })
          console.log("dataSource:", that.data.dataSource);
        } else {
          wx.showToast({
            title: '无相似结果',
            icon: 'none'
          })
        }
      }
    })
  },
  loaddata2: function () { //书名
    var that = this;
    var access_token = wx.getStorageSync("access_token");
    app.request({
      url: api.bookcircle.searchbookcirclebname,
      data: {
        bName: that.data.bName
      },
      success: function (res) {
        if (res.searchBCInf) {
          var dataSource = [];
          for (var i = 0; i < res.searchBCInf.length; i++) {
            dataSource.push(res.searchBCInf[i]);
          }
          that.setData({
            dataSource: dataSource

          })
          console.log("dataSource:", that.data.dataSource);
        } else {
          wx.showToast({
            title: '无相似结果',
            icon: 'none'
          })
        }
      }
    })
  },

  //跳转到图书圈详情界面
  goToDetailCircle: function (e) {
    var circleId = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/bsecond/CMember/CMember?circleId='+circleId
    });
  },
  searchInput: function (e) {
    this.setData({ searchBC: e.detail.value })
  },

  //跳转到图书圈搜索结果页面
  goToSearchRes: function (e) {
    console.log("selected=", this.data.selected);
    console.log("selected.name=", this.data.selected.name);
    if (this.data.selected.id == '001') {
      var bcName = this.data.searchBC;
      wx.navigateTo({
        url: '/pages/asecond/SearchBC/SearchBC?bcName=' + bcName
      });
    } else if (this.data.selected.id == '000') {
      var bName = this.data.searchBC;
      wx.navigateTo({
        url: '/pages/asecond/SearchBC/SearchBC?bName=' + bName
      });
    }
  },
  change(e) {
    this.setData({
      selected: { ...e.detail }
    })

  },
  close() {
    // 关闭select
    this.selectComponent('#select').close()
  }
})