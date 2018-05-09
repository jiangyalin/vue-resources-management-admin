import skinEdit from './../../../page/user/skin/skinEdit.vue'

export default [
  {
    path: 'user/userList/skin/skinEdit/:userId',
    meta: {
      requireAuth: true
    },
    component: skinEdit
  }
]
