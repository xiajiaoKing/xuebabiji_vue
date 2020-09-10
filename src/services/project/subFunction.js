import BaseService from '../common/BaseService'

const api = {
  createSubfunction: '/handleSubFunction',
  deleteSubfunction: '/batchDeleteByIds',
  listSubfunction: '/listBySubFunction',

}


class SubfunctionService extends BaseService {
  _baseUrl() {
    return '/subFunction'
  }

  creat(data) {
    return this._toFullPost(api.createSubfunction, data)
  }

  delete(ids) {
    return this._toFullPost(api.deleteSubfunction, {ids})
  }

  list(name) {
    return this._toFullPost(api.listSubfunction, {name})
  }

}

const subfunctionService = new SubfunctionService()

export default subfunctionService
