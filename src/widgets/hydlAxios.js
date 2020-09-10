/**
 * create by : TenzeTseng
 * 自定义封装Axios
 */
import axios from 'axios'
import domain from '@/domain.js'

axios.defaults.baseURL = domain.url

export default {
  axios
}
