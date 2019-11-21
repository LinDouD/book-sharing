// pages/scan/scResult/scResult.js

const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_exist:false,
    is_briefnull:1,
    windowWidth: '',
    isLogin:false,
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
  onShow:function(){
    if (app.globalData.is_login){
      this.setData({
        isLogin:true
      })
    }
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
    var that = this;
    var content=""
    if(this.data.bookInf.bookId!=-1){
      
      content = "您的书架里已有"+that.data.count+"本相同书籍"
    }else{
      content= "添加新书"
    }
    this.setData({ hiddenModal2: false , content:content})
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
            addTime: time,
            privacy: that.data.index
          },
          success:function(res){
            console.log(res);
            if (res.status.save_success==1){
             
              wx.showToast({
                title: '添加成功',
                icon:'none',
                duration: 2000
              })
              
            } else if (res.data.status == 0){
              //保存失败
              wx.showToast({
                title: '添加失败',
                icon: 'none',
                duration: 2000
              }) 
            }
            that.loaddata();
          },
          
        })
      }
    })
    
  },
  model2cancel: function (e) {
    this.setData({ hiddenModal2: true })
  },
  onLoad: function (options) {
  
    
    var that = this;
    if(JSON.stringify(options)!='{}'){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        isbn: ''
      })
      var isbn = options.id;
      that.setData({
        isbn: isbn
      })
    }else{
      that.setData({
        isbn: '10019-2047'
        //10019-2047
        //9780324168624
      })
    

    }
   
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
   
    this.loaddata();
  },

   /**
     * scan/scResult 查询
     * param: isbn
     * res:bookInf{
     *     包括：List<CategoryInf>)
     *          ifnull(bookId -1)
     *          ifnull(catgId -1)
     * }
     *    is_exist:0,1
     **/

  loaddata: function () {
    var that=this;
    var isbn = this.data.isbn
    app.checkSession({success:function(){
      app.request({
        url: api.scan.querybook,
        data: {
          isbn: isbn
        },
        success: function (res) {
          that.setData({
            is_exist: res.status.is_exist
          })
          if (res.status.is_exist == 1) {
            if (res.book.briefIntro == null || res.book.briefIntro == '') {
              res.book.briefIntro = "";
            }
            that.setData({
              bookInf:res.book,
              is_exist:true,
              count:res.count
            })
            console.log("scResult", res)
          }else{
            that.setData({
              is_exist:false
            })
            wx.showToast({
              title: '查无此书',
              icon:'none'
            })
          }

        },

      });
    }})
   
  }



})