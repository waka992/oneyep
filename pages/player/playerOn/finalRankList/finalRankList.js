// pages/player/playerOn/finalRankList/finalRankList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {type: Boolean, default: true},
    rankList: {type: Array, default: []},
  },

  /**
   * 组件的初始数据
   */
  data: {
    raceName: '对决赛-FreeStyle16进8',
    isWin: false,
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
