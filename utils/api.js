//var _api_root = 'http://localhost:8080/small/';
var _api_root = 'https://www.qqxxy.xyz/sharebook/small/';
var api = {
  contact: 'http://localhost:8080/samll/websocket',
  shelf: {
    search: _api_root +'search',
    shelfIndex: _api_root + 'shelfIndex',
    findBookList: _api_root + 'shelfIndex/findBookList',
    myshelf: _api_root + 'myshelf',
    booklist: _api_root + 'myshelf/list',
    othershelf: _api_root + 'othershelf',
    otherbooklist: _api_root + 'othershelf/list'
  },
  scan: {
    addShelfByM: _api_root + 'scan/addShelfByM',
    querybook: _api_root + 'scan/book',
    addShelf: _api_root + 'scan/addShelf'
  },
  asecond: {
    otherBook: _api_root + 'asecond/otherBook',
    bdself: _api_root + 'asecond/bdself',
    bdother: _api_root + 'asecond/bdother',
    bdother_self: _api_root + 'asecond/otherself/self',
    bdother_other: _api_root + 'asecond/otherself/other',
    privacy: _api_root + 'asecond/bdself/privacy',
    deletebook: _api_root + 'asecond/bdself/deleteBook',
    bdother_opt: _api_root + 'asecond/bdother/opt',
    bdother_cancelApply: _api_root + 'asecond/bdother/cancelApply',
    applyBook: _api_root + 'asecond/bdother/applyBook',
    returnBook: _api_root + 'asecond/bdother/return'

  },
  bsecond:{
    
    fileUpload: _api_root + 'fileUpload',
    applyCircle: _api_root + 'applyCircle',
    deleteCMember: _api_root + 'deleteCMember',
    setCMOpt: _api_root + 'setCMOpt',
    setCMember: _api_root + 'setCMember',
    cmember:_api_root+'bsecond/cMember',
    othercircle:_api_root+'bsecond/otherCircle',
    member: _api_root +'member',
    shelf: _api_root +'cfindshelf',
    post: _api_root +'findPostList',
    post_add: _api_root + 'addPost',
    post_detail: _api_root +'findPost',
    comment: _api_root + 'findCommentList',
    post_reply: _api_root +'reply',
    add_circle: _api_root +'addCircle'
  
  },
  bookcircle: {
    mybookcircle: _api_root + 'bookCircle',
    findlist: _api_root + 'findlist',
    newbookcircle: _api_root + 'newBookCircle',
    searchbookcirclebname: _api_root + 'searchBookCircleBName',
    searchbookcirclebcname: _api_root + 'searchBookCircleBCName'
  },
  friendlist: {
    contact: _api_root +'contact',
    friendlist: _api_root + 'friendlist',
    friendInfo:_api_root + 'friendInfo',
    unfriendInfo: _api_root + 'unfriendInfo',
    friendOpt: _api_root + 'friendOpt',
    fMessageList: _api_root +'fMessageList'
    
  },
  chat: {
    chat: _api_root + 'chat',
    chat_opt: _api_root + 'chat/opt',
    chat_history: _api_root + 'chat/history'
  },
  applogin: {
    login: _api_root + 'login',
  },
  pc: {
    pc: _api_root + 'PC'
  }
};
module.exports = api;
