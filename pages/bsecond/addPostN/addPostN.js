// pages/bsecond/addPostN/addPostN.js


const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookCircleId:6,
    content:'',
    title:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    bookCircleId:options.id
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
  input(e){
    this.setData({
      title: e.detail.value.replace(/\s+/g, '')
    })
    if(this.data.title!=''){
      this.setData({
        titleBtn:true
      })
    }else{
      this.setData({
        titleBtn: false
      })
    }
  },
  tinput(e) {
    this.setData({
      content: e.detail.value.replace(/\s+/g, '')
    })
    if (this.data.content != '') {
      this.setData({
        contentBtn: true
      })
    } else {
      this.setData({
        contentBtn: false
      })
    }
    
  },

  addPost:function(){
    var time = util.formatTime(new Date());
    var that = this;
    console.log(time)
    app.checkSession({
      success: function () {
        app.request({
          url: api.bsecond.post_add,
          data:{
            bookCircleId: that.data.bookCircleId,
            title:that.data.title,
            content:that.data.content,
            time:time
          },
          success: function (res) {
            if (res.status.is_exist == 1) {

              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 1000,
                mask: true,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    var pages = getCurrentPages(); //当前页面

                    var prevPage = pages[pages.length - 2]; //上一页面
                    prevPage.getCircleInfo();

                    wx.navigateBack({ //返回

                      delta: 1

                    });
                  }, 1000) //延迟时间
                },
              });

            } else {
              wx.showToast({
                title: '发帖失败',
                icon: 'none',
                duration: 1000,
                mask: true,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    var pages = getCurrentPages(); //当前页面

                    var prevPage = pages[pages.length - 2]; //上一页面

                    wx.navigateBack({ //返回

                      delta: 1

                    });
                  }, 1000) //延迟时间
                },
              });

             }

         


          }
        })
      }
    })








  }
})