<template>
  <div class="m-odr" v-loading="loading">
    <p>姓名：{{user.name}}</p>
    <p>昵称：{{user.nickname}}</p>
    <p>性别：{{user.gender}}</p>
    <p>手机：{{user.phone}}</p>
    <p>电子邮箱：{{user.eMail}}</p>
    <p>出生日期：{{user.birthDate}}</p>
    <p>头像：{{user.avatar}}</p>
    <img :src="user.avatar" style="display: block">
    <returnBtn></returnBtn>
  </div>
</template>

<script type="text/ecmascript-6">
  import returnBtn from './../../../components/public/returnBtn.vue'
  // 获取用户详情
  const GetUser = vue => {
    const user = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/user/userInfo',
        params: {
          id: vue.$route.params.userId
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
    return user
  }
  export default {
    name: '',
    data () {
      return {
        user: {
          name: '', // 姓名
          nickname: '', // 昵称
          gender: '0', // 性别
          phone: '', // 手机
          eMail: '', // 电子邮箱
          avatar: '', // 头像
          birthDate: this.$moment() // 出生日期
        },
        genderOptions: [{
          value: '0',
          label: '保密'
        }, {
          value: '1',
          label: '男'
        }, {
          value: '2',
          label: '女'
        }],
        loading: true
      }
    },
    components: {
      returnBtn: returnBtn
    },
    methods: {},
    created: function () {
      // 获取用户详细信息
      const User = GetUser(this)

      User.then((resolve) => {
        const avatar = resolve.data.data.avatar !== undefined ? window.config.server + resolve.data.data.avatar.path + resolve.data.data.avatar.name : ''
        const user = {
          name: resolve.data.data.name || '', // 姓名
          nickname: resolve.data.data.nickname || '', // 昵称
          gender: resolve.data.data.gender || '', // 性别
          phone: resolve.data.data.phone || '', // 手机
          eMail: resolve.data.data.eMail || '', // 电子邮箱
          avatar: avatar, // 头像
          birthDate: this.$moment(resolve.data.data.birthDate || '').format('YYYY-MM-DD HH:mm') // 出生日期
        }
        this.user = user
        this.loading = false
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style scoped>

</style>
