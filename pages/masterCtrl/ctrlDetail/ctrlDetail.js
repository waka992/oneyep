// pages/masterCtrl/ctrlDetail/ctrlDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {type: Boolean, value: false},
    nodeList: {type: Array, value: []},
    animationData: null,
    groupVal: {type: Number, value: ''}
  },

  /**
   * 组件的初始数据
   */
  data: {
    // nodeList: [
    //   {nodeName: '选手签到', beginTime: '11:00', duration: '1\'00"'},
    // ]
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
    showDetail(e) {
      console.log(e);
      this.triggerEvent('showNode', e)
    },
    close() {
      this.triggerEvent('closeNode')
    },
    // 操作节点
    operate(e) {
      this.triggerEvent('operate', e.currentTarget.dataset.type)
      this.close()
    }
  }
})
