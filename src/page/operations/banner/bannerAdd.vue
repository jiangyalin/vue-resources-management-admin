<template>
  <div class="m-odr" v-loading="loading">
    <transition name="el-fade-in-linear">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini" class="demo-ruleForm">
        <el-form-item class="s-wh-fl" label="标题" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="图片">
          <el-button @click="toggleShow">{{ruleForm.imageBtn}}</el-button>
        </el-form-item>
        <el-form-item style="width: 100%;float: left;">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </transition>
    <my-upload
      field="img"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      v-model="core.show"
      :width="580"
      :height="310"
      :url="core.action"
      :params="core.params"
      :headers="core.headers"
      :noCircle="core.noCircle"
      :noSquare="core.noSquare"
      :noRotate="core.noRotate"
      :withCredentials="core.withCredentials"
      img-format="png"></my-upload>
    <img :src="core.imgDataUrl">
  </div>
</template>

<script type="text/ecmascript-6">
  import myUpload from 'vue-image-crop-upload'
  // 添加Banner
  const AddBanner = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/banner',
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
  export default {
    name: 'bannerAdd',
    data () {
      return {
        ruleForm: {
          name: '', // 姓名
          image: '', // 图片
          imageBtn: '点击上传图片'
        },
        core: {
          action: window.config.upload + '/api/upload/img',
          show: false,
          params: {
            token: '123456798',
            name: 'avatar'
          },
          headers: {
            smail: '*_~',
            'Authorization': 'Bearer ' + this.$cookie.get('token')
          },
          imgDataUrl: '',
          noCircle: false,
          noSquare: false,
          noRotate: false
        },
        imageBtn: '点击上传图片',
        rules: {
          name: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ]
        },
        dialogFormVisible: false,
        loading: false
      }
    },
    components: {
      'my-upload': myUpload
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.image !== '') {
              this.ruleForm = {
                name: this.ruleForm.name, // 标题
                image: this.ruleForm.image
              }
              AddBanner(this).then((resolve) => {
                if (resolve.data.code === '200') {
                  this.$confirm('添加banner成功', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'success'
                  }).then(() => {
                    this.$router.push('/' + this.$route.params.lang + '/operations/banner/bannerList')
                  })
                }
              }).catch((reject) => {
                window.publicFunction.error(reject, this)
              })
            } else {
              this.$message.error('请先上传图片')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      toggleShow () {
        this.core.show = !this.core.show
      },
      // 封面上传成功
      cropUploadSuccess (jsonData, field) {
        console.log('上传成功')
        this.ruleForm.image = jsonData.data.id
        this.ruleForm.imageBtn = jsonData.data.id
      },
      // 封面上传失败
      cropUploadFail (status, field) {
        console.log('上传失败')
        console.log(status)
        console.log('field: ' + field)
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
