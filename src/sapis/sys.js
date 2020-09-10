/**
 * create by : TenzeTseng
 * 系统服务API模块
 */
export default {
  menu: {
    findAll: '/sys/menu/find/all',
    // findAll: '/sys/menu/find/judge',
    page: '/sys/menu/page',
    addMenu: '/sys/menu/insertOrUpdateMenu',
    save: '/sys/menu/insertOrUpdateMenu',
    remove: '/sys/menu/delMenuByIds',
    removeHistory: '/sys/menu/getDelMenuList',
    returnRecord: '/sys/menu/recoverMenuByIds',
    menuInfo: '/sys/menu/getMenuInfoById',
    menuSelect: '/sys/menu/getMenuByParentId',
    visiable: '/sys/menu/changeIsVisible',
    getSort: '/sys/menu/getSort',
    isSameName: '/sys/menu/isSameName',

  },
  user: {
    getUser: '/sys/user/get',
    page: '/sys/user/page',
    save: '/sys/user/edit',
    remove: '/sys/user/delete',
    batchRemove: '/sys/user/batch/delete', // 多个删除
    getUserTree: '/sys/department/find/all/tier/users',
    updataPassword: '/sys/user/updataPassword',
    initPassword: '/sys/user/initPassword'
  },
  role: {
    findAll: '/sys/role/find/all',
    page: '/sys/role/page',
    save: '/sys/role/edit',
    remove: '/sys/role/delete'
  },
  department: {
    findAll: '/sys/department/find/all/tier',
    get: '/sys/department/get',
    save: '/sys/department/edit',
    remove: '/sys/department/delete',
    page: '/sys/department/page',
    userTree: '/sys/department/find/all/tier/users'
  },
  dictionary: {
    findAll: '/sys/dictionary/find/all',
    findType: '/sys/dictionary/selectDictType',
    dictAll: '/sys/dictionary/selectDictAll',
    save: '/sys/dictionary/edit',
    getCode: '/sys/dictionary/getDictCode',
    removeType: '/sys/dictionary/delectDictType',
    remove: '/sys/dictionary/delectDict',
    page: '/sys/dictionary/selectDict',
    findByParent: '/sys/dictionary/find/parentId',
    findCode: '/sys/dictionary/find/by/code',
    getSort: '/sys/dictionary/getMaxSortByParentId'
  },
  transformerSubstation: {
    getList: '/micro/transformerSubstationInfo/getTransFormList',
    getSelectList: '/micro/transformerSubstationInfo/getSelectList',
    editForm: '/micro/transformerSubstationInfo/edit',
    delRow: '/micro/transformerSubstationInfo/deletePower'
  },

  security: {
    alter: '/sys/security/setting/alter',
    find: '/sys/security/setting/findSecuritySetting'
  },
  log: {
    getAllUserLog: '/sys/sysUserLog/page',
    getSelectResult: '/sys/sysUserLog/page'
  }
}
