// pages/friendlist/friendlist.js
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    isActive: null,
    listMain: [{
      id: "1", region: "A",
      items: [
        { id: "", name: "amour" },
        { id: "", name: "amour" },
        { id: "", name: "amour" },
        { id: "", name: "amour" }
      ]
    },
    {
      id: "2", region: "B",
      items: [
        { id: "", name: "bandon" },
        { id: "", name: "bandon" }
      ]
    },
    {
      id: "3", region: "C",
      items: [
        { id: "", name: "client" },
        { id: "", name: "client" },
        { id: "", name: "client" },
        { id: "", name: "client" }
      ]
    },
    {
      id: "4", region: "D",
      items: [
        { id: "", name: "digital" },
        { id: "", name: "digital" }
      ]
    },
    {
      id: "5", region: "E",
      items: [
        { id: "", name: "echo" },
        { id: "", name: "echo" },
        { id: "", name: "echo" },
        { id: "", name: "echo" }
      ]
    },
    {
      id: "6", region: "F",
      items: [
        { id: "", name: "funk" },
        { id: "", name: "funk" }
      ]
    },
    ],
    listTitles: [],
    fixedTitle: 'A',
    toView: 'inToView0',
    viewPosition: [],
    scroolHeight: 0
  },
  //页面加载触发， 获取所定义view距离可滚动视图区域顶部高度
  onLoad: function (options) {
    var that = this;
    var num = 0;
    for (let i = 0; i < that.data.listMain.length; i++) {
      wx.createSelectorQuery().select('#inToView' + that.data.listMain[i].id).boundingClientRect(function (rect) {
        num = num + rect.height; //元素高度+该元素先前元素高度 ， 可理解为元素底部至可滚动视图区域顶部高度
        console.log(num)
        var _array = [{ 'height': num, 'key': rect.dataset.id, 'name': that.data.listMain[i].region }];
        that.setData({
          viewPosition: that.data.viewPosition.concat(_array) //合并数组
        });
      }).exec()
    };
  },
  // 可滚动视图区域滑动函数触发
  onPageScroll: function (e) {
    console.log(e)
    this.setData({
      scroolHeight: e.detail.scrollTop //获取滚动条滚动位置
    });
    for (let i in this.data.viewPosition) {
      if (e.detail.scrollTop < this.data.viewPosition[i].height) { //判断滚动条位置是否在元素内
        this.setData({
          isActive: this.data.viewPosition[i].key,
          fixedTitle: this.data.viewPosition[i].name
        });
        return false;
      }
    }
  },
  //点击右侧字母导航定位触发
  scrollToViewFn: function (e) {
    console.log(e)
    var that = this;
    var _id = e.target.dataset.id;
    for (var i = 0; i < that.data.listMain.length; ++i) {
      if (that.data.listMain[i].id === _id) {
        that.setData({
          isActive: _id,
          toView: 'inToView' + _id //滚动条to指定view
        })
        break
      }
    }
  },
})
