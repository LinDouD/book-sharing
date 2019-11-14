
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [], //本地图片地址数组
    picPaths: [], //网络路径
    type: 1,
    bookCircleId: 6,
    btn: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
      this.setData({
      bookCircleId:options.id,
      type:options.type
      })
    
  },
  //添加上传图片
  chooseImageTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  // 图片本地路径
  chooseWxImage: function (type) {
    var that = this;
    var imgsPaths = that.data.imgs;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res.tempFilePaths[0]);
        that.upImgs(res.tempFilePaths[0], 0) //调用上传方法
      }
    })
  },
  //上传服务器
  upImgs: function (imgurl, index) {
    var that = this;
    wx.uploadFile({
      url: 'https://xxxxxxxxxxxxxxxxxxxxxxxxxxxx', //
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: null,
      success: function (res) {
        console.log(res) //接口返回网络路径
        var data = JSON.parse(res.data)
        that.data.picPaths.push(data['msg'])
        that.setData({
          picPaths: that.data.picPaths
        })
        console.log(that.data.picPaths)
      }
    })
  },
  titleInput(e) {
    this.setData({
      title: e.detail.value.replace(/\s+/g, '')
    })
    if (this.data.title != '') {
      this.setData({
        btn: true
      })
    } else {
      this.setData({
        btn: false
      })
    }
  },
  briefInfoInput(e) {
    this.setData({
      briefInfo: e.detail.value.replace(/\s+/g, '')
    })
    if (this.data.titbriefInfole != '') {
      this.setData({
        btn: true
      })
    } else {
      this.setData({
        btn: false
      })
    }
  },

  save: function () {
    var that = this;
    var mode = '';
    var data = {};
    if (this.data.type == 0) {
      mode = "title";
      data = {
        bookCircleId: that.data.bookCircleId,
        title: that.data.title,
        mode: mode

      }
    } else if (this.data.type == 1) {
      mode = "briefInfo";
      data = {
        bookCircleId: that.data.bookCircleId,
        briefInfo: that.data.briefInfo,
        mode: mode
      }
    }
 
    app.checkSession({
      success: function () {
        app.request({
          url: api.bsecond.setCMOpt,
          data: data,
          success: function (res) {
            if (res.status.is_exist == 1) {

              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000,
                mask: true,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    var pages = getCurrentPages(); //当前页面

                    var prevPage = pages[pages.length - 2]; //上一页面

                    wx.navigateBack({ //返回

                      delta: 1

                    });
                  }, 1000) //延迟时间
                },
              });

            } else {
              wx.showToast({
                title: '修改失败',
                icon: 'none',
                duration: 1000,
                mask: true,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    var pages = getCurrentPages(); //当前页面

                    var prevPage = pages[pages.length - 2]; //上一页面

                    wx.navigateBack({ //返回

                      delta: 1

                    });
                  }, 1000) //延迟时间
                },
              });

            }




          }
        })
      }
    })








  }


})