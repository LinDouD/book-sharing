// pages/asecond/posting/posting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  favorclick: function (e) {
    var likeFlag = false; //标志，避免多次发请求
    //避免多次点击
    if (likeFlag === true) {
      return false;
    }
    var that = this;
    if (e.currentTarget.dataset.userid == that.data.user_id) {
      that.Pop_show('../../../magic/nozan.png', '不能给自己评论点赞');
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
      this.Pop_show('../../../magic/nozan.png', '评论超过最大字数限制')
      return
    }
  }
})