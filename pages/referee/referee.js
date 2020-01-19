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
      id: '001', // 赛事id
      userId: wx.getStorageSync('openid')
    }
    api.post('/node/getCurrentNode', param).then(res => {
      console.log(res);
    })
    return
    let flag = 1 // 当前是海选还是battle
    if (flag == 1) {
      wx.navigateTo({
        url: '/pages/referee/refereeRate/refereeRate',
      })
    }
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
    console.log(options);
    let isComplete = options.isComplete === 'true' ? true : false // 是否已完成评分
    let id = options.id
    this.setData({
      isComplete: isComplete,
      eventId: id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})