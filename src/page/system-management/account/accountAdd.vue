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
        <el-form-item style="width: 50%;float: left;" label="登录名" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="密码" prop="pwd">
          <el-input type="password" auto-complete="off" v-model="ruleForm.pwd"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="电子邮箱" prop="eMail">
          <el-input v-model="ruleForm.eMail"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="用户类型" prop="userType">
          <el-select style="width: 100%;" v-model="ruleForm.userType" @change="getAccountGroup">
            <el-option
              v-for="item in userTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="所属公司" prop="groupName">
          <el-select style="width: 100%;" v-model="ruleForm.groupName">
            <el-option
              v-for="item in groupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
  // 获取业主信息
  const GetGroupAccountsList = (vue) => {
    const accounts = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.serverLogin + '/api/v1/accounts',
        params: {
          userType: vue.ruleForm.userType,
          accountType: 'USER_GROUP'
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
    return accounts
  }
  // 添加用户
  const AddAccount = vue => {
    const account = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.serverLogin + '/api/v1/accounts',
        data: {
          account: vue.ruleForm.userName,
          name: vue.ruleForm.name,
          password: vue.ruleForm.pwd,
          email: vue.ruleForm.eMail,
          mobile: vue.ruleForm.mobile,
          type: vue.ruleForm.userType,
          groupName: vue.ruleForm.groupName
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
        props: {
          value: 'label',
          children: 'cities'
        },
        ruleForm: {
          userName: '', // 用户名
          pwd: '', // 密码
          name: '', // 姓名
          eMail: '', // 电子邮箱
          userType: 'PLATFORM', // 用户类型
          mobile: '', // 手机
          groupName: '' // 业主
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
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          eMail: [
            { required: true, message: '请输入电子邮箱', trigger: 'blur' },
            { pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: 'E-mail格式错误', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          userType: [
            { required: true, message: '请选择用户类型', trigger: 'blur' }
          ],
          groupName: [
            { required: false, message: '请选择用户所属公司', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ]
        },
        userTypeOption: [{
          value: 'PLATFORM',
          label: '运营'
        }, {
          value: 'OPERATOR',
          label: '业主'
        }],
        groupOptions: [],
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
              this.$confirm('账户添加成功', '提示', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'success'
              }).then(() => {
                this.$router.push('/' + this.$route.params.lang + '/systemManagement/account/accountList')
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
      },
      getAccountGroup () {
        const groups = GetGroupAccountsList(this)

        groups.then((resolve) => {
          let groupOptions = []
          groupOptions = resolve.data.content.map(data => {
            return {
              value: data.account,
              label: data.name
            }
          })
          this.groupOptions = groupOptions
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      }
    },
    created: function () {
      const groups = GetGroupAccountsList(this)

      groups.then((resolve) => {
        let groupOptions = []
        groupOptions = resolve.data.content.map(data => {
          return {
            value: data.account,
            label: data.name
          }
        })
        this.groupOptions = groupOptions
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      Promise.all([groups])
        .then((resolve) => {
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
    }
  }
</script>

<style scoped>
  .m-odr{
    overflow: auto;
    padding: 30px 30px 0 0;
  }
</style>
