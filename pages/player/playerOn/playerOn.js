// pages/player/playerOn/playerOn.js
import api from '../../../api/api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemNum: '?',
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
    eventId: '',
    itemId: '',
    winWord: '',
    loseWord: '',
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
    auditionFinish: false, // 是否结束
    showProcess: false,
    processList: []
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
  openProcessList() {
    this.getAllNodes()
    this.setData({
      showProcess: true
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
      let itemId = currentItems[num].id
      this.setData({
        currentItem: num,
        hasNext:hasNext,
        itemId: itemId,
        hasPrev: true
      })
      this.getCurrentNodeType()

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
      let itemId = currentItems[num].id
      this.setData({
        currentItem: num,
        hasPrev: hasPrev,
        itemId: itemId,
        hasNext: true
      })
      this.getCurrentNodeType()
    }
  },

  // 获取battle双方信息
  getBattleInfo() {
    // userid用itemuserid
    // itemId 1 测试用
    let {eventId, itemUserId, itemId} = this.data
    let param = {
      eventId: eventId,
      itemId: itemId,
      userId: itemUserId
    }
    api.post('room/event/getUserBattle', param).then(res => {
      if (res) {
        // 处理组
        let data = [] // 默认选取第一组
        let battleFinish = true
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
        }
        for (let i = 0; i < res.length; i++) {
          // 如果当前已经全部出成绩了
          if (res[i].status == 0) {
            battleFinish = false
            break
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

        let winWord = ''
        let loseWord = ''
        switch(Number(data.group)) {
          case 2:
            winWord = '获得冠军'
            loseWord = '亚军'
            break
          case 4:
            winWord = '晋级决赛'
            loseWord = '四强'
            break
          case 8:
            winWord = '晋级四强'
            loseWord = '八强'
            break
          case 16:
            winWord = '晋级八强'
            loseWord = '十六强'
            break
        }
   
        this.setData({
          chosenGroup: data,
          group: data.group, // x强
          winWord: winWord,
          loseWord: loseWord,
          playerList: res,
          judge: judge,
          battleFinish: battleFinish,
        })
        // fn && fn()
      }
    })
  },

  // 获取battle列表
  getBattleList(fn) {
    let param = {
      eventId: this.data.eventId,
      itemId: this.data.itemId
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
        this.setData({
          playerList: groups,
        })
        fn && fn()
      }
    })
  },

  // 1.获取当前选手的赛事列表
  getEventList() {
    let openid = wx.getStorageSync('openid')
    let params = {
      id:this.data.eventId,
      userId:openid}
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
        itemId: itemList[0].id, // 默认取第一个 
        hasNext: hasNext,
      })
      this.getUserItemInfo()
    })
  },

  // 2.获取用户其中一个item信息
  getUserItemInfo() {
    let id = this.data.eventId// itemid
    let param = {
      id: id,
      userId: wx.getStorageSync('openid')
    }
    api.post('event/getEventUserInfo', param).then(res => {
      this.setData({
        itemUserId: res.id,  // 同一个赛事不同项目用同一个itemuserid
        name: res.userName,
      })
      this.getCurrentNodeType() // 3. 判断节点，判断好会请求battle/audition的数据
    })
  },

  // 3.获取当前赛事的节点(切换左右的入口)
  getCurrentNodeType() {
    // id = '001' // 测试用
    let { eventId, itemUserId, itemId } = this.data
    let param = {
      eventId: eventId,
      itemId: itemId,
      userId: itemUserId
      // userId: "afc6d5d8-5c5a-4a79-9556-71ea87a55b85"
    }
    api.post('/room/event/getUserRecord', param).then(res => {
      let type = ''
      //auditionStatus 海选状态（0草稿，1评分中，2.已评分）
      // battleStatus battle状态（草稿 0 ，进行中1，已完成2）
      let {auditionStatus, battleStatus, itemNum} = res
      if (auditionStatus == 0) {
        type = 'normal'
        this.getEventItem({id:itemId, title: '赛事准备中'})
      }
      // 先判断battle，有battle就没有海选
      else if (battleStatus == 1 || battleStatus == 2) {
        type = 'battle'
        this.getEventItem({id:itemId, title: '对决赛'}) // 获取赛事信息
        this.getBattleInfo() // 获取battle信息
      }
      else if (auditionStatus == 1 || (auditionStatus == 2 && battleStatus == 0)) {
        type = 'audition'
        this.getEventItem({id:itemId, title: '海选赛'})
        this.getAuditionList()
      }
      this.setData({
        itemNum: itemNum,
        currentItemStatus: type // 当前展示对决赛/海选
      })
    })
  },
  // 4.获取赛事信息
  getEventItem(info) {
    // userid用itemuserid
    let param = {
      eventId: this.data.eventId,
      itemId: info.id
    } // 测试用
    api.post('room/event/getEventItem', param).then(res => {
      if (res) {
        this.setData({
          raceName: `${info.title} - ${res.itemName}`,
        })
      }
    })
  },
  // 海选接口
  // 海选列表
  getAuditionList(fn) {
    let param = {eventId: this.data.eventId, itemId: this.data.itemId} // 测试用
    api.post('room/event/getUserRecordList', param).then(res => {
      if (res) {
        let currentRank = 99
        let finished = true
        // 排名
        let arr = res.sort((a, b) => {
          return b.totalScore - a.totalScore
        })
        // 获取当前排名
        arr.forEach((ele, index) => {
          if (ele.itemUserId == this.data.itemUserId) {
            currentRank = index
          }
          if (!ele.totalScore && ele.totalScore !== 0) {
            finished = false
          }
        });
        this.setData({
          auditionPlayerList: arr,
          currentRank: currentRank,
          auditionFinish: finished
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
  getAllNodes() {
    // id = '001' // 测试
    let id = this.data.eventId //this.data.eventId
    api.post('node/eventAllNode', {id: id, userId: wx.getStorageSync('openid')}).then(res => {
      let list = []
      for (let i = 0; i < res.length; i++) {
        list.push({
          name: res[i].nodeName
        })
      }
      this.setData({
        processList: list
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      eventId: options.eventId
    })
    this.getEventList() // 当前选手的赛事列表用于左右切换
  },
})