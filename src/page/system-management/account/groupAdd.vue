<template>
  <div class="m-odr" v-loading="loading">
    <transition name="el-fade-in-linear">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        size="mini"
        class="demo-ruleForm">
        <el-form-item style="width: 50%;float: left;" label="编号" prop="code">
          <el-input v-model="ruleForm.code"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="电子邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="QQ" prop="qq">
          <el-input v-model="ruleForm.qq"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="微信" prop="wechat">
          <el-input v-model="ruleForm.wechat"></el-input>
        </el-form-item>
        <el-form-item class="s-fl s-wd-100">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  // 添加用户
  const AddAccount = vue => {
    const account = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.serverLogin + '/api/v1/group/accounts',
        data: {
          account: vue.ruleForm.code,
          name: vue.ruleForm.name,
          type: 'OPERATOR',
          email: vue.ruleForm.email,
          mobile: vue.ruleForm.mobile,
          qq: vue.ruleForm.qq,
          wechat: vue.ruleForm.wechat
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
    return account
  }
  export default {
    data () {
      return {
        ruleForm: {
          code: '', // 组名
          name: '', // 姓名
          email: '', // 电子邮箱
          mobile: '', // 手机
          wechat: '', // 手机
          qq: '' // qq
        },
        rules: {
          code: [
            { required: true, message: '请输入唯一业主编码', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          email: [
            { required: true, message: '请输入电子邮箱', trigger: 'blur' },
            { pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: 'E-mail格式错误', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          qq: [
            { required: false, message: '请输入QQ', trigger: 'blur' }
          ],
          wechat: [
            { required: false, message: '请输入微信号', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ]
        },
        loading: false
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 添加用户
            const Account = AddAccount(this)

            Account.then((resolve) => {
              this.$confirm('业主信息添加成功', '提示', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'success'
              }).then(() => {
                this.$router.push('/' + this.$route.params.lang + '/systemManagement/account/groupList')
              })
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
      }
    },
    created: function () {

    }
  }
</script>

<style scoped>
  .m-odr{
    overflow: auto;
    padding: 30px 30px 0 0;
  }
</style>
