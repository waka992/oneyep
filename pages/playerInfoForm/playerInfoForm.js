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
    console.log(e.detail.value)
    let openid = wx.getStorageSync('openid');
    console.log(openid);
    if (!openid) {
      // 保留到登录完后使用
      let {name, gender, age, mobile, wechat} = e.detail.value
      let form = {
        name: name,
        gender: gender,
        age: age,
        mobile: mobile,
        wechat: wechat
      }
      wx.navigateTo({
        url: '/pages/authorization/authorization?from=enroll',
      });
      this.setData({
        form: form
      })
      this.login()
      return
    }
    else {
      this.enroll(e.detail.value)
    }
  },

  // 报名操作
  enroll(form) {
    let {name, gender, age, mobile, wechat} = form
    let param = {
      userName: name,
      openId: wx.getStorageSync('openid'),
      id: this.data.raceId,
      phone: mobile,
    }
    console.log(param);
    // 提交到后台
    api.post('event/enroll', param).then((res) => {
      console.log(res);
      wx.switchTab({
        url: '/pages/user/user'  
      });
    })
    // wx.navigateTo({
    //   url: '/pages/activityProcess/activityProcess?raceId=' + this.data.raceId,
    // });
  },

  login() {
    let self = this
    wx.login({
      success (res) {
        if (res.code) {
          // 登录成功，获取用户信息
          self.backendLogin(res.code)
        } else {
          // 否则弹窗显示，showToast需要封装
          // showToast()
        }
      },
      fail () {
        // showToast()
      }
    })
  },

  // 调用后台登录接口
  backendLogin(code) {
    let self = this
    api.post('wx/login', {code: code}).then((res) => {
      wx.setStorageSync('sessionKey', res.session_key);
      wx.setStorageSync('openid', res.openid);
      wx.hideLoading();
      self.checkAuthorization()
      // self.enroll(self.data.form) // 发起报名
    })
  },

  // 查询授权
  checkAuthorization() {
    let that = this
    wx.getSetting({
      success: function (res) {
          if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                  success: function (res) {
                    let {signature, rawData, encryptedData, iv} = res
                    let sessionKey = wx.getStorageSync('sessionKey')
                    api.post('getUserInfo', {
                      signature: signature,
                      rawData: rawData,
                      encryptedData: encryptedData,
                      iv: iv,
                      sessionKey: sessionKey,
                    }).then((res) => {
                      wx.hideLoading();
                    }).catch((error) => {
                      console.log(error);
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