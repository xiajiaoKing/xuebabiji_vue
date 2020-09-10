/** ----------------------------------------
 * 用户服务模块
 * ---------------------------------------------- */
import hydlAxios from '@/widgets/hydlAxios.js'
import apis from '@/sapis/sys'
import qs from 'qs'

function page(pageNum, limit, userName, realName) {
  return hydlAxios.axios.post(apis.user.page, qs.stringify({
    pageNum, limit, userName, realName
  }))
}

function remove(id) {
  return hydlAxios.axios.post(apis.user.remove, qs.stringify({id}))
}

function batchRemove(ids) {
  return hydlAxios.axios.post(apis.user.batchRemove, qs.stringify({ids}))
}

function save(user) {
  return hydlAxios.axios.post(apis.user.save, qs.stringify(user))
}

function get(id) {
  return hydlAxios.axios.post(apis.user.getUserTree, {})
}

function userTree() {
  return hydlAxios.axios.post()
}

function updataPassword(obj) {
  return hydlAxios.axios.post(apis.user.updataPassword, qs.stringify(obj))
}

function initPassword(id) {
  return hydlAxios.axios.patch(apis.user.initPassword, qs.stringify({id}))
}

export default {
  page, remove, save, get, userTree, updataPassword, batchRemove, initPassword
}
