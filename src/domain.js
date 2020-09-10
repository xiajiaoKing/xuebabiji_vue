// 配置全局接口域名
'use strict'
const domain = '/api' // 跨域请求url,正式:'',测试:'http://localhost:8088/api'
//const target = 'http://192.168.43.75:10011' // 后台跨域请求地址
const target = 'http://localhost:9998'
module.exports = {
  url: domain,
  target: target
}
