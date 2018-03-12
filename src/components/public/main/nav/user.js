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
      index: '3-1'
    }, {
      text: '添加用户',
      name: 'userAdd',
      path: '/user/user/userAdd',
      index: '3-2'
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
