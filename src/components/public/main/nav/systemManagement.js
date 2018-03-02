const operateNav = (vue) => {
  return [{
    text: '账户',
    name: 'account',
    path: '/systemManagement/account',
    index: '2',
    node: [{
      text: '账户信息',
      name: 'accountList',
      path: '/systemManagement/account/accountList',
      index: '2-1',
      node: [{
        text: '账户编辑',
        name: 'accountEdit',
        path: '/systemManagement/account/accountList/accountEdit/' + vue.$route.params.accountId,
        index: '2-1-1'
      }]
    }, {
      text: '添加账户',
      name: 'accountAdd',
      path: '/systemManagement/account/accountAdd',
      index: '2-2'
    }, {
      text: '添加业主',
      name: 'groupAdd',
      path: '/systemManagement/account/groupAdd',
      index: '2-3'
    }, {
      text: '业主信息',
      name: 'groupList',
      path: '/systemManagement/account/groupList',
      index: '2-4',
      node: [{
        text: '业主信息编辑',
        name: 'groupEdit',
        path: '/systemManagement/account/groupList/groupEdit/' + vue.$route.params.accountId,
        index: '2-4-1'
      }]
    }]
  }]
}

const ownerNav = (vue) => {
  return [{
    text: '账户',
    name: 'account',
    path: '/systemManagement/account',
    index: '2',
    node: [{
      text: '账户编辑',
      name: 'accountEdit',
      path: '/systemManagement/account/accountList/accountEdit/' + vue.$route.params.accountId,
      index: '2-1-1'
    }]
  }]
}

const node1 = {
  text: '系统管理',
  name: 'systemManagement',
  path: '/systemManagement',
  index: '01'
}

export default {
  operate: operateNav,
  owner: ownerNav,
  node1: node1
}
