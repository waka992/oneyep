// pages/race/raceListCompo/raceList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    raceList: {
      type: Array,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    raceList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDetail(evt) {
      let id = evt.currentTarget.dataset.id
      console.log(id);
      this.triggerEvent('showDetail', {id: id})
      // wx.navigateTo({
      //   url: '/pages/race/raceDetail/raceDetail?id=' + id,
      // })
    }
  }
})
