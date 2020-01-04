// pages/referee/referee.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isComplete: true
  },
  start() {
    wx.navigateTo({
      url: '/pages/referee/refereeRate/refereeRate',
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
    let isComplete = options.isComplete === 'true' ? true : false
    this.setData({
      isComplete: isComplete
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