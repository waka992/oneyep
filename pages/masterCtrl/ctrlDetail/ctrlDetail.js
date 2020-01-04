// pages/masterCtrl/ctrlDetail/ctrlDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {type: Boolean, value: false}
  },

  /**
   * 组件的初始数据
   */
  data: {
    nodeList: [
      {event: '选手签到', startTime: '11:00', duration: '1\'00"'},
      {event: '选手签到', startTime: '11:00', duration: '1\'00"'},
      {event: 'MC开场', startTime: '11:00', duration: '1\'00"'},
      {event: 'HipHop2on2海选', startTime: '11:00', duration: '1\'00"'},
      {event: 'HipHop2on2海选', startTime: '11:00', duration: '1\'00"'},
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDetail(e) {
      console.log(e);
      this.triggerEvent('showNode', e)
    },
    close() {
      this.setData({
        show: false
      })
    }
  }
})
