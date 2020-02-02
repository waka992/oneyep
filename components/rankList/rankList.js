// components/rankList/rankList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {type: Boolean, default: false},
    title: {type: String, default: ''},
    playerList: {type: Array, default: []},
    currentRank: {type: Number, default: 99}
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
    },

  }
})
