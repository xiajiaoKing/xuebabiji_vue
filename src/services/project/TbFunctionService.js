import AjaxService from '../common/AjaxService'

const api = {
  deleteByIds: '/deleteByIds',
  listData: '/listData',
  getFunByProject: '/getFunByProject',
  saveChange: '/saveChange'
}

class TbFunctionService extends AjaxService {
  _baseUrl() {
    return '/function'
  }

  deleteByIds(ids) {
    return this._toFullPost(api.deleteByIds, ids)
  }

  listData(example, pageBean) {
    let params = Object.assign({}, example, pageBean)
    return this._toFullPost(api.listData, params)
  }

  getFunByProject(projectId) {
    return this._toFullPost(api.getFunByProject, {projectId})
  }

  saveChange(dto) {
    return this._toFullPostJson(api.saveChange, dto)
  }
}

const tbFunctionService = new TbFunctionService()

export default tbFunctionService
