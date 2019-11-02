

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
    toView: ''
  },
  onLoad: function () {

    
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
    wx.navigateTo({
      url: '/pages/shelf/othershelf/othershelf?fid=' + e.currentTarget.id
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
     
        
            console.log("friendlist",res.data)
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

  
 


})

