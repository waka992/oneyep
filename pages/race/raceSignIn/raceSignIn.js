// pages/race/raceSignIn/raceSignIn.js
import api from '../../../api/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    imgSrc: '/images/race-detail.png',
    raceTitle: '',
    raceTime: '',
    startTime: '',
    endTime: '',
    raceAddress: '',
    raceDetail: ''
  },
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 签到
  signIn() {
    let phone = wx.getStorageSync('phone');
    if (!phone) {
      wx.navigateTo({
        url: '/pages/authorizationPhone/authorizationPhone',
      });
      return
    }
    wx.scanCode({
      success: (res) => {
        // http://www.oneyep.com.cn:8601/event/sign?eventId=SQC22DY9JRH2RU0F5J0HWG018F
        console.log(res)
        try {
          let obj = JSON.parse(res.result)
          let {url, eventId } = obj
          let param = {
            phone: wx.getStorageSync('phone'),
            openId: wx.getStorageSync('openid'),
            eventId: eventId,
          }
          api.post(url, param)
        }
        finally {
          
        }
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('phone', '');
    console.log(
      options.id
    )
    // this.getData(options.id)
  },
  getData(id) {
    wx.showLoading({
      mask: true,
    });
    api.post('event/eventDetail', {id: id, userId: id}).then((res) => {
      let {eventName, address, beginTime, endTime, flowStatus, picture, description} = res
      this.setData({
        raceTitle: eventName,
        raceAddress: address,
        startTime: beginTime.slice(0, 10),
        endTime: endTime.slice(0, 10),
        status: Number(flowStatus),
        imgSrc: picture,
        raceDetail: description,
        id: id,
      })
      console.log(res);
      wx.hideLoading()
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