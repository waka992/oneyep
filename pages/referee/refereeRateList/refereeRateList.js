// pages/referee/refereeRateList/refereeRateList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playerList: {type: Array, default: []}
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 1未评分， 2已评分
  },

  /**
   * 组件的方法列表
   */
  methods: {
    select(e) {
      this.triggerEvent('select', e.currentTarget.dataset.selectindex)
    }
  }
})
