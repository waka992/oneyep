// pages/referee/refereeBattle/refereeBattleList/refereeBattleList.js
import api from '../../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group: 0, // x强
    playerList: []
  },
  backToRefereeBattle() {
    wx.navigateBack({
      delta: 1
    });
  },
  // 获取battle列表
  getBattleList(param) {
    api.post('room/event/getBattleGroupMap', param).then(res => {
      if (res) {
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
        let x = 0
        if (Object.keys(res) && Object.keys(res)[0]) {
          x = Number(Object.keys(res)[0])
        }
        this.setData({
          group: x,
          playerList: groups,
        })
        // fn && fn()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let param = JSON.parse(options.param)
    this.getBattleList(param)
  },
})