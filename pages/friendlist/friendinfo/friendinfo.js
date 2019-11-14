// pages/friendlist/friendinfo/friendinfo.js
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');


// config
const bgCoverUrl =
  "https://cdn.pixabay.com/photo/2016/04/15/10/23/grindelwald-1330662_1280.jpg";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bgCoverUrl,
    isClick: false,
    isCircle:false,
    hideNick:false, //true--不隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("friendInfo-optios",options.fid)

      this.setData({
        fid: options.fid,
      }) 

   
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  showModal(e) {

    this.setData({
      alias: '',
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })

  },

  editBtn: function() {
    var isClick = this.data.isClick;
    this.setData({
      isClick: !isClick
    })
  },
  aliasInput(e) {
    this.setData({
      alias: e.detail.value.replace(/\s+/g, '')
    })
  },
  confirm: function(e) {

    if (this.data.alias != '') {
      this.hideModal();
      this.edit();
    } else {
      console.log("e")
      wx.showToast({
        title: '输入不能为空',
        icon: 'none'
      })
    }

  },

  goToShelf: function () {
    var that = this;
    if (that.data.flag==2||that.data.flag==0) {
      wx.navigateTo({
        url: '/pages/shelf/othershelf/othershelf?fid=' + that.data.fid
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先添加对方好友',
        success: function (e) {
          if (e.confirm) {
            // 用户点击了确定 可以调用删除方法了
          } else if (e.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }


  },

  loadData:function(){
    console.log(this.data.fid)
var that = this;
    app.checkSession({
      success: function () {
        app.request({
          url: api.friendlist.friendInfo,
          data: {
            fid: that.data.fid
          },
          success: function (res) {

            console.log("friendInfo", res)
            if (res.status.is_exist == 1) {
              that.setData({
                userInfo: res.data,
                mid:res.mid,
                flag:res.flag
              })
              console.log("friendInfo", that.data.userInfo)
            }

          },
        });
      }
    })
  },
  add:function(){
    var mode = "add";
    var addTime = util.formatTime(new Date());
    var that = this;
    app.checkSession({
      success: function () {
        app.request({
          url: api.friendlist.friendOpt,
          data: {
            fid: that.data.fid,
            mid: that.data.mid,
            mode: mode,
            addTime: addTime
          },
          success: function (res) {

            console.log("add", res)
            if (res.status.is_exist == 1) {
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                success:function(){
                  that.loadData();
                }
              })
            } else {
              wx.showToast({
                title: '添加失败',
                icon: 'none'
              })
            }


          },
        });
      }
    })
  },
  delete:function(){
    var mode ="delete";
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (e) {
        if (e.confirm) {
         
          app.checkSession({
            success: function () {
              app.request({
                url: api.friendlist.friendOpt,
                data: {
                  fid: that.data.fid,
                  mid: that.data.mid,
                  mode :mode
                },
                success: function (res) {

                  console.log("delete", res)
                  if (res.status.is_exist == 1) {
                    wx.showToast({
                      title: '成功删除',
                      icon: 'none',
                      duration:2000,
                      success: function () {
                        setTimeout(function () {
                          //要延时执行的代码
                          var pages = getCurrentPages(); //当前页面

                          var prevPage = pages[pages.length - 2]; //上一页面

                          wx.navigateBack({ //返回

                            delta: 1

                          });
                        }, 1000) //延迟时间
                      }
                    })
                  }else{
                    wx.showToast({
                      title: '删除失败',
                      icon: 'none'
                    })
                  }
                    

                },
              });
            }
          })
        } else if (e.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

 
  edit: function () {
    var mode = "edit";
    var that = this;
    app.checkSession({
      success: function () {
        app.request({
          url: api.friendlist.friendOpt,
          data: {
            fid: that.data.fid,
            mid: that.data.mid,
            mode: mode,
            name: that.data.alias
          },
          success: function (res) {

            console.log("edit", res)
            if (res.status.is_exist == 1) {
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 2000,
                success: function () {
                  that.onShow();
                }
              })
            } else {
              wx.showToast({
                title: '修改失败',
                icon: 'none'
              })
            }


          },
        });
      }
    })
  },

})