const operateNav = (vue) => {
  return [{
    text: '结算',
    name: 'settlement',
    path: '/financialCenter/settlement',
    index: '3',
    node: [{
      text: '对账单',
      name: 'settlementList',
      path: '/financialCenter/settlement/settlementList',
      index: '3-1',
      node: [{
        text: '账单订单',
        name: 'settlementOrderList',
        path: '/financialCenter/settlement/settlementList/settlementOrderList/' + vue.$route.params.settlementId,
        index: '3-1-1',
        node: [{
          text: '账单详情',
          name: 'settlementInfo',
          path: '/financialCenter/settlement/settlementList/settlementOrderList/' + vue.$route.params.settlementId + '/settlementInfo/' + vue.$route.params.settlementOrderId,
          index: '3-1-1-1'
        }]
      }]
    }, {
      text: '结算配置列表',
      name: 'billingConfigurationList',
      path: '/financialCenter/settlement/billingConfigurationList',
      index: '3-2',
      node: [{
        text: '配置结算',
        name: 'billingConfigurationEdit',
        path: '/financialCenter/settlement/billingConfigurationList/billingConfigurationEdit/' + vue.$route.params.billingConfigurationId,
        index: '3-2-1'
      }]
    }]
  }]
}

const ownerNav = (vue) => {
  return [{
    text: '统计分析',
    name: 'statistics',
    path: '/financialCenter/statistics',
    index: '2',
    node: [{
      text: '订单统计',
      name: 'orderStatistics',
      path: '/financialCenter/statistics/orderStatistics',
      index: '2-1'
    }, {
      text: '金额统计',
      name: 'amountStatistics',
      path: '/financialCenter/statistics/amountStatistics',
      index: '2-2'
    }, {
      text: '渠道统计',
      name: 'channelStatistics',
      path: '/financialCenter/statistics/channelStatistics',
      index: '2-3'
    }]
  }, {
    text: '结算',
    name: 'settlement',
    path: '/financialCenter/settlement',
    index: '3',
    node: [{
      text: '对账单',
      name: 'settlementList',
      path: '/financialCenter/settlement/settlementList',
      index: '3-1',
      node: [{
        text: '账单订单',
        name: 'settlementOrderList',
        path: '/financialCenter/settlement/settlementList/settlementOrderList/' + vue.$route.params.settlementId,
        index: '3-1-1',
        node: [{
          text: '账单详情',
          name: 'settlementInfo',
          path: '/financialCenter/settlement/settlementList/settlementOrderList/' + vue.$route.params.settlementId + '/settlementInfo/' + vue.$route.params.settlementOrderId,
          index: '3-1-1-1'
        }]
      }]
    }, {
      text: '结算配置列表',
      name: 'billingConfigurationList',
      path: '/financialCenter/settlement/billingConfigurationList',
      index: '3-2',
      node: [{
        text: '配置结算',
        name: 'billingConfigurationEdit',
        path: '/financialCenter/settlement/billingConfigurationList/billingConfigurationEdit/' + vue.$route.params.billingConfigurationId,
        index: '3-2-1'
      }]
    }]
  }]
}

const node1 = {
  text: '财务中心',
  name: 'financialCenter',
  path: '/financialCenter',
  index: '01'
}

export default {
  operate: operateNav,
  owner: ownerNav,
  node1: node1
}
