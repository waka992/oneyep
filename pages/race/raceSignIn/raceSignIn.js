// pages/race/raceSignIn/raceSignIn.js
import api from '../../../api/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    imgSrc: '/images/race-detail.png',
    raceTitle: '',
    raceTime: '',
    startTime: '',
    endTime: '',
    raceAddress: '',
    raceDetail: '',
    eventId: '',
  },
  getQueryVariable(url, variable) {
        let qsmI = url.indexOf('?')
        let query = url.slice(qsmI).substr(1)
        let vars = query.split("&");
        for (let i=0;i<vars.length;i++) {
                let pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
        }
        return(false);
  },
  // 返回
  onBack() {
    wx.switchTab({
        url: '/pages/user/user'  
    })
  },
  // 签到
  signIn() {
    let phone = wx.getStorageSync('phone');
    if (!phone) {
      wx.navigateTo({
        url: '/pages/authorizationPhone/authorizationPhone',
      });
      return
    }
    let param = {
      phone: wx.getStorageSync('phone'),
      openId: wx.getStorageSync('openid'),
      eventId: this.data.eventId,
    }
    api.post('event/sign', param).then(res => {
      wx.showToast({
        title: '签到成功',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.q) {
      let q = decodeURIComponent(options.q)
      let id = this.getQueryVariable(q, 'eventId')
      this.setData({
        eventId: id
      })
      this.getData(id)
    }
 
  },
  getData(id) {
    // wx.showLoading({
    //   mask: true,
    // });
    api.post('event/eventDetail', {id: id, userId: id}).then((res) => {
      let {eventName, address, beginTime, endTime, flowStatus, picture, description} = res
      this.setData({
        raceTitle: eventName,
        raceAddress: address,
        startTime: beginTime.slice(0, 10),
        endTime: endTime.slice(0, 10),
        status: Number(flowStatus),
        imgSrc: picture,
        raceDetail: description,
        id: id,
      })
      wx.hideLoading()
    })
  },
})