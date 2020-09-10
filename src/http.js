import axios from 'axios'
import router from './router'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {

  return config
}, function (error) {

  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {

  // 判断用户登录状态是否过期
  if (response.data.msg === '没有此token') {
    router.push({
      path: '/login'
    })
  }
  if (response.data.status === 403) {
    router.push({
      path: '/login'
    })
  }
  return response
}, function (error) {
  if (error.response.status === 401) {
    router.push({
      path: '/login'
    })
  }
  if (error.response.status === 504) {
    router.push({
      path: '/login'
    })
  }
  return Promise.reject(error)
})
