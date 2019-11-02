//index.js
//获取应用实例
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');
Page({
  data: {
    disabled:false,
    bdisabled1:true,
    bdisabled2: true,
    type:0,
    is_folded: 0,
    userBook: {},
    userInfo: {},
    bookInf: {},
    fuserInfo:{},
    borrowState: '',
    borrowDateTime: '',
    returnDateTime:'',
    is_exist: 0,
    time:'',
    self:true,
    fid:-1,
    mode:'self',  //other || self
    isbn:'',
    isCatg:true,
    id:-1 , //bookId || borrowId
    borrow:false,
    applyEmpty:true,

  },
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var self = options.self;
    var isbn = options.isbn;
    var fid = -1;
    var mode = '';
    var flag = self === "false" ? false : true;
    if (!flag) {
      fid = options.fid;
      that.setData({
        fid: fid, 
        mode :'other'
      })
    }
    that.setData({
      isbn : isbn,
      id :id,
      self :flag
    })
 

  },

  onShow:function(){
    this.loaddata();
  },
  loaddata: function () {
    
    var that = this;
    var data = {
      isbn: that.data.isbn,
      mode: that.data.mode,
      id: that.data.id,   //bookId || borrowId
      fid: that.data.fid
    };
   var  url = api.asecond.bdother;
    app.checkSession({
      success: function () {
        app.request({
          url: url,
          data:data,
          success: function (res) {
            console.log(res);
            if (res.status.is_exist == 2) {
              var borrow = true;
              if(!that.data.self){
                borrow = res.borrow;
              }
             
              var bookInf = res.bookInf;
              var borrowState = '';
              var time = '';
              var isCatg = false;
              var type = 0;
              var bdisabled1 = true;
              var bdisabled2 = true;
              if (res.bookInf.categoryInfList != null && res.bookInf.categoryInfList.length!=0){
                isCatg = true;
              }else{
                isCatg = false;
              }
              
              if (res.bookInf.briefIntro == '' || res.bookInf.briefIntro == null) {
                bookInf.briefIntro = '暂无简介'
              } else {
                bookInf.briefIntro = res.bookInf.briefIntro;
              }
              if(!that.data.self){
                 //other
                if (res.userBook.borrowState == 1) {
                  borrowState = "待处理";
                  type = 2; //申请
                  if (borrow){
                    bdisabled1 = true;
                  }else{
                    bdisabled1 = false;
                  }
                  
                  
                } else if (res.userBook.borrowState == 2) {
                  borrowState = "借阅中";
                  type = 2; //申请
                  bdisabled1 = true;
                 
                } else {
                  borrowState = "无申请";
                  type = 2; //申请
                  bdisabled1 = false;
                
                }
                that.setData({
                  type: type,
                  bdisabled1: bdisabled1,
                })
                let addTime = res.userBook.addTime;
                time = addTime.split('.')[0].split('T')[0];
              }else{
                  //self 
                var borrowDateTime ='';
                var returnDateTime ='';
                if (res.userBook.usrBorrowState == 1) {
                  borrowState = "申请中";
                  type = 0; //取消申请btn
                  bdisabled1 = false;
                  that.setData({
                    type: type,
                    bdisabled1: bdisabled1,
                  })

                } else if (res.userBook.usrBorrowState == 2) {
                  borrowState = "借阅中";
                  borrowDateTime = res.userBook.borrowDateTime.split('.')[0].split('T')[0];
                  type = 1; //归还
                  bdisabled2 = false;
                  that.setData({
                    type: type,
                    bdisabled2: bdisabled2,

                    borrowDateTime: borrowDateTime,
                  })
                } else if (res.userBook.usrBorrowState == 3){
                  borrowState = "归还中";
                  borrowDateTime = res.userBook.borrowDateTime.split('.')[0].split('T')[0];
                  type = 1; //归还
                  bdisabled2 = true;
                  that.setData({
                    type: type,
                    bdisabled2: bdisabled2,
                    borrowDateTime: borrowDateTime
                  })
                } else if (res.userBook.usrBorrowState == 4) {
                  borrowState = "已归还";
                  borrowDateTime = res.userBook.borrowDateTime.split('.')[0].split('T')[0];
                  returnDateTime = res.userBook.returnDateTime.split('.')[0].split('T')[0];
                  type = 1; //归还
                  bdisabled2 = true;
                  that.setData({
                    type: type,
                    bdisabled2: bdisabled2,
               
                    borrowDateTime: borrowDateTime,
                    returnDateTime: returnDateTime
                  })
                } else  { //5
                  borrowState = "取消申请";
                  type = 0; //取消申请
                  bdisabled1 = true;
                  that.setData({
                    type: type,
                    bdisabled2: bdisabled2
                    })
                }
                time = res.userBook.borrowTime.split('.')[0].split('T')[0];
              }
              that.setData({
                borrow: borrow,
                fuserInfo :res.fuserInfo,
                userInfo: res.userInfo,
                userBook: res.userBook,
                bookInf: res.bookInf,
                borrowState: borrowState,
                is_exist: res.status.is_exist,
                time: time,
                isCatg: isCatg
              })
              console.log("iscATG",that.data)
            } else {
              that.setData({
                is_exist: res.status.is_exist
              })
            }
          },
        });

      }
    })

  },


  more: function (e) {
    var that = this;
    this.setData({
      is_folded: 1
    })
  },

  close: function (e) {
    var that = this;
    this.setData({
      is_folded: 0
    })
  },



  opt: function (e) {
    var that = this;
    var type = e.currentTarget.id;
    var mode = '';
    var data ={};
    var content = '';
  
    if (type == 0) {
      mode = 'cancel';
      content = '确认要取消申请本书籍?';
      data = {
        id: that.data.id,  //borrowId
        mode: mode
      }
    } else if (type == 1) {
      mode = 'return';
      content = '确认要归还本书籍?';
        data = {
        id: that.data.id, //borrowId
          mode: mode
      }
    } else {
      mode = 'apply';
      content = '确认要借阅本书籍?';
       var time = util.formatTime(new Date());
      data = {
        id: that.data.id, //bookId
        mode: mode,
        time:time
      }
    }

    wx.showModal({
      title: '提示',
      content: content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          app.checkSession({
            success: function () {
              app.request({
                url: api.asecond.bdother_opt,
                data:data,
                success: function (res) {
                  if (res.data.save_success == 0) {
                    //保存失败
                    wx.showToast({
                      title: '修改失败',
                      icon: 'none',
                      duration: 2000
                    })
                  } else {
                   
                   that.onShow();

                    wx.showToast({
                      title: '修改成功',
                      duration: 2000
                    })
                  }

                },

              });
            }
          })


        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  goToShelf:function(e){
    if(this.data.self){
      wx.navigateTo({
        url: '/pages/shelf/othershelf/othershelf?fid=' + e.currentTarget.id
      })
    }
    
  },
  goToChat:function(){
    //self --id ==borrowId
    //other --id == bookId
    var self=''
    if(this.data.self){
      self='oself';
    }else{
      self='other';
    }

   var that = this;
    wx.navigateTo({
      url: '/pages/chat/chat?id=' + e.currentTarget.id+'&self='+self
    })
  }
})
