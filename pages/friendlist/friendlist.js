

const app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');

Page({
  data: {
    focus: false,
    val: '',
    friendlist:{},
    is_exist:false,
    nav: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"],
    toView: '',
    

    delBtnWidth: 160,
    data: [{ content: "1", right: 0 }, { content: "2", right: 0 }, { content: "3", right: 0 }, { content: "4", right: 0 }, { content: "5", right: 0 }, { content: "6", right: 0 }, { content: "7", right: 0 }, { content: "8", right: 0 }, { content: "9", right: 0 }, { content: "10", right: 0 }],
    isScroll: true,
    windowHeight: 0,
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    
  },
  setFocus: function () {
    this.setData({
      focus: !this.data.focus,
      val: ''
    })
  },
  search: function (e) {
    console.log(e.detail.value)
  },
  toView: function (e) {
   var toView = e.currentTarget.dataset.i
    this.setData({
      toView: toView
    })
  },
  goDetail: function (e) {

    console.log("gotoDetail--fid", e.currentTarget.id)
    wx.navigateTo({
      url: '/pages/friendlist/friendinfo/friendinfo?fid=' + e.currentTarget.id 
    })
  },
  onShow: function () {
    this.loadData();
  },

  loadData:function(){
    var that = this;
    app.checkSession({
      success: function () {
        app.request({
          url: api.friendlist.friendlist,
    
          success: function (res) {
     
            console.log("friendlist",res)
            if(res.status.is_exist ==1){

              //存在好友
              that.setData({
                friendlist:res.data,
                is_exist:true
              })
            
            }
         
          },
        });
      }
    })


  },


  drawStart: function (e) {
    // console.log("drawStart");  
    var touch = e.touches[0]

    for (var index in this.data.data) {
      var item = this.data.data[index]
      item.right = 0
    }
    this.setData({
      data: this.data.data,
      startX: touch.clientX,
    })

  },
  drawMove: function (e) {
    var touch = e.touches[0]
    var item = this.data.data[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX

    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        data: this.data.data
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        data: this.data.data
      })
    }
  },
  drawEnd: function (e) {
    var item = this.data.data[e.currentTarget.dataset.index]
    if (item.right >= this.data.delBtnWidth / 2) {
      item.right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        data: this.data.data,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        data: this.data.data,
      })
    }
  },

  delItem: function (e) {

  },
  goToMessage:function(){
    wx.navigateTo({
      url: '/pages/friendlist/friendMessage/friendMessage' 
    })
  }
 


})

