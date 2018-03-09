<template>
  <div class="m-odr" v-loading="loading">
    <p>书名：{{book.bookName}}</p>
    <p>地区：{{book.area}}</p>
    <p>发售时间：{{book.releaseTime}}</p>
    <p>作者：{{book.author}}</p>
    <p>插画师：{{book.illustrator}}</p>
    <p>文件：{{book.files}}</p>
    <p>封面：{{book.cover}}</p>
    <img :src="book.cover" style="display: block">
    <p>简介：{{book.introduction}}</p>
    <returnBtn></returnBtn>
  </div>
</template>

<script type="text/ecmascript-6">
  import returnBtn from './../../../components/public/returnBtn.vue'
  // 获取国家信息
  const GetCountryAll = vue => {
    const country = new Promise((resolve, reject) => {
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
    return country
  }
  // 获取书籍详情
  const GetFiction = vue => {
    const fiction = new Promise((resolve, reject) => {
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
    return fiction
  }
  export default {
    name: '',
    data () {
      return {
        book: {
          bookName: '',
          area: '',
          releaseTime: '',
          author: '',
          illustrator: '',
          cover: '',
          files: '',
          introduction: ''
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

      // 获取书籍详细信息
      const Fiction = GetFiction(this)

      Promise.all([Country, Fiction])
        .then((resolve) => {
          let areaOptions = resolve[0].data.data.content.map(data => {
            return {
              value: data.id,
              label: data.name
            }
          })
          this.areaOptions = areaOptions
          const book = {
            bookName: resolve[1].data.data.bookName,
            area: resolve[1].data.data.area,
            releaseTime: this.$moment(resolve[1].data.data.releaseTime).format('YYYY-MM-DD HH:mm'),
            author: resolve[1].data.data.author,
            illustrator: resolve[1].data.data.illustrator,
            cover: window.config.upload + resolve[1].data.data.cover.path + resolve[1].data.data.cover.name,
            files: window.config.upload + resolve[1].data.data.bookFile.path + resolve[1].data.data.bookFile.name,
            introduction: resolve[1].data.data.introduction
          }
          this.book = book
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
    }
  }
</script>

<style scoped>

</style>
