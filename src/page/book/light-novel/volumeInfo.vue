<template>
  <div class="m-odr" v-loading="loading">
    <p>书名：{{volume.book}}</p>
    <p>卷名：{{volume.name}}</p>
    <p>序列号：{{volume.sequence}}</p>
    <p>文件：{{volume.file}}</p>
    <p>封面：{{volume.cover}}</p>
    <img :src="volume.cover" style="display: block">
    <returnBtn></returnBtn>
  </div>
</template>

<script type="text/ecmascript-6">
  import returnBtn from './../../../components/public/returnBtn.vue'
  // 获取卷详情
  const GetVolume = vue => {
    const volume = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/lightNovel/volumeInfo',
        params: {
          id: vue.$route.params.volumeId
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
    return volume
  }
  export default {
    name: '',
    data () {
      return {
        volume: {
          sequence: '', // 序列号
          name: '', // 卷名称
          releaseTime: '', // 发售时间
          createTime: '', // 更新时间
          cover: '', // 封面
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
      // 获取卷详细信息
      const Volume = GetVolume(this)

      Volume.then((resolve) => {
        this.volume = {
          sequence: resolve.data.data.sequence, // 序列号
          name: resolve.data.data.name, // 卷名称
          releaseTime: resolve.data.data.releaseTime, // 发售时间
          createTime: resolve.data.data.createTime, // 更新时间
          cover: window.config.upload + resolve.data.data.cover.path + resolve.data.data.cover.name, // 封面
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
