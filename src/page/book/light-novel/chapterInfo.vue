<template>
  <div class="m-odr" v-loading="loading">
    <p>书名：{{chapter.book}}</p>
    <p>卷名：{{chapter.volume}}</p>
    <p>章名：{{chapter.name}}</p>
    <p>序列号：{{chapter.sequence}}</p>
    <p>文件：{{chapter.file}}</p>
    <returnBtn></returnBtn>
  </div>
</template>

<script type="text/ecmascript-6">
  import returnBtn from './../../../components/public/returnBtn.vue'
  // 获取章详情
  const GetChapter = vue => {
    const chapter = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/lightNovel/chapterInfo',
        params: {
          id: vue.$route.params.chapterId
        },
        headers: {
          'languageCode': vue.$route.params.lang,
          'Authorization': 'Bearer ' + vue.$cookie.get('token')
        }
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
    return chapter
  }
  export default {
    name: '',
    data () {
      return {
        chapter: {
          sequence: '', // 序列号
          name: '', // 章名称
          volume: '', // 卷名称
          file: '', // 文件
          book: '' // 书
        },
        loading: true
      }
    },
    components: {
      returnBtn: returnBtn
    },
    methods: {},
    created: function () {
      // 获取章详细信息
      const Chapter = GetChapter(this)

      Chapter.then((resolve) => {
        this.chapter = {
          sequence: resolve.data.data.sequence, // 序列号
          volume: resolve.data.data.volume.name, // 卷名称
          name: resolve.data.data.name, // 章名称
          file: window.config.upload + resolve.data.data.file.path + resolve.data.data.file.name, // 文件
          book: resolve.data.data.book.bookName // 书
        }
        this.loading = false
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style scoped>

</style>
