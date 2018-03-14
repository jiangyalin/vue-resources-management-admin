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
        <el-form-item class="s-wh-fl" label="姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="昵称" prop="nickname">
          <el-input v-model="ruleForm.nickname"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="头像" prop="avatar">
          <el-button @click="dialogFormVisible = true">{{avatarBtn}}</el-button>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="性别" prop="gender">
          <el-select style="width: 100%;" v-model="ruleForm.gender">
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="手机" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="邮箱" prop="eMail">
          <el-input v-model="ruleForm.eMail"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="出生日期" prop="birthDate">
          <el-date-picker v-model="ruleForm.birthDate" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width: 100%;float: left;">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <returnBtn></returnBtn>
        </el-form-item>
      </el-form>
    </transition>
    <el-dialog title="上传头像" :visible.sync="dialogFormVisible" width="740px">
      <canvasAvatar @success="getCoverBase"></canvasAvatar>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="determine">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import CanvasAvatar from './../../../components/public/canvas-avatar/index.vue'
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
  // 编辑用户
  const EditUser = vue => {
    const user = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/user/userInfo',
        data: vue.ruleForm,
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
  // 上传头像
  const UploadAvatar = vue => {
    const avatar = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/upload/avatar',
        data: {
          avatar: vue.avatar
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
    return avatar
  }
  export default {
    name: 'userEdit',
    data () {
      return {
        ruleForm: {
          id: this.$route.params.userId,
          name: '', // 姓名
          nickname: '', // 昵称
          gender: '0', // 性别
          phone: '', // 手机
          eMail: '', // 电子邮箱
          avatar: '', // 头像
          birthDate: this.$moment() // 出生日期
        },
        avatarBtn: '点击上传用户头像',
        rules: {
          name: [
            { required: false, message: '请输入姓名', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          nickname: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          gender: [
            { required: true, message: '请选择性别', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/, message: '手机号格式错误' }
          ],
          eMail: [
            { required: true, message: '请输入电子邮箱', trigger: 'blur' },
            { pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, message: '电子邮箱格式错误' }
          ],
          birthDate: [
            { required: true, message: '请选择出生日期', trigger: 'blur' }
          ]
        },
        dialogFormVisible: false,
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
        loading: false
      }
    },
    components: {
      canvasAvatar: CanvasAvatar,
      returnBtn: returnBtn
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const User = EditUser(this)

            User.then((resolve) => {
              if (resolve.data.code === '200') {
                this.$confirm('编辑用户成功', '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  type: 'success'
                }).then(() => {
                  this.$router.push('/' + this.$route.params.lang + '/user/user/userList')
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
      getCoverBase (msg) {
        this.coverBase = msg
      },
      determine () {
        this.avatar = this.coverBase.DataURL
        // 上传头像
        const Avatar = UploadAvatar(this)

        Avatar.then((resolve) => {
          if (resolve.data.code === '200') {
            this.$confirm('头像上传成功', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'success'
            }).then(() => {
              this.avatarBtn = resolve.data.data.id
              this.ruleForm.avatar = resolve.data.data.id
              this.dialogFormVisible = false
            })
          }
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      }
    },
    created: function () {
      // 获取用户详细信息
      const User = GetUser(this)

      User.then((resolve) => {
        const avatar = resolve.data.data.avatar !== undefined ? resolve.data.data.avatar._id : ''
        const user = {
          id: resolve.data.data._id,
          name: resolve.data.data.name || '', // 姓名
          nickname: resolve.data.data.nickname || '', // 昵称
          gender: resolve.data.data.gender || '', // 性别
          phone: resolve.data.data.phone || '', // 手机
          eMail: resolve.data.data.eMail || '', // 电子邮箱
          avatar: avatar, // 头像
          birthDate: resolve.data.data.birthDate || '' // 出生日期
        }
        if (avatar !== '') this.avatarBtn = avatar
        this.ruleForm = user
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

  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }

  .s-wh-fl{
    width: 50%;
    float: left;
  }
</style>
