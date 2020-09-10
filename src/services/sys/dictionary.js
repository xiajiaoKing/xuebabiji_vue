/** ----------------------------------------
 * 字典服务模块
 * ---------------------------------------------- */
import hydlAxios from '@/widgets/hydlAxios.js'
import apis from '@/sapis/sys'
import qs from 'qs'

function findAll() {
  return hydlAxios.axios.get(apis.dictionary.findAll)
}

function findType(dictName) {
  return hydlAxios.axios.post(apis.dictionary.findType, qs.stringify(dictName))
}

function dictAll(pageNum, limit, dictName) {
  return hydlAxios.axios.post(apis.dictionary.dictAll, qs.stringify({pageNum, limit, dictName}))
}

function getCode(dictName) {

  return hydlAxios.axios.post(apis.dictionary.getCode, qs.stringify({dictName}))
}


function page(pageNum, limit, parentId, dictName) {
  return hydlAxios.axios.post(apis.dictionary.page, qs.stringify({
    pageNum, limit, parentId, dictName
  }))
}

function save(dictionary) {
  return hydlAxios.axios.post(apis.dictionary.save, qs.stringify(dictionary))
}

function remove(id) {
  return hydlAxios.axios.post(apis.dictionary.remove, qs.stringify({id}))
}

function removeType(id) {
  return hydlAxios.axios.post(apis.dictionary.removeType, qs.stringify({id}))
}

function findByParent(parentId) {
  return hydlAxios.axios.post(apis.dictionary.findByParent, qs.stringify({parentId}))
}

function findCode(code) {
  return hydlAxios.axios.post(apis.dictionary.findCode, qs.stringify({code}))
}

function getSort(id) {
  return hydlAxios.axios.post(apis.dictionary.getSort, qs.stringify({id}))
}


export default {
  findAll, findType, getCode, dictAll, page, save, remove, removeType, findByParent, findCode, getSort
}
