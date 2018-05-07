const data = (vue) => {
  return [{
    text: 'banner',
    name: 'banner',
    path: '/operations/banner',
    index: '5',
    node: [{
      text: 'banner列表',
      name: 'bannerList',
      path: '/operations/banner/bannerList',
      index: '5-1',
      node: [{
        text: '编辑banner',
        name: 'bannerEdit',
        path: '/operations/banner/bannerList/bannerEdit/' + vue.$route.params.bannerId,
        index: '5-1-1'
      }, {
        text: 'banner详情',
        name: 'bannerInfo',
        path: '/operations/banner/bannerList/bannerInfo/' + vue.$route.params.bannerId,
        index: '5-1-2'
      }]
    }, {
      text: '添加banner',
      name: 'bannerAdd',
      path: '/operations/banner/bannerAdd',
      index: '5-2'
    }]
  }]
}

const node = {
  text: '运营',
  name: 'operations',
  path: '/operations/banner',
  index: '05'
}

export default {
  data: data,
  node: node
}
