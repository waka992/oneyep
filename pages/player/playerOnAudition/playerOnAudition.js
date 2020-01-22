// 当前是海选查看成绩
import api from '../../../api/api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ranking: '?',
    name: '陈某',
    status: 0, // 0未开始
    describe: '您未参与此项，请等待',
    raceName: '海选赛-HipHop',
    time: '12:25-12:55',
    hasPrev: false,
    hasNext: true,
    showRankList: false, // 展开海选名单
    showFinalRankList: false, // 展开battle名单
    itemUserId: '', // 当前选手id
    rating: false, // 比赛是否进行中
    playerList: [],
    group: 0,
    chosenGroup: {}, // 当前查看组
  },
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  openRankList() {
      this.setData({
        showRankList: true
      })
  },
  toNext() {

  },
  toPrevious() {

  },
  raceNoHandler(num) {
    switch(num) {
      case 1:
          this.setData({
            rating: false,
          })
          break
      case 2:
          this.setData({
            rating: true
          })
          break
      case 3:
          this.setData({
            rating: false,
          })
        break
    }
  },
  // 获取battle列表
  getBattleList() {
    let param = {eventId: 1, itemId: 1, judgeId: 1} // 测试用
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
        // let leftInfo = groups[this.data.round].battleLeft
        // let rightInfo = groups[this.data.round].battleRight
        console.log(groups[0]);
        this.setData({
          playerList: groups,
          group: x,
          chosenGroup: groups[0]
          // leftInfo: leftInfo,
          // rightInfo: rightInfo,
        })
        // fn && fn()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBattleList()
  },
})