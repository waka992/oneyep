// pages/masterCtrl/masterCtrl.js
import api from '../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectNodeId: '', // 选中的节点
    switchDetail: false,
    timePlanList: [
      {time: '8:00', node: '准备工作'},
    ],
    isComplete: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  showDetail(e) {
    // console.log(e);
    let nodeid = e.currentTarget.dataset.nodeid
    for (let i = 0; i < this.data.timePlanList.length; i++) {
      const ele = this.data.timePlanList[i];
      
    }
    this.setData({
      selectNodeId: nodeid,
      switchDetail: true
    })
  },
  // 打开节点操作界面
  showNode(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/nodeCtrl/nodeCtrl?nodeid=' + this.data.selectNodeId,
    })
  },
  // 回到user界面
  backToUser() {
    wx.switchTab({
      url: '/pages/user/user',
    });
  },

  // 获取当前节点
  getNodes(opt) {
    let {roleId, id} = opt
    // roleId = '001' // 测试
    id = '001' // 测试
    api.post('node/eventAllNode', {id: id, userId: wx.getStorageSync('openid')}).then(res => {
      console.log(res);
      let list = res
      for (let i = 0; i < res.length; i++) {
        const ele = res[i];
        ele.time = ele.beginTime.slice(-8)
        ele.node = ele.nodeName
      }
      this.setData({
        timePlanList: list
      })
    })
  },

  onLoad: function (options) {
    let type = options.type
    console.log(options);
    this.getNodes(options)
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