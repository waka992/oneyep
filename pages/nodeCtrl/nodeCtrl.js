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
    nodeName: '',
    startTime: '',
    endTime: '',
    groups: [
      // {name: '签到组', status: 1, tasks: [{task: '交场', status: 1},{task: '工作人员到场', status: 1},{task: '清点&交接物料', status: 0},]},
      // {name: '摊位组', status: 0, tasks: [{task: '交场', status: 1},{task: '工作人员到场', status: 1},{task: '清点&交接物料', status: 0},{task: '清点&交接物料2', status: 1},{task: '清点&交接物料3', status: 0},]},
    ],
    operateList: [
      {imgSrc:'/images/icon/icon-start.png', word: '开始'}, 
      {imgSrc:'/images/icon/icon-urge.png', word: '催办'},
      {imgSrc:'/images/icon/icon-reback.png', word: '回滚'},
      {imgSrc:'/images/icon/icon-end.png', word: '结束'},
      {imgSrc:'/images/icon/icon-share.png', word: '分享'},
    ],
    operateList3: [
      {imgSrc:'/images/icon/icon-start.png', word: '开始'}, 
      {imgSrc:'/images/icon/icon-end.png', word: '结束'},
      {imgSrc:'/images/icon/icon-feedback.png', word: '反馈'},
    ],
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
    this.setData({
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
  closeRelease(e) {
    this.setData({
      switchRelease: false
    })
  },
  operate(e) {
    console.log(e);
    let word = e.detail.word
    if (word == '反馈') {
      this.setData({
        switchRelease: true
      })
    }
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
  //     组长 裁判 userId 001
  //    总控 002
    let userid = wx.getStorageSync('openid')
    userid = '002' // 测试用
    api.post('node/getNode', {id: id, userId: userid}).then(res => {
      console.log(res);
      // status 0未开始 1进行中 2结束
      let groups = []
      let {taskList, node} = res
      for (let i = 0; i < taskList.length; i++) {
        const ele = taskList[i];
        groups.push({
          canOperate: ele.groupIds ? false : true, // 没值可以操作
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNode(options.nodeid) 
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