import appList from './../../../page/yao-xiao/app/appList.vue'
import userAdd from './../../../page/user/user/userAdd.vue'

export default [
  {
    path: 'app/appList',
    meta: {
      requireAuth: true
    },
    component: appList
  },
  {
    path: 'user/userAdd',
    meta: {
      requireAuth: true
    },
    component: userAdd
  }
]
