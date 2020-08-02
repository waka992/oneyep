// pages/myMessage/myMessage.js
import api from '../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgLists: [
      {
        sendUserPic: '/images/avatar.png',
        createName: '张三',
        groupName: '物料组',
        roleName: 'roleName',
        createTime: '2019.10.30  21：16',
        taskName: 'taskName',
        operate: '催办',
        msg: '好的,收到!!!',
        content: '',
        // fromMsg: '你们到底还要多久菜准备好？？就差你们了'
      },
    ]
  },
  // 获取data
  getData() {
    let param = {
      userId: wx.getStorageSync('openid')
    }
    api.post('message/getMessageList', param).then(res => {
      this.setRead()
      this.setData({
        msgLists: res
      })
    })
  },
  setRead() {
    let param = {
      userId: wx.getStorageSync('openid')
    }
    api.post('message/alreadyRead', param).then(res => {})
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
    if (!msg[i].replyContent) {
      return
    }
    let param = {
      content: msg[i].replyContent,
      messageId: msg[i].id,
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
        msg[i].replyContent = val
      }
    }
    this.setData({
      msgLists: msg
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getData()
  },
})