import orderList from './../../../page/operate-center/order/orderList.vue'
import orderInfo from './../../../page/operate-center/order/orderInfo.vue'
import orderAdd from './../../../page/operate-center/order/orderAdd.vue'

export default [
  {
    path: 'order',
    redirect: 'order/orderList'
  },
  {
    path: 'order/orderList',
    meta: {
      requireAuth: true
    },
    component: orderList
  },
  {
    path: 'order/orderList/orderInfo/:orderId',
    meta: {
      requireAuth: true
    },
    component: orderInfo
  },
  {
    path: 'order/orderAdd',
    meta: {
      requireAuth: true
    },
    component: orderAdd
  },
  { // 快速创建订单
    path: 'order/orderAdd/:propertyId',
    meta: {
      requireAuth: true
    },
    component: orderAdd
  }
]
