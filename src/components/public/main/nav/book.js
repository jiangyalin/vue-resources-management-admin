const data = (vue) => {
  return [{
    text: '轻小说',
    name: 'lightNovel',
    path: '/book/lightNovel',
    index: '2',
    node: [{
      text: '轻小说列表',
      name: 'fictionList',
      path: '/book/lightNovel/fictionList',
      index: '2-1',
      node: [{
        text: '编辑轻小说',
        name: 'fictionEdit',
        path: '/book/lightNovel/fictionList/fictionEdit/' + vue.$route.params.fictionId,
        index: '2-1-1'
      }, {
        text: '轻小说详情',
        name: 'fictionInfo',
        path: '/book/lightNovel/fictionList/fictionInfo/' + vue.$route.params.fictionId,
        index: '2-1-2'
      }, {
        text: '卷列表',
        name: 'volumeList',
        path: '/book/lightNovel/fictionList/volumeList/' + vue.$route.params.fictionId,
        index: '2-1-3',
        node: [{
          text: '卷详情',
          name: 'volumeInfo',
          path: '/book/lightNovel/fictionList/volumeList/' + vue.$route.params.fictionId + '/volumeInfo/' + vue.$route.params.volumeId,
          index: '2-1-3-1'
        }, {
          text: '编辑卷',
          name: 'volumeEdit',
          path: '/book/lightNovel/fictionList/volumeList/' + vue.$route.params.fictionId + '/volumeEdit/' + vue.$route.params.volumeId,
          index: '2-1-3-2'
        }, {
          text: '章列表',
          name: 'chapterList',
          path: '/book/lightNovel/fictionList/volumeList/' + vue.$route.params.fictionId + '/chapterList/' + vue.$route.params.volumeId,
          index: '2-1-3-3',
          node: [{
            text: '章详情',
            name: 'chapterInfo',
            path: '/book/lightNovel/fictionList/volumeList/' + vue.$route.params.fictionId + '/chapterList/' + vue.$route.params.volumeId + '/chapterInfo/' + vue.$route.params.chapterId,
            index: '2-1-3-3-1'
          }, {
            text: '编辑章',
            name: 'chapterEdit',
            path: '/book/lightNovel/fictionList/volumeList/' + vue.$route.params.fictionId + '/chapterList/' + vue.$route.params.volumeId + '/chapterEdit/' + vue.$route.params.chapterId,
            index: '2-1-3-3-2'
          }, {
            text: '上传章',
            name: 'chapterUpload',
            path: '/book/lightNovel/fictionList/volumeList/' + vue.$route.params.fictionId + '/chapterList/' + vue.$route.params.volumeId + '/chapterUpload/' + vue.$route.params.chapterId,
            index: '2-1-3-3-2'
          }]
        }]
      }]
    }, {
      text: '添加轻小说',
      name: 'fictionAdd',
      path: '/book/lightNovel/fictionAdd',
      index: '2-2'
    }, {
      text: '添加卷',
      name: 'volumeAdd',
      path: '/book/lightNovel/volumeAdd',
      index: '2-3'
    }, {
      text: '添加章',
      name: 'chapterAdd',
      path: '/book/lightNovel/chapterAdd',
      index: '2-4'
    }]
  }, {
    text: '这本轻小说真厉害',
    name: 'awesome',
    path: '/book/awesome',
    index: '3',
    node: [{
      text: '轻厉列表',
      name: 'awesomeList',
      path: '/book/awesome/awesomeList',
      index: '3-1'
    }, {
      text: '设置轻厉',
      name: 'awesomeList',
      path: '/book/awesome/awesomeAdd',
      index: '3-2'
    }]
  }]
}

const node = {
  text: '书籍',
  name: 'book',
  path: '/book/lightNovel',
  index: '02'
}

export default {
  data: data,
  node: node
}
