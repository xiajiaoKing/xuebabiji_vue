import hydlAxios from '@/widgets/hydlAxios.js'
import apis from '@/sapis/sys'
import qs from 'qs'

// hydlAxios.axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
function alter(securityList) {
  return hydlAxios.axios.post(apis.security.alter, {securityList})
}

function find() {
  return hydlAxios.axios.post(apis.security.find)
}

export default {
  alter, find
}
