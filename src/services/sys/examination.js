/*
*
* 考试管理服务模块
*
* */
import hydlAxios from '@/widgets/hydlAxios.js'
import apis from '@/sapis/examination'
import qs from 'qs'

function serve_getQuestions() {
  return hydlAxios.axios.post(apis.add.getExamination)
}

function serve_addExamination(name) {
  return hydlAxios.axios.post(apis.add.addExamination, qs.stringify([name]))
}

function serve_ExaminationData(id) {
  return hydlAxios.axios.post(apis.add.ExaminationData, qs.stringify([id]))
}

function serve_getSchedule(pageNum, limit) {
  return hydlAxios.axios.post(apis.add.getSchedule, qs.stringify({pageNum, limit}))
}

export default {
  serve_getQuestions, serve_ExaminationData, serve_addExamination, serve_getSchedule
}
