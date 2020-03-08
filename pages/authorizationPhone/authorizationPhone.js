// pages/authorization/authorization.js
let app = getApp().globalData;
import api from '../../api/api'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    encryptedData: '',
    iv: '',
  },
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  getPhoneNumber(e) {
    let {encryptedData, iv} = e.detail
    this.setData({
      encryptedData: encryptedData,
      iv: iv,
    })
    api.login(this.requestPhone)
  },
  requestPhone() {
    let param = {
      encryptedData: this.data.encryptedData,
      iv: this.data.iv,
      sessionKey: wx.getStorageSync('sessionKey'),
      // openId: wx.getStorageSync('openid')
    }
    api.post('getPhone', param).then(res => {
      if (res) {
        wx.setStorageSync('phone', res);
      }
      this.onBack()
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.from) {
      this.setData({
      })
    }
  },
})