import accountEdit from './../../../page/system-management/account/accountEdit.vue'

export default [
  {
    path: 'account/accountList/accountEdit/:accountId',
    meta: {
      requireAuth: true
    },
    component: accountEdit
  }
]
