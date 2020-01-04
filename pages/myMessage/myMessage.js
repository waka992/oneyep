// pages/myMessage/myMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgCount: 2,
    msgLists: [
      {
        avatar: '/images/avatar.png',
        userName: '张三',
        group: '物料组',
        identity: '组长',
        time: '2019.10.30  21：16',
        from: '物料组-清点%交接物料',
        operate: '催办',
        msg: '好的,收到!!!',
        fromMsg: '你们到底还要多久菜准备好？？就差你们了'
      },
      {
        avatar: '/images/avatar.png',
        userName: '张五',
        group: '物料组',
        identity: '组长',
        time: '2019.10.30  21：16',
        from: '总控',
        operate: '开始',
        msg: '好的,收到!!!',
        fromMsg: '你们到底还要多久菜准备好？？就差你们了'
      },
    ]
  },
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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