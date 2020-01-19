// pages/masterCtrl/masterCtrl.js
import api from '../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventId: '', // 赛事id
    selectNodeId: '', // 选中的节点
    switchDetail: false,
    timePlanList: [],
    isComplete: false,
    showDetailList: [], // 详情展示的列表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 弹出详情框
  showDetail(e) {
    let nodeid = e.currentTarget.dataset.nodeid
    let arr = []
    for (let i = 0; i < this.data.timePlanList.length; i++) {
      const ele = this.data.timePlanList[i];
      // 当前选中的节点
      if (ele.nodeId == nodeid) {
        // 加入前一个节点
        if (this.data.timePlanList[i - 1]) {
          arr.push(this.data.timePlanList[i - 1])
        }
        else {
          arr.push({nodeName: '', beginTime: ''}) // 加入空数据保证样式
        }
        // 加入当前节点
        arr.push(ele)
        // 加入后一个节点
        if (this.data.timePlanList[i + 1]) {
          arr.push(this.data.timePlanList[i + 1])
        }
        else {
          arr.push({nodeName: '', beginTime: ''}) // 加入空数据保证样式
        }
      }
    }
    arr.forEach(ele => {
      ele.beginTime = ele.beginTime.slice(-8) // 时间格式调整
    })
    this.setData({
      showDetailList: arr,
      selectNodeId: nodeid,
      switchDetail: true
    })
  },
  // 打开节点操作界面
  showNode(e) {
    wx.navigateTo({
      url: `/pages/nodeCtrl/nodeCtrl?nodeid=${this.data.selectNodeId}&eventid=${this.data.eventId}`,
    })
  },
  // 关闭窗口
  closeNode() {
    this.setData({
      switchDetail: false
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
    // id = '001' // 测试
    this.setData({eventId: id})
    api.post('node/eventAllNode', {id: id, userId: wx.getStorageSync('openid')}).then(res => {
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
  onShareAppMessage: function (res) {

  }
})