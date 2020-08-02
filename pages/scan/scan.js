// pages/scan/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getCode(e) {
      console.log('扫码成功得到的结果', e);
      console.log('扫码成功,期望值', e.detail.result);
      wx.showToast({
        title: '扫码成功',
      })
      let that = this;
      // that.setData({
      //   cameraOpen: false,
      //   result: e.detail.result
      // })
  },
  error(e) {
    console.log(e.detail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.scanCode({
    //   onlyFromCamera: false,
    //   scanType: ['qrCode','barCode','datamatrix','pdf417'],
    //   success: (result)=>{
    //     console.log(1);
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });
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
})