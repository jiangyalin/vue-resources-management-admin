const data = (vue) => {
  return [{
    text: 'app',
    name: 'app',
    path: '/yaoxiao/app',
    index: '4',
    node: [{
      text: 'app列表',
      name: 'appList',
      path: '/yaoxiao/app/appList',
      index: '4-1'
    }, {
      text: '添加app',
      name: 'appAdd',
      path: '/yaoxiao/app/appAdd',
      index: '4-2'
    }]
  }]
}

const node = {
  text: '姚逍',
  name: 'yaoxiao',
  path: '/yaoxiao/app',
  index: '04'
}

export default {
  data: data,
  node: node
}
