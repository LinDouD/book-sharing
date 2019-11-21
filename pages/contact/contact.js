// pages/index/to_news/to_news.js  
var app = getApp();
var util = require('../../utils/util');
var api = require('../../utils/api.js');
var socketOpen = false;
var SocketTask = false;

Page({
  data: {
    sendBtn:false,
    InputBottom: 0,
    inputValue: '',
    returnValue: '',
    list:[] ,
     senderId:23,
    receiverId:29

  },
  onLoad: function (options) {
    if(JSON.stringify(options)!='{}'){
      this.setData({
        senderId:options.userId,
        receiverId:options.fid,
      })
    }else{
      this.setData({
        senderId:23,
        receiverId:29
      })
    }
   
    console.log("list", this.data.list.length)
  },
  onShow:function(){
   
    this.loadData(true);
  
  },
  onReady: function () {
    const height = this.data.projectNum * 90 + 92    // 计算出页面高度
    wx.pageScrollTo({
      scrollTop: height,
      duration: 300
    })

    var that = this;
    // 创建Socket
    SocketTask = wx.connectSocket({
    //url: 'ws://localhost:8080/small/websocket/'+that.data.senderId,
      url: 'wss://www.qqxxy.xyz/sharebook/small/websocket/'+that.data.senderId,
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res)
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    })
    if (SocketTask) {
      SocketTask.onOpen(res => {
        console.log('监听 WebSocket 连接打开事件。', res)
        console.log(' wx.onSocketError', wx.onSocketError)
       
      })
      SocketTask.onClose(onClose => {
        console.log('监听 WebSocket 连接关闭事件。', onClose)
      })
      SocketTask.onError(onError => {
        console.log('监听 WebSocket 错误。错误信息', onError)
      })
      
      SocketTask.onMessage(onMessage => {
        var that = this;
        var list = that.data.list;
        var content = JSON.parse(onMessage.data)
    
        var time = util.formatTimen(content.dateTime/1000, 'Y-M-D h:m:s');
        content.dateTime = util.current(time)
        if(content.flag==1){
          //数据库插入成功
          if(content.mType==2){
            list.push(content)
            that.setData({
              list: list
            })
            that.pageScrollToBottom();
          }else{
            that.loadData(false);
          }
        

        }
        console.log(that.data.list)
 
        console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', onMessage)
      
      })
    }
  },

  // 提交文字
  submitTo: function (e) {
    console.log("submitTo")
    let that = this;
    let list = that.data.list;
    let dateTime = util.formatTime(new Date());

       this.setData({
         sendValue:'',
         sendBtn: false,
       })
  
    var data = {
      senderId:that.data.senderId,
      content: that.data.inputValue,
      receiverId: that.data.receiverId,
      dateTime:dateTime,
      mType: 2,
       
    } 
 //   if (socketOpen) {
      console.log("submitTo")
      // 如果打开了socket就发送数据给服务器
      sendSocketcontent(data)
   // }
  },
  
  bindKeyInput: function (e) {
    var inputValue =  e.detail.value.replace(/\s+/g, '')
    this.setData({
      inputValue: inputValue,
     
    })
   
    if(this.data.inputValue!=''){
      this.setData({
        sendBtn: true
      })
    }else{
      this.setData({
        sendBtn: false
      })
    }
  
  },

  onHide: function () {
    SocketTask.close(function (close) {
      console.log('关闭 WebSocket 连接。', close)
    })
  },

  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0,
      
    })
    },
  loadData:function(flag){
    var that = this;
    app.checkSession({
      success: function () {
        app.request({
          url: api.friendlist.contact,
          data: {
            senderId: that.data.senderId,
            receiverId:that.data.receiverId,
            offset:0,
            limit:10
          },
          success: function (res) {
            var list =[]
            console.log("contact", res)
            if (res.status.is_exist == 1) {
              if(res.count!=0){
                list = spiltTime(res.list)
              }
              that.setData({
                userInfo: res.userInfo,
                fuserInfo: res.fuserInfo,
                list:list ,
                offest:res.count
              })
             
            } else if (res.status.is_exist == 1){
              that.setData({
                userInfo: res.userInfo,
                fuserInfo: res.fuserInfo,
              })
            }
           if(flag){
             that.pageScrollToBottom();
           }
          },
        });
      }
    })
  },
  agree: function (e) {
    var flag = e.currentTarget.dataset.flag;
    if (flag == 0) {
      var borrowRes = 1;
      var messageId = e.currentTarget.id;
      var mType = e.currentTarget.dataset.type;
      var time = util.formatTime(new Date());
      var that = this;
      var data = {
        messageId: messageId,
        mType: mType,
        borrowRes: borrowRes,
        dateTime: time,
        senderId: that.data.receiverId,
        receiverId: that.data.senderId,
      }
      this.opt(data)
    }



  },
  disagree: function (e) {
    var flag = e.currentTarget.dataset.flag;
    if (flag == 0) {
      var borrowRes = 2;
      var messageId = e.currentTarget.id;
      var mType = e.currentTarget.dataset.type;
      var time = util.formatTime(new Date());
      var that = this;
      var data = {
        messageId: messageId,
        mType: mType,
        borrowRes: borrowRes,
        dateTime: time,
        senderId: that.data.receiverId,
        receiverId: that.data.senderId,
      }
      this.opt(data)
    }

  },

  opt: function (data) {
    sendSocketcontent(data)
  },

  // 获取容器高度，使页面滚动到容器底部
  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom + 5000
      })
    }).exec()
  },
  goDetail: function (e) {
var that= this;
   
    wx.navigateTo({
      url: '/pages/friendlist/friendinfo/friendinfo?fid=' + that.data.fuserInfo.userId
    })
  },

  
})

//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
function sendSocketcontent(data) {
  console.log('通过 WebSocket 连接发送数据')
  //if (socketOpen) {
    SocketTask.send({
      data: JSON.stringify(data)
    }, function (res) {
      console.log('已发送', res)
    })
  //} else {
   // socketMsgQueue.push(msg)
 // }
  
}

function spiltTime(list){
  for(var i =0 ;i<list.length;i++){
 //   list[i].dateTime = util.lcurrent(list[i].dateTime);
    if (list[i].mType==2){
      list[i].dateTime = util.lcurrent(list[i].dateTime);
    }else{
      list[i].dateTime = list[i].dateTime.split("T")[0]
    }
    
  }
  return list;
}

