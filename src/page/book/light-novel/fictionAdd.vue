<template>
  <div class="m-odr"
       v-loading="loading">
    <transition name="el-fade-in-linear">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        size="mini"
        class="demo-ruleForm">
        <el-form-item class="s-wh-fl" label="书籍名称" prop="bookName">
          <el-input v-model="ruleForm.bookName"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="地区" prop="area">
          <el-select style="width: 100%;" v-model="ruleForm.area">
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="文库" prop="library">
          <el-select style="width: 100%;" v-model="ruleForm.library">
            <el-option
              v-for="item in libraryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="封面">
          <el-button @click="toggleShow">{{ruleForm.coverBtn}}</el-button>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="作者" prop="author">
          <el-input v-model="ruleForm.author"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="插画师" prop="illustrator">
          <el-input v-model="ruleForm.illustrator"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="简介" prop="introduction">
          <el-input type="textarea" v-model="ruleForm.introduction"></el-input>
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
  // 获取国家信息
  const GetCountryAll = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/basis/country',
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
  // 获取文库信息
  const GetLibraryAll = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/basis/library',
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
  // 添加书籍
  const AddFiction = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/lightNovel/fiction',
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
    data () {
      return {
        props: {
          value: 'label',
          children: 'cities'
        },
        ruleForm: {
          bookName: '', // 书籍名称
          area: '', // 地区
          library: '', // 文库
          author: '', // 作者
          illustrator: '', // 插画师
          introduction: '', // 简介
          coverBtn: '点击上传封面', // 封面
          cover: '' // 封面id
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
          imgDataUrl: '', // the datebase64 url of created image
          noCircle: false,
          noSquare: false,
          noRotate: false
        },
        rules: {
          bookName: [
            { required: true, message: '请输入书籍名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          area: [
            { required: true, message: '请选择地区', trigger: 'blur' }
          ],
          library: [
            { required: true, message: '请选择文库', trigger: 'blur' }
          ],
          author: [
            { required: true, message: '请输入作者名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          illustrator: [
            { required: true, message: '请输入插画师名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          introduction: [
            { required: false, message: '请输入简介', trigger: 'blur' },
            { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
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
        areaOptions: [],
        libraryOptions: [],
        loading: true
      }
    },
    components: {
      'my-upload': myUpload
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 添加轻小说
            const Fiction = AddFiction(this)

            Fiction.then((resolve) => {
              if (resolve.data.code === '200') {
                this.$confirm('添加轻小说成功', '提示', {
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
      // 获取所有国家
      const Country = GetCountryAll(this)

      // 获取所有文库
      const Library = GetLibraryAll(this)

      Promise.all([Country, Library])
        .then((resolve) => {
          this.areaOptions = resolve[0].data.data.content.map(data => {
            return {
              value: data.id,
              label: data.name
            }
          })
          this.ruleForm.area = this.areaOptions[0].value

          this.libraryOptions = resolve[1].data.data.library.map(data => {
            return {
              value: data.id,
              label: data.name
            }
          })
          this.ruleForm.library = this.libraryOptions[0].value
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

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }

  .s-wh-fl{
    width: 50%;
    float: left;
  }
</style>
