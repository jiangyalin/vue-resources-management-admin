<template>
  <div class="m-odr" v-loading="loading">
    <p>名称：{{app.name}}</p>
    <p>类型：{{app.type}}</p>
    <p>内容：{{app.content}}</p>
    <p>图片：{{app.img}}</p>
    <img :src="app.img" style="display: block">
    <returnBtn></returnBtn>
  </div>
</template>

<script type="text/ecmascript-6">
  import returnBtn from './../../../components/public/returnBtn.vue'
  // 获取app详情
  const GetApp = vue => {
    const app = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/yaoxiao/appInfo',
        params: {
          id: vue.$route.params.appId
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
    return app
  }
  export default {
    name: '',
    data () {
      return {
        app: {
          name: '',
          type: '',
          content: '',
          img: ''
        },
        loading: true
      }
    },
    components: {
      returnBtn: returnBtn
    },
    methods: {},
    created: function () {
      // 获取app详细信息
      const App = GetApp(this)

      App.then((resolve) => {
        const app = {
          name: resolve.data.data.name,
          type: resolve.data.data.type,
          content: resolve.data.data.content,
          img: window.config.server + resolve.data.data.img.path + resolve.data.data.img.name
        }
        this.app = app
        this.loading = false
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style scoped>

</style>
