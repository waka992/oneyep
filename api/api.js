const app = getApp()

const request = (url, options) => {
   return new Promise((resolve, reject) => {
       wx.request({
           url: `${app.globalData.url}${url}`,
           method: options.method,
           data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
           header: {
               'Content-Type': 'application/json; charset=UTF-8',
            //    'x-token': 'x-token'  // 看自己是否需要
           },
           success(request) {
               if (request.data && request.data.code == 1) {
                   resolve(request.data.data)
               } else {
                   console.log('reject function');
                   if (request.data) {
                    wx.showToast({
                        title: request.data.desc,
                        icon: 'none',
                        duration: 1500,
                    });
                    return
                   }
                   reject(request.data)
               }
           },
           fail(error) {
               console.error(error);
               reject(error)
           }
       })
   })
}

const get = (url, options = {}) => {
   return request(url, { method: 'GET', data: options })
}

const post = (url, options) => {
   return request(url, { method: 'POST', data: options })
}

const put = (url, options) => {
   return request(url, { method: 'PUT', data: options })
}

// 不能声明DELETE（关键字）
const remove = (url, options) => {
   return request(url, { method: 'DELETE', data: options })
}

  // 登录操作
const login = (fn) => {
    wx.login({
      success (res) {
        if (res.code) {
          // 登录成功，获取用户信息
          console.log('login');
          backendLogin(res.code, fn)
        // fn && fn()
        } else {
          // showToast()
        }
      },
      fail () {
        // showToast()
      }
    })
}

  // 调用后台登录接口
const backendLogin = (code, fn) => {
    post('wx/login', {code: code}).then((res) => {
      wx.setStorageSync('sessionKey', res.session_key);
      wx.setStorageSync('openid', res.openid);
      fn && fn()
      wx.hideLoading();
    })
}

module.exports = {
   get,
   post,
   put,
   remove,
   login
}