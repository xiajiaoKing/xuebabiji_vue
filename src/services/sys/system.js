import qs from 'qs'
import server from '@/widgets/hydlAxios.js'

// 定时任务  获取用户权限
function timing(userId) {
  return server.axios.post('/sys/quartz/getQuartzByUser', qs.stringify({
    userId
  }))
}


// 定时更新
function timeUpdate(obj) {
  return server.axios.post('/sys/quartz/updateQuartz', obj)
} // 获取菜单所有
function findAll() {
  return server.axios.post('/sys/menu/find/all')
} // 菜单保存
function save(obj) {
  return server.axios.post('/sys/menu/edit', qs.stringify(obj))
} // 删除菜单
function remove(id) {
  return server.axios.post('/sys/menu/delete', qs.stringify({
    id
  }))
} // 获取当前用户菜单权限
function serve_billAdministration() {
  return server.axios.post('/sys/menu/find/all/judge')
}

/** ************************************   角色     ************************************************************************/
// 获取角色列表
function role_page(obj) {
  return server.axios.post('/sys/role/page', qs.stringify(obj))
} // 保存权限接口
function role_save(obj) {
  return server.axios.post('/sys/role/edit', qs.stringify(obj))
} // 删除
function role_del(id) {
  return server.axios.post('/sys/role/delete', qs.stringify({
    id
  }))
}

// 保存菜单
function role_saveMenu(roleId, ids) {
  return server.axios.post('/sys/menu/save/menu/roles', qs.stringify({
    roleId,
    ids
  }))
} // 获取角色的树形数据权限列表
function roleList(roleId) {
  return server.axios.post('/sys/menu/role/list', qs.stringify({
    roleId
  }))
}

// 点击角色时去拿该角色有什么权限
function role_findAll() {
  return server.axios.get('/sys/menu/find/all')
}

export default {
  timing,
  timeUpdate,
  findAll,
  save,
  remove,
  serve_billAdministration,
  // 角色管理
  role_page,
  role_save,
  role_del,
  role_saveMenu,
  roleList,
  role_findAll
}
