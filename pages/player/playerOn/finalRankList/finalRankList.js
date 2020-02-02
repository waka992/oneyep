// pages/player/playerOn/finalRankList/finalRankList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {type: Boolean, default: true},
    playerList: {type: Array, default: []},
    title: {type: String, default: ''},
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        show: false
      })
    }
  }
})
