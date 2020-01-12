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
    content: '',
    animationData: null
  },
  lifetimes: {
    attached: function() {
      this.showPicker()
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function() {
    this.showPicker()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showPicker() {
      var that = this;
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease'
      })
      that.animation = animation
      animation.translateY(200).step()
      that.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export()
        })
      }, 50)
    },
    release(evt) {
      console.log(this.data.content);
      this.triggerEvent('release', {content: this.data.content})
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
