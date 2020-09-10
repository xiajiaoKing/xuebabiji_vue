/** ----------------------------------------
 * 部分服务模块
 * ---------------------------------------------- */
import hydlAxios from '@/widgets/hydlAxios.js'
import apis from '@/sapis/sys'
import qs from 'qs'

function findAll() {
  return hydlAxios.axios.get(apis.department.findAll)
}

function page(pageNum, limit) {
  return hydlAxios.axios.post(apis.department.page, qs.stringify({
    pageNum,
    limit
  }))
}

function save(department) {
  return hydlAxios.axios.post(apis.department.save, qs.stringify(department))
}

function remove(id) {
  return hydlAxios.axios.post(apis.department.remove, qs.stringify({
    id
  }))
}

function get(id) {
  return hydlAxios.axios.post(apis.department.get, qs.stringify({
    id
  }))
}

function findByParentId(parentId) {
  return hydlAxios.axios.post(apis.department.findByParentId, qs.stringify({
    parentId
  }))
}

function byIdListFindName(idList) {
  return hydlAxios.axios.post(apis.department.byIdListFindName, qs.stringify({
    idList
  }))
}

function findAllToPersons() {
  return hydlAxios.axios.post(apis.department.findAllToPersons)
}

function findRootCompany() {
  return hydlAxios.axios.post(apis.department.findRootCompany)
}

function findSecondOrThreeData(companyId) {
  return hydlAxios.axios.post(apis.department.findSecondOrThreeData, qs.stringify({
    companyId
  }))
}

function findFristLevelData() {
  return hydlAxios.axios.post(apis.department.findFristLevelData)
}

function findListByFristId(parentId) {
  return hydlAxios.axios.post(apis.department.findListByFristId, qs.stringify({
    parentId
  }))
}

export default {
  findAll,
  page,
  save,
  remove,
  get,
  findByParentId,
  byIdListFindName,
  findAllToPersons,
  findRootCompany,
  findSecondOrThreeData,
  findFristLevelData,
  findListByFristId
}
