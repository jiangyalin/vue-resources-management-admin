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
        <el-form-item class="s-wh-fl" label="文件" prop="file">
          <el-button @click="dialogFormVisible = true">{{ruleForm.filesBtn}}</el-button>
        </el-form-item>
        <el-form-item style="width: 100%;float: left;">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </transition>
    <el-dialog title="上传小说文件" :visible.sync="dialogFormVisible">
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
        <div slot="tip" class="el-upload__tip">只能上传txt文件，且不超过50M</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="dialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>
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
    const volume = new Promise((resolve, reject) => {
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
    return volume
  }
  // 获取所有书籍名称
  const GetFictionAllName = vue => {
    const fiction = new Promise((resolve, reject) => {
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
    return fiction
  }
  // 编辑书籍（卷）
  const EditVolume = vue => {
    const volume = new Promise((resolve, reject) => {
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
    return volume
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
          filesBtn: '点击上传文件', // 文件
          file: '', // 文件id
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
          ],
          file: [
            { required: true, message: '请上传文件', trigger: 'blur' }
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
      imageuploaded (res) {
        if (res.errcode === 0) {
          this.core.src = res.data.src
        }
      },
      // 上传成功
      handleAvatarSuccess (res, file, fileList) {
        this.ruleForm.file = file.response.data.id
        this.ruleForm.filesBtn = file.response.data.id
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
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      addName () {
        console.log(this.ruleForm)
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.file !== '' && this.ruleForm.cover !== '') {
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
              this.$message.error('请先上传文件')
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
