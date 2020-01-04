// pages/player/playerOn/playerOn.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ranking: '?',
    name: '陈某',
    status: 0, // 0未开始
    describe: '您未参与此项，请等待',
    raceName: '海选赛-HipHop',
    time: '12:25-12:55',
    hasPrev: false,
    hasNext: true,
    showRankList: false,
    showFinalRankList: false,
    rating: false, // 比赛是否进行中
    raceNo: 1
  },
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  openRankList() {
    if (this.data.raceNo == 1) {
      this.setData({
        showRankList: true
      })
    }
    else if (this.data.raceNo == 3) {
      this.setData({
        showFinalRankList: true
      })
    }
  },
  toNext() {
    console.log(123);
    let num = 0
    if (this.data.raceNo < 3) {
      num = this.data.raceNo + 1
    }
    else {return}
    console.log(num);
    this.raceNoHandler(num)
    this.setData({
      raceNo: num
    })
  },
  toPrevious() {
    let num = 0
    if (this.data.raceNo > 1) {
      num = this.data.raceNo - 1
    }
    else {return}
    this.raceNoHandler(num)
    this.setData({
      raceNo: num
    })
  },
  raceNoHandler(num) {
    switch(num) {
      case 1:
          this.setData({
            rating: false,
          })
          break
      case 2:
          this.setData({
            rating: true
          })
          break
      case 3:
          this.setData({
            rating: false,
          })
        break
    }
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