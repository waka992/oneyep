// pages/authorization/authorization.js
let app = getApp().globalData;
import api from '../../api/api'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    from: '',
  },
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail);
    if (e.detail.userInfo) {
        //用户按了允许授权按钮
        var that = this;
        //插入登录的用户的相关信息到数据库
        let {signature, rawData, encryptedData, iv} = e.detail
        api.post('getUserInfo', {
          signature: signature,
          rawData: rawData,
          encryptedData: encryptedData,
          iv: iv,
          sessionKey: app.sessionKey,
        }).then(res => {
          console.log("getuserinfo成功！");
        })
        if (this.data.from == 'enroll') {
          console.log(this.data.from);
          wx.navigateBack({
            delta: 1
          })
        }
        else {
          //授权成功后，跳转进入小程序首页
          wx.switchTab({
              url: '/pages/user/user'  
          })
        }
      } else {
        //用户按了拒绝按钮
        wx.showModal({
            title:'警告',
            content:'您点击了拒绝授权，将无法执行报名或签到!',
            showCancel:false,
            confirmText:'返回授权',
            success:function(res){
                if (res.confirm) {
                    console.log('用户点击了“返回授权”')
                } 
            }
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.from) {
      this.setData({
        from: options.from
      })
    }
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