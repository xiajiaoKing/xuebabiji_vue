class BaseApi {
  findAllUrl = '/find/all'
  listUrl = '/list'
  createUrl = '/create'
  getUrl = '/get'
  updateUrl = '/update'
  deleteByIdUrl = '/delete'
  batchDeleteByIdsUrl = '/batch/delete'
  findUrl = '/find'
  pageUrl = '/page'
  createOrUpdateUrl = '/createOrUpdate'
  likeSearchPageUrl = '/likeSearchPage'
}

const baseApi = new BaseApi()

export default baseApi
