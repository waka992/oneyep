// pages/player/playerOn/finalRankList/finalRankList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {type: Boolean, default: true}
  },

  /**
   * 组件的初始数据
   */
  data: {
    raceName: '对决赛-FreeStyle16进8',
    isWin: false,
    rankList: [
      { group1: 'A1', group2: 'A2', winner: 'A1'},
      { group1: 'A1', group2: 'A2', winner: 'A1'},
      { group1: 'A1', group2: 'A2', winner: 'A2'},
      { group1: 'A1', group2: 'A2', winner: 'A1'},
      { group1: 'A1', group2: 'A2', winner: 'A2'},
      { group1: 'A1', group2: 'A2', winner: 'A1'},
      { group1: 'G1', group2: 'G2', winner: 'G2'},
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      console.log('close')
      this.setData({
        show: false
      })
    }
  }
})
