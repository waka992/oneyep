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

module.exports = {
   get,
   post,
   put,
   remove
}