//index.js
//获取应用实例
const app = getApp()
import api from '../../api/api'

Page({
  data: {
    motto: 'Hello World',
    timer: null,
    userInfo: {},
    hasUserInfo: false,
    currentSwiper: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgsArr: [{ url: "/images/swiper-1.png" }, { url: "/images/2.jpg" }, { url: "/images/2.jpg" }],
    previousmargin: '40rpx',//前边距
    nextmargin: '40rpx',//后边距
    page: 0,
    totalList: 0, // 总数
    raceList: [
      // {
      // id: 0,
      // picUrl: '/images/race-list1.png',
      // eventName: '要你好看',
      // beginTime: '2019/10/29',
      // endTime: '2019/11/1',
      // address: '四川 成都市金牛区',
      // flowStatus: 0 // 0未开始 1进行中
      // },
    ]
  },
  // 下拉加载更多
  onReachBottom() {
    this.getMoreList()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 0,
      raceList: []
    })
    this.getList()
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  swiperChange: function (e) {
    let { source } = e.detail
    if (source === 'autoplay' || source === 'touch') {
      this.setData({
        currentSwiper: e.detail.current
      })
    }
  },
  // 展示详情
  showDetail(evt){
      let id = evt.detail.id
      wx.navigateTo({
        url: '/pages/race/raceDetail/raceDetail?id=' + id,
      })
  },
  // 获取赛事列表
  debounceGetList() {
    clearTimeout(this.data.timer)
    let timer = setTimeout(() => {
      this.getList()
    }, 1000)
    this.setData({
      timer: timer
    })
  },
  // 获取当前页
  getList() {
    console.log('当前页' + this.data.page);
    wx.showLoading({
      mask: true,
    });
    let that = this
    api.post('event/list', {
      page: this.data.page,
      pageSize: 10,
    }).then(res => {
      let arr = res.records
      arr.forEach(ele => {
        ele.beginTime = ele.beginTime.slice(0, 10)
        ele.endTime = ele.endTime.slice(0, 10)
      });
      let orginArr = that.data.raceList
      orginArr.push(...arr)
      that.setData({
        totalList: res.total, 
        raceList: orginArr
      })
      wx.stopPullDownRefresh()
      wx.hideLoading();
    })
  },
  // 底部加载更多
  getMoreList() {
    let {totalList, raceList, page} = this.data
    if (totalList <= raceList.length) {return}
    this.setData({
      page: Number(page) + 1,
    })
    this.debounceGetList()
  },

  onLoad: function () {
    this.getList()
  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  }
})
