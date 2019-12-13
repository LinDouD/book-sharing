//获取应用实例  ——Sijar 
const app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');

Page({
  data: {
    is_login: 0,
    nullView: [],
    bcName:'',
    searchBC:'',
    intro:'',
    othercircle_list: [],
    dataSource: [],
    height: 200,
    hiddenModal2: true,
    options: [{
      city_id: '001',
      city_name: '圈名'
    }],
    selected: {
      id: '000',
      name: '书名'}
  },
  //事件处理函数
  onLoad: function (options) {
   
   this.loadMyCircle();
  },
  onShow: function () {
   
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
  },
  input1: function (e) {
    this.setData({ bcName: e.detail.value })
  },
  input2: function (e) {
    this.setData({ intro: e.detail.value })
  },
  showModal2: function (e) {
    this.setData({ hiddenModal2: false })
  },
  model2confirm: function (e) {
    var that=this;
    this.setData({ hiddenModal2: true })
    console.log('bcName=', this.data.bcName);
    console.log("intro=", this.data.intro);
    var access_token = wx.getStorageSync("access_token");
    app.request({
      url: api.bookcircle.newbookcircle,
      data: {
        bcName: that.data.bcName,
        intro:that.data.intro,
      },
      success: function (res) {
        if(res.result==1){
          wx.showToast({
            title: '确定' + that.data.bcName,
            icon: 'none'
          })   
          that.loadMyCircle();
        }else{
          wx.showToast({
            title: '创建失败',
            icon: 'none'
          })  
        }
       
      }
    })
  },
  model2cancel: function (e) {
    this.setData({ hiddenModal2: true })
    wx.showToast({
      title: '取消' + this.data.bcName,
      icon: 'none'
    })
  },
  //加载我的图书圈
  loadMyCircle: function(){
    var that = this;
    var access_token = wx.getStorageSync("access_token");
    app.request({
      url: api.bookcircle.mybookcircle,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': access_token
      },
      success: function (res) {
        if (res.code == 0) {
          var datasource = [];
          var othercircle_list=[];
          var nullview = [];
          if(res.my_book_circle_list!=null){
            if (res.my_book_circle_list.length % 3 == 2) {  //页面最后一排只有两个
              nullview.push(1);
            }
            else {
              nullview.push(0);
            }
            for (var i = 0; i < res.my_book_circle_list.length; i++) {
              datasource.push(res.my_book_circle_list[i]);
            }         
          }
          for (var i = 0; i < res.other_book_circle_list.length; i++) {
            othercircle_list.push(res.other_book_circle_list[i]);
          }  
          console.log("nullview:",nullview);   
          console.log("datasource:", datasource);
          console.log("othercircle_list", othercircle_list);
          that.setData({
            dataSource: datasource,
            othercircle_list: othercircle_list,
            nullView: nullview,
          })
        }
      },
      complete: function () {
        wx.stopPullDownRefresh();
      }
    })
  },
  //跳转到已加入的图书圈详情界面
  goToDetailCircle1: function (e) {
    var circleId = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/bsecond/CMember/CMember?circleId='+circleId
    });
  },
  //跳转到未加入的图书圈详情界面
  goToDetailCircle2: function (e) {
    var circleId = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/bsecond/OtherCircle/OtherCircle?circleId=' + circleId
    });
  },
  searchInput: function (e) {
    this.setData({ searchBC: e.detail.value })
  },

  //跳转到图书圈搜索结果页面
  goToSearchRes:function(e){
    console.log("selected=",this.data.selected);
    console.log("selected。name=", this.data.selected.name);
    if(this.data.searchBC){
      if (this.data.selected.id == '001') {
        var bcName = this.data.searchBC;
        wx.navigateTo({
          url: '/pages/asecond/SearchBC/SearchBC?bcName=' + bcName
        });
      } else if (this.data.selected.id == '000') {
        var bName = this.data.searchBC;
        wx.navigateTo({
          url: '/pages/asecond/SearchBC/SearchBC?bName=' + bName
        });
      }
    }else{
      wx.showToast({
        title: '搜索不可为空' ,
        icon: 'none'
      })
    }
    
      
  },
  change(e) {
    this.setData({
      selected: { ...e.detail }
    })
   
  },
  close() {
    // 关闭select
    this.selectComponent('#select').close()
  }
})

