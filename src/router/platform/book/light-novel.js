import fictionList from './../../../page/book/light-novel/fictionList.vue'
import fictionAdd from './../../../page/book/light-novel/fictionAdd.vue'
import fictionEdit from './../../../page/book/light-novel/fictionEdit.vue'
import fictionInfo from './../../../page/book/light-novel/fictionInfo.vue'
import volumeList from './../../../page/book/light-novel/volumeList.vue'
import volumeInfo from './../../../page/book/light-novel/volumeInfo.vue'
import volumeEdit from './../../../page/book/light-novel/volumeEdit.vue'
import volumeAdd from './../../../page/book/light-novel/volumeAdd.vue'
import chapterAdd from './../../../page/book/light-novel/chapterAdd.vue'
import chapterList from './../../../page/book/light-novel/chapterList.vue'
import chapterInfo from './../../../page/book/light-novel/chapterInfo.vue'
import chapterEdit from './../../../page/book/light-novel/chapterEdit.vue'

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
  },
  {
    path: 'lightNovel/fictionList/volumeList/:fictionId',
    meta: {
      requireAuth: true
    },
    component: volumeList
  },
  {
    path: 'lightNovel/fictionList/volumeList/:fictionId/volumeInfo/:volumeId',
    meta: {
      requireAuth: true
    },
    component: volumeInfo
  },
  {
    path: 'lightNovel/fictionList/volumeList/:fictionId/volumeEdit/:volumeId',
    meta: {
      requireAuth: true
    },
    component: volumeEdit
  },
  {
    path: 'lightNovel/volumeAdd',
    meta: {
      requireAuth: true
    },
    component: volumeAdd
  },
  {
    path: 'lightNovel/chapterAdd',
    meta: {
      requireAuth: true
    },
    component: chapterAdd
  },
  {
    path: 'lightNovel/fictionList/volumeList/:fictionId/chapterList/:volumeId',
    meta: {
      requireAuth: true
    },
    component: chapterList
  },
  {
    path: 'lightNovel/fictionList/volumeList/:fictionId/chapterList/:volumeId/chapterInfo/:chapterId',
    meta: {
      requireAuth: true
    },
    component: chapterInfo
  },
  {
    path: 'lightNovel/fictionList/volumeList/:fictionId/chapterList/:volumeId/chapterEdit/:chapterId',
    meta: {
      requireAuth: true
    },
    component: chapterEdit
  }
]
