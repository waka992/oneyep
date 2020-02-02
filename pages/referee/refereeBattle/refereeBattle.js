// pages/referee/refereeBattle/refereeBattle.js
import api from '../../../api/api'
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group: 0, // x强
    round: 0, // n + 1轮
    playerList: [],
    leftInfo: {},
    rightInfo: {}
  },
  toList() {
    let {eventId} = this.data
    let param = {
      eventId: eventId,
      itemId: 1,
      judgeId:1
    }
    wx.navigateTo({
      url: `/pages/referee/refereeBattle/refereeBattleList/refereeBattleList?param=${JSON.stringify(param)}`,
    });
  },

  // 获取battle列表
  getBattleList() {
    let {eventId} = this.data
    let param = {
      eventId: eventId,
      itemId: 1,
      judgeId: 1
    } // 测试用
    api.post('room/event/getBattleGroupMap', param).then(res => {
      if (res) {
        // 处理组
        let groups = []
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            const element = res[key];
            for (const k in element) {
              if (element.hasOwnProperty(k)) {
                const group = element[k];
                groups.push(group)
              }
            }
          }
        }
        console.log(res);
        let x = 0
        if (Object.keys(res) && Object.keys(res)[0]) {
          x = Number(Object.keys(res)[0])
        }
        let leftInfo = groups[this.data.round].battleLeft
        let rightInfo = groups[this.data.round].battleRight
        this.setData({
          playerList: groups,
          group: x,
          leftInfo: leftInfo,
          rightInfo: rightInfo,
        })
        // fn && fn()
      }
    })
  },
  // 弃权
  giveup() {
    wx.showModal({
      title: '提示',
      content: '确认弃权？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          let info = {}
          info = this.data.leftInfo
          let param = {
            eventId: info.eventId, //赛事id
            group: this.data.group, // x强
            itemId: info.itemId,
            judgeId: info.judgeId, // 测试用
            oneMore: true,
            round: info.round,
            winSide: '',
          }
          console.log(param);
          this.sendResult(param)
        }
      },
    });
  },
  // 选择胜者
  chose(e) {
    wx.showModal({
      title: '提示',
      content: '确认选择该参赛者胜出？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          let side = e.currentTarget.dataset.side
          let info = {}
          if (side == 'left') {
            info = this.data.leftInfo
          }
          else if (side == 'right') {
            info = this.data.rightInfo
          }
          let param = {
            eventId: info.eventId, //赛事id
            group: this.data.group, // x强
            itemId: info.itemId,
            judgeId: info.judgeId, // 测试用
            oneMore: (side !== 'left') && (side !== 'right') ? true : false,
            round: info.round,
            winSide: side == 'left' ? 0 : side == 'right' ? 1 : '',
          }
          console.log(param);
          this.sendResult(param)
        }
      },
    });
  },
  // 通知结果
  sendResult(param) {
    api.post('/room/event/battleJudge', param).then(res => {
      console.log(res);
      wx.showToast({
        title: '评分成功！',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      eventId: options.eventId
    })
    this.getBattleList()
  },

})