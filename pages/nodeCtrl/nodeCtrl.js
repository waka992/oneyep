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
    showRepickList: false, // 重选界面
    nodeId: '', // 当前大节点的id
    currentNodeId: '', // getnode获得的nodeid
    currentInstanceId: '', // getnode获得的id
    currentNodeType: '', // getnode获得的nodetype
    currentOperateType: '', // 当前操作的type
    msgCount: 0, // 消息数量
    eventId: '', // 赛事id
    itemId: '', // 项目id
    selectNodeId: '', // 选中的小节点id(任务id)
    nodeName: '',
    startTime: '',
    endTime: '',
    groupVal: '', // 身份识别 0总控 1组长 2组员
    groups: [
      // {name: '签到组', status: 1, tasks: [{task: '交场', status: 1},{task: '工作人员到场', status: 1},{task: '清点&交接物料', status: 0},]},
      // {name: '摊位组', status: 0, tasks: [{task: '交场', status: 1},{task: '工作人员到场', status: 1},{task: '清点&交接物料', status: 0},{task: '清点&交接物料2', status: 1},{task: '清点&交接物料3', status: 0},]},
    ],
    timePlanList: [], // 回滚节点需要的列表
    operateList: [
      {imgSrc:'/images/icon/icon-start.png', word: '开始', type: 1}, 
      {imgSrc:'/images/icon/icon-reback.png', word: '回滚', type: 0},
      {imgSrc:'/images/icon/icon-end.png', word: '结束', type: 2},
      {imgSrc:'/images/icon/icon-share.png', word: '分享'},
    ],
    operateList3: [
      {imgSrc:'/images/icon/icon-start.png', word: '开始', type: 1}, 
      {imgSrc:'/images/icon/icon-end.png', word: '完成', type: 2},
      {imgSrc:'/images/icon/icon-reback.png', word: '回滚', type: 0},
      {imgSrc:'/images/icon/icon-urge.png', word: '催办', type: 3},
      {imgSrc:'/images/icon/icon-feedback.png', word: '反馈', type: 9},// type传送时候改为2
    ], // 小节点的列表
    showOperateList3: [], // 过滤后小节点的列表
    openIndex: 0,
    fromShare: false,
  },
  onBack() {
    // 分享过来的
    if (this.data.fromShare) {
      wx.switchTab({
        url: '/pages/user/user'  
      })
      return
    }
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
    this.getMsgCount()
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
    let {selectNodeId, currentOperateType} = this.data
    let param = {
      content: content,
      sendUserId: wx.getStorageSync('openid'),
      taskId: selectNodeId,
      type: currentOperateType == 3 ? 2 : currentOperateType
    }
    api.post('message/feedBack', param).then(res => {
      wx.showToast({
        title: '发布成功',
        icon: 'none',
        duration: 1500,
      });
    })
  },
  // 操作框执行的动作(大节点)
  operateNode(e) {
    this.getMsgCount()
    let type = e.detail.type
    // 回滚
    if (type === 0) {
      // let param = {id: this.data.eventid}
      // this.getNodes(param)
      this.toBackNode() // 回滚接口
      return
    }
    this.requestNodeOperate(type)
  },
  // 操作框执行的动作
  operate(e) {
    this.getMsgCount()
    let type = e.detail.type
    // 反馈不需要传后台
    if (type == 9 || type == 3) {
      this.setData({
        currentOperateType: type,
        switchRelease: true
      })
      return
    }
    this.requestOperate(type)
  },
  // 提醒后台执行动作（大节点）
  requestNodeOperate(type) {
    api.post('node/nodeControl', {nodeId: this.data.nodeId, type: type}).then(res => {
      wx.showToast({
        title: '操作成功',
        icon: 'none',
        duration: 1500,
      });
      this.getNode(this.data.nodeId) // 执行成功刷新列表
    }).catch(res => {
      // 重选
      if (res.code == 2006) {
        this.getNodeItemByNodeId()
        return
      }
      else if (res.code == 2012) {
        // battle列表
        wx.showToast({
          title: res.desc,
          icon: 'none',
          duration: 1500,
        });
        return
      }
    })
  },

  // 获取项目id
  getNodeItemByNodeId() {
    let param = {
      id: this.data.nodeId,
      userId: wx.getStorageSync('openid')
    }
    api.post('/node/getNodeItemByNodeId', param).then(res => {
      this.setData({
        itemId: res.itemId,
        showRepickList: true, // 打开重选人员名单
      })
    })
  },

  // 关闭重选人员列表
  closeRepickList() {
    this.setData({
      showRepickList: false
    })
  },

  // 提醒后台执行动作
  requestOperate(type) {
    api.post('task/taskControl', {taskId: this.data.selectNodeId, type: type}).then(res => {
      this.getNode(this.data.nodeId) // 执行成功刷新列表
    })
  },
  openGroup(evt) {
    this.getMsgCount()
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
    // id = '001'; userid = '002'
    let param = {id: id, userId: userid }
    api.post('node/getNode', param).then(res => {
      console.log(res);
      // status 0未开始 1进行中 2结束
      let groups = []
      let {taskList, node} = res
      for (let i = 0; i < taskList.length; i++) {
        const ele = taskList[i];
        groups.push({
          canOperate: Number(ele.flag) ? true : false,
          name: ele.groupName,
          tasks: ele.taskList,
          currentInstanceId: res.node.id,
          currentNodeId: res.node.nodeId,
          currentNodeType: res.node.nodeType
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
    let { currentNodeId, currentInstanceId, currentNodeType} = this.data
    api.post('node/nodeBack', {nodeId: currentNodeId, nodeInstanceId: currentInstanceId, nodeType: currentNodeType}).then(res => {
      console.log(res);
      wx.showToast({
        title: '操作成功',
        icon: 'none',
        duration: 1500,
      });
      this.getNode(this.data.nodeId) // 执行成功刷新列表
      // this.setData({
      // switchBackNode: false
      // })
    }).catch(res => {
      // this.setData({
      //   switchBackNode: false
      // })
    })
  },
  // 回滚时候获取列表
  getNodes(opt) {
    let {roleId, id} = opt
    // id = '001' // 测试
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
  // 获取信息数量
  getMsgCount() {
    let param = {
      userId: wx.getStorageSync('openid')
    }
    api.post('message/messageCount', param).then(res => {
      this.setData({
        msgCount: res
      })
      console.log(res);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.share == 'true') {
      this.setData({
        fromShare: true
      })
    }
    // this.getMsgCount()
    let op3 = []
    let op = []
    switch(Number(options.groupVal)) {
     // groupVal身份识别 0总控 1组长 2组员
      case 0:
        op3 = [
          {imgSrc:'/images/icon/icon-start.png', word: '开始', type: 1}, 
          {imgSrc:'/images/icon/icon-end.png', word: '完成', type: 2},
          {imgSrc:'/images/icon/icon-reback.png', word: '回滚', type: 0},
          {imgSrc:'/images/icon/icon-urge.png', word: '催办', type: 3}, // 总控才有
        ]
        op = [
          {imgSrc:'/images/icon/icon-start.png', word: '开始', type: 1}, 
          {imgSrc:'/images/icon/icon-reback.png', word: '回滚', type: 0},
          {imgSrc:'/images/icon/icon-end.png', word: '结束', type: 2},
          {imgSrc:'/images/icon/icon-share.png', word: '分享'},
        ]
      break
      case 1:
      case 2:
        op = [
          // {imgSrc:'/images/icon/icon-start.png', word: '开始', type: 1}, 
          // {imgSrc:'/images/icon/icon-reback.png', word: '回滚', type: 0},
          // {imgSrc:'/images/icon/icon-end.png', word: '结束', type: 2},
          {imgSrc:'/images/icon/icon-share.png', word: '分享'},
        ]
        op3 = [
          // {imgSrc:'/images/icon/icon-start.png', word: '开始', type: 1}, 
          // {imgSrc:'/images/icon/icon-end.png', word: '完成', type: 2},
          // {imgSrc:'/images/icon/icon-reback.png', word: '回滚', type: 0},
          {imgSrc:'/images/icon/icon-feedback.png', word: '反馈', type: 9}, // 组长 组员只能反馈，type传2
        ]
    }
    this.setData({
      nodeId: options.nodeid,
      eventId: options.eventid,
      groupVal: options.groupVal,
      operateList3: op3,
      operateList: op,
    })
    this.getNode(options.nodeid) 
  },
  onShow() {
    this.getMsgCount()
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
      path: `/pages/nodeCtrl/nodeCtrl?share=true&nodeid=${this.data.nodeid}&eventid=${this.data.eventId}groupVal=${this.data.groupVal}`
    }
  }
})