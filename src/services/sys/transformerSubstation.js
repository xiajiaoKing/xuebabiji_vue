/** ----------------------------------------
 * 菜单服务模块
 * ---------------------------------------------- */
import hydlAxios from '@/widgets/hydlAxios.js'
import apis from '@/sapis/sys'
import qs from 'qs'

function getList(data) {

  return hydlAxios.axios.post(apis.transformerSubstation.getList, qs.stringify(data))
}

function getSelectList() {
  return hydlAxios.axios.post(apis.transformerSubstation.getSelectList,)
}

function editForm(data) {
  return hydlAxios.axios.post(apis.transformerSubstation.editForm, qs.stringify(data))
}

function delRow(data) {
  return hydlAxios.axios.post(apis.transformerSubstation.delRow, qs.stringify(data))
}


export default {
  getList, getSelectList, editForm, delRow
}
