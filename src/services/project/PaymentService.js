import BaseService from '../common/BaseService'

const api = {
  listByProject: '/listByProject',
  getProjectWithPayDetail: '/getProjectWithPayDetail'
}

class PaymentService extends BaseService {
  _baseUrl() {
    return '/payment'
  }

  listByProject(projectExample, pageBean) {
    let params = Object.assign({}, projectExample, pageBean)
    return this._toFullPost(api.listByProject, params)
  }

  getProjectWithPayDetail(projectId) {
    return this._toFullPost(api.getProjectWithPayDetail, {projectId})
  }
}

const paymentService = new PaymentService()

export default paymentService
