// pages/nodeCtrl/nodeOperate/nodeOperate.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {type: Boolean, value: false},
    operateList: {type: Array, value: []},
  },

  /**
   * 组件的初始数据
   */
  data: {
    // operateList: [
    //   {imgSrc:'/images/icon/icon-start.png', word: '开始'}, 
    //   {imgSrc:'/images/icon/icon-urge.png', word: '催办'},
    //   {imgSrc:'/images/icon/icon-reback.png', word: '回滚'},
    //   {imgSrc:'/images/icon/icon-end.png', word: '结束'},
    //   {imgSrc:'/images/icon/icon-share.png', word: '分享'},
    // ],
    // operateList3: [
    //   {imgSrc:'/images/icon/icon-start.png', word: '开始'}, 
    //   {imgSrc:'/images/icon/icon-end.png', word: '结束'},
    //   {imgSrc:'/images/icon/icon-feedback.png', word: '反馈'},
    // ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    doTask(evt) {
      console.log(evt);
      this.triggerEvent('operate', {word: evt.currentTarget.dataset.task})
      this.triggerEvent('close')
    },
    close() {
      this.triggerEvent('close')
    }
  }
})
