//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');


Page({
  data: {
    //xqq
    // is_auth: app.globalData.is_auth,
    is_login: 0,
    nullView: [],
    cat_list: {},
    dataSource: [],
    height: 200,
    widHeight: 800 + 'px',
    //xqqend

    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navData: [
      {
        text: '所有'
      },
      {
        text: '文学'
      },
      {
        text: '流行'
      },
      {
        text: '文化'
      },
      {
        text: '生活'
      },
      {
        text: '经管'
      },
      {
        text: '科技'
      }
    ],
    currentTab: 0,
    navScrollLeft: 0,

    //时间/字母
    array: ['时间', '字母'],
    objectArray: [
      {
        id: 0,
        name: '时间'
      },
      {
        id: 1,
        name: '字母'
      }
    ],
    index: 0,
    //书籍
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000


  },

  //时间/字母
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value
    })
  },

  //事件处理函数
  onLoad: function (options) {
    var that = this;
    app.login().then(function (res) {

      that.setData({
        is_login: res.data.result
      })
      if (res.data.result == 0) {

        console.log("用户不存在，跳转到授权界面");
        wx.navigateTo({
          url: "/pages/index/index"
        })
      }
      else {

        that.loadData();
      }
    })
  },

  onShow: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    let is_login = currPage.data.is_login;
    console.log("onshow", is_login)//为传过来的值
    if (is_login == 1) {
      this.loadData();
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
    var that = this;
    var access_token = wx.getStorageSync("access_token");
    app.request({
      url: api.myshelf.myshelf,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': access_token
      },
      success: function (res) {
        if (res.code == 0) {
          var book = [
            {
              catgId: 0,
              catgName: '所有'
            }
          ];
          for (var i = 0; i < res.data.cat_list.length; i++) {

            book.push(res.data.cat_list[i]);
          };
          var datasource = [];
          var nullview = [];
          var x = Math.ceil(res.data.catg_book_list.length / 3);
          var widheight = x * that.data.height + 'px';

          for (var i = 0; i < res.data.catg_book_list.length; i++) {
            //book.push(res.data.cat_list[i]);

            if (res.data.catg_book_list[i].catgId == 0) {
              datasource.unshift(res.data.catg_book_list[i].catg_book_list);
              if (res.data.catg_book_list[i].catg_book_list.length % 3 == 2) {
                nullview.unshift(1);
              }
              else {
                nullview.unshift(0);
              }
              continue;

            }
            else {
              if (res.data.catg_book_list[i].catg_book_list.length % 3 == 2) {
                nullview.push(1);
              }
              else {
                nullview.push(0);
              }
            }



            datasource.push(res.data.catg_book_list[i].catg_book_list);
          }
          // datasource.push(res.data.catg_book_list)
          console.log("datasource:", datasource)

          that.setData({
            cat_list: book,
            dataSource: datasource,
            nullView: nullview,
            widHeight: widheight
          })
          console.log("cate_list", book);

        }
      },
      complete: function () {
        wx.stopPullDownRefresh();
      }
    });

  },

  //xqq:跳转到书籍详情界面，未完成
  goToDetailPage: function (e) {
    var isbn = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/asecond/BDetail/BDetail?id=' + isbn
    });
  },

})

