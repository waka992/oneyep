// 海选
import api from '../../../api/api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ranking: '?',
    name: '陈某',
    status: 1, // 0未开始
    describe: '',
    raceName: '海选赛-HipHop',
    time: '12:25-12:55',
    hasPrev: false,
    hasNext: false,
    showFinalRankList: false, // 展开battle名单
    itemUserId: '', // 当前选手id
    rating: false, // 比赛是否进行中
    playerList: [],
    currentItem: 0, // 当前第几个赛事
    currentItems: [], // 当前选手赛事列表
    group: 0,
    chosenGroup: {}, // 当前查看组
    showRankList: false,
  },
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  openRankList() {
    this.getAuditionList()
    this.setData({
      showRankList: true
    })
  },
  // 下一个赛事
  toNext() {
    let data = this.data
    let { currentItem, currentItems} = data
    if (currentItem >= currentItems.length - 1) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1500,
      });
      return
    }
    else {
      let num = currentItem + 1
      let hasNext = true
      // 最后一个
      if (num == 0) {
        hasNext = false
      }
      this.setData({
        currentItem: num,
        chosenGroup: currentItems[num],
        hasNext:hasNext
      })
    }
  },
  // 上一个赛事
  toPrevious() {
    let data = this.data
    let { currentItem, currentItems} = data
    if (currentItem <= 0) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1500,
      });
      return
    }
    else {
      let num = currentItem - 1
      let hasPrev = true
      // 第一个
      if (num == 0) {
        hasPrev = false
      }
      this.setData({
        currentItem: num,
        chosenGroup: currentItems[num],
        hasPrev: hasPrev
      })
    }
  },
  // 获取用户item信息
  getUserItemInfo() {
    let param = {
      id: 1, // evnetid,测试用
      userId: wx.getStorageSync('openid')
    }
    api.post('event/getEventUserInfo', param).then(res => {
      this.getBattleInfo({
        itemUserId: res.id
      })
      this.setData({
        name: res.userName,
        itemUserId: res.id
      })
    })
  },

  // 获取battle双方信息
  getBattleInfo(info) {
    // userid用itemuserid
    let param = {eventId: 1, itemId: 1, userId: info.itemUserId} // 测试用
    api.post('room/event/getUserBattle', param).then(res => {
      if (res) {
        // 处理组
        let data = res[this.data.currentItem]
        let hasNext = false
        if (res.length > 1) {
          hasNext = true
        }
        this.setData({
          chosenGroup: data,
          currentItems: res,
          hasNext: hasNext
        })
        // fn && fn()
      }
    })
  },

  // 获取赛事信息
  getEventItem(info) {
    // userid用itemuserid
    let param = {eventId: 1, itemId: 1} // 测试用
    api.post('room/event/getEventItem', param).then(res => {
      if (res) {
        this.setData({
          raceName: `海选赛 - ${res.itemName}`,
          title: res.itemName,
          group: res.initRankGroup, // x强
        })
      }
    })
  },

  // 获取battle列表
  getAuditionList(fn) {
    let param = {eventId: 1, itemId: 1} // 测试用
    api.post('room/event/getUserRecordList', param).then(res => {
      if (res) {
        let arr = res.sort((a, b) => {
          return a.totalScore - b.totalScore
        })
        this.setData({
          playerList: arr,
        })
        fn && fn()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserItemInfo() // 获取当前用户信息
    this.getEventItem()// 获取赛事信息
  },
})