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
    pollingTimer: null, // 轮询timer
  },
  // 返回上一页
  back() {
    wx.navigateBack({
      delta: 1
    });
  },
  // 查看列表
  toList() {
    let {eventId, itemId, raceName, itemUserId, group} = this.data
    let param = {
      eventId: eventId,
      itemId: itemId,
      judgeId: itemUserId,
    }
    wx.navigateTo({
      url: `/pages/referee/refereeBattle/refereeBattleList/refereeBattleList?param=${JSON.stringify(param)}&raceName=${raceName}&group=${group}`,
    });
  },

  // 获取battle列表
  getBattleList(judge = false) {
    let {eventId, itemId, group} = this.data
    let param = {
      eventId: eventId,
      itemId: itemId,
      judgeId:this.data.itemUserId
    } // 测试用
    api.post('room/event/getBattleGroupMap', param).then(res => {
      if (res) {
        // 调用以判断是否评分完毕
        if (judge) {
          let canBackToStart = true // 是否评分完回到开始界面
          let isComplete = false
          let num = 0
          for (const key in res[group]) {
            num ++
            const element = res[group][key];
            if (element.status == 0) {
              canBackToStart = false
            }
          }
          console.log(canBackToStart);
          if (canBackToStart) {
            // 决赛评分完，就是完成了
            if (num == 1) {
              isComplete = true
            }
            wx.navigateTo({
              url: `/pages/referee/referee?isComplete=${isComplete}&id=${this.data.eventid}`,
            })
          }
          return
        }
        // 处理组
        let groups = []
        for (const key in res[group]) {
            const element = res[group][key];
            groups.push(element)
        }
        console.log(res);
        let leftInfo = groups[this.data.round].battleLeft
        let rightInfo = groups[this.data.round].battleRight
        this.setData({
          playerList: groups,
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
    this.getBattleList(true) // 判断完成没有
    // if (num >= group / 2) {
      // wx.showToast({
      //   title: '已经是最后一组',
      //   icon: 'none',
      //   duration: 1500,
      //   mask: false,
      // });
      // return
    // }
    this.setData({
      round: num,
      leftInfo: leftInfo,
      rightInfo: rightInfo,
    })
  },
  // 能不能到下一组选手
  canNext() {
    wx.showLoading({
      title: '正在评分统计',
      mask: true,
    });
    let {eventId, group, itemId, round } = this.data
    if (group == 0) {return} // 防止数据未加载成功
    let param = {
      eventId: eventId,
      group: group,
      itemId: itemId,
      round: round + 1,
    }
    api.post('room/event/calculateGroupBattle', param).then(res => {
      wx.hideLoading();
      this.tonext()
    }).catch(res => {
      // 平局
      if (res.code == 2005) {
        wx.hideLoading();
        wx.showToast({
          title: '当前结果为平局，请重新评分',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }
      // 等待中
      else if (res.code == 2004) {
        let that = this
        let timer = setTimeout(() => {
          that.canNext()
        }, 10000);
        this.setData({
          pollingTimer: timer
        })
      }
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
    if (!contentNum) { return } // 防止数据为加载
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
      wx.showToast({
        title: '评分成功！',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      setTimeout(() => {
        this.canNext()
      }, 1000)
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
      group: options.group, // x强
      // eventId: 1,
      // itemId: 1,
      // itemUserId: 1,
      // group: 16, // x强
    })
    this.getBattleList()
  },
  onUnload: function() {
    // 清除timer
    clearTimeout(this.data.pollingTimer)
  },

})