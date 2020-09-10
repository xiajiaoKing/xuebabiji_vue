import BaseService from '../common/BaseService'

const api = {
  createPRole: '/createOrUpdataSingle',
  deletePRole: '/batchDelectByIds',
  listPRole: '/findAllDetail',
  findById: '/findByIdDetail'
}


class projectRole extends BaseService {
  _baseUrl() {
    return '/projectRole'
  }

  creat(data) {
    return this._toFullPostJson(api.createPRole, data)
  }

  delete(ids) {
    return this._toFullPost(api.deletePRole, {ids})
  }

  list() {
    return this._toFullPost(api.listPRole)
  }

  getDetail(id) {
    return this._toFullPost(api.findById, {id})
  }

}

const projectRoles = new projectRole()

export default projectRoles
