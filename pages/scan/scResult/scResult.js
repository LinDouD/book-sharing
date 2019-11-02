// pages/scan/scResult/scResult.js

const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_briefnull:1,
    windowWidth: '',
    disable:false,
    pixelRatio:'',
    bookName: '',
    is_exist:-1,  //0:book不存在，1 存在
    author:'',
    briefIntro: '',
    picPath: '',
    publisher:'',
    price:'',
    isbn: '10006-456', //测试
    hiddenModal2:true,
    time:'',
    index:0,
    
    items: [
      { name: 'public', value: '公开',checked: 'true'  },
      { name: 'privacy', value: '私密'},
     
    ]

  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var value = e.detail.value;
    var index = 0;
    if(value =='public'){
      index = 0;
    }
    else{
      index = 1;
    }
    this.setData({
      index:index
    })
  },
  showModal2: function (e) {
    this.setData({ hiddenModal2: false })
  },
  model2confirm: function (e) {
    var that = this;
    var time = util.formatTime(new Date());
    
    this.setData({ hiddenModal2: true })
    app.checkSession({
      success: function () {
        app.request({
          url: api.scan.addShelf,
          data: {
            isbn: that.data.isbn,
            addTimes: time,
            privacy: that.data.index
          },
          success:function(res){
            console.log(res);
            if(res.data.status==1){
              //我的书架中已有此书
              wx.showToast({
                title: '我的书架中已有此书',
                icon:'none',
                duration: 2000
              })
              that.setData({
                disable:true
              })
            } else if (res.data.status == 2){
              //保存书籍
              if(res.data.save_success==0){
                //保存失败
                wx.showToast({
                  title: '添加失败',
                  icon: 'none',
                  duration: 2000
                })
                
              } else {
                //保存成功
                wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                  duration: 2000
                })
                that.setData({
                  disable: true
                })

              }
            }
            else{
              //用户不存在
              wx.showToast({
                title: '此用户不存在请重新授权登陆',
                icon: 'success',
                duration: 2000
              })
              wx.navigateTo({
                url: "/pages/index/index"
              })
            }
          },
          
        })
      }
    })
    
  },
  model2cancel: function (e) {
    this.setData({ hiddenModal2: true })
  },
  onLoad: function (options) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; 
    prevPage.setData({
      isbn: ''
    })
    var id = options.id;
    var that = this;
    //1.动态获取设备屏幕的高度，然后计算scroll view的高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          pixelRatio: res.pixelRatio
        });
      }
    });
    this.setData({
      isbn: id
    })
    this.loaddata();
  },

  loaddata: function () {
    var that=this;
    var id = this.data.isbn
    app.checkSession({success:function(){
      app.request({
        url: api.scan.querybook,
        data: {
          isbn: id
        },
        success: function (res) {
          that.setData({
            is_exist: res.status.is_exist
          })
          if (res.status.is_exist == 1) {
            var briefIntro = res.book.briefIntro;
            var is_briefnull = 1;

            if (res.book.briefIntro == null || res.book.briefIntro == '') {
              briefIntro = "无简介";
              is_briefnull = 0;

            }
            that.setData({
              is_briefnull:is_briefnull,
              publisher:res.book.publisher,
              price:res.book.price,
              bookName: res.book.bookName,
              picPath: res.book.picPath,
              briefIntro: briefIntro,
              author: res.book.author
            })
            console.log("scResult", res)
          }

        },

      });
    }})
   
  }



})