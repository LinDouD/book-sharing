
const app = getApp();
var util = require('../../../utils/util');
var api = require('../../../utils/api.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUBtn: false,
    imgList: [],
    imgs: [], //本地图片地址数组
    picPaths: [], //网络路径
    type: 2,
    bookCircleId: 6,
    btn: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(JSON.stringify(options)!="{}"){
      this.setData({
        bookCircleId: options.id,
        type: options.type
      })
    }else{
      this.setData({
        bookCircleId: 6,
        type: 2
      })
     
    }
     
    
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








  },


  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths),
            isUBtn: true
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths,
            isUBtn: true
          })
        }
      }
    });
  },

  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定删除图片？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
       
          this.setData({
            imgList: this.data.imgList,
            isUBtn:false
          })
        }
      }
    })
  },

  upload:function(){
   
    console.log(this.data.imgList)
  
 var that = this;
    wx.uploadFile({
      url: api.bsecond.fileUpload,
      filePath: that.data.imgList[0],
      method: 'POST',
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: { 'bookCircleId': that.data.bookCircleId },
      success: function (res) {
       
/**
 *  wx.showToast({
          title: '修改成功',
          icon:'success'
        })

         let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.loadData();
        wx.navigateBack({
          delta: 1
           })
 * 
 * 
 * 
 */
       
       
      }
    })

  }

})

