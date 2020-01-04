// components/rankList/rankList.js
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
    raceName: '海选赛-FreeStyle',
    rank: 4,
    rankList: [
      {rank: 1, playerNo: 1, rage: 97},
      {rank: 2, playerNo: 1, rage: 97},
      {rank: 3, playerNo: 1, rage: 97},
      {rank: 4, playerNo: 1, rage: 97},
      {rank: 5, playerNo: 1, rage: 97},
      {rank: 6, playerNo: 1, rage: 97},
      {rank: 7, playerNo: 1, rage: 97},
      {rank: 8, playerNo: 1, rage: 97},
      {rank: 9, playerNo: 1, rage: 97},
      {rank: 10, playerNo: 1, rage: 97},
      {rank: 11, playerNo: 60, rage: 97},
      {rank: 11, playerNo: 60, rage: 97},
      {rank: 11, playerNo: 66, rage: 97},
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
    },

  }
})
