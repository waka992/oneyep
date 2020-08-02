// components/process/process.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {type: Boolean, default: false},
    list: {type: Array, default: []},
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
    judge(i) {
      return i === this.data.list.length
    },
    close() {
      this.setData({
        show: false
      })
    },
  }
})
