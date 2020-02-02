// pages/player/playerOn/playerOn.js
import api from '../../../api/api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ranking: '?',
    name: '',
    status: 1, // 0未开始
    describe: '',
    raceName: '',
    time: '12:25-12:55',
    hasPrev: false,
    hasNext: false,
    itemUserId: '', // 当前选手id
    rating: false, // 比赛是否进行中
    currentItem: 0, // 当前第几个赛事
    currentItemStatus: 'battle', // 当前项目节点（battle还是audition）
    currentItems: [], // 当前选手赛事列表
    group: 0,
    eventId: 1,
    // battle用的变量
    showFinalRankList: false, // 展开battle名单
    chosenGroup: {}, // 当前查看组
    judge: '', // 左边还是右边赢， 空值未评分，draw就是one more
    battleFinish: false,
    playerList: [],
    // 海选所用的变量
    showAuditionRankList: false,
    auditionPlayerList: [],
    currentRank: 99, // 当前排名
  },
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  openRankList() {
    this.getBattleInfo()
    this.setData({
      showFinalRankList: true
    })
  },
  // 下一个赛事
  toNext() {
    let data = this.data
    let { currentItem, currentItems} = data
    if (currentItem >= currentItems.length - 1) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1500,
      });
      return
    }
    else {
      let num = currentItem + 1
      let hasNext = true
      // 最后一个
      if (num == currentItems.length - 1) {
        hasNext = false
      }
      let itemId = currentItems[num]
      this.getCurrentNode(1) // 测试用
      // this.getCurrentNode(itemId)
      this.setData({
        currentItem: num,
        hasNext:hasNext,
        hasPrev: true
      })
    }
  },
  // 上一个赛事
  toPrevious() {
    let data = this.data
    let { currentItem, currentItems} = data
    if (currentItem <= 0) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1500,
      });
      return
    }
    else {
      let num = currentItem - 1
      let hasPrev = true
      // 第一个
      if (num == 0) {
        hasPrev = false
      }
      let itemId = currentItems[num]
      this.getCurrentNode(1) // 测试用
      // this.getCurrentNode(itemId)
      this.setData({
        currentItem: num,
        hasPrev: hasPrev,
        hasNext: true
      })
    }
  },
  // 获取用户item信息
  getUserItemInfo() {
    let param = {
      id: this.data.eventId,
      userId: wx.getStorageSync('openid')
    }
    api.post('event/getEventUserInfo', param).then(res => {
      this.setData({
        itemUserId: res.id,
        name: res.userName,
      })
    })
  },

  // 获取battle双方信息
  getBattleInfo() {
    // userid用itemuserid
    let param = {eventId: this.data.eventId, itemId: 1, userId: this.data.itemUserId} // 测试用
    api.post('room/event/getUserBattle', param).then(res => {
      if (res) {
        // 处理组
        let data = [] // 默认选取第一组
        let battleFinish = false
        let leftWinNum = 0, rightWinNum = 0, readyNum = 0, readyFlag = false
        for (let i = 0; i < res.length; i++) {
          const ele = res[i];
          let leftWin = ele.battleLeft.isWin
          let rightWin = ele.battleRight.isWin
          if (leftWin == 1) {
            leftWinNum ++
          }
          if (rightWin == 1) {
            rightWinNum ++
          }
          if (leftWin == rightWin && leftWin == -1) {
            readyNum ++
          }
          // 选取当前选手的对应组
          if (ele.battleLeft.itemUserId == this.data.itemUserId || ele.battleRight.itemUserId == this.data.itemUserId) {
            data = ele
          }
          // 如果当前已经全部出成绩了
          if (res.length == res[0].group / 2) {
            battleFinish = true
          }
        }

        // 判断得分
        let judge = ''
        if (leftWinNum > rightWinNum) {
          judge = 'left'
        }
        else if (leftWinNum < rightWinNum) {
          judge = 'right'
        }
        else if (readyNum == res.length) { // 如果全部都为-1就是未评分
          judge = ''
        }
        else if (leftWinNum == rightWinNum) { // 否则就是平局
          judge = 'draw'
        }
   
        this.setData({
          chosenGroup: data,
          playerList: res,
          judge: judge,
          battleFinish: battleFinish,
        })
        // fn && fn()
      }
    })
  },

  // 获取赛事信息
  getEventItem(info) {
    // userid用itemuserid
    let param = {eventId: this.data.eventId, itemId: info.id} // 测试用
    api.post('room/event/getEventItem', param).then(res => {
      if (res) {
        this.setData({
          raceName: `${info.title} - ${res.itemName}`,
          group: res.initRankGroup, // x强
        })
      }
    })
  },

  // 获取battle列表
  getBattleList(fn) {
    let param = {eventId: this.data.eventId, itemId: 1} // 测试用
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
        this.setData({
          playerList: groups,
        })
        fn && fn()
      }
    })
  },

  // 获取当前选手的赛事列表
  getEventList(id) {
    let openid = wx.getStorageSync('openid')
    let params = {id:id, userId:openid}
    let hasNext = false

    api.post('event/eventItemList', params).then((res) => {
      let {itemList, reportedItems} = res
      let arr = reportedItems ? reportedItems : []
      for (let i = 0; i < itemList.length; i++) {
        const ele = itemList[i];
        if(arr.indexOf(ele.id) === -1) {
          ele._status = 1 // 未报名
        }
        else {
          ele._status = 2
        }
      }
      itemList = itemList.filter(list => list._status == 2) // 只要报名了的
      // 可以点击下一步
      if (itemList.length > 1) {
        hasNext = true
      }
      this.setData({
        currentItems: itemList,
        hasNext: hasNext,
      })
    })
  },
  // 获取当前赛事的节点
  getCurrentNode(id) {
    let param = {
      id: id || '001', //001测试用
      userId: wx.getStorageSync('openid')
    }
    api.post('/node/getCurrentNode', param).then(res => {
      let type = ''
      // 0普通1海选2比赛
      if (res.nodeType == 0) {
        type = 'normal'
        this.getEventItem({id:id, title: '赛事准备中'})
      }
      else if (res.nodeType == 1) {
        type = 'audition'
        this.getEventItem({id:id, title: '海选赛'})
      }
      else if (res.nodeType == 2) {
        type = 'battle'
        this.getEventItem({id:1, title: '对决赛'}) // 获取赛事信息
        this.getBattleInfo() // 获取battle信息
      }
      this.setData({
        currentItemStatus: type // 当前展示对决赛/海选
      })
    })
  },
  // 海选接口
  // 海选列表
  getAuditionList(fn) {
    let param = {eventId: this.data.eventId, itemId: 1} // 测试用
    api.post('room/event/getUserRecordList', param).then(res => {
      if (res) {
        let currentRank = 99
        // 排名
        let arr = res.sort((a, b) => {
          return b.totalScore - a.totalScore
        })
        // 获取当前排名
        arr.forEach((ele, index) => {
          if (ele.itemUserId == this.data.itemUserId) {
            currentRank = index
          }
        });
        this.setData({
          auditionPlayerList: arr,
          currentRank: currentRank
        })
        fn && fn()
      }
    })
  },
  // 海选成绩单
  openAuditionList() {
    this.getAuditionList()
    this.setData({
      showAuditionRankList: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      eventId: 1 // 测试用
    })
    this.getEventList(1) // 当前选手的赛事列表用于左右切换
    this.getUserItemInfo() // 获取当前用户信息
    this.getCurrentNode(1) // 入口！ 判断节点，判断好会请求battle/audition的数据
  },
})