import BaseService from '../common/BaseService'

const api = {
  createDocuments: '/createDocuments',
  listByProject: '/listByProject',
  findByProjectAndStage: '/findByProjectAndStage'
}

class DocumentService extends BaseService {
  _baseUrl() {
    return '/document'
  }

  createDocuments(documents) {
    return this._toFullPostJson(api.createDocuments, documents)
  }

  listByProject(example, pageBean) {
    let params = Object.assign({}, example, pageBean)
    return this._toFullPost(api.listByProject, params)
  }

  findByProjectAndStage(projectId, stageType) {
    return this._toFullPost(api.findByProjectAndStage, {projectId, stageType})
  }
}

const documentService = new DocumentService()

export default documentService
