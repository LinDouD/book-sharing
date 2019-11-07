var _api_root = 'http://localhost:8080/small/';
//var _api_root = 'https://www.qqxxy.xyz/sharebook/small/';
var api = {
  shelf: {
    myshelf: _api_root + 'myshelf',
    booklist: _api_root + 'myshelf/list',
    othershelf: _api_root + 'othershelf',
    otherbooklist: _api_root + 'othershelf/list'
  },
  scan: {
    querybook: _api_root + 'scan/book',
    addShelf: _api_root + 'scan/addShelf'
  },
  asecond: {
    bdself: _api_root + 'asecond/bdself',
    bdother: _api_root + 'asecond/bdother',
    bdother_self: _api_root + 'asecond/otherself/self',
    bdother_other: _api_root + 'asecond/otherself/other',
    privacy: _api_root + 'asecond/bdself/privacy',
    deletebook: _api_root + 'asecond/bdself/deleteBook',
    bdother_opt: _api_root + 'asecond/bdother/opt'
  },
  bookcircle: {
    mybookcircle: _api_root + 'bookCircle',
    newbookcircle: _api_root + 'newBookCircle',
    searchbookcirclebname: _api_root + 'searchBookCircleBName',
    searchbookcirclebcname: _api_root + 'searchBookCircleBCName'
  },
  friendlist: {
    friendlist: _api_root + 'friendlist'
  },
  chat: {
    chat: _api_root + 'chat'
  },
  applogin: {
    login: _api_root + 'login',
  },
  pc: {
    pc: _api_root + 'PC'
  }
};
module.exports = api;
