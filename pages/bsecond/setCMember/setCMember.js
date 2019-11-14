//index.js
//获取应用实例
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');


Page({
  data: {
    bookCircleId:6,
    circleInfo:{},
    userInfo:{},
  },
  
  
  onLoad: function (options) {
      this.setData({
      bookCircleId: options.id
    })

  },


onShow:function(){
this.loadData();

},

loadData:function(){
  var that = this;
  app.checkSession({
    success: function () {
      app.request({
        url: api.bsecond.setCMember,
        data: {
          bookCircleId: that.data.bookCircleId,
        },
        success:function(res){
          console.log(res)
          if (res.status.is_exist==1){
            that.setData({
              userInfo:res.dataU,
              circleInfo:res.dataC
            })
            console.log(that.data.userInfo)
            console.log(that.data.circleInfo)
          }
        }
      })
    }
  })
},


})
