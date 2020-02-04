// pages/referee/referee.js
let app = getApp().globalData;
import api from '../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isComplete: true,
    itemUserId: '',
    raceName: '', // 赛事名
  },

  // 1.开始
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
          url: `/pages/referee/refereeRate/refereeRate?eventId=${this.data.eventId}&itemId=${res.itemId}&itemUserId=${this.data.itemUserId}&raceName=${this.data.raceName}`,
        })
      }
      else if (res.nodeType == 2) {
        wx.navigateTo({
          url: `/pages/referee/refereeBattle/refereeBattle?eventId=${this.data.eventId}&itemId=${res.itemId}&itemUserId=${this.data.itemUserId}`,
        }) 
      }
    })
  },

  // 2.获取赛事信息
  getEventItem(id) {
    // userid用itemuserid
    let param = {
      eventId: this.data.eventId,
      itemId: id
    } // 测试用
    api.post('room/event/getEventItem', param).then(res => {
      if (res) {
        this.setData({
          raceName: res.itemName,
        })
      }
    })
  },

  // 1.获取用户其中一个item信息
  getUserItemInfo() {
    wx.showLoading({
      mask: true,
    });
    let id = this.data.eventId// itemid
    let param = {
      id: id,
      userId: wx.getStorageSync('openid')
    }
    api.post('event/getEventUserInfo', param).then(res => {
      this.setData({
        itemUserId: res.id,  // 同一个赛事不同项目用同一个itemuserid
      })
      this.getEventItem(res.id) // 获取赛事名字
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
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
    this.getUserItemInfo()
  },
})