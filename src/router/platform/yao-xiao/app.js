import appList from './../../../page/yao-xiao/app/appList.vue'
import appAdd from './../../../page/yao-xiao/app/appAdd.vue'
import appInfo from './../../../page/yao-xiao/app/appInfo.vue'

export default [
  {
    path: 'app/appList',
    meta: {
      requireAuth: true
    },
    component: appList
  },
  {
    path: 'app/appList/appInfo/:appId',
    meta: {
      requireAuth: true
    },
    component: appInfo
  },
  {
    path: 'app/appAdd',
    meta: {
      requireAuth: true
    },
    component: appAdd
  }
]
