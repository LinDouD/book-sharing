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
  bsecond:{
    cmember:_api_root+'bsecond/cMember',
    othercircle:_api_root+'bsecond/otherCircle',
    member: _api_root +'member',
    shelf: _api_root +'cfindshelf',
    post: _api_root +'findPostList',
    post_detail: _api_root +'findPostDetail',
    post_reply: _api_root +'reply',
    add_circle: _api_root +'addCircle'
  
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
    chat: _api_root + 'chat',
    chat_opt: _api_root + 'chat/opt'
  },
  applogin: {
    login: _api_root + 'login',
  },
  pc: {
    pc: _api_root + 'PC'
  }
};
module.exports = api;
