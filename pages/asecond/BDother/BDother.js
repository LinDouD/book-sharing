//index.js
//获取应用实例
const app = getApp()
const api = require('../../../config.js')
Page({
  data: {
    hiddenModal: true,
    input: null,
    
  },
  
  input: function (e) {
    this.setData({ input: e.detail.value })
  },
  showModal: function (e) {
    this.setData({ hiddenModal: false })
  },
  model2confirm: function (e) {
    this.setData({ hiddenModal: true })
    wx.showToast({
      title: '确定' + this.data.input,
      icon: 'none'
    })
  },
  model2cancel: function (e) {
    this.setData({ hiddenModal: true })
    wx.showToast({
      title: '取消' + this.data.input,
      icon: 'none'
    })
  }
})
