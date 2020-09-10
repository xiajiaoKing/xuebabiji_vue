/** ----------------------------------------
 * 菜单服务模块
 * ---------------------------------------------- */
import hydlAxios from '@/widgets/hydlAxios.js'
import apis from '@/sapis/sys'
import qs from 'qs'
import {link} from 'fs';

function findAll() {

  return hydlAxios.axios.post(apis.menu.findAll, qs.stringify())
}

function page(pageNum, limit, name) {
  return hydlAxios.axios.post(apis.menu.page, qs.stringify({
    pageNum, limit, name
  }))
}

function save(menu) {
  return hydlAxios.axios.post(apis.menu.save, qs.stringify(menu))
}

function addMenu(menu) {
  return hydlAxios.axios.post(apis.menu.addMenu, qs.stringify(menu))
}

function removeHistory(pageNum, limit, name) {
  return hydlAxios.axios.post(apis.menu.removeHistory, qs.stringify({pageNum, limit, name}))
}

function returnRecord(ids, parentId) {
  return hydlAxios.axios.post(apis.menu.returnRecord, qs.stringify({ids, parentId}))
}

function menuInfo(id) {
  return hydlAxios.axios.post(apis.menu.menuInfo, qs.stringify({id}))
}

function menuSelect(parentId) {
  return hydlAxios.axios.post(apis.menu.menuSelect, qs.stringify({parentId}))
}

function visiable(id, isVisible) {
  return hydlAxios.axios.post(apis.menu.visiable, qs.stringify({id, isVisible}))
}

function remove(ids) {
  return hydlAxios.axios.post(apis.menu.remove, qs.stringify({ids}))
}

function getSort(parentId) {
  return hydlAxios.axios.post(apis.menu.getSort, qs.stringify({parentId}))
}

function isSameName(parentId, menuName, menuId) {
  return hydlAxios.axios.post(apis.menu.isSameName, qs.stringify({parentId, menuName, menuId}))
}


export default {
  findAll, save, isSameName, addMenu, page, remove, returnRecord, removeHistory, visiable, menuInfo, menuSelect, getSort
}
