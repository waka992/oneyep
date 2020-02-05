// pages/referee/refereeRateList/refereeRateList.js
import api from '../../api/api';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemId: {type: String, default: ''},
    eventId: {type: String, default: ''}
  },

  /**
   * 组件的初始数据
   */
  data: {
    pickList: {},
    playerList: [],
  },

  lifetimes: {
    attached: function() {
      // 页面被展示
      this.getRepickList()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取重选人员名单
    getRepickList(id) {
      let param = {
        eventId: this.data.eventId,
        itemId: this.data.itemId,
        isPick: 1, // 海选是否被选中 0 没有被选上 1待重选 2选中
        // isPick: 2,
        // eventId: 1,
        // itemId: 1,
      } 
      api.post('/room/event/getPickList', param).then(res => {
        // 打开重选列表
        this.setData({
          playerList: res
        })
      })
    },
  
    chose(e) {
      let obj = this.data.pickList
      let index = e.currentTarget.dataset.index
      // 有的去掉
      if (obj[index] === undefined) {
        obj[index] = true
      }
      else if (obj[index]) {
        obj[index] = false
      }

      this.setData({
        pickList: obj
      })
    },
    // 确认被选中人
    confirm() {
      let that = this
      let list = this.data.pickList
      let arr = []
      for (const key in list) {
        if (list.hasOwnProperty(key)) {
          const ele = list[key];
          // true的时候才添加
          if (ele) {
            arr.push(Number(key))
          }
        }
      }
      let res = this.data.playerList.filter((ele, index) => {
        return arr.indexOf(index) !== -1
      })
      let resIds = []
      res.forEach(ele => {
        resIds.push(ele.itemUserId)
      });
      if (resIds.length == 0) {
        that.triggerEvent('close')
        return
      }
      let param = {
        bestSize: 16,
        eventId: this.data.eventId,
        itemId: this.data.itemId,
        userIds: resIds
      }
      api.post('/room/event/repeatPickToChoose', param).then(res => {
        that.triggerEvent('close')
      }).catch(err => {
        wx.showToast({
          title: err.desc,
          icon: 'none',
          duration: 1500,
        });
      })
    },
  }
})
