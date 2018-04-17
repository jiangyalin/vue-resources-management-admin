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
        <el-form-item class="s-wh-fl" label="书籍名称" prop="book">
          <el-select style="width: 100%;" v-model="ruleForm.book" filterable>
            <el-option
              v-for="item in bookNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="卷名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="序列号" prop="sequence">
          <el-input-number v-model="ruleForm.sequence" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="发售时间" prop="releaseTime">
          <el-date-picker v-model="ruleForm.releaseTime" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="封面">
          <el-button @click="toggleShow">{{ruleForm.coverBtn}}</el-button>
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
      :width="300"
      :height="400"
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
  import returnBtn from './../../../components/public/returnBtn.vue'
  // 获取卷详情
  const GetVolume = vue => {
    return new Promise((resolve, reject) => {
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
  }
  // 获取所有书籍名称
  const GetFictionAllName = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/lightNovel/fictionAllName',
        params: {
          id: vue.$route.params.fictionId
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
  // 编辑书籍（卷）
  const EditVolume = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/lightNovel/volumeInfo',
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
    name: 'volumeEdit',
    data () {
      return {
        ruleForm: {
          book: '', // 书籍名称
          name: '', // 卷名称
          sequence: '', // 序列号
          releaseTime: this.$moment(), // 发售时间
          coverBtn: '点击上传封面', // 封面
          cover: '' // 封面id
        },
        bookNameOptions: [],
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
          imgDataUrl: '', // the datebase64 url of created image
          noCircle: false,
          noSquare: false,
          noRotate: false
        },
        imgCutData: '',
        rules: {
          book: [
            { required: true, message: '请输入书籍名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          name: [
            { required: true, message: '请输入卷名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          sequence: [
            { required: true, message: '请输入序列号', trigger: 'blur' }
          ],
          releaseTime: [
            { required: true, message: '请选择发售时间', trigger: 'blur' }
          ]
        },
        fileList: [],
        images: [],
        headers: {
          'languageCode': this.$route.params.lang,
          'Authorization': 'Bearer ' + this.$cookie.get('token')
        },
        action: window.config.upload + '/api/upload/book',
        dialogImageUrl: '',
        dialogVisible: false,
        dialogFormVisible: false,
        limit: 1,
        loading: true
      }
    },
    components: {
      'my-upload': myUpload,
      returnBtn: returnBtn
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.cover !== '') {
              // 添加轻小说
              const Volume = EditVolume(this)

              Volume.then((resolve) => {
                if (resolve.data.code === '200') {
                  this.$confirm('编辑卷成功', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'success'
                  }).then(() => {
                    this.$router.push('/' + this.$route.params.lang + '/book/lightNovel/fictionList')
                  })
                }
              }).catch((reject) => {
                window.publicFunction.error(reject, this)
              })
            } else {
              this.$message.error('请先上传封面')
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
        this.ruleForm.cover = jsonData.data.id
        this.ruleForm.coverBtn = jsonData.data.id
      },
      // 封面上传失败
      cropUploadFail (status, field) {
        console.log('上传失败')
        console.log(status)
        console.log('field: ' + field)
      }
    },
    created: function () {
      // 获取所有书籍名称
      const FictionAllName = GetFictionAllName(this)

      // 获取卷详细信息
      const Volume = GetVolume(this)

      Promise.all([FictionAllName, Volume])
        .then((resolve) => {
          this.bookNameOptions = resolve[0].data.data.book.map(data => {
            return {
              value: data._id,
              label: data.bookName
            }
          })

          this.ruleForm = {
            book: resolve[1].data.data.book._id, // 书籍名称
            name: resolve[1].data.data.name, // 卷名称
            sequence: resolve[1].data.data.sequence, // 序列号
            releaseTime: resolve[1].data.data.releaseTime, // 发售时间
            filesBtn: resolve[1].data.data.file._id, // 文件
            file: resolve[1].data.data.file._id, // 文件id
            coverBtn: resolve[1].data.data.cover._id, // 封面
            cover: resolve[1].data.data.cover._id // 封面id
          }
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
