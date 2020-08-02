// pages/demo/demoBindRole/demoBindRole.js
import api from '../../../api/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    id2: ''
  },
  // 输入评分
  edit(e) {
    if (e.detail.value) {
      this.setData({
        id: e.detail.value
      })
    }
  },
  editSignIn(e) {
    console.log(e);
    if (e.detail.value) {
      this.setData({
        id2: e.detail.value
      })
    }
  },

  req() {
    let param = {
      itemId: '',
      eventId: '',
      userId: wx.getStorageSync('openid')
    }
    api.post('room/event/signIn', param).then(res => {
      console.log(res);
    })
  },
  signIn() {
    let param = {
      // id: this.data.id2
        eventId: '',
        openId: '',
        userId: ''
    }
    api.post('event/bindUserByOpenId', param).then(res => {
      console.log(res);
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


})