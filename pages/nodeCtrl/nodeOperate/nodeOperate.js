// pages/nodeCtrl/nodeOperate/nodeOperate.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {type: Boolean, value: false},
    operateList: {type: Array, value: []},
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
   * 组件的初始数据
   */
  data: {
    animationData: null
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
      animation.translateY(300).step()
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
    doTask(evt) {
      console.log(evt);
      this.triggerEvent('operate', {type: evt.currentTarget.dataset.type})
      this.triggerEvent('close', )
    },
    close() {
      this.triggerEvent('close', '')
    }
  }
})
