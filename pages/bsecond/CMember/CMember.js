const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');



Page({
  data: {
    top: true,
    /** 
      * 页面配置 
      */
    x1: 0,
    winWidth: 100,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    circleId: 6,
    circleName: '',
    createTime: '',
    intro: '',
    picPath: '',

    member: {},
    post: {},
    shelf: {},


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
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        height = height - 160;

        that.setData({
          height: height,
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    console.log("winWidth====!=======" + that.data.winWidth);
    console.log("winHeigh====xixixixi===" + that.data.winHeight);
    if (options.circleId) {
      var circleId = options.circleId;
      this.data.circleId = circleId;
    }
    this.getCircleInfo();
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
      if (e.target.dataset.current == 1) {
        that.postList();
      } else if (e.target.dataset.current == 2) {
        that.bookList();
      } else if (e.target.dataset.current == 0) {
        that.memberList();
      }
    }
  },
  getCircleInfo: function () {
    var that = this;
    var data = {
      circleId: that.data.circleId,
      circleName: that.data.circleName,
      createTime: that.data.createTime,
      intro: that.data.intro,
      picPath: that.data.picPath
    };
    console.log("data.cirleId=" + this.data.circleId);
    var url = api.bsecond.cmember;
    app.checkSession({
      success: function () {
        app.request({
          url: url,
          data: data,
          success: function (res) {
            console.log("show", res);
            var creatTime = res.createTime.split('T')[0];
            that.setData({
              bcName: res.bcName,
              createTime: creatTime,
              intro: res.intro,
              picPath: res.picPath
            })
            if (res.status.is_exist == 1) {
              data = res.data;
              that.setData({
                member: data,
                flag: res.flag
              })
            } else { }


          }
        })
      }
    })


  },


  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    console.log("ddd")
    this.setData({
      top: false
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      top: true
    })
  },


  scroll(e) {
    console.log(e.detail)
    if (e.detail.scrollTop <= 10) {
      this.setData({
        top: true
      })
    }
    if (e.detail.scrollTop > 10) {
      this.setData({
        top: false
      })
    }
  },


  goToDetailPage: function (e) {
    var that = this;
    var isbn = e.currentTarget.id;
    var count = e.currentTarget.dataset.count;
    var id = e.currentTarget.dataset.bid;
    var ownerId = e.currentTarget.dataset.ownerid;
    var isMe = e.currentTarget.dataset.me;
    console.log(e.currentTarget);
    var flag = "circle";
    if (that.data.flag != 2) {
      if (count == 1) {
        //直接跳转到具体界面
        if (isMe) {
          wx.navigateTo({
            url: '/pages/asecond/BDself/BDself?bookId=' + id + '&isbn=' + isbn + '&ownerId=' + ownerId
          })
        } else {
          wx.navigateTo({
            url: '/pages/asecond/BDother/BDother?bookId=' + id + '&isbn=' + isbn + '&ownerId=' + ownerId+'&flag='+'circle'
          })
        }

      } else {
        //否则跳转到列表界面
        wx.navigateTo({
          url: '/pages/shelf/list/list?isbn=' + isbn + '&flag=' + flag + '&id=' + that.data.circleId
        })
      }

    } else {
      wx.showModal({
        title: '提示',
        content: '请先申请加圈',
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

  goToMember: function (e) {

    var fid = e.currentTarget.id
    if (this.data.flag != 2) {
      wx.navigateTo({
        url: '/pages/friendlist/friendinfo/friendinfo?fid=' + fid
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先申请加圈',
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
  goToPost: function (e) {
    var postId = e.currentTarget.id;
    var that = this;
    wx.navigateTo({
      url: '/pages/asecond/posting/posting?id=' + postId + '&flag=' + that.data.flag
    })
  },
  addPost: function () {
    var that = this;

    if (that.data.flag == 2) {
      wx.showModal({
        title: '提示',
        content: '请先申请加圈',
        success: function (e) {
          if (e.confirm) {
            // 用户点击了确定 可以调用删除方法了
          } else if (e.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/bsecond/addPostN/addPostN?id=' + that.data.circleId
      })
    }
  },

  memberList: function () {
    var data = {};
    var that = this;
    app.request({
      url: api.bsecond.member,
      data: {
        bookCircleId: that.data.circleId
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

  postList: function () {
    var data = {};
    var that = this;
    app.request({
      url: api.bsecond.post,
      data: {
        bookCircleId: that.data.circleId
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
  bookList: function () {
    var data = {};
    var that = this;
    app.request({
      url: api.bsecond.shelf,
      data: {
        bookCircleId: that.data.circleId
      },
      success: function (res) {
        console.log(res)
        if (res.status.is_exist == 1) {
          console.log(res.data)
          that.setData({
            shelf: res.data
          })
        } else {

        }
      }
    })
  },
  edit: function () {
    var bookCircleId = this.data.circleId;
    wx.navigateTo({
      url: '/pages/bsecond/setCMember/setCMember?id=' + bookCircleId
    })
  },

  applyCircle: function () {
    var that = this;
    var content = "确认加入" + this.data.bcName
    wx.showModal({
      title: '提示',
      content: content,
      success: function (e) {
        if (e.confirm) {
          // 用户点击了确定 可以调用删除方法了


          app.checkSession({
            success: function () {
              app.request({
                url: api.bsecond.applyCircle,
                data: {
                  bookCircleId: that.data.circleId
                },
                success: function (res) {
                  console.log("applyCircle", res);
                  if (res.status.is_exist == 1) {
                    wx.showToast({
                      title: '添加成功',
                      icon: 'success',
                      success: function () {
                        that.getCircleInfo();
                      }
                    })


                  } else {

                    wx.showToast({
                      title: '申请失败',
                      icon: 'none',
                      success: function () {
                        that.getCircleInfo();
                      }
                    })

                  }


                }
              })
            }
          })



        } else if (e.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


})
