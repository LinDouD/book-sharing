//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');


Page({
  data: {
    count: 0,
    isMe: true,
    bCatgId: 0, //分类-所有，文学。。。。
    isself: 0, //属性-全部，我的，借阅
    privacy: 2, //状态- 全部，公开，私密
    bCatgIdTemp: 0,
    isselfTemp: 0,
    privacyTemp: 2,
    isList: false,
    isSetTrue: false,
    is_login: -1,
    emptyView: false, //是否需要空占位
    cat_list: {}, //分类
    exist: true,
    list: [],
    height: '', //scrollView -height
    sortName: '筛选',

  },
  sortByTime: function() {
    console.log("sortByTime")
    var datas = [];
    datas = this.data.list;
    datas.sort(this.compare());
    this.setData({
      list: datas
    })
    this.setHideSet();
  },

  /**
   * 用户存在：加载界面，否则跳转到pc/pc界面（进行授权）
   **/
  onLoad: function(options) {

    var that = this;
    var mode = "check";

    wx.getSystemInfo({
      success: function(res) {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        height = height - 130;
        that.setData({
          height: height
        });
      }
    });
    app.login(mode).then(function(res) {
      that.setData({
        is_login: res.data.result
      })
      // is_login:-1(code为null)，0(用户不存在)，1(用户存在)
      if (res.data.result == 0) {
        wx.switchTab({
          url: "/pages/PC/PC"
        })
      } else {
        app.globalData.is_login = 1;
        that.setData({
          is_login: app.globalData.is_login,
        })
        //加载界面书籍
        that.loadData();
      }
    })
  },

  /**
   * 每次切换tab时重新加载数据 
   **/
  onShow: function() {
    let is_login = app.globalData.is_login;
    if (is_login == 1) {
      this.loadData();
    } else {
      //重新授权
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.loadData();
  },




  //xqq:加载界面数据：分类以及书籍
  loadData: function() {
    var that = this;
    var access_token = wx.getStorageSync("access_token");
    app.checkSession({
      success: function() {
        app.request({
          url: api.shelf.shelfIndex,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': access_token
          },
          data: {
            bCatgId: that.data.bCatgId, //所有分类
            privacy: that.data.privacy, //all
            isself: that.data.isself //all 
          },
          success: function(res) {
            var exist = false;
            console.log("shelf", res)
            //顶部导航条（分类）
            if (res.status.isSuccess == 1) {
              exist = true;

              var emptyView = false;
              //是否需要空占位
              if (res.data.count % 3 == 2) {
                emptyView = true;
              }
              that.setData({
                list: res.data.books,
                cat_list: res.data.cat_list,
                count: res.data.count,
                emptyView: emptyView,
                myUserId: res.myUserId

              })
            } else
              console.log("shelf", "无此用户")

            that.setData({
              exist: exist
            })
          },
          complete: function() {
            wx.stopPullDownRefresh();
          }
        });
      }
    })

  },

  //xqq:跳转到书籍详情界面，未完成
  goToDetailPage: function(e) {
    var that = this;
    var isbn = e.currentTarget.id;
    var count = e.currentTarget.dataset.count;
    var type = e.currentTarget.dataset.type; //是否是我的书籍
    var id = e.currentTarget.dataset.bid;
    var ownerId = e.currentTarget.dataset.ownerid;
   console.log(e.currentTarget);
   var flag = "shelf";

   if(count==1){
     //直接跳转到具体界面
     if (type) {
       //我的书籍
       wx.navigateTo({
         url: '/pages/asecond/BDself/BDself?bookId=' + id + '&isbn=' + isbn + '&ownerId=' + that.data.myUserId 
       })
     } else {
       //借阅书籍
       wx.navigateTo({
         url: '/pages/asecond/BDother/BDother?borrowId=' + id + '&isbn=' + isbn + '&ownerId=' + that.data.myUserId 
       })

     }
     
   }else{
      //否则跳转到列表界面
     wx.navigateTo({
       url: '/pages/shelf/list/list?isbn=' + isbn + '&type=' + type + '&flag=' + flag
     })
   }
  },

  /**
   *特殊写法:比较数组date日期
   */
  compare: function() {
    return function(a, b) {
      var value1 = Date.parse(a.sortTime);
      var value2 = Date.parse(b.sortTime);
      return value2 - value1;
    }
  },



  tryDriver: function(e) {
    console.log(e.currentTarget)
    var id = e.currentTarget.id;
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.item;
    var that = this;
    if (type == 0) {
      //类别
      that.setData({
        bCatgIdTemp: id,
      })
    } else if (type == 1) {
      //属性
      if (index == 1 || index == 0) {
        //我的 展开状态栏
        that.setData({
          isMe: true
        })
      } else {
        that.setData({
          isMe: false
        })
      }
      that.setData({
        isselfTemp: index
      })
    } else if (type == 2) {
      //状态
      that.setData({
        privacyTemp: index
      })
    }




  },
  onReady: function() {
    this.animation = wx.createAnimation({
      timingFunction: "step-start",
      duration: 400,
      delay: 0
    });
    this.animationSort = wx.createAnimation({
      duration: 400, // 整个动画过程花费的时间，单位为毫秒
      timingFunction: "ease", // 动画的类型
      delay: 0 // 动画延迟参数
    })
  },
  translate: function() {
    console.log("dd")
    this.setData({
      isRuleTrue: true
    })
    this.animation.translate(0, 0).step()
    this.setData({
      animation: this.animation.export()
    })
  },

  translateSort: function() {
    this.setData({
      isSortTrue: true
    })
    this.animationSort.translate(245, 0).step()
    this.setData({
      animationSort: this.animationSort.export()
    })
  },

  setHideSet: function() {
    this.setData({
      isRuleTrue: false
    })
    this.animation.translate(150, 0).step()
    this.setData({
      animation: this.animation.export()
    })
  },

  sethideSort: function() {
    console.log("ddd")
    this.setData({
      isSortTrue: false
    })
    // 设置动画内容为：使用绝对定位隐藏整个区域，高度变为0
    this.animation.translate(0, 0).step();
    this.setData({
      animationSort: this.animationSort.export()
    })
  },
  changeList: function() {
    var that = this;
    if (this.data.isList) {
      that.setData({
        isList: false
      })
    } else {
      that.setData({
        isList: true
      })
    }
    this.setHideSet();
  },
  okBtn: function() {

    var that = this;

    if (that.data.bCatgId == that.data.bCatgIdTemp &&
      that.data.privacy == that.data.privacyTemp &&
      that.data.isself == that.data.isselfTemp) {
      that.sethideSort();
    } else {
      app.checkSession({
          success: function() {
            app.request({
              url: api.shelf.shelfIndex,
              data: {
                bCatgId: that.data.bCatgIdTemp,
                privacy: that.data.privacyTemp,
                isself: that.data.isselfTemp
              },
              success: function(res) {
                var exist = false;
                console.log("shelf", res)
                //顶部导航条（分类）
                if (res.status.isSuccess == 1) {
                  exist = true;

                  var emptyView = false;
                  //是否需要空占位
                  if (res.data.count % 3 == 2) {
                    emptyView = true;
                  }
                  that.setData({
                    list: res.data.books,
                    cat_list: res.data.cat_list,
                    count: res.data.count,
                    emptyView: emptyView,
                    bCatgId: that.data.bCatgIdTemp,
                    isself: that.data.isselfTemp,
                    privacy: that.data.privacyTemp,
                  })
                  for (var i = 0; i < that.data.cat_list.length; i++) {
                    if (that.data.cat_list[i].catgId == that.data.bCatgId) {
                      that.setData({
                        sortName: that.data.cat_list[i].catgName
                      })
                      break;
                    }
                  }
                  that.sethideSort();
                }
              }
            })
          }
        }
      )
    }
  },
  cancelBtn: function() {
    this.setData({
      bCatgIdTemp: this.data.bCatgId,
      isselfTemp: this.data.isself,
      privacyTemp: this.data.privacy,

    })
    this.sethideSort();
  }

})