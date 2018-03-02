import propertyInfo from './../../../page/operate-center/property/propertyInfo.vue'
import propertyAudit from './../../../page/operate-center/property/propertyAudit.vue'

export default [
  {
    path: 'property/propertyAudit',
    meta: {
      requireAuth: true
    },
    component: propertyAudit
  },
  {
    path: 'property/propertyAudit/propertyInfo/:propertyId',
    meta: {
      requireAuth: true
    },
    component: propertyInfo
  }
]
