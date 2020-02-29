// pages/playerInfoForm/playerInfoForm.js
import api from '../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: 0,
    genderArr: ['男', '女'],
    raceId: '',
    avatar: '',
    form: {
      name: '',
      gender: 0,
      age: '',
      mobile: '',
      wechat: ''
    }
  },
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  formSubmit(e) {
    this.enroll(e.detail.value)
  },

  // 报名操作
  enroll(form) {
    let {name, gender, age, mobile, wechat} = form
    let param = {
      userName: name,
      openId: wx.getStorageSync('openid'),
      id: this.data.raceId,
      phone: mobile,
      pic: this.data.avatar
    }
    console.log(param);
    // 提交到后台
    api.post('event/enroll', param).then((res) => {
      console.log(res);
      wx.switchTab({
        url: '/pages/user/user'  
      });
    })
  },

  checkAuth() {
    let that = this
    wx.getSetting({
      success: function (res) {
          if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                  success: function (res) {
                    console.log(res);
                    that.setData({
                      avatar: res.userInfo.avatarUrl,
                    })
                  }
              });
          }
      }
    })
  },

  bindPickerChange: function(e) {
    this.setData({
      gender: Number(e.detail.value)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      raceId: options.raceId
    })
    this.checkAuth()
  },
})