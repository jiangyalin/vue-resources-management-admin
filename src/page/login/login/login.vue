<template>
  <div class="m-lgn">
    <transition name="el-fade-in-linear">
      <div class="loginPage">
        <el-form class="form" :model="ruleForm" ref="ruleForm">
          <div class="item">
            <input type="text" name="username" placeholder="请输入用户名" autocomplete="off" ref="username">
          </div>
          <div class="item">
            <input type="password" name="password" placeholder="请输入密码" autocomplete="off" @keyup.enter="submitForm('ruleForm')" ref="pwd">
          </div>
          <div class="join">
            <p class="join-p" @click="toJoin">去注册</p>
          </div>
          <div class="btn">
            <button type="button" @click="submitForm('ruleForm')">登录</button>
          </div>
        </el-form>
      </div>
    </transition>
    <div class="backstretch">
      <img class="bg-img" @load="imgSize" :style="bgImg1" src="../../../assets/images/login/bgimg.jpg" ref="bgImg">
      <img class="bg-img" @load="imgSize" :style="bgImg2" src="../../../assets/images/login/bgimg2.jpg" ref="bgImg2">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import platform from './../../../router/platform' // 运营
  // 用户登录
  const LoginAccount = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/login',
        data: {
          username: vue.ruleForm.userName,
          password: vue.ruleForm.pwd
        },
        headers: {
          'languageCode': vue.$route.params.lang
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
        bgImg1: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        },
        bgImg2: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        },
        screenWidth: document.body.clientWidth,
        props: {
          value: 'label',
          children: 'cities'
        },
        ruleForm: {
          userName: '', // 用户名
          pwd: '' // 密码
        },
        rules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          pwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ]
        },
        loading: false
      }
    },
    components: {},
    methods: {
      // 去注册
      toJoin () {
        this.$router.push('/' + this.$route.params.lang + '/login/join')
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.userName = this.$refs.username.value
            this.ruleForm.pwd = this.$refs.pwd.value
            // 登录用户
            const Login = LoginAccount(this)

            Login.then((resolve) => {
              if (resolve.data.code === '200') {
                this.$cookie.set('userId', resolve.data.data.user._id, 7)
                this.$cookie.set('userName', resolve.data.data.user.nickname, 7)
                this.$cookie.set('token', resolve.data.data.token, 7)
                console.log('pppp')
                window.setTimeout(() => {
                  this.$router.addRoutes(platform)
                  this.$router.push('/')
                }, 1)
              } else {
                this.$message({
                  type: 'error',
                  message: '登录失败,账号或者密码错误请重试!'
                })
              }
            }).catch((reject) => {
              window.publicFunction.error(reject, this)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      imgSize () {
        if (this.$refs.bgImg) {
          const naturalWidth = this.$refs.bgImg.naturalWidth || 0
          const naturalHeight = this.$refs.bgImg.naturalHeight || 0
          let widthSize = window.innerWidth / naturalWidth
          let heightSize = window.innerHeight / naturalHeight
          if (widthSize > heightSize) {
            this.bgImg1 = {
              position: 'absolute',
              top: (window.innerHeight - widthSize * naturalHeight) / 2 + 'px',
              left: 0,
              zIndex: 2,
              width: '100%',
              height: 'auto',
              opacity: 1
            }
            this.bgImg2 = {
              position: 'absolute',
              top: (window.innerHeight - widthSize * naturalHeight) / 2 + 'px',
              left: 0,
              zIndex: 1,
              width: '100%',
              height: 'auto',
              opacity: 1
            }
          } else {
            this.bgImg1 = {
              position: 'absolute',
              top: 0,
              left: (window.innerWidth - heightSize * naturalWidth) / 2 + 'px',
              zIndex: 2,
              width: 'auto',
              height: '100%',
              opacity: 1
            }
            this.bgImg2 = {
              position: 'absolute',
              top: 0,
              left: (window.innerWidth - heightSize * naturalWidth) / 2 + 'px',
              zIndex: 1,
              width: 'auto',
              height: '100%',
              opacity: 1
            }
          }
        }
      }
    },
    mounted: function () {
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
          this.imgSize()
        })()
      }
    },
    watch: {
      screenWidth (val) {
        this.screenWidth = val
      }
    }
  }
</script>

<style scoped>
  *{
    font-family:"PingFang SC","PingHei","STHeitiSC-Light", "Myriad Set Pro", "Lucida Grande","Helvetica Neue", "Helvetica","microsoft yahei","SimHei", "tahoma", "Arial","Verdana", "sans-serif";
    margin:0;
    padding:0;
    outline:none;
    hide-focus:expression(this.hideFocus=true);
  }
  .loginPage{
    width:490px;
    height:380px;
    position:absolute;
    left:50%;
    top:50%;
    margin:-190px 0 0 -245px;
    background:#fff;
    z-index:9;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    border-radius:6px;
    border-top:5px solid #fc7b29;
  }
  .form{
    padding:140px 80px 20px 80px;
    background:url(../../../assets/images/login/logo.png) no-repeat center 60px;
  }
  .form .join{
    width: 100%;
    height: 12px;
    font-size: 12px;
    color: #ff972b;
    text-align: right;
    line-height: 12px;
    transition: .15s;
  }
  .form .join:hover{
    color: #fc7b29;
  }
  .form .join-p{
    float: right;
    cursor: pointer;
  }
  .form .item{
    height:44px;
    width:330px;
    border:1px solid #dddee1;
    border-radius:5px;
    margin-bottom:18px;
  }
  .form .item input{
    width:100%;
    height:100%;
    border:0;
    background:none;
    text-indent:12px;
  }
  .form .btn{
    background: url(../../../assets/images/login/btn.png) no-repeat center center;
    width:344px;
    height:55px;
    line-height:55px;
    color:#fff;
    position:relative;
    left:-2px;
    margin-top:20px;
  }
  .form .btn button{
    display: block;
    width:100%;
    height:46px;
    border:0;
    background:none;
    font-size:14px;
    line-height:46px;
    color:#fff;
    cursor:pointer;
  }

  .backstretch{
    left: 0;
    top: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    z-index: -999999;
    position: fixed;
  }
  @keyframes bg-img1 {
    0% {
      opacity: 1;
    }
    30% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    80% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes bg-img2 {
    0% {
      opacity: 0;
    }
    30% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .bg-img{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .bg-img:nth-last-of-type(1){
    animation: bg-img1 10s infinite;
  }
  .bg-img:nth-last-of-type(2){
    animation: bg-img2 10s infinite;
  }
</style>

<style>
  .m-lgn .el-form-item__label{
    color: #dadada;
  }
</style>
