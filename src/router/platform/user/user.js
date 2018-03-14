import userList from './../../../page/user/user/userList.vue'
import userAdd from './../../../page/user/user/userAdd.vue'
import userInfo from './../../../page/user/user/userInfo.vue'
import userEdit from './../../../page/user/user/userEdit.vue'

export default [
  {
    path: 'user/userList',
    meta: {
      requireAuth: true
    },
    component: userList
  },
  {
    path: 'user/userList/userInfo/:userId',
    meta: {
      requireAuth: true
    },
    component: userInfo
  },
  {
    path: 'user/userList/userEdit/:userId',
    meta: {
      requireAuth: true
    },
    component: userEdit
  },
  {
    path: 'user/userAdd',
    meta: {
      requireAuth: true
    },
    component: userAdd
  }
]
