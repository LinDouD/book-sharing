

const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');

Page({
  data: {
  
    is_exist: false,
  
  },
  onLoad: function () {
    var that = this;
   

  },
  
  
  goDetail: function (e) {
    wx.navigateTo({
      url: '/pages/shelf/othershelf/othershelf?fid=' + e.currentTarget.id
    })
  },
  onShow: function () {
    this.loadData();
  },

  loadData: function () {
    var that = this;
    var mode="all"
    app.checkSession({
      success: function () {
        app.request({
          url: api.friendlist.fMessageList,
          data:{
            mode:mode,
          },

          success: function (res) {
        
            console.log(res)
            if (res.status.is_exist == 1) {

              //存在好友
              that.setData({
                messagelists: res.data,
                is_exist: true
              })

              
            }

          },
        });
      }
    })


  },



agree:function(e){
  var fid = e.currentTarget.id;
  var mid = e.currentTarget.dataset.mid;
  var that = this;
  var mode = "agree"
  app.checkSession({
    success: function () {
      app.request({
        url: api.friendlist.friendOpt,
        data: {
          mode: mode,
          mid:mid,
          fid:fid
        },

        success: function (res) {
          console.log(res)
          console.log("agree", res)
          if (res.status.is_exist == 1) {
            wx.showToast({
              title: '已同意',
              icon:'none'
            })
          that.loadData();

          }else{
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            })
          }

        },
      });
    }
  })
},

})