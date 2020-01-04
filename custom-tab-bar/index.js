Component({
  data: {
    selected: '',
    color: "#6D6D6D",
    selectedColor: "#fff",
    backgroundColor: "#303030",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/tab/home.png",
      selectedIconPath: "/images/tab/home-hl.png",
      text: "首页"
    }, {
      pagePath: "/pages/user/user",
      iconPath: "/images/tab/user.png",
      selectedIconPath: "/images/tab/user-hl.png",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      console.log(
        data.index
      )
      this.setData({
        selected: data.index
      })
    }
  }
})