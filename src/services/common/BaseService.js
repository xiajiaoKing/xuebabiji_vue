import hydlAxios from '@/widgets/hydlAxios.js'
import qs from 'qs'
import baseApi from './BaseApi'
import domain from '@/domain'
import AjaxService from './AjaxService'

export default class BaseService extends AjaxService {
  findAll() {
    return this._toFullPost(baseApi.findAllUrl)
  }

  list(bean) {
    return this._toFullPost(baseApi.listUrl, bean)
  }

  create(bean) {
    return this._toFullPost(baseApi.createUrl, bean)
  }

  get(id) {
    return this._toFullPost(baseApi.getUrl, {id})
  }

  update(bean) {
    return this._toFullPost(baseApi.updateUrl, bean)
  }

  deleteById(id) {
    return this._toFullPost(baseApi.deleteByIdUrl, {id})
  }

  batchDeleteByIds(ids) {
    return this._toFullPost(baseApi.batchDeleteByIdsUrl, {ids})
  }

  find(bean, pageNum, limit) {
    let param = Object.assign({}, bean, {pageNum, limit})
    return this._toFullPost(baseApi.findUrl, param)
  }

  page(bean, pageNum, limit) {
    const iDisplayStart = pageNum * limit
    const param = Object.assign({}, bean, {iDisplayStart, iDisplayLength: limit})
    return this._toFullPost(baseApi.pageUrl, param)
  }

  likeSearchPage(bean, pageNum, limit) {
    const param = Object.assign({}, bean, {pageNum, limit})
    return this._toFullPost(baseApi.likeSearchPageUrl, param)
  }

  createOrUpdate(bean) {
    return this._toFullPost(baseApi.createOrUpdateUrl, bean)
  }
}
