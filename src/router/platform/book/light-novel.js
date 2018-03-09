import fictionList from './../../../page/book/light-novel/fictionList.vue'
import fictionAdd from './../../../page/book/light-novel/fictionAdd.vue'
import fictionEdit from './../../../page/book/light-novel/fictionEdit.vue'
import fictionInfo from './../../../page/book/light-novel/fictionInfo.vue'

export default [
  {
    path: 'lightNovel/fictionList',
    meta: {
      requireAuth: true
    },
    component: fictionList
  },
  {
    path: 'lightNovel/fictionAdd',
    meta: {
      requireAuth: true
    },
    component: fictionAdd
  },
  {
    path: 'lightNovel/fictionList/fictionEdit/:fictionId',
    meta: {
      requireAuth: true
    },
    component: fictionEdit
  },
  {
    path: 'lightNovel/fictionList/fictionInfo/:fictionId',
    meta: {
      requireAuth: true
    },
    component: fictionInfo
  }
]
