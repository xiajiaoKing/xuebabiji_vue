/** ----------------------------------------
 * 角色服务模块
 * ---------------------------------------------- */
import hydlAxios from '@/widgets/hydlAxios.js'
import apis from '@/sapis/sys'
import qs from 'qs'

function findAll() {
  return hydlAxios.axios.get(apis.role.findAll)
}

function page(pageNum, limit, roleCode, roleName) {
  return hydlAxios.axios.post(apis.role.page, qs.stringify({
    pageNum, limit, roleCode, roleName
  }))
}

function save(role) {
  return hydlAxios.axios.post(apis.role.save, qs.stringify(role))
}

function remove(id) {
  return hydlAxios.axios.post(apis.role.remove, qs.stringify({id}))
}


export default {
  findAll, save, remove, page
}
