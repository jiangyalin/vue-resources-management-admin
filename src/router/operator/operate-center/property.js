import propertyList from './../../../page/operate-center/property/propertyList.vue'
import propertyAdd from './../../../page/operate-center/property/propertyAdd.vue'
import propertyEdit from './../../../page/operate-center/property/propertyEdit.vue'
import propertyImageEdit from './../../../page/operate-center/property/propertyImageEdit.vue'
import propertyInfo from './../../../page/operate-center/property/propertyInfo.vue'
import propertyPolicy from './../../../page/operate-center/property/propertyPolicy.vue'
import propertyRelated from './../../../page/operate-center/property/propertyRelated.vue'
import additionalFeesList from './../../../page/operate-center/property/additionalFeesList.vue'
import additionalFeesEdit from './../../../page/operate-center/property/additionalFeesEdit.vue'
import rateList from './../../../page/operate-center/property/rateList.vue'
import rateEdit from './../../../page/operate-center/property/rateEdit.vue'
import channelPrice from './../../../page/operate-center/property/channelPrice.vue'
import channelPriceEdit from './../../../page/operate-center/property/channelPriceEdit.vue'
import checkInRules from './../../../page/operate-center/property/checkInRules.vue'

export default [
  {
    path: 'property/propertyList',
    meta: {
      requireAuth: true
    },
    component: propertyList
  },
  {
    path: 'property/propertyList/propertyInfo/:propertyId',
    meta: {
      requireAuth: true
    },
    component: propertyInfo
  },
  {
    path: 'property/propertyList/propertyEdit/:propertyId',
    meta: {
      requireAuth: true
    },
    component: propertyEdit
  },
  {
    path: 'property/propertyList/propertyPolicy/:propertyId',
    meta: {
      requireAuth: true
    },
    component: propertyPolicy
  },
  {
    path: 'property/propertyList/propertyImageEdit/:propertyId',
    meta: {
      requireAuth: true
    },
    component: propertyImageEdit
  },
  {
    path: 'property/propertyList/rateList/:propertyId',
    meta: {
      requireAuth: true
    },
    component: rateList
  },
  {
    path: 'property/propertyList/rateList/:propertyId/rateEdit',
    meta: {
      requireAuth: true
    },
    component: rateEdit
  },
  {
    path: 'property/propertyList/propertyRelated/:propertyId',
    meta: {
      requireAuth: true
    },
    component: propertyRelated
  },
  {
    path: 'property/propertyList/channelPrice/:propertyId',
    meta: {
      requireAuth: true
    },
    component: channelPrice
  },
  {
    path: 'property/propertyList/channelPrice/:propertyId/channelPriceEdit/:channelId',
    meta: {
      requireAuth: true
    },
    component: channelPriceEdit
  },
  {
    path: 'property/propertyList/checkInRules/:propertyId',
    meta: {
      requireAuth: true
    },
    component: checkInRules
  },
  {
    path: 'property/propertyList/additionalFeesList/:propertyId',
    meta: {
      requireAuth: true
    },
    component: additionalFeesList
  },
  {
    path: 'property/propertyList/additionalFeesList/:propertyId/additionalFeesEdit/:additionalFeesId',
    meta: {
      requireAuth: true
    },
    component: additionalFeesEdit
  },
  {
    path: 'property/propertyAdd',
    meta: {
      requireAuth: true
    },
    component: propertyAdd
  }
]
