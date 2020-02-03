// pages/referee/referee.js
let app = getApp().globalData;
import api from '../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isComplete: true
  },
  start() {
    // 先查询当前比赛状态（海选还是battle
    let param = {
      id: this.data.eventId, // 赛事id
      userId: wx.getStorageSync('openid')
    }
    api.post('/node/getCurrentNode', param).then(res => {
      // 0普通 1海选 2比赛
      console.log(res);
      if (res.nodeType == 0) {
        wx.showToast({
          title: '赛事未开始，请等待通知',
          icon: 'none',
          duration: 1500,
        });
      }
      else if (res.nodeType == 1) {
        wx.navigateTo({
          url: `/pages/referee/refereeRate/refereeRate?eventId=${this.data.eventId}&itemId=${res.itemId}`,
        })
      }
      else if (res.nodeType == 2) {
        wx.navigateTo({
          url: `/pages/referee/refereeBattle/refereeBattle?eventId=${this.data.eventId}&itemId=${res.itemId}`,
        }) 
      }
    })
  },
  complete() {
    // 还要请求一下重新开始的裁判状态
    this.setData({
      isComplete: false
    })
  },
  backToUser() {
    if (!this.data.isComplete) {
      wx.switchTab({
        url: '/pages/user/user',
      });
    }
    else {
      this.setData({
        isComplete: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isComplete = options.isComplete === 'true' ? true : false // 是否已完成评分
    let id = options.id
    this.setData({
      isComplete: isComplete,
      eventId: id,
    })
  },
})