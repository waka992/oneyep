// pages/referee/refereeRate/refereeRate.js
import api from '../../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventId: '',
    showRateList: false,
    playerList: [],
    currentNum: 0,
    currentScore: 0,
    currentPlayer: {
      num: 8,
      pic: '/images/player-video.png'
    }
  },
  // 输入评分
  scoreEdit(e) {
    if (e.detail.value) {
      this.setData({
        currentScore: e.detail.value
      })
    }
  },
  // 确认评分
  confirmRate() {
    let data = this.data
    let current = data.playerList[data.currentNum]
    let param = {
      eventId: current.eventId, // 赛事id
      itemId: current.itemId, // 项目id
      userId: current.itemUserId, // 项目id
      judgeId: wx.getStorageSync('openid'), // 裁判id
      score: Number(this.data.currentScore) || 0, // 得分
    }
    api.post('room/event/scoreAudition', param).then(res => {
      console.log(res);
      wx.showToast({
        title: '完成评分',
        icon: 'none',
        duration: 1000,
      });
    })
    // wx.navigateTo({
    //   url: '/pages/referee/referee?isComplete=true',
    // });
  },
  openList() {
    this.getPickList()
    this.setData({
      showRateList: true
    })
  },
  closeList() {
    let that = this
    let setRateList = function() {
      that.setData({
        showRateList: false
      })
    }
    this.getPickList(setRateList)
  },
  // 获取海选人员名单
  getPickList(fn) {
    // eventid 赛事id， itemid: 项目(hihop等)id 1poping 2hiphop 3freestyle
    let {eventId} = this.data
    let param = {eventId: eventId, itemId: 1} // 测试用
    api.post('room/event/getUserRecordList', param).then(res => {
      if (res.length > 0) {
        this.setData({
          currentPlayer: {num: res[this.data.currentNum].itemNum},
          playerList: res
        })
        fn && fn()
      }
    })
  },
  animateLeft() {
    // 图片滑动
    this.animate('.player-pic', [
      { translateX: 0,  ease: 'ease-out'  },
      { translateX: '-100%',  ease: 'ease-out'  },
    ], 200, function () {
      this.clearAnimation('.player-pic', function () {
      })
    }.bind(this))
    // 数字滑动
    this.animate('.player-num', [
      { translateX: '-50%', translateY: '-50%', opacity: 1, ease: 'ease-out'},
      { translateX: '-600', translateY: '-50%', opacity: 0,  ease: 'ease-out'},
    ], 200, function () {
      this.clearAnimation('.player-num', function () {
      })
    }.bind(this))
  },
  animateRight() {
    // 图片滑动
    this.animate('.player-pic', [
      { translateX: 0,  ease: 'ease-out'  },
      { translateX: '100%',  ease: 'ease-out'  },
    ], 200, function () {
      this.clearAnimation('.player-pic', function () {
      })
    }.bind(this))
    // 数字滑动
    this.animate('.player-num', [
      { translateX: '-50%', translateY: '-50%', opacity: 1, ease: 'ease-out'},
      { translateX: '-600', translateY: '-50%', opacity: 0,  ease: 'ease-out'},
    ], 200, function () {
      this.clearAnimation('.player-num', function () {
      })
    }.bind(this))
  },
  // 上一个参赛人员
  goPrevious() {
    let data = this.data
    if (data.currentNum <= 0) {
      return
    }
    this.setData({
      currentNum: data.currentNum - 1
    })
    this.animateLeft()
    this.setData({
      currentPlayer: {num: data.playerList[data.currentNum].itemNum}
    })
  },
  // 下一个参赛人员
  goNext() {
    let data = this.data
    if (data.currentNum >= data.playerList.length) {
      return
    }
    this.setData({
      currentNum: data.currentNum + 1
    })
    this.animateRight()
    this.setData({
      currentPlayer: {num: data.playerList[data.currentNum].itemNum}
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      eventId: options.eventId
    })
    this.getPickList()
  },
})