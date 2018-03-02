import orderList from './../../../page/operate-center/order/orderList.vue'
import orderInfo from './../../../page/operate-center/order/orderInfo.vue'

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
  }
]
