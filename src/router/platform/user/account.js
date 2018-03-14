import accountList from './../../../page/user/account/accountList.vue'
import accountAdd from './../../../page/user/account/accountAdd.vue'

export default [
  {
    path: 'account/accountList',
    meta: {
      requireAuth: true
    },
    component: accountList
  },
  {
    path: 'account/accountAdd',
    meta: {
      requireAuth: true
    },
    component: accountAdd
  }
]
