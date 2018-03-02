import settlementList from './../../../page/financial-center/settlement/settlementList.vue'
import settlementOrderList from './../../../page/financial-center/settlement/settlementOrderList.vue'
import settlementInfo from './../../../page/financial-center/settlement/settlementInfo.vue'
import billingConfigurationList from './../../../page/financial-center/settlement/billingConfigurationList.vue'
import billingConfigurationEdit from './../../../page/financial-center/settlement/billingConfigurationEdit.vue'

export default [
  {
    path: 'settlement/settlementList',
    meta: {
      requireAuth: true
    },
    component: settlementList
  },
  {
    path: 'settlement/settlementList/settlementOrderList/:settlementId',
    meta: {
      requireAuth: true
    },
    component: settlementOrderList
  },
  {
    path: 'settlement/settlementList/settlementOrderList/:settlementId/settlementInfo/:settlementOrderId',
    meta: {
      requireAuth: true
    },
    component: settlementInfo
  },
  {
    path: 'settlement/billingConfigurationList',
    meta: {
      requireAuth: true
    },
    component: billingConfigurationList
  },
  {
    path: 'settlement/billingConfigurationList/billingConfigurationEdit/:billingConfigurationId',
    meta: {
      requireAuth: true
    },
    component: billingConfigurationEdit
  }
]
