import accountList from './../../../page/system-management/account/accountList.vue'
import accountAdd from './../../../page/system-management/account/accountAdd.vue'
import accountEdit from './../../../page/system-management/account/accountEdit.vue'
import groupList from '../../../page/system-management/account/groupList.vue'
import groupEdit from '../../../page/system-management/account/groupEdit.vue'
import groupAdd from '../../../page/system-management/account/groupAdd.vue'

export default [
  {
    path: 'account/accountList',
    meta: {
      requireAuth: true
    },
    component: accountList
  },
  {
    path: 'account/accountList/accountEdit/:accountId',
    meta: {
      requireAuth: true
    },
    component: accountEdit
  },
  {
    path: 'account/accountAdd',
    meta: {
      requireAuth: true
    },
    component: accountAdd
  },
  {
    path: 'account/groupAdd',
    meta: {
      requireAuth: true
    },
    component: groupAdd
  },
  {
    path: 'account/groupList',
    meta: {
      requireAuth: true
    },
    component: groupList
  },
  {
    path: 'account/groupList/groupEdit/:accountId',
    meta: {
      requireAuth: true
    },
    component: groupEdit
  }
]
