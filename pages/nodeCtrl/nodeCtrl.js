// pages/nodeCtrl/nodeCtrl.js
import api from '../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchNodeOperate: false,
    switchTaskOperate: false,
    switchRelease: false,
    switchBackNode: false, // 回滚节点选择弹窗
    nodeid: '', // 当前大节点的id
    eventid: '', // 赛事id
    selectNodeId: '', // 选中的小节点id
    nodeName: '',
    startTime: '',
    endTime: '',
    groups: [
      // {name: '签到组', status: 1, tasks: [{task: '交场', status: 1},{task: '工作人员到场', status: 1},{task: '清点&交接物料', status: 0},]},
      // {name: '摊位组', status: 0, tasks: [{task: '交场', status: 1},{task: '工作人员到场', status: 1},{task: '清点&交接物料', status: 0},{task: '清点&交接物料2', status: 1},{task: '清点&交接物料3', status: 0},]},
    ],
    timePlanList: [], // 回滚节点需要的列表
    operateList: [
      {imgSrc:'/images/icon/icon-start.png', word: '开始', type: 1}, 
      {imgSrc:'/images/icon/icon-urge.png', word: '催办'},
      {imgSrc:'/images/icon/icon-reback.png', word: '回滚', type: 0},
      {imgSrc:'/images/icon/icon-end.png', word: '结束', type: 2},
      {imgSrc:'/images/icon/icon-share.png', word: '分享'},
    ],
    operateList3: [
      {imgSrc:'/images/icon/icon-start.png', word: '开始', type: 1}, 
      {imgSrc:'/images/icon/icon-end.png', word: '结束', type: 2},
      {imgSrc:'/images/icon/icon-reback.png', word: '回滚', type: 0},
      {imgSrc:'/images/icon/icon-feedback.png', word: '反馈', type: 9},
    ], // 小节点的列表
    showOperateList3: [], // 过滤后小节点的列表
    openIndex: 0
  },
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  msgClick(e) {
    wx.navigateTo({
      url: '/pages/myMessage/myMessage',
    })
  },
  menuClick(e) {
    this.setData({
      switchNodeOperate: true
    })
  },
  taskClick(e) {
    let {nodeid, status} = e.currentTarget.dataset
    let arr = this.data.operateList3
    // 已结束的只能执行回滚操作
    if (status == 2) {
      arr = this.data.operateList3.filter(list => list.type === 0)
    }
    this.setData({
      showOperateList3: arr,
      selectNodeId: nodeid,
      switchTaskOperate: true
    })
  },
  closeNode(e) {
    this.setData({
      switchNodeOperate: false
    })
  },
  closeTask(e) {
    this.setData({
      switchTaskOperate: false
    })
  },
  // 关闭反馈框
  closeRelease(e) {
    this.setData({
      switchRelease: false
    })
  },
  // 发送反馈
  sendRelease(e) {
    let content = e.detail.content
    console.log(content);
    api.post('task/feedBack', {})
  },
  // 操作框执行的动作(大节点)
  operateNode(e) {
    let type = e.detail.type
    // 弹出回滚节点选择
    if (type === 0) {
      let param = {id: this.data.eventid}
      this.getNodes(param)
      return
    }
    this.requestNodeOperate(type)
  },
  // 操作框执行的动作
  operate(e) {
    let type = e.detail.type
    // 反馈不需要传后台
    if (type == 9) {
      this.setData({
        switchRelease: true
      })
      return
    }
    this.requestOperate(type)
  },
  // 提醒后台执行动作（大节点）
  requestNodeOperate(type) {
    api.post('node/nodeControl', {nodeId: this.data.nodeid, type: type}).then(res => {
      this.getNode(this.data.nodeid) // 执行成功刷新列表
    })
  },
  // 提醒后台执行动作
  requestOperate(type) {
    api.post('task/taskControl', {taskId: this.data.selectNodeId, type: type}).then(res => {
      this.getNode(this.data.nodeid) // 执行成功刷新列表
    })
  },
  openGroup(evt) {
    let i = evt.currentTarget.dataset.index
    if (this.data.openIndex === i) {
      this.setData({
        openIndex: ''
      })
    }
    else {
      this.setData({
        openIndex: i
      })
    }
    console.log(evt);
  },
  getNode(id){
  //     组长 裁判 userId 001 总控 002
    let userid = wx.getStorageSync('openid')
    userid = '001' // 测试用
    let param = {id: id, userId: userid }
    api.post('node/getNode', {id: id, userId: userid}).then(res => {
      console.log(res);
      // status 0未开始 1进行中 2结束
      let groups = []
      let {taskList, node} = res
      for (let i = 0; i < taskList.length; i++) {
        const ele = taskList[i];
        groups.push({
          canOperate: Number(ele.flag) ? true : false, // 没值可以操作
          name: ele.groupName,
          tasks: ele.taskList
        })
      }
      console.log(groups);
      this.setData({
        groups: groups,
        nodeName: node.nodeName,
        startTime: node.beginTime.slice(-8),
        endTime: node.endTime.slice(-8)
      })
    })
  },
  // 跳转到指定回滚节点
  toBackNode(e) {
    console.log(e.detail);
    let newNodeId = e.detail.nodeId // newnodeid是哪个？
    api.post('nodeBack', {nodeId: this.data.nodeid, newNodeId: newNodeId}).then(res => {
      console.log(res);
      this.setData({
      switchBackNode: false
      })
    }).catch(res => {
      this.setData({
        switchBackNode: false
      })
    })
  },
  // 回滚时候获取列表
  getNodes(opt) {
    let {roleId, id} = opt
    // roleId = '001' // 测试
    id = '001' // 测试
    api.post('node/eventAllNode', {id: id, userId: wx.getStorageSync('openid')}).then(res => {
      let list = res
      for (let i = 0; i < res.length; i++) {
        const ele = res[i];
        ele.startTime = ele.beginTime.slice(-8)
        ele.event = ele.nodeName
      }
      this.setData({
        timePlanList: list,
        switchBackNode: true
      })
    })
  },
  closeBackDialog(){
    this.setData({
      switchBackNode: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nodeid: options.nodeid,
      eventid: options.eventid
    })
    this.getNode(options.nodeid) 
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
      path: `/pages/nodeCtrl/nodeCtrl?nodeid=${this.data.nodeid}&eventid=${this.data.eventid}`
    }
  }
})