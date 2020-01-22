// pages/player/playerOn/pairFinal/pairFinal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playerInfo: {type: Object, value: {}}
  },

  /**
   * 组件的初始数据
   */
  data: {
    playerInfo1: {
      img: '',
      status: 0, // 0 lose，1 win，2 unknow 3 again
      group: 'B1'
    },
    playerInfo2: {
      img: '',
      status: 1,
      group: 'B2'
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
