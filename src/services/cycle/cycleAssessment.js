import BaseService from '../common/BaseService'

const api = {
  creat: '/createOrUpdate',
  delete: '/batch/delete',
  listData: '/findPeriodByProject',
  listProject: '/findByPeriodStatusByStatus',
  get: 'get'
}


class CycleAssessment extends BaseService {
  _baseUrl() {
    return '/project'
  }

  creat(data) {
    return this._toFullPost(api.creat, data)
  }

  delete(ids) {
    return this._toFullPost(api.delete, {ids})
  }

  list(data) {
    return this._toFullPost(api.listData, data)
  }

  listProject(data) {
    return this._toFullPost(api.listProject, data)
  }


  get(id) {
    return this._toFullPost(api.get, {id})
  }

}

const cycleAssessment = new CycleAssessment()

export default cycleAssessment
