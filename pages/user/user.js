// pages/user/user.js
let app = getApp().globalData;
import api from '../../api/api'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasInfo: false,
    avatar: '/images/icon/icon-user.png',
    username: '点击登录',
    raceList: [
      // {
      // id: 0,
      // picUrl: '/images/race-list1.png',
      // eventName: '要你好看',
      // beginTime: '2019/10/29',
      // endTime: '2019/11/1',
      // address: '四川 成都市金牛区',
      // flowStatus: 0 // 0未开始 1进行中
      // },
    ],
    sheetTitle: '您在该活动中有多个角色，请选择您要进入的页面',
    showActionsheet: false,
    staticGroups: [
      { text: '总控', value: 0, icon: '/images/icon/member-icon.png' },
      { text: '组长', value: 1, icon: '/images/icon/leader-icon.png' },
      { text: '组员', value: 2, icon: '/images/icon/member-icon.png' },
      { text: '裁判', value: 3, icon: '/images/icon/judge-icon.png' },
      { text: '选手', value: 4, icon: '/images/icon/player-icon.png' },
    ], // 固定组用于筛选groups
    groups: [],
    returnIdentity: [], // 返回的身份列表
    page: 0,
    totalList: 0,
    timer: null,
  },
  // 授权界面
  auth() {
    // 已经授权
    if (this.data.hasInfo) {
      return
    }
    wx.navigateTo({
      url: '/pages/authorization/authorization',
    });
  },
  // 展示角色列表
  showDetail(e) {
    let id = e.detail.id
    let param = {id: id, userId: wx.getStorageSync('openid')}
    // return
    api.post('event/identity', param).then(res => {
      this.setData({
        returnIdentity: res
      })
      // 只有一个角色直接进入
      if (res.length == 1) {
        let e = {
          detail: {value: res[0].type}
        }
        this.sheetSelect(e)
        return
      }
      let arr = []
      // 从staticGroups中匹配type
      for (let i = 0; i < res.length; i++) {
        const ele = res[i];
        arr.push(this.data.staticGroups[Number(ele.type)])
      }
      this.setData({
        groups: arr
      })
      this.openIdentify()
    })
  },
  // 关闭角色列表
  sheetClose: function () {
    this.setData({
        showActionsheet: false
    })
  },
  // 选择赛事
  sheetSelect(e) {
    let roleid = ''
    let eventid = ''
    this.sheetClose()
    let groupVal = Number(e.detail.value)
    // 从列表中获取roleid和赛事id
    for (let i = 0; i < this.data.returnIdentity.length; i++) {
      const ele = this.data.returnIdentity[i];
      if (ele.type == groupVal) {
        roleid = ele.id
        eventid = ele.eventId
        break
      }
    }
    switch(groupVal) {
      // 总控
      case 0:
          wx.navigateTo({
            url: `/pages/masterCtrl/masterCtrl?roleId=${roleid}&id=${eventid}&groupVal=${groupVal}`,
          })
        break
      // 组长
      case 1:
          wx.navigateTo({
            url: `/pages/masterCtrl/masterCtrl?roleId=${roleid}&id=${eventid}&groupVal=${groupVal}`,
          })
        break
      // 组员
      case 2:
          wx.navigateTo({
            url: `/pages/masterCtrl/masterCtrl?roleId=${roleid}&id=${eventid}&groupVal=${groupVal}`,
          })
        break
      // 裁判
      case 3:
          wx.navigateTo({
            url: `/pages/referee/referee?isComplete=false&id=${eventid}`,
          })
        break
      // 选手
      case 4:
          wx.navigateTo({
            url: `/pages/player/playerOn/playerOn?eventId=${eventid}`,
          })
        break
    }
  },
  // 选择身份
  openIdentify() {
    this.setData({
      showActionsheet: true
    })
  },
  // 登录
  login (callback) {
    let self = this
    wx.showLoading()
    wx.login({
      success (res) {
        if (res.code) {
          // 登录成功，获取用户信息
          self.backendLogin(res.code)
        } else {
          // 否则弹窗显示，showToast需要封装
          // showToast()
        }
      },
      fail () {
        // showToast()
      }
    })
  },
  
  // 调用后台登录接口
  backendLogin(code) {
    let self = this
    api.post('wx/login', {code: code}).then((res) => {
      wx.setStorageSync('sessionKey', res.session_key);
      app.sessionKey = res.session_key
      wx.hideLoading();

      self.checkAuthorization()
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sessionKey = wx.getStorageSync('sessionKey');
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log(1);
    this.setData({
      page: 0,
      raceList: []
    })
    this.getList()
  },
  // 查询授权
  checkAuthorization() {
    let that = this
    wx.getSetting({
      success: function (res) {
          if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                  success: function (res) {
                    console.log(res);
                    that.setData({
                      avatar: res.userInfo.avatarUrl,
                      username: res.userInfo.nickName
                    })
                    let {signature, rawData, encryptedData, iv} = res
                    let sessionKey = wx.getStorageSync('sessionKey')
                    api.post('getUserInfo', {
                      signature: signature,
                      rawData: rawData,
                      encryptedData: encryptedData,
                      iv: iv,
                      sessionKey: sessionKey,
                    }).then((res) => {
                      if (res && res.openId) {wx.setStorageSync('openid', res.openId);}
                      if (that.data.raceList.length == 0) {
                        that.getList()
                      }
                      wx.hideLoading();
                    }).catch((error) => {
                      console.log(error);
                    })
                  }
              });
          }
      }
    })
  },
  // 获取赛事列表
  getList() {
    let userId = wx.getStorageSync('openid')
    if (!userId) {
      return
    }
    wx.showLoading({
      title: 'loading',
      mask: true,
    });
    let that = this
    api.post('event/myList', {
      page: this.data.page,
      pageSize: 10,
      userId: userId
    }).then(res => {
      let arr = res.records
      arr.forEach(ele => {
        ele.beginTime = ele.beginTime.slice(0, 10)
        ele.endTime = ele.endTime.slice(0, 10)
      });
      let orginArr = that.data.raceList
      orginArr.push(...arr)
      that.setData({
        totalList: res.total, 
        raceList: orginArr,
      })
      wx.stopPullDownRefresh()
      wx.hideLoading();
    })
  },
  // 底部加载更多
  getMoreList() {
    let {totalList, raceList, page} = this.data
    if (totalList <= raceList.length) {return}
    this.setData({
      page: Number(page) + 1,
    })
    this.debounceGetList()
  },
  // 获取赛事列表
  debounceGetList() {
    clearTimeout(this.data.timer)
    let timer = setTimeout(() => {
      this.getList()
    }, 1000)
    this.setData({
      timer: timer
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 切换tabbar
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    if (wx.getStorageSync('sessionKey')) {
      this.checkAuthorization()
    }
    let that = this
    // 查看是否授权
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        let sessionKey = wx.getStorageSync('sessionKey');
        if (!sessionKey) {
          that.login()
        }
        // 获取配置
        wx.getSetting({
          success: (res)=>{
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: function (res) {
                  that.setData({
                    hasInfo: true,
                    avatar: res.userInfo.avatarUrl,
                    username: res.userInfo.nickName
                  })
                }
              })
            }
            else {
              that.setData({
                hasInfo: false
              })
            }
          },
        });
      },
      fail () {
        console.log('session_key 已经失效，需要重新执行登录流程');
        // session_key 已经失效，需要重新执行登录流程
        that.login() //重新登录
      }
    })
  },
  onLoad: function() {
    this.getList()
  }
})