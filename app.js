//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,
    // url: 'http://2o6465101l.wicp.vip/',
    // url: 'http://2652841pv0.zicp.vip/', // 俊
    url: 'http://www.oneyep.com.cn:8601/',
    sessionKey: '',
  }
})