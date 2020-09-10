/** ----------------------------------------
 * 通用服务模块
 * ---------------------------------------------- */
import hydlAxios from '@/widgets/hydlAxios.js'
import apis from '@/sapis/common'
import qs from 'qs'

function checkExists(url) {
  return hydlAxios.axios.head(url)
}

function uploadFile(file, fileName, fileMd5, callback) {
  var data = new FormData()// 重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传
  data.append('file', file)
  data.append('fileName', fileName)
  data.append('name', fileMd5)
  return hydlAxios.axios({
    method: 'post',
    url: apis.uploadFile,
    data: data,
    headers: {'Content-Type': 'multipart/form-data'},
    onUploadProgress: progressEvent => {
      if (callback && progressEvent.lengthComputable) {
        callback(progressEvent.loaded / progressEvent.total * 100 | 0)
      }
    }
  })
}

export default {
  uploadFile, checkExists
}
