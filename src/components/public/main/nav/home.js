const operateNav = (vue) => {
  return [{
    text: '推送',
    name: 'forwardNews',
    path: '/home/forwardNews',
    index: '2',
    node: [{
      text: '推送消息列表',
      name: 'forwardNewsList',
      path: '/home/forwardNews/forwardNewsList',
      index: '2-1'
    }]
  }]
}

const ownerNav = (vue) => {
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

const node1 = {
  text: '首页',
  name: 'home',
  path: '/home/home',
  index: '01'
}

export default {
  operate: operateNav,
  owner: ownerNav,
  node1: node1
}
