const data = (vue) => {
  return [{
    text: '首页',
    name: 'home',
    path: '/home/home',
    index: '1',
    node: [{
      text: '系统首页',
      name: 'home',
      path: '/home/home',
      index: '1-1'
    }]
  }]
}

const node = {
  text: '首页',
  name: 'home',
  path: '/home/home',
  index: '01'
}

export default {
  data: data,
  node: node
}
