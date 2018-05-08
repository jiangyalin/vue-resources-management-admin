<template>
  <div class="m-odr" v-loading="loading">
    <transition name="el-fade-in-linear">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini" class="demo-ruleForm">
        <el-form-item class="s-wh-fl" label="用户" prop="user">
          <el-select style="width: 100%;" v-model="ruleForm.user" filterable>
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="a背景色" prop="type_a_backgroundColor">
          <el-color-picker v-model="ruleForm.type_a_backgroundColor" show-alpha size="small"></el-color-picker>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="a阴影" prop="type_a_boxShadow">
          <el-input v-model="ruleForm.type_a_boxShadow"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="a背景图" prop="type_a_backgroundImage">
          <el-button @click="uploadBtn(0)">{{type_a_backgroundImage_btn}}</el-button>
          <el-input v-model="ruleForm.type_a_backgroundImage"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="网页背景" prop="backgroundImage">
          <el-button @click="uploadBtn(1)">{{backgroundImage_btn}}</el-button>
          <el-input v-model="ruleForm.backgroundImage"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%;float: left;">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </transition>
    <el-dialog title="上传图片" :visible.sync="dialogFormVisible">
      <el-upload
        class="upload-demo"
        :headers="upload.headers"
        :action="upload.action"
        :on-preview="handlePictureCardPreview"
        :file-list="upload.fileList"
        :multiple="upload.true"
        :on-success="handleAvatarSuccess"
        :on-error="handleError"
        :limit="upload.limit"
        :on-remove="handleRemove">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传png,jpg,jpeg,gif文件，且不超过50M</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="uploadDetermineBtn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import CanvasAvatar from './../../../components/public/canvas-avatar/index.vue'
  // 添加用户
  const AddUser = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/user/user',
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
  }
  // 获取全部用户
  const GetUserAll = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/user/user',
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
    name: 'userAdd',
    data () {
      return {
        ruleForm: {
          user: '', // 用户
          type_a_backgroundColor: 'rgba(0, 0, 0, 0)', // 类型a盒子背景颜色raba
          type_a_boxShadow: '', // 类型a盒子阴影 左位移，上位移，扩展，大小，rgba [0, 0, 0, 0, [0, 0, 0, 0]]
          type_a_backgroundImage: '', // 类型a盒子背景图片
          backgroundImage: '' // 网页背景图片
        },
        uploadClickBtnType: 0,
        type_a_backgroundImage_btn: '点击上传a盒子背景图片',
        backgroundImage_btn: '点击上传网页背景图片',
        rules: {
          user: [
            { required: true, message: '请选择用户', trigger: 'blur' }
          ],
          type_a_backgroundColor: [
            { required: true, message: '请选择颜色', trigger: 'blur' }
          ],
          type_a_boxShadow: [
            { required: true, message: '填写阴影值', trigger: 'blur' }
          ],
          type_a_backgroundImage: [
            { required: true, message: '请选择图片', trigger: 'blur' }
          ],
          backgroundImage: [
            { required: true, message: '请选择图片', trigger: 'blur' }
          ],
          birthDate: [
            { required: true, message: '请选择出生日期', trigger: 'blur' }
          ]
        },
        upload: {
          fileList: [],
          images: [],
          headers: {
            'languageCode': this.$route.params.lang,
            'Authorization': 'Bearer ' + this.$cookie.get('token')
          },
          action: window.config.upload + '/api/upload',
          dialogImageUrl: '',
          dialogVisible: false,
          limit: 1
        },
        dialogFormVisible: false,
        userOptions: [],
        loading: false
      }
    },
    components: {
      canvasAvatar: CanvasAvatar
    },
    methods: {
      // 上传成功
      handleAvatarSuccess (res, file, fileList) {
        this.upload.fileList = fileList
      },
      // 上传失败
      handleError (err, file, fileList) {
        if (err) this.$message.error('上传失败')
      },
      // 删除文件
      handleRemove (file, fileList) {
        this.$message.info('删除成功')
      },
      // 上传
      handlePictureCardPreview (file) {
        this.dialogVisible = true
      },
      // 点击上传图片按钮
      uploadBtn (type) {
        this.upload.fileList = []
        this.dialogFormVisible = true
        this.uploadClickBtnType = type
      },
      // 点击上传图片确定按钮
      uploadDetermineBtn () {
        this.dialogFormVisible = false
        if (this.uploadClickBtnType === 0) {
          this.ruleForm.type_a_backgroundImage = this.upload.fileList[0].response.data.id
          this.type_a_backgroundImage_btn = this.upload.fileList[0].response.data.id
        } else if (this.uploadClickBtnType === 1) {
          this.ruleForm.backgroundImage = this.upload.fileList[0].response.data.id
          this.backgroundImage_btn = this.upload.fileList[0].response.data.id
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.avatar === '') {
              this.ruleForm = {
                name: this.ruleForm.name, // 姓名
                nickname: this.ruleForm.nickname, // 昵称
                gender: this.ruleForm.gender, // 性别
                phone: this.ruleForm.phone, // 手机
                eMail: this.ruleForm.eMail, // 电子邮箱
                birthDate: this.$moment() // 出生日期
              }
            }
            const User = AddUser(this)

            User.then((resolve) => {
              if (resolve.data.code === '200') {
                this.$confirm('添加用户成功', '提示', {
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
      init () {
        // 获取所有用户
        GetUserAll(this).then(resolve => {
          this.userOptions = resolve.data.data.content.map(data => {
            return {
              value: data._id,
              label: data.nickname,
              name: data.name
            }
          })
        }).catch(reject => {
          window.publicFunction.error(reject, this)
        })
      }
    },
    created: function () {
      this.init()
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
