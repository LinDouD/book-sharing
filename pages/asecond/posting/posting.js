// pages/asecond/posting/posting.js
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
    postDetail: {},
    count: 0,
    isFriend: 0,
    content: '',
    postId:6,
    isClick:false,



    talks: [],
    is_input: 0,
    input: '',
    

  },

  onReady: function () {
    // 评论弹出层动画创建
    this.animation = wx.createAnimation({
      duration: 400, // 整个动画过程花费的时间，单位为毫秒
      timingFunction: "ease", // 动画的类型
      delay: 0 // 动画延迟参数
    })
  },

//未实现
  favorclick: function (e) {
    var likeFlag = false; //标志，避免多次发请求
    //避免多次点击
    if (likeFlag === true) {
      return false;
    }
    var that = this;
    if (e.currentTarget.dataset.userid == that.data.user_id) {
      that.Pop_show('http://101.37.173.235/magic/nozan.png', '不能给自己评论点赞');
      return
    }
    var comment_id = e.currentTarget.dataset.id; //点击当前项的id
    var index = e.currentTarget.dataset.dex;
    var islike = e.currentTarget.dataset.islike;
    var message = this.data.talks;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var zanInfo = {
      token: App.globalData.portConfig.token,
      timestamp: timestamp,
      comment_id: comment_id,
      cancel: islike,
    }
    var zanData = zanInfo;
    var postzanData = that.makePostData(zanData, that.data.key);
    wx.request({
      url: App.globalData.portConfig.HTTP_BASE_URL + '/comment/addLike', //点赞接口
      data: postzanData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        for (let i in message) {
          if (i == index) {
            if (message[i].is_like == 0) {
              that.data.talks[index].is_like = 1
              message[i].like_num = parseInt(message[i].like_num) + 1
            } else {
              that.data.talks[index].is_like = 0
              message[i].like_num = parseInt(message[i].like_num) - 1
            }
          }
        }
        that.setData({
          talks: message
        })
        console.log("点赞成功", res);

      },
      complete: function (res) {
        likeFlag = false;
      }
    })
  },
//未实现
  faBu: function () {
    let that = this;
    if (!that.data.inputValue) {
      return false;
    } else {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var voice_id = that.data.voice_id;
      var content = this.data.inputValue;
      var newCommentInfo = {
        token: App.globalData.portConfig.token,
        timestamp: timestamp,
        voice_id: voice_id,
        reply_user_id: 0,
        pid: 0,
        source: 1,
        content: content
      }
      var newCommentData = newCommentInfo;
      var postnewCommentData = that.makePostData(newCommentData, that.data.key);
      wx.request({
        url: App.globalData.portConfig.HTTP_BASE_URL + '/comment/addComment', //发布评论的接口
        data: postnewCommentData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log("成功评论", res);
          that.data.talks.unshift({
            user_avater: that.data.headimgurl,
            user_name: that.data.nickName,
            content: that.data.inputValue,
            createtime: '刚刚'
          })
          that.data.inputValue = '';
          that.setData({
            talks: that.data.talks,
            inputValue: that.data.inputValue,
            talksAnimationData: that.animation.export(),
            sendShow: true
          })
          that.tapMove();
        }
      })


    }
  },
  //未实现
  tapMove: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  //实时获取评论框的输入的内容
  inputValue(e) {
    this.setData({
      inputValu: e.detail.value,
      val_len: e.detail.value.length,
      sendShow: false
    })
    if (!e.detail.value) {
      this.setData({
        sendShow: true
      })
    }
    console.log(this.data.inputValu)
    if (this.data.val_len >= 140) {
      this.Pop_show('http://101.37.173.235/magic/nozan.png', '评论超过最大字数限制')
      return
    }
  },
  showTalks: function () {
    var that = this;
    that.comment();
    

    // 加载数据
    this.loadTalks();
    // 设置动画内容为：使用绝对定位显示区域，高度变为100%
    this.animation.bottom("0rpx").height("100%").step()
    this.setData({
      talksAnimationData: this.animation.export()
    })
  },
  hideTalks: function () {
    this.setData({
      is_input: 0,
      input: ''
    }),
      // 设置动画内容为：使用绝对定位隐藏整个区域，高度变为0
      this.animation.bottom("-100%").height("0rpx").step()
    this.setData({
      talks: [],
      talksAnimationData: this.animation.export()
    })
  },

  // 加载数据
  loadTalks: function () {
    // 随机产生一些评论
    wx.showNavigationBarLoading();
    var that = this;
    var talks = [];
    var faces = ['http://101.37.173.235/magic/apost/icon1.jpeg', 'http://101.37.173.235/magic/apost/icon2.jpeg', 'http://101.37.173.235/magic/apost/icon3.jpeg'];
    var names = ['贝贝', '晶晶', '欢欢', '妮妮'];
    var contents = ['IT实战联盟很不错的', '是的', '楼上说的对'];
    talks = talks.concat(this.data.talks);
    // 随机产生10条评论
    for (var i = 0; i < 9; i++) {
      talks.push({
        id: i,
        avatarUrl: faces[Math.floor(Math.random() * faces.length)],
        nickName: names[Math.floor(Math.random() * names.length)],
        content: '书单很棒,书单很棒,书单很棒,书单很棒,书单很棒,书单很棒',
        comtTime: '2019-5-12'
      });
    }
    this.setData({
      talks: talks,
      talksAnimationData: that.animation.export()
    })
    wx.hideNavigationBarLoading();
  },

  bindKeyInput: function (e) {
    var that = this;
    if (e.detail.value != '') {
      that.setData({
        is_input: 1,
        content: e.detail.value
      })
    } else {
      that.setData({
        is_input: 0,
        input: '',
        content: ''
      })
    }
  },

  onLoad: function (options) {
    var that = this;
    var postId = options.id;
    var flag = options.flag;
    var disabled = false;
    if(flag==2){
     
      disabled = true;
    }
    
   // var postId = 1;

    this.setData({
      postId: postId,
      disabled: disabled
    })

  
    app.request({
      url: api.bsecond.post_detail,
      data: {
        postId: that.data.postId,

      },
      success: function (res) {
        console.log(res)
 
       if (res.status.is_exist == 1) {
          that.setData({
            postDetail: res.data,
          })
        }
        
      }
    })
  },
  issue: function () {
    this.setData({
      is_input: 0
    })
    var that = this;
    var comeTime = util.formatTime(new Date());
    var content = this.data.content;
    var postId = this.data.postDetail.postId;

    app.request({
      url: api.bsecond.post_reply,
      data: {
        content: content,
        comeTime: comeTime,
        postId: postId
      },
      success: function (res) {
        console.log(res)
        if (res.status.is_exist == 1) {
          wx.showToast({
            title: '发布成功',
            icon: "success",
            duration: 2000
          })
          var commentList = res.commentList;
          var count = commentList.length;
          for (var i = 0; i < commentList.length; i++) {
            commentList[i].comtTime = commentList[i].comtTime.split('T')[0];

          }
          that.setData({
            commentList: commentList,
            count: count,
            is_input: 0,
            input: '',
            content: ''
          })

        }
      }
    })
  },
  comment:function(){
    var that = this;
    app.request({
      url: api.bsecond.comment,
      data: {
        postId: that.data.postId,

      },
      success: function (res) {
        console.log(res)

        if (res.status.is_exist == 1) {
          
          var commentList=  res.data;
          for (var i = 0; i < commentList.length; i++) {
            commentList[i].comtTime = commentList[i].comtTime.split('T')[0];

          }
          that.setData({
            commentList: commentList,
            isClick:true
          })
 
        }

      }
    })
  }

})