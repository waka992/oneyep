// pages/race/raceSignUp/raceSignUp.js
import api from '../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '本活动分为三个比赛项目，您可以选择您擅长的项目进行报名，或者同时挑战多个项目，您点击报名后填写参赛选手信息再支付，支付完成后该项目完成报名，如需报多项，则返回项目列表页再次报名其他项目。',
    title: '购票须知',
    programs: [
      {
      name: 'HipHop',
      color: '#1D8E8A',
      status: 1,
      raceId: 0
      },
    ]
  },
  // 点击报名
  signUp (evt) {
    console.log(evt.currentTarget)
    let {raceid, status} = evt.currentTarget.dataset
    if (status == 1) {
      wx.navigateTo({
        url: '/pages/playerInfoForm/playerInfoForm?raceId=' + raceid,
      });
    }
  },
  // 返回
  onBack:() => {
    wx.navigateBack({
      delta: 1
    })
  },
  getData(id) {
    wx.showLoading({
      mask: true,
    });
    let openid = wx.getStorageSync('openid')
    let params = {id:id, userId:openid ? openid : id}
    api.post('event/eventItemList', params).then((res) => {
      console.log(res);
      let {itemList, reportedItems} = res
      let arr = reportedItems ? reportedItems : []
      for (let i = 0; i < itemList.length; i++) {
        const ele = itemList[i];
        if(arr.indexOf(ele.id) === -1) {
          ele._status = 1 // 未报名
        }
        else {
          ele._status = 2
        }
      }
      this.setData({
        programs: itemList
      })
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onshow');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})