// pages/referee/refereeBattle/refereeBattle.js
import api from '../../../api/api'
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group: 0, // x强
    round: 0, // 使用时需要n + 1轮
    itemId: '',
    eventId: '',
    playerList: [],
    leftInfo: {},
    rightInfo: {},
  },
  toList() {
    let {eventId, itemId, raceName, itemUserId} = this.data
    let param = {
      eventId: eventId,
      itemId: itemId,
      judgeId: itemUserId,
    }
    wx.navigateTo({
      url: `/pages/referee/refereeBattle/refereeBattleList/refereeBattleList?param=${JSON.stringify(param)}&raceName=${raceName}`,
    });
  },

  // 获取battle列表
  getBattleList() {
    let {eventId, itemId} = this.data
    let param = {
      eventId: eventId,
      itemId: itemId,
      judgeId:this.data.itemUserId
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
          console.log(Object.keys(res));
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
            itemId: this.data.itemId,
            judgeId:this.data.itemUserId,
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
  // 下一个选手
  tonext() {
    let { round, playerList, group } = this.data
    let num = round + 1
    let leftInfo = playerList[num].battleLeft
    let rightInfo = playerList[num].battleRight
    if (num > group / 2) {
      wx.showToast({
        title: '已经是最后一组',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return
    }
    this.setData({
      round: num,
      leftInfo: leftInfo,
      rightInfo: rightInfo,
    })
  },
  // 能不能到下一组选手
  canNext() {
    let {eventId, group, itemId, round } = this.data
    if (group == 0) {return} // 防止数据未加载成功
    let param = {
      eventId: eventId,
      group: group,
      itemId: itemId,
      round: round + 1,
    }
    api.post('room/event/calculateGroupBattle', param).then(res => {
      this.tonext()
    }).catch(err => {
      wx.showToast({
        title: '当前结果为平局，需要重新评分',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    })
  },
  // 选择胜者
  chose(e) {
    let eside = e.currentTarget.dataset.side
    let einfo = {}
    if (eside == 'left') {
      einfo = this.data.leftInfo
    }
    else if (eside == 'right') {
      einfo = this.data.rightInfo
    }
    let contentNum = einfo.itemNum
    wx.showModal({
      title: '提示',
      content: `确认选择${contentNum}号参赛者胜出？`,
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
            itemId: this.data.itemId,
            judgeId:this.data.itemUserId,
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
      eventId: options.eventId,
      itemId: options.itemId,
      itemUserId: options.itemUserId,
      raceName: options.raceName,
      // eventId: 1,
      // itemId: 1,
      // itemUserId: 1,
    })
    this.getBattleList()
  },

})