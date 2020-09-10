/**
 * create by : TenzeTseng
 * 登录服务模块
 */
import hydlAxios from '@/widgets/hydlAxios.js'
import qs from 'qs'
import loginApi from '@/sapis/login.js'
import domain from '@/domain.js'

/** 登录操作 */
function doLogin(username, password, code) {
  return hydlAxios.axios
    .post(loginApi.doLogin, qs.stringify({
      username, password, code
    }))
}

/** 获取验证码 */
function getVerifyCode() {
  return `${domain.url}${loginApi.getVerifyCode}?date=${Math.random()}`
}

/** 获取验证码 */
function getStatus() {
  return hydlAxios.axios.get(loginApi.getStatus)
}

function doLogout() {
  return hydlAxios.axios.post(loginApi.doLogout)
}

export default {
  doLogin, getVerifyCode, getStatus, doLogout
}
