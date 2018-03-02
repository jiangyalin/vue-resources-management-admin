const operateNav = (vue) => {
  return [{
    text: '房源',
    name: 'property',
    path: '/operateCenter/property',
    index: '2',
    node: [{
      text: '房源审核',
      name: 'propertyAudit',
      path: '/operateCenter/property/propertyAudit',
      index: '2-3',
      node: [{
        text: '房源详情',
        name: 'orderInfo',
        path: '/operateCenter/property/propertyAudit/propertyInfo/' + vue.$route.params.propertyId,
        index: '2-3-1'
      }]
    }]
  }, {
    text: '渠道',
    name: 'channel',
    path: '/operateCenter/channel',
    index: '5',
    node: [{
      text: '渠道列表',
      name: 'channelList',
      path: '/operateCenter/channel/channelList',
      index: '5-1',
      node: [{
        text: '渠道绑定',
        name: 'channelBinding',
        path: '/operateCenter/channel/channelList/channelBinding/' + vue.$route.params.channelId,
        index: '5-1-1'
      }, {
        text: '编辑渠道',
        name: 'channelEdit',
        path: '/operateCenter/channel/channelList/channelEdit/' + vue.$route.params.channelId,
        index: '5-1-2'
      }]
    }, {
      text: '添加渠道',
      name: 'channelAdd',
      path: '/operateCenter/channel/channelAdd',
      index: '5-2'
    }]
  }, {
    text: '订单',
    name: 'order',
    path: '/operateCenter/order',
    index: '6',
    node: [{
      text: '订单列表',
      name: 'orderList',
      path: '/operateCenter/order/orderList',
      index: '6-1',
      node: [{
        text: '订单详情',
        name: 'orderInfo',
        path: '/operateCenter/order/orderList/orderInfo/' + vue.$route.params.orderId,
        index: '6-1-1'
      }]
    }]
  }]
}

const ownerNav = (vue) => {
  return [{
    text: '房源',
    name: 'property',
    path: '/operateCenter/property',
    index: '2',
    node: [{
      text: '房源列表',
      name: 'propertyList',
      path: '/operateCenter/property/propertyList',
      index: '2-1',
      node: [{
        text: '房源详情',
        name: 'orderInfo',
        path: '/operateCenter/property/propertyList/propertyInfo/' + vue.$route.params.propertyId,
        index: '2-1-1'
      }, {
        text: '房源编辑',
        name: 'propertyEdit',
        path: '/operateCenter/property/propertyList/propertyEdit/' + vue.$route.params.propertyId,
        index: '2-1-2'
      }, {
        text: '房源图片编辑',
        name: 'propertyImageEdit',
        path: '/operateCenter/property/propertyList/propertyImageEdit/' + vue.$route.params.propertyId,
        index: '2-1-3'
      }, {
        text: '房价房态',
        name: 'rateList',
        path: '/operateCenter/property/propertyList/rateList/' + vue.$route.params.propertyId,
        index: '2-1-4',
        node: [{
          text: '房价维护',
          name: 'rateEdit',
          path: '/operateCenter/property/propertyList/rateList/' + vue.$route.params.propertyId + '/rateEdit',
          index: '2-1-4-1'
        }]
      }, {
        text: '房源政策',
        name: 'propertyPolicy',
        path: '/operateCenter/property/propertyList/propertyPolicy/' + vue.$route.params.propertyId,
        index: '2-1-5'
      }, {
        text: '房源关联',
        name: 'propertyRelated',
        path: '/operateCenter/property/propertyList/propertyRelated/' + vue.$route.params.propertyId,
        index: '2-1-6'
      }, {
        text: '渠道价格',
        name: 'channelPrice',
        path: '/operateCenter/property/propertyList/channelPrice/' + vue.$route.params.propertyId,
        index: '2-1-7',
        node: [{
          text: '渠道价格编辑',
          name: 'channelPriceEdit',
          path: '/operateCenter/property/propertyList/channelPrice/' + vue.$route.params.propertyId + '/channelPriceEdit/' + vue.$route.params.channelId,
          index: '2-1-7-1'
        }]
      }, {
        text: '入住规则',
        name: 'checkInRules',
        path: '/operateCenter/property/propertyList/checkInRules/' + vue.$route.params.propertyId,
        index: '2-1-8'
      }, {
        text: '附加费用',
        name: 'additionalFeesList',
        path: '/operateCenter/property/propertyList/additionalFeesList/' + vue.$route.params.propertyId,
        index: '2-1-9',
        node: [{
          text: '附加费用编辑',
          name: 'additionalFeesEdit',
          path: '/operateCenter/property/propertyList/additionalFeesList/' + vue.$route.params.propertyId + '/additionalFeesEdit/' + vue.$route.params.additionalFeesId,
          index: '2-1-9-1'
        }]
      }]
    }, {
      text: '添加房源',
      name: 'propertyAdd',
      path: '/operateCenter/property/propertyAdd',
      index: '2-2'
    }]
  }, {
    text: '订单',
    name: 'order',
    path: '/operateCenter/order',
    index: '6',
    node: [{
      text: '订单列表',
      name: 'orderList',
      path: '/operateCenter/order/orderList',
      index: '6-1',
      node: [{
        text: '订单详情',
        name: 'orderInfo',
        path: '/operateCenter/order/orderList/orderInfo/' + vue.$route.params.orderId,
        index: '6-1-1'
      }]
    }, {
      text: '添加订单',
      name: 'orderAdd',
      path: '/operateCenter/order/orderAdd',
      index: '6-2'
    }]
  }]
}

const node1 = {
  text: '运营中心',
  name: 'app',
  path: '/operateCenter',
  index: '01'
}

export default {
  operate: operateNav,
  owner: ownerNav,
  node1: node1
}
