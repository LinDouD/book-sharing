//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');


Page({
  data: {
    is_login: -1,
    nullView: [], //每一分类下是否需要空占位
    cat_list: {}, //分类
    dataSource: [], //每一分类下的所有书籍
    widHeight: 0 + 'px', //swiper 的高度 ，默认为150
    currentTab: 0,
    navScrollLeft: 0,
    exist: true,

    //picker
    array: ['时间', '字母'],
    objectArray: [{
      id: 0,
      name: '时间'
    },
    {
      id: 1,
      name: '字母'
    }
    ],
    index: 0,

    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000


  },

  //时间/字母
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var index = e.detail.value;
    var that = this;
    this.setData({
      index: e.detail.value
    })
    if (index == 0) {
      //时间排序
      var datas = [];
      datas = that.data.dataSource;
      var cur = that.data.currentTab
      datas[cur].sort(that.compare());
      that.setData({
        dataSource: datas
      })

    }

  },

  /**
   * 用户存在：加载界面，否则跳转到pc/pc界面（进行授权）
   **/
  onLoad: function (options) {

    var that = this;
    var mode = "check";

    app.login(mode).then(function (res) {
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
  onShow: function () {

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
  onPullDownRefresh: function () {
    this.loadData();
  },

  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5

    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur


      })
    }
  },

  switchTab(event) {
    var cur = event.detail.current;
    console.log(cur)
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth,
      //绑定数据
      //  children: event.target.dataset.current

    });
  },



  //xqq:加载界面数据：分类以及书籍
  loadData: function () {

    //设置swiper 高度，默认为150
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    var windowHeight = wx.getSystemInfoSync().windowHeight;
    var scroll_height = 750 * windowHeight / windowWidth - 100;

    var that = this;
    var access_token = wx.getStorageSync("access_token");
    app.checkSession({
      success: function () {
        app.request({
          url: api.shelf.myshelf,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': access_token
          },
          success: function (res) {
            var exist = false;
            console.log("shelf", res)
            //顶部导航条（分类）
            if (res.status.isSuccess == 2) {
              exist = true;
              var book = [];
              for (var i = 0; i < res.data.cat_list.length; i++) {
                book.push(res.data.cat_list[i]);
              };
              //顶部导航条（分类）

              //书架
              var datasource = [];
              var nullview = []; //是否需要空占位
              var widheight = scroll_height + 'rpx';

              for (var i = 0; i < res.data.catg_book_list.length; i++) {
                if (res.data.catg_book_list[i].catgId == 0) {
                  //分类所有-放置在最前
                  datasource.unshift(res.data.catg_book_list[i].catg_book_list);
                  //若最后一行只有两本书籍，为保证格式不乱，插入一个空占位
                  if (res.data.catg_book_list[i].catg_book_list.length % 3 == 2) {

                    nullview.unshift(true);
                  } else {
                    nullview.unshift(false);
                  }

                  continue;
                }

                //若最后一行只有两本书籍，为保证格式不乱，插入一个空占位
                if (res.data.catg_book_list[i].catg_book_list.length % 3 == 2) {

                  nullview.push(true);
                } else {
                  nullview.push(false);
                }
                datasource.push(res.data.catg_book_list[i].catg_book_list);


              }
              that.setData({
                cat_list: book,
                dataSource: datasource,
                nullView: nullview,
                widHeight: widheight
              })


            } else if (res.status.isSuccess == 1)
              console.log("shelf", "无此用户")
            else if (res.status.isSuccess == 3) {
              console.log("shelf", "无书籍")
              var book = [];
              for (var i = 0; i < res.data.cat_list.length; i++) {
                book.push(res.data.cat_list[i]);
              };
              that.setData({
                cat_list: book,

              })
            }
            else
              console.log("shelf", "openId解密不成功")

            that.setData({
              exist: exist
            })
          },
          complete: function () {
            wx.stopPullDownRefresh();
          }
        });
      }
    })


  },

  //xqq:跳转到书籍详情界面，未完成
  goToDetailPage: function (e) {
    var isbn = e.currentTarget.id;
    var isSelf = true;
    wx.navigateTo({
      url: '/pages/shelf/list/list?isbn=' + isbn + '&self=' + isSelf
    })

  },

  /**
   *特殊写法:比较数组date日期
   */
  compare: function () {
    return function (a, b) {
      var value1 = Date.parse(a.sortTime);
      var value2 = Date.parse(b.sortTime);
      return value2 - value1;
    }
  },

})