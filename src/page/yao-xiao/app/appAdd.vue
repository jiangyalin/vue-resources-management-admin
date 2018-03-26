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
        <el-form-item class="s-wh-fl" label="名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="类型" prop="type">
          <el-select style="width: 100%;" v-model="ruleForm.type">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="内容" prop="content">
          <el-input v-model="ruleForm.content"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="图片" prop="img">
          <el-button @click="dialogFormVisible = true">{{imgBtn}}</el-button>
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
        :headers="headers"
        :action="action"
        :on-preview="handlePictureCardPreview"
        :file-list="fileList"
        :multiple="true"
        :on-success="handleAvatarSuccess"
        :on-error="handleError"
        :limit="limit"
        :on-remove="handleRemove">
        <el-button
          slot="trigger"
          size="small"
          type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传png,jpg,jpeg,gif文件，且不超过50M</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="dialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import CanvasAvatar from './../../../components/public/canvas-avatar/index.vue'
  // 添加用户
  const AddApp = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/yaoxiao/app',
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
  // 上传头像
  const UploadAvatar = vue => {
    return new Promise((resolve, reject) => {
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
  }
  export default {
    name: 'userAdd',
    data () {
      return {
        ruleForm: {
          name: '', // 名称
          type: '0', // 类型
          content: '', // 内容
          img: '' // 图片
        },
        imgBtn: '点击上传app图片',
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          type: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          img: [
            { required: true, message: '请选择图片', trigger: 'click' }
          ]
        },
        fileList: [],
        images: [],
        headers: {
          'languageCode': this.$route.params.lang,
          'Authorization': 'Bearer ' + this.$cookie.get('token')
        },
        action: window.config.upload + '/api/upload',
        dialogImageUrl: '',
        dialogVisible: false,
        limit: 1,
        dialogFormVisible: false,
        typeOptions: [{
          value: '0',
          label: '甲'
        }, {
          value: '1',
          label: '乙'
        }, {
          value: '2',
          label: '丙'
        }],
        loading: false
      }
    },
    components: {
      canvasAvatar: CanvasAvatar
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const App = AddApp(this)

            App.then((resolve) => {
              if (resolve.data.code === '200') {
                this.$confirm('添加app成功', '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  type: 'success'
                }).then(() => {
                  this.$router.push('/' + this.$route.params.lang + '/yaoxiao/app/appList')
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
      // 上传成功
      handleAvatarSuccess (res, file, fileList) {
        this.ruleForm.img = file.response.data.id
        this.imgBtn = this.ruleForm.img
      },
      // 上传失败
      handleError (err, file, fileList) {
        this.$message.error('网络错误')
        console.log(err)
      },
      // 删除文件
      handleRemove (file, fileList) {
        console.log('file', file)
      },
      // 上传
      handlePictureCardPreview (file) {
        this.dialogVisible = true
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
              this.dialogFormVisible = false
            })
          }
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      }
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
