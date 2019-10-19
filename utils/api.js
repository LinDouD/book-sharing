//var _api_root = 'http://localhost:8080/small/';
var _api_root = 'https://www.qqxxy.xyz/sharebook/small/';
var api = {
  myshelf: {
    myshelf: _api_root + 'myshelf',
  },
  scan: {
    querybook: _api_root + 'scan/book',
    addShelf: _api_root + 'scan/addShelf'
  },
  asecond: {
    bdself: _api_root + 'asecond/bdself',
    privacy: _api_root + 'asecond/privacy'
  },
  bookcircle:{
    mybookcircle: _api_root +'bookCircle',
    newbookcircle:_api_root+'newBookCircle'
  },

  applogin: {
    login: _api_root + 'login',
  },

};
module.exports = api;