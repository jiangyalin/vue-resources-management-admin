import awesomeList from './../../../page/book/awesome/awesomeList.vue'
import awesomeAdd from './../../../page/book/awesome/awesomeAdd.vue'

export default [
  {
    path: 'awesome/awesomeList',
    meta: {
      requireAuth: true
    },
    component: awesomeList
  },
  {
    path: 'awesome/awesomeAdd',
    meta: {
      requireAuth: true
    },
    component: awesomeAdd
  }
]
