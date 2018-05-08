const data = (vue) => {
  return [{
    text: '用户',
    name: 'user',
    path: '/user/user',
    index: '3',
    node: [{
      text: '用户列表',
      name: 'userList',
      path: '/user/user/userList',
      index: '3-1',
      node: [{
        text: '编辑用户',
        name: 'userEdit',
        path: '/user/user/userList/userEdit/' + vue.$route.params.userId,
        index: '3-1-1'
      }, {
        text: '用户详情',
        name: 'userInfo',
        path: '/user/user/userList/userInfo/' + vue.$route.params.userId,
        index: '3-1-2'
      }]
    }, {
      text: '添加用户',
      name: 'userAdd',
      path: '/user/user/userAdd',
      index: '3-2'
    }]
  }, {
    text: '皮肤',
    name: 'skin',
    path: '/user/skin',
    index: '6',
    node: [{
      text: '皮肤列表',
      name: 'skinList',
      path: '/user/skin/skinList',
      index: '6-1'
    }, {
      text: '添加皮肤',
      name: 'skinAdd',
      path: '/user/skin/skinAdd',
      index: '6-2'
    }]
  }]
}

const node = {
  text: '用户',
  name: 'user',
  path: '/user/user',
  index: '03'
}

export default {
  data: data,
  node: node
}
