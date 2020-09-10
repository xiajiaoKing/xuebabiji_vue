import hydlAxios from '@/widgets/hydlAxios.js'
import qs from 'qs'
import domain from '@/domain'

/**
 * Ajax请求封装
 */
export default class BaseService {
  constructor() {
    this._baseUrl()
  }

  /**
   * api基本url，baseUrl + url既是请求访问的url
   * @private
   */
  _baseUrl() {
    throw new Error('子类需要重写baseUrl()')
  }

  /**
   * 拼接 baseUrl + url
   * @param url
   * @returns {*}
   * @private
   */
  _fullUrl(url) {
    return this._baseUrl() + url
  }

  /**
   * 转换成fullUrl再进行post
   * @param url
   * @param param
   * @param config  axios 配置，非必传
   * @returns {Promise<AxiosResponse<T>>}
   * @protected
   */
  _toFullPost(url, param, config) {
    let fullUrl = this._fullUrl(url)
    return this._post(fullUrl, param, config)
  }

  /**
   * 转换成fullUrl再进行postJson
   * @param url
   * @param param
   * @param config axios 配置，非必传
   * @returns {Promise<AxiosResponse<T>>}
   * @protected
   */
  _toFullPostJson(url, param, config) {
    let fullUrl = this._fullUrl(url)
    return this._postJson(fullUrl, param)
  }

  /**
   * post
   * @param fullUrl
   * @param param
   * @param config axios 配置，非必传
   * @returns {Promise<AxiosResponse<T>>}
   * @protected
   */
  _post(fullUrl, param, config) {
    return hydlAxios.axios.post(fullUrl, qs.stringify(param, {
      arrayFormat: 'repeat'
    }), config)
  }

  /**
   * 参数使用json方式进行post
   * @param fullUrl
   * @param param
   * @param config axios 配置，非必传
   * @returns {Promise<AxiosResponse<T>>}
   * @protected
   */
  _postJson(fullUrl, param, config) {
    return hydlAxios.axios.post(fullUrl, param, config)
  }

  _downloadFile(url, param) {
    let fullUrl = this._fullUrl(url)
    let paramStr = qs.stringify(param, {
      arrayFormat: 'repeat'
    })
    window.location.href = domain.url + fullUrl + '?' + paramStr
  }
}
