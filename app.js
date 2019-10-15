//app.js
var util = require('/utils/util.js');
var api = require('/utils/api.js');

App({
  is_on_launch: true,

  onLaunch: function () {

    // 展示本地存储能力
    // console.log(wx.getSystemInfoSync());
    // this.getStoreData();
    //  this.getCatList();
    var access_token = wx.getStorageSync("access_token");
    // console.log('token:' + access_token);
    //  if (access_token) {
    //   this.globalData.is_auth = 1;
    //}

  },

  //xqq:用户授权登陆
  getToken: function () {
    var promise = new Promise((resolve, reject) => {
      var that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code;
            wx.getUserInfo({
              success: function (res) {
                console.log('login.....');
                getApp().request({
                  url: api.applogin.login,
                  method: "post",
                  data: {
                    code: code,
                    userInfo: res.rawData,
                    //   encrypted_data: res.encryptedData,
                    //  iv: res.iv,
                    //   signature: res.signature
                  },
                  success: function (res) {

                    wx.setStorageSync("access_token", res.data.token);
                    resolve(res)
                  }
                });
              }
            });
          } else {
            //console.log(res);
          }

        }
      })
    });
    return promise;
  },

  //xqq:用户授权登陆
  login: function () {
    var promise = new Promise((resolve, reject) => {
      var that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code;
            getApp().request({
              url: api.applogin.login1,
              method: "post",
              data: {
                code: code,
              },
              success: function (res) {
                if (res.data.result == 1) {
                  wx.setStorageSync("access_token", res.data.token);
                  getApp().globalData.access_token = res.data.token;
                }
                resolve(res)
              }

            });
          } else {
            //console.log(res);
          }

        }
      })
    });
    return promise;
  },

  //xqq：request工具封装
  request: function (object) {
    var access_token = wx.getStorageSync("access_token");
    //  console.log('token:' + access_token);
    if (access_token) {
      if (!object.data)
        object.data = {};
      object.data.access_token = access_token;
    }
    console.log('request.data', object.data)
    wx.request({
      url: object.url,
      header: object.header || {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: object.data || {},
      method: object.method || "GET",
      dataType: object.dataType || "json",
      success: function (res) {
        if (res.data.code == -1) {
          getApp().login();
        } else {
          if (object.success)
            object.success(res.data);
        }
      },
      fail: function (res) {
        var app = getApp();
        if (app.is_on_launch) {
          app.is_on_launch = false;
          wx.showModal({
            title: "网络请求出错",
            content: res.errMsg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                if (object.fail)
                  object.fail(res);
              }
            }
          });
        } else {
          wx.showToast({
            title: res.errMsg,
            image: "/images/icon-warning.png",
          });
          if (object.fail)
            object.fail(res);
        }
      },
      complete: function (res) {
        if (object.complete)
          object.complete(res);
      }
    });
  },

  globalData: {
    loginCode: null,
    access_token: null,
    is_auth: 0    //登录后返回的授权状态：0未授权，1已授权
  },


})