var _api_root = 'http://localhost:8080/small/';
var api = {
  index: _api_root + 'default/index',
  myshelf: {
    myshelf: _api_root + 'myshelf',
  },
  scan: {
    querybook: _api_root + 'scan/book'
  },
  asecond: {
    bdetail: _api_root + 'asecond/bdetail',
  },


  applogin: {
    login: _api_root + 'login',
    login1: _api_root + 'tlogin',
  },

};
module.exports = api;