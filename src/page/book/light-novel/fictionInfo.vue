<template>
  <div class="m-odr" v-loading="loading">
    <p>书名：{{book.bookName}}</p>
    <p>地区：{{book.area}}</p>
    <p>文库：{{book.library}}</p>
    <p>作者：{{book.author}}</p>
    <p>插画师：{{book.illustrator}}</p>
    <p>简介：{{book.introduction}}</p>
    <p>封面：{{book.cover}}</p>
    <img :src="book.cover" style="display: block">
    <returnBtn></returnBtn>
  </div>
</template>

<script type="text/ecmascript-6">
  import returnBtn from './../../../components/public/returnBtn.vue'
  // 获取国家信息
  const GetCountryAll = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/basis/country',
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
  }
  // 获取文库信息
  const GetLibraryAll = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/basis/library',
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
  }
  // 获取书籍详情
  const GetFiction = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/lightNovel/fictionInfo',
        params: {
          id: vue.$route.params.fictionId
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
  }
  export default {
    name: '',
    data () {
      return {
        book: {
          bookName: '',
          area: '',
          library: '',
          author: '',
          illustrator: '',
          introduction: '',
          cover: ''
        },
        loading: true
      }
    },
    components: {
      returnBtn: returnBtn
    },
    methods: {},
    created: function () {
      // 获取所有国家
      const Country = GetCountryAll(this)

      // 获取所有文库
      const Library = GetLibraryAll(this)

      // 获取书籍详细信息
      const Fiction = GetFiction(this)

      Promise.all([Country, Library, Fiction])
        .then((resolve) => {
          let area = ''
          this.areaOptions = resolve[0].data.data.content.forEach(data => {
            if (resolve[2].data.data.area === data.id) {
              area = data.name
            }
          })
          let library = ''
          this.libraryOptions = resolve[1].data.data.library.forEach(data => {
            if (resolve[2].data.data.library === data.id) {
              library = data.name
            }
          })
          this.book = {
            bookName: resolve[2].data.data.bookName,
            area,
            library,
            author: resolve[2].data.data.author,
            illustrator: resolve[2].data.data.illustrator,
            introduction: resolve[2].data.data.introduction,
            cover: window.config.upload + resolve[2].data.data.cover.path + resolve[2].data.data.cover.name // 封面
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
