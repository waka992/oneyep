// pages/race/raceDetail2/raceDetail.js
import api from '../../../api/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    imgSrc: '/images/race-detail.png',
    raceTitle: '赛事标题',
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
  // 报名
  signUp() {
    let openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.navigateTo({
        url: '/pages/authorization/authorization?from=enroll',
      });
     
      this.login()
    }
    wx.navigateTo({
      url: '/pages/race/raceSignUp/raceSignUp?id=' + this.data.id
    })
  },
  // 获取数据
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


  // 登录操作
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id)
  },
})