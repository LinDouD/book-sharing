//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');

Page({
  data: {
    count: 0,
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
    catgName: '筛选',
    bCatgId: 0, //分类-所有，文学。。。。
    isself: 0, //属性-全部，我的，借阅
    privacy: 2, //状态- 全部，公开，私密
    isMe: true, //我的 展开状态栏

  },

  

  onReady: function () {
    this.animation = wx.createAnimation({
      timingFunction: "step-start",
      duration: 400,
      delay: 0
    });
   
  },

  /**
   * 用户存在：加载界面，否则跳转到pc/pc界面（进行授权）
   **/
  onLoad: function() {
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
          that.onShow();
        }
      })
    
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
   
  },

  /**
   * 每次切换tab时重新加载数据 
   **/
  onShow: function() {
    console.log("onshow")
    var that = this;
    let is_login = app.globalData.is_login;
    if (is_login == 1) {
      var data = {
    bCatgId: that.data.bCatgId, //所有分类
    privacy: that.data.privacy, //all
    isself: that.data.isself //all 
  }
  var catgName = that.data.catgName

     
      that.loadData(data, catgName);
      
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

  /*
   * tryDriver 筛选时style 变化
   * 注：不涉及后端
   * 
   */

  tryDriver: function (e) {
    console.log(e.currentTarget)
    var id = e.currentTarget.id;
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.item;
    var that = this;
   
    if (type == 0) {
      //类别
      var  catgName = e.currentTarget.dataset.name;
      
      that.setData({
        bCatgIdTemp: id,
        catgNameTemp: catgName
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
   
    console.log(
      
      that.data.privacyTemp, that.data.isselfTemp, that.data.bCatgIdTemp,
      that.data.privacy, that.data.isself, that.data.bCatgId
    )


  },

  /**
   * translate 右侧动画控制
   * 
   */
  translate: function () {
    this.setData({
      isRuleTrue: true
    })
    this.animation.translate(0, 0).step()
    this.setData({
      animation: this.animation.export()
    })
  },


  /**
     * setHideSet 右侧动画隐藏
     * 
     */
  setHideSet: function () {
    this.setData({
      isRuleTrue: false
    })
    this.animation.translate(150, 0).step()
    this.setData({
      animation: this.animation.export()
    })
  },
  

  /*
   * changeList 列表-图墙切换
   * 
   */
  changeList: function () {
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

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

 /**
   * loadData
   * 加载所有书籍，包括
   * 借阅的书籍：若有多个书籍--跳转进入为列表，否则直接进入详情界面
   * 我的书籍：若有多个书籍--跳转进入为列表
   * url:api.shelf.shelfIndex
   * data:bCatgId：分类（0-所有）
   *      privacy：公开0 私密1 所有2
   *      isself：我的1 借阅2 所有0
   * 返回：data: 分类列表cat_list--cat_list
   *            书籍列表books --list
   *            书籍总数count--count
   *      status:isSuccess（1-成功）（0-失败）
   *      myUserId---myUserId
   */

  
  loadData: function (data, catgName) {
    console.log("data",data)
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
         data:data,

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
                myUserId: res.myUserId,
                catgName: catgName,
                catgNameTemp:catgName,
                 bCatgId: that.data.bCatgIdTemp,
                privacy: that.data.privacyTemp,
                isself: that.data.isselfTemp

              })
            } else{
              console.log("shelf", "无此用户")
              that.setData({
                error: "暂无书籍"
              })
            }
             

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

 

  /**
   * okBtn 筛选确认
   * 重新设置筛选条件
   * 如果条件未变化，则不触发筛选
   * url：api.shelf.shelfIndex,
   * 同 loaddata
   * 
   */
  okBtn: function() {
    var that = this;
    if (that.data.bCatgId == that.data.bCatgIdTemp &&
      that.data.privacy == that.data.privacyTemp &&
      that.data.isself == that.data.isselfTemp) {
      that.hideModal();
    } else {
      var data={
        bCatgId: that.data.bCatgIdTemp,
          privacy: that.data.privacyTemp,
            isself: that.data.isselfTemp
      }
      var catgName = that.data.catgNameTemp
      console.log(catgName)
      that.loadData(data, catgName);
      that.hideModal();
    }
  },
 
  /**
   * sortByTime
   * 根据时间排序 最近
   * 
   */
  sortByTime: function () {
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
   * goToDetailPage
   * count ==0 跳转到详情界面
   *       否则 跳转到列表界面
   * 详情-携带数据：ownerId
   *              isbn
   *              bookId/borrowId
   * 列表-携带数据：isbn
   *              flag="shelf"
   *              type true  我的 false 借阅
   * 
   */
  goToDetailPage: function (e) {
    var that = this;
    var isbn = e.currentTarget.id;
    var count = e.currentTarget.dataset.count;
    var type = e.currentTarget.dataset.type; //是否是我的书籍
    var id = e.currentTarget.dataset.bid;
    var ownerId = e.currentTarget.dataset.ownerid;
    console.log(e.currentTarget);
    var flag = "shelf";

    if (count == 1) {
      //直接跳转到具体界面
      if (type) {
        //我的书籍
        wx.navigateTo({
          url: '/pages/asecond/BDself/BDself?bookId=' + id + '&isbn=' + isbn + '&ownerId=' + that.data.myUserId
        })
      } else {
        //借阅书籍
        wx.navigateTo({
          url: '/pages/asecond/BDother/BDother?borrowId=' + id + '&isbn=' + isbn + '&userId=' + that.data.myUserId + '&flag=' + 'shelf'
        })

      }

    } else {
      //否则跳转到列表界面
      wx.navigateTo({
        url: '/pages/shelf/list/list?isbn=' + isbn + '&type=' + type + '&flag=' + flag
      })
    }
  },

/**
     * showModal 左侧动画隐藏
     * 
     */
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  searchIcon(e) {
    var bookName= e.detail.value.replace(/\s+/g, '');
    this.setData({
      bookName:bookName
    })
    },
    search:function(){
      if (this.data.bookName == "" || typeof (this.data.bookName) == "undefined"){
        this.clean();
       this.onShow();
      }
      else{
      var that = this;
      var bookName = this.data.bookName;
      var ownerId = this.data.myUserId;
      app.checkSession({
        success: function () {
          app.request({
            url: api.shelf.search,
            data: {
              bookName: bookName,
              ownerId: ownerId
            },
            success: function (res) {
              console.log("search", res)
              var exist = false;
              that.clean();
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
                  count: res.data.count,
                  emptyView: emptyView,
                })
              } else if (res.status.isSuccess == 0){
                console.log("search", "无此图书")
                that.setData({
                  error: "无此图书",
                  list:[],
                  
                })

              
              }
            },
          });
        }
      })
      }
    },

    clean:function(){
      this.setData({
        catgName: '筛选',
        bCatgId: 0, //分类-所有，文学。。。。
        isself: 0, //属性-全部，我的，借阅
        privacy: 2, //状态- 全部，公开，私密
        isMe: true, //我的 展开状态栏
       
      })
    }

})