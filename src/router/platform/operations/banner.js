import bannerList from './../../../page/operations/banner/bannerList.vue'
import bannerAdd from './../../../page/operations/banner/bannerAdd.vue'
import bannerInfo from './../../../page/operations/banner/bannerInfo.vue'
import bannerEdit from './../../../page/operations/banner/bannerEdit.vue'

export default [
  {
    path: 'banner/bannerList',
    meta: {
      requireAuth: true
    },
    component: bannerList
  },
  {
    path: 'banner/bannerAdd',
    meta: {
      requireAuth: true
    },
    component: bannerAdd
  },
  {
    path: 'banner/bannerList/bannerInfo/:bannerId',
    meta: {
      requireAuth: true
    },
    component: bannerInfo
  },
  {
    path: 'banner/bannerList/bannerEdit/:bannerId',
    meta: {
      requireAuth: true
    },
    component: bannerEdit
  }
]
