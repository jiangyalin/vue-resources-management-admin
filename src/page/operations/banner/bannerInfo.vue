<template>
  <div class="m-odr" v-loading="loading">
    <p>标题：{{banner.name}}</p>
    <p>创建时间：{{banner.createTime}}</p>
    <p>图片：{{banner.image}}</p>
    <img :src="banner.image" style="display: block">
    <returnBtn></returnBtn>
  </div>
</template>

<script type="text/ecmascript-6">
  import returnBtn from './../../../components/public/returnBtn.vue'
  // 获取Banner详情
  const GetBanner = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/banner/' + vue.$route.params.bannerId,
        params: {},
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
    name: 'bannerInfo',
    data () {
      return {
        banner: {
          name: '',
          image: '',
          createTime: ''
        },
        loading: true
      }
    },
    components: {
      returnBtn: returnBtn
    },
    methods: {},
    created: function () {
      // 获取Banner详细信息
      GetBanner(this).then((resolve) => {
        this.banner = {
          name: resolve.data.data.name,
          image: window.config.upload + resolve.data.data.image.path + resolve.data.data.image.name,
          createTime: this.$moment(resolve.data.data.createTime).format('YYYY-MM-DD')
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
