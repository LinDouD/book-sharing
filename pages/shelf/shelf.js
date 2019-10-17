//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');


Page({
  data: {

    is_login: -1,
    nullView: [],
    cat_list: {},
    dataSource: [],
    height: 200,
    widHeight: 0 + 'px',
 
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
        dataSource:datas
      })

    }
  
  },

  //事件处理函数
  onLoad: function (options) {
    var that = this;
    var mode = "check";
    app.login(mode).then(function (res) {
      that.setData({
        is_login: res.data.result
      })
      // is_login:-1(code为null)，0(用户不存在)，1(用户存在)
      if (res.data.result == 0) {
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
    app.checkSession({success:function(){
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
            var x = Math.floor(res.data.catg_book_list.length / 3);

            var widheight = x * that.data.height + 'px';
            
            for (var i = 0; i < res.data.catg_book_list.length; i++) {
            
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

            that.setData({
              cat_list: book,
              dataSource: datasource,
              nullView: nullview,
              widHeight: widheight
            })
            console.log("datasource:", datasource)
            console.log("cate_list", book);

          }
        },
        complete: function () {
          wx.stopPullDownRefresh();
        }
      });
    }})
    

  },

  //xqq:跳转到书籍详情界面，未完成
  goToDetailPage: function (e) {
    var isbn = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/asecond/BDself/BDself?id=' + isbn
    });
  },

  /**
   *特殊写法:比较数组date日期
   */
  compare: function () {
    return function (a, b) {
      var value1 = Date.parse(a.addTime);
      var value2 = Date.parse(b.addTime);
      return value2 - value1;
    }
  },



})

