import {login, sys} from '../sapis'

var Mock = require('mockjs')

Mock.mock(`/api${sys.menu.findAll}`, function () {
  return {
    'msg': null,
    'data': [
      {
        'id': '38043036-bc24-41c4-a6bc-f28322ebb6de',
        'createTime': '2018-11-07 10:45:04',
        'createUserId': 'dacfe9b6-134e-4930-9b73-c238ed5022fe',
        'updateTime': null,
        'updateUserId': null,
        'parentId': 'ROOT',
        'name': '用车管理',
        'type': null,
        'url': '',
        'visible': 1,
        'icon': 'fa-codepen',
        'sort': 1,
        'remark': '',
        'children': [
          {
            'id': '665e7117-5b5d-444c-86e0-c5420bc10da4',
            'createTime': '2018-11-07 16:07:58',
            'createUserId': 'dacfe9b6-134e-4930-9b73-c238ed5022fe',
            'updateTime': '2019-01-16 10:11:49',
            'updateUserId': 'dacfe9b6-134e-4930-9b73-c238ed5022fe',
            'parentId': '38043036-bc24-41c4-a6bc-f28322ebb6de',
            'name': '车辆管理',
            'type': '',
            'url': '/car/csCar/index',
            'visible': 1,
            'icon': 'fa-circle-o',
            'sort': 1,
            'remark': '',
            'children': [
              {
                'id': 'a42e0553-7880-4033-9c72-bedb389fb89f',
                'createTime': '2019-02-24 17:25:47',
                'createUserId': 'dacfe9b6-134e-4930-9b73-c238ed5022fe',
                'updateTime': null,
                'updateUserId': null,
                'parentId': '665e7117-5b5d-444c-86e0-c5420bc10da4',
                'name': '测试一',
                'type': null,
                'url': '/sys/sysUser/index',
                'visible': 1,
                'icon': 'fa-circle-o',
                'sort': 1,
                'remark': '',
                'children': []
              }
            ]
          }
        ]
      }
    ],
    'status': 1
  }
})
