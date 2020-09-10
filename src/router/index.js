import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import AppConfig from '../AppConfig'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
    {
      path: '/',
      component: resolve => require(['@/components/common/Home.vue'], resolve),
      meta: {
        title: '自述文件'
      },
      children: [{
        path: '/dashboard',
        component: resolve => require(['@/pages/Dashboard.vue'], resolve),
        meta: {
          title: '系统首页'
        }
      },
        {
          path: '/icon',
          component: resolve => require(['@/pages/Icon.vue'], resolve),
          meta: {
            title: '自定义图标'
          }
        },
        {
          path: '/sys/sysMenu/index',
          component: resolve => require(['@/pages/sys/menu.vue'], resolve),
          meta: {
            title: '菜单管理'
          }
        },
        {
          path: '/sys/delHistory/index',
          component: resolve => require(['@/pages/sys/delHistory.vue'], resolve),
          meta: {
            title: '删除历史'
          }
        },
        {
          path: '/sys/sysUser/index',
          component: resolve => require(['@/pages/sys/user.vue'], resolve),
          meta: {
            title: '用户管理'
          }
        },
        {
          path: '/sys/sysRole/index',
          component: resolve => require(['@/pages/sys/role.vue'], resolve),
          meta: {
            title: '角色管理'
          }
        },
        {
          path: '/sys/delHistory/index',
          component: resolve => require(['@/pages/sys/delHistory.vue'], resolve),
          meta: {
            title: '删除历史'
          }
        },
        {
          path: '/sys/sysDictionary/index',
          component: resolve => require(['@/pages/sys/dictionary.vue'], resolve),
          meta: {
            title: '字典管理'
          }
        },
        {
          path: '/sys/sysDepartment/index',
          component: resolve => require(['@/pages/sys/department.vue'], resolve),
          meta: {
            title: '部门管理',
            requiresAuth: true
          }
        },
        {
          path: '/sys/securitySettings/index',
          component: resolve => require(['@/pages/sys/securitySettings.vue'], resolve),
          meta: {
            title: '安全设置'
          }
        },
        {
          path: '/sys/log/index',
          component: resolve => require(['@/pages/sys/log.vue'], resolve),
          meta: {
            title: '用户日志'
          }
        },
        {
          path: '/404',
          component: resolve => require(['@/pages/404.vue'], resolve),
          meta: {
            title: '404'
          }
        },
        {
          path: '/403',
          component: resolve => require(['@/pages/403.vue'], resolve),
          meta: {
            title: '403'
          }
        },

        {
          path: '/project/project',
          component: resolve => require(['@/pages/project/project'], resolve),
          meta: {
            title: '项目管理'
          }
        },
        {
          path: '/project/document',
          component: resolve => require(['@/pages/project/projectDocuments'], resolve),
          meta: {
            title: '项目明细'
          }
        },
        {
          path: '/project/function',
          component: resolve => require(['@/pages/project/TbFunction'], resolve),
          meta: {
            title: '项目功能目录'
          }
        },
        {
          path: '/project/payment',
          component: resolve => require(['@/pages/project/projectPayment'], resolve),
          meta: {
            title: '项目收款'
          }
        },
        {
          path: '/project/subFunction',
          component: resolve => require(['@/pages/project/subFunction'], resolve),
          meta: {
            title: '子功能管理'
          }
        },
        {
          path: '/project/projectRole',
          component: resolve => require(['@/pages/project/projectRole'], resolve),
          meta: {
            title: '项目角色管理'
          }
        },
        {
          path: '/cycle/cycleAssessment',
          component: resolve => require(['@/pages/cycle/cycleAssessment'], resolve),
          meta: {
            title: '周期评估'
          }
        },
        {
          path: '/newModel',
          component: resolve => require(['@/pages/newModel'], resolve),
          meta: {
            title: '添加'
          }
        },

        {
          path: '/notes/level/index',
          component: resolve => require(['@/pages/notes/level.vue'], resolve),
          meta: {
            title: '笔记等级'
          }
        },

        {
          path: '/notes/student/index',
          component: resolve => require(['@/pages/notes/student.vue'], resolve),
          meta: {
            title: '学生信息'
          }
        },

        {
          path: '/notes/notes/index',
          component: resolve => require(['@/pages/notes/notes.vue'], resolve),
          meta: {
            title: '学生笔记'
          }
        },


      ]

    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: AppConfig.applicationName
      }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
