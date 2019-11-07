// pages/bsecond/OtherCircle/OtherCircle.js
Page({
  data: {
    /** 
      * 页面配置 
      */
    x1: 0,
    winWidth: 100,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    console.log("winWidth====!=======" + that.data.winWidth);
    console.log("winHeigh====xixixixi===" + that.data.winHeight);
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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
  }
})
