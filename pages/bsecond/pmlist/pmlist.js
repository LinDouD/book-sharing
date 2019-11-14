// pages/bsecond/postlist/postlist.js



const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
ifp:true,
type:1,
    bookCircleId:6,
    deleteSet:false,
    deleteBtn:false,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
    bookCircleId: options.id,
     type: options.type
  })
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
    if(this.data.type==1){
      this.memberList();
      this.setData({
        deleteSet:false,
        deleteBtn:false

      })
    }else{
      this.postList();
    }

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


   memberList: function () {
    var data = {};
    var that = this;
    app.request({
      url: api.bsecond.member,
      data: {
        bookCircleId: that.data.bookCircleId
      },
      success: function (res) {
        console.log(res)
        if (res.status.is_exist == 1) {
          data = res.data;
          that.setData({
            member: data
          })
        } else {

        }
      }
    })
  },

  deleteSet:function(){
    var that= this;
    this.setData({
      deleteSet: !that.data.deleteSet
    })
  },
  checkboxChange:function(e){
    var that = this;
    if (that.data.deleteSet){
      
      var list = e.detail.value;

      if(list.length!=0){
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        that.setData({
          deleteBtn: true,
          list:list
        })
      }else{
        that.setData({
          deleteBtn: false
        })
      }
    }

  },
  deleteBtn:function(){
    var that = this;
    var url='';
if(this.data.type==0){

}else{
  url=api.bsecond.deleteCMember
}

    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          app.request({
            url: api.bsecond.deleteCMember,
            data: {
              list: that.data.list
            },
            success: function (res) {
              console.log(res)
              if (res.status.is_exist == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  success: function () {
                    that.onShow();
                  }
                })

              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  success: function () {
                    that.onShow();
                  }
                })
              }
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })

   
  },
  postList: function () {
    var data = {};
    var that = this;
    app.request({
      url: api.bsecond.post,
      data: {
        bookCircleId: that.data.bookCircleId
      },
      success: function (res) {
        console.log(res)
        if (res.status.is_exist == 1) {
          data = res.data;
          for (var i = 0; i < data.length; i++) {
            data[i].pubTime = data[i].pubTime.split('T')[0];

          }

          that.setData({
            post: data
          })
        } else {

        }
      }
    })
  },


 
})