// pages/nodeCtrl/releaseDialog/releaseDialog.js
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
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    release(evt) {
      console.log(this.data.content);
      this.triggerEvent('close')
    },
    contentChange(evt) {
      this.setData({
        content: evt.detail.value
      })
    },
    close() {
      this.triggerEvent('close')
    }
  }
})
