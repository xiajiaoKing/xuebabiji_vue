import server from '@/widgets/hydlAxios.js'
import apis from '@/sapis/sys'
import qs from 'qs'

//用户日志
function getAllUserLog() {
  return server.axios.post(apis.log.getAllUserLog)
}

function getSelectResult(obj) {
  return server.axios.post(apis.log.getSelectResult, qs.stringify(obj))
}

export default {
  //用户日志
  getAllUserLog,
  getSelectResult
}
