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
    id: '', // 节点id
    groupVal: '', // 身份识别 0总控 1组长 2组员
    showRepickList: true, // 重选人员表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 弹出详情框
  showDetail(e) {
    // 实际是id而不是nodeid(可查看HTML上绑定的字段)
    let nodeid = e.currentTarget.dataset.nodeid
    let arr = []
    for (let i = 0; i < this.data.timePlanList.length; i++) {
      const ele = this.data.timePlanList[i];
      // 当前选中的节点
      if (ele.id == nodeid) {
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
      url: `/pages/nodeCtrl/nodeCtrl?nodeid=${this.data.selectNodeId}&eventid=${this.data.eventId}&groupVal=${this.data.groupVal}`,
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
  getNodes(id) {
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

  // 刷新列表
  refresh() {
    this.getNodes(this.data.id)
  },

  // 获取重选人员名单
  getRepickList() {
    let param = {
      eventId: this.data.id,
      isPick: 1, // 海选是否被选中 0 没有被选上 1待重选 2选中
      itemId: ''
    } 
    api.post('/room/event/getPickList', param).then(res => {
      console.log(res);
    })
  },

  // 操作节点
  operate(e) {
    // 分享
    if (e.detail == 99) {

      return
    }
    this.requestNodeOperate(e.detail)
  },

  // 请求后台执行动作（大节点）
  requestNodeOperate(type) {
    api.post('node/nodeControl', {nodeId: this.data.selectNodeId, type: type}).then(res => {
      if (res.code == 2006) {
        // 打开重选列表
        this.setData({
          showRepickList: true
        })
        return
      }
      else if (res.code == 2012) {
        // battle列表
        wx.showToast({
          title: res.bestSize + '强选手未全部选出',
          icon: 'none',
          duration: 1500,
        });
        return
      }
      wx.showToast({
        title: '操作成功',
        icon: 'none',
        duration: 1500,
      });
      this.getNode(this.data.id) // 执行成功刷新列表
    })
  },

  onLoad: function (options) {
    let type = options.type
    this.setData({
      id: options.id,
      groupVal: options.groupVal, // 身份识别
    })
    this.getNodes(options.id)
  },

  onShow: function() {
    if (this.data && this.data.id) {
      this.getNodes(this.data.id)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '节点控制台',
      path: `/pages/nodeCtrl/nodeCtrl?nodeid=${this.data.selectNodeId}&eventid=${this.data.id}`
    }
  }

})