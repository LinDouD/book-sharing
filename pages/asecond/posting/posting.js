// pages/asecond/posting/posting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_collected: 0,
    talks: [],
    is_input:0,
    input:'',
    "post":
    {
      "title": "2019书单推荐",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJtL29ib9NW5CQ8xXm8qYdJia3yHsKj8nVibWPxthNHiaNE0QCDNib3OTT9Dian4tWrE4ic8Grk50cbtPDvQ/132",
      "nickName": "徐倩倩",
      "content": "  看书是件简单的事情，就跟吃一块巧克力一样。推荐几本陪伴过我不同时期的书。《远山淡影 》是我在高铁上看完的。它很薄，一天可读完。推荐原因是新年要到了，旅途可以看看。《飘》应该每个人都知道的书啦！我前前后后读过这本书三遍，在我十几岁的时候读它跟我后来二十几岁读它是完全不一样的感触。十几岁时憧憬恋爱，读它完全就是当偶像剧看。二十几岁时经历恋爱到失恋，它让我有了另一种思考。我很好奇在我三十几岁的时候看它又会是什么样的一番心情。《第二性 》这本书比较长，读起来相对枯燥。我看它的原因是有一段时间我很迷茫，她给我了一种力量吧！书里有着观点放到现在有些过时了，但有一些却让我们惊讶，为什么过了快一世纪了女性还存在着这些话题？男女平等是个永恒话题。《先知》生活不止眼前的苟且，还有诗和远方的田野哈哈！不知道有没有人经历过就是生活压力大的情况下感觉被关在一个黑盒子里，这时候看到一首诗，就像给你的生活投入一束光。我又开始瞎扯了《眼球绮谭 》是我要看还没看的书，我读过绫辻行人的《钟表馆时间》和《十角馆事件》。当时我是因为看了唐人街探案，被刘昊然弟弟帅到才对这类书有兴趣的。打开书以为自己跟刘昊然一样聪明，看完后内心的os是：我去，还有这操作。我果然是个凡人《红楼梦》推荐红楼梦还能因为什么，美啊2019美好的生活是什么？多读书 多睡觉 多喝热水 多思考",
      "count": 5
    }

  },

  onReady: function () {
    // 评论弹出层动画创建
    this.animation = wx.createAnimation({
      duration: 400, // 整个动画过程花费的时间，单位为毫秒
      timingFunction: "ease", // 动画的类型
      delay: 0 // 动画延迟参数
    })
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
  },
  showTalks: function () {
    var that = this;
    if (this.data.is_collected == 1) {
      that.setData({
        is_collected: 0
      })
    } else {
      that.setData({
        is_collected: 1
      })
    }

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
      is_input:0,
      input:''
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
    var faces = ['/magic/apost/icon1.jpeg', '/magic/apost/icon2.jpeg', '/magic/apost/icon3.jpeg'];
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

  onScrollLoad: function () {
    // 加载新的数据
    // this.loadTalks();
  },

  bindKeyInput: function (e) {
    var that = this;
    if (e.detail.value!=''){
      that.setData({
        is_input:1
      })
    }else{
      that.setData({
        is_input: 0,
        input:''
      })
    }
  },

})
