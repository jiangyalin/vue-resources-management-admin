import skinList from './../../../page/user/skin/skinList.vue'
import skinAdd from './../../../page/user/skin/skinAdd.vue'

export default [
  {
    path: 'skin/skinList',
    meta: {
      requireAuth: true
    },
    component: skinList
  },
  {
    path: 'skin/skinAdd',
    meta: {
      requireAuth: true
    },
    component: skinAdd
  }
]
