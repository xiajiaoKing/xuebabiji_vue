import BaseService from '../common/BaseService'

const projectApi = {
  exportExcel: '/exportExcel'
}

class ProjectService extends BaseService {
  /**
   * @returns {string}
   * @protected
   */
  _baseUrl() {
    return '/project'
  }

  exportExcel(searchBean) {
    return this._downloadFile(projectApi.exportExcel, searchBean)
  }
}

const projectService = new ProjectService()

export default projectService
