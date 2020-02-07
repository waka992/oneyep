// pages/referee/refereeBattle/refereeBattleList/refereeBattleList.js
import api from '../../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group: 0, // x强
    playerList: [],
    raceName: ''
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
        let {group} = this.data
        let groups = []
        for (const key in res[group]) {
            const element = res[group][key];
            groups.push(element)
        }
        this.setData({
          playerList: groups,
        })
        // fn && fn()
      }
    })
  },
  // 选中组并跳转页面
  toTargetPage(e) {
    let round = e.currentTarget.dataset.round
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[ pages.length - 2 ];  
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    let {playerList} = this.data
    let leftInfo = playerList[round - 1].battleLeft
    let rightInfo = playerList[round - 1].battleRight
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      leftInfo: leftInfo,
      rightInfo: rightInfo,
    })
    wx.navigateBack({ delta: 1 })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    try{
      let param = JSON.parse(options.param)
      this.getBattleList(param)
      this.setData({
        raceName: options.raceName,
        group: options.group,
      })
    }
    catch(err) {
      console.log(err);
    }
  },
})