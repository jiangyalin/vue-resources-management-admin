import userList from './../../../page/user/user/userList.vue'
import userAdd from './../../../page/user/user/userAdd.vue'

export default [
  {
    path: 'user/userList',
    meta: {
      requireAuth: true
    },
    component: userList
  },
  {
    path: 'user/userAdd',
    meta: {
      requireAuth: true
    },
    component: userAdd
  }
]
