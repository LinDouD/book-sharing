//index.js
//获取应用实例
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');
Page({
  data: {
    bookName: '',
    briefIntro: '',
    picPath: '',
    isbn: '',
    catg:'',
    borrowState:'',
    is_exist:1,
    oldIndex:-1,
    hiddenModal: true,
    input: null,
    array: ['公开', '私密'],
    objectArray: [
      {
        id: 0,
        name: '公开'
      },
      {
        id: 1,
        name: '私密'
      }
    ],
    index: 0,
  },
  onLoad: function (options) {
    var id = options.id;
    this.data.isbn = id;
    this.loaddata();

  },
  loaddata: function () {
    var that = this;
    app.checkSession({success:function(){
      app.request({
        url: api.asecond.bdself,
        data: {
          isbn: that.data.isbn
        },
        success: function (res) {
          if (res.status.is_exist==1){
            var briefIntro = '';
            var borrowState = '';
            var index = 0;
            var catg = '';
            if (res.data.briefIntro == '') {
              briefIntro = '无简介'
            }
            else {
              briefIntro = res.data.briefIntro;
            }

            if (res.data.privacy == 0) {
              index = 0;//公开
            }
            else {
              index = 1;
            }

            if (res.data.borrowState == 1) {
              borrowState = "待处理";
            }
            else {
              if (res.data.borrowState == 2) {
                borrowState = "已借阅";
              }
              else {
                borrowState = "无申请";
              }
            }

            for (var i = 0; i < res.data.catg.length; i++) {
              catg += res.data.catg[i];
              if (i < res.data.catg.length - 1) {
                catg += ',';
              }
            }

            that.setData({
              borrowState: borrowState,
              bookName: res.data.bookName,
              picPath: res.data.picPath,
              briefIntro: briefIntro,
              index: index,
              catg: catg,
              is_exist: res.status.is_exist
            })
            console.log("bdself", res.data)
          
          }
          else{
            that.setData({
              is_exist: res.status.is_exist
            })
          }
        },
      });

    }})
   
  },

  setPrivate: function (pr) {
    var that = this;
    app.request({
      url: api.asecond.privacy,
      data: {
        isbn: that.data.isbn,
        privacy:pr
      },
      success: function (res) {
        var that= this;
        var oldIndex = this.data.oldIndex;
        console.log("bdtail", res.data)
        if (res.data.save_success==0){
          //保存失败
          that.setData({
            newIndex:oldIndex
          })
          wx.showToast({
            title: '修改失败',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '修改成功',
            duration: 2000
          })
        }
       
      },

    });
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that = this;
    var oldIndex = this.data.index;
    var newIndex = e.detail.value;
    this.setData({
      index: newIndex,
      oldIndex: oldIndex
    })
    if (oldIndex != newIndex){
      app.checkSession({
        success: function () {
          that.setPrivate(newIndex);
        }
      })
    }
  },
  

 
 
})
