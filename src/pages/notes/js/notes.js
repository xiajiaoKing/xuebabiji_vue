import qs from 'qs'
import server from '@/widgets/hydlAxios.js'
import de from "element-ui/src/locale/lang/de";

/**
 * 笔记等级  ================================================================
 * @returns {Promise<AxiosResponse<any>>}
 */
// 查看列表 笔记等级
function findLevelList(pageBean) {
  return server.axios.post('/level/findAll', qs.stringify(pageBean))
}

// 查看all 笔记等级
function findLevelAllList() {
  return server.axios.post('/level/find/all')
}

// 创建或编辑等级
function createOrEdit(bean) {
  return server.axios.post('/level/createOrUpdate', qs.stringify(bean))
}

//删除笔记等级
function deleteNotesLevel(ids) {
  return server.axios.post('/level/batch/delete', qs.stringify({ids: ids}))
}

//获取单个笔记等级
function getNotesLevel(id) {
  return server.axios.post('/level/get', qs.stringify({id: id}))
}


/**
 * 学生信息 ================================================================
 */
// 查看列表 学生信息
function findStudentList(pageBean) {
  return server.axios.post('/student/findAll', qs.stringify(pageBean))
}

// 查看列表 学生信息
function findStudentAllList() {
  return server.axios.post('/student/find/all')
}


// 查看列表 学生信息
function createOrEditForStudentMsg(pageBean) {
  return server.axios.post('/student/createOrUpdate', qs.stringify(pageBean))
}

//删除 学生信息
function deleteStudent(ids) {
  return server.axios.post('/student/batch/delete', qs.stringify({ids: ids}))
}

//获取单个 学生信息
function getStudentMsg(id) {
  return server.axios.post('/student/getStudentMsg', qs.stringify({id: id}))
}


/**
 * 笔记   ================================================================
 */

// 查看列表 笔记
function findNotesBookList(pageBean) {
  return server.axios.post('/book/findNotesBookList', qs.stringify(pageBean))
}


// 创建 笔记
function createOrEditForNoteBookMsg(pageBean) {
  return server.axios.post('/book/createOrUpdate', qs.stringify(pageBean))
}

//删除 笔记
function deleteNotesBook(ids) {
  return server.axios.post('/book/batch/delete', qs.stringify({ids: ids}))
}

//获取单个 笔记
function getNoteBookMsg(id) {
  return server.axios.post('/book/getNoteBookMsg', qs.stringify({id: id}))
}

//查找科目list
function findSubjectList(id) {
  return server.axios.post('/sys/dictionary/findDictByParentCode', qs.stringify({dictCode: 'KMMC'}))
}


export default {
  getNoteBookMsg,
  deleteNotesBook,
  createOrEditForNoteBookMsg,
  findLevelAllList,
  findStudentAllList,
  findNotesBookList,
  getStudentMsg,
  deleteStudent,
  findLevelList,
  createOrEdit,
  deleteNotesLevel,
  getNotesLevel,
  findStudentList,
  createOrEditForStudentMsg,
  findSubjectList,


}
