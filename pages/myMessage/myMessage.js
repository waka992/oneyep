// pages/myMessage/myMessage.js
import api from '../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
        content: '',
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
        content: '',
        fromMsg: '你们到底还要多久菜准备好？？就差你们了'
      },
    ]
  },
  // 获取data
  getData() {
    let param = {
      id: wx.getStorageSync('openid')
    }
    api.post('message/getMessageList', param).then(res => {
      this.setData({
        msgLists: []
      })
    })
  },
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 回复
  reply(e) {
    let i = e.target.dataset.index
    let msg = this.data.msgLists
    if (!msg[i].content) {
      return
    }
    let param = {
      content: msg[i].content,
      messageId: msg[i].messageId,
      openId: wx.getStorageSync('openid')
    }
    api.post('message/reply', param).then(res => {
      wx.showToast({
        title: '回复成功',
        icon: 'none',
        duration: 1500,
      });
      this.getData()
    })
  },
  // 输入框
  contentChange(e) {
    let index = e.target.dataset.index
    let val = e.detail.value
    let msg = this.data.msgLists
    for (let i = 0; i < msg.length; i++) {
      const element = msg[i];
      if (i == index) {
        msg[i].content = val
      }
    }
    this.setData({
      msgLists: msg
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getData()
  },
})