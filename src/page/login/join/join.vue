<template>
  <div class="m-lgn">
    <transition name="el-fade-in-linear">
      <div class="loginPage">
        <div class="form">
          <div class="item">
            <input type="text" placeholder="请输入邮箱" autocomplete="off" ref="eMail" value="">
          </div>
          <div class="item">
            <input type="password" placeholder="请输入密码" autocomplete="off" ref="pwd" value="">
          </div>
          <div class="item">
            <input type="password" placeholder="请再次输入密码" autocomplete="off" ref="newPwd" value="">
          </div>
          <div class="btn">
            <button type="button" @click="submitForm('ruleForm')">注册</button>
          </div>
        </div>
      </div>
    </transition>
    <div class="backstretch">
      <img class="bg-img" @load="imgSize" :style="bgImg1" src="../../../assets/images/login/bgimg.jpg" ref="bgImg">
      <img class="bg-img" @load="imgSize" :style="bgImg2" src="../../../assets/images/login/bgimg2.jpg" ref="bgImg2">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 用户注册
  const JoinUser = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/join',
        data: {
          eMail: vue.ruleForm.eMail,
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
          eMail: '', // 邮箱
          pwd: '', // 密码
          newPwd: '',
          verificationCode: '', // 验证码
          btnText: '发送验证码'
        },
        loading: false
      }
    },
    components: {},
    methods: {
      // 数据同步
      dataSync () {
        this.ruleForm.eMail = this.$refs.eMail.value
        this.ruleForm.pwd = this.$refs.pwd.value
        this.ruleForm.newPwd = this.$refs.newPwd.value
      },
      // 验证
      verification (callback) {
        if (this.ruleForm.eMail === '') {
          this.$message.warning('邮箱不能为空')
        } else if (!new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$').test(this.ruleForm.eMail)) {
          this.$message.warning('邮箱格式错误')
        } else if (this.ruleForm.pwd === '') {
          this.$message.warning('密码不能为空')
        } else if (!new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5]{6,18}$').test(this.ruleForm.pwd)) {
          this.$message.warning('密码应为有数字，字母，下划线组成的6-18位的组合')
        } else if (this.ruleForm.newPwd !== this.ruleForm.pwd) {
          this.$message.warning('两次密码不相同')
        } else {
          callback()
        }
      },
      submitForm () {
        this.dataSync()
        this.verification(() => {
          // 注册用户
          const Join = JoinUser(this)

          Join.then((resolve) => {
            if (resolve.data.code !== '200') return this.$message.warning(resolve.data.message)
            this.$message.success('已向你的邮箱发送验证邮件，请查看邮件激活账号')
            this.$router.push('/')
          }).catch((reject) => {
            window.publicFunction.error(reject, this)
          })
        })
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
    height:420px;
    position:absolute;
    left:50%;
    top:50%;
    margin:-210px 0 0 -245px;
    background:#fff;
    z-index:9;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    border-radius:6px;
    border-top:5px solid #fc7b29;
  }
  .form{
    padding:140px 80px 20px 80px;
    background:url(../../../assets/images/join/logo.png) no-repeat center 60px;
  }
  .form .item{
    position: relative;
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
  .u-code-it{
    padding-right: 100px;
    box-sizing: border-box;
  }
  .u-code{
    position: absolute;
    top: 0;
    right: 0;
    width: 90px;
    height: 44px;
    color: #747272;
    font-size: 12px;
    line-height: 44px;
    border: 0;
    background-color: rgba(221, 221, 221, 1);
    cursor: pointer;
  }
  .form .btn{
    background: url(../../../assets/images/join/btn.png) no-repeat center center;
    width:344px;
    height:55px;
    line-height:55px;
    color:#fff;
    position:relative;
    left:-2px;
    margin-top:32px;
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
