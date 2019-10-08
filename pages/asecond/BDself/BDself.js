//index.js
//获取应用实例
const app = getApp()
const api = require('../../../config.js')
Page({
  data: {
    hiddenModal: true,
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
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
