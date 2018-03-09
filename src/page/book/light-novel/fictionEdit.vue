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
        <el-form-item class="s-wh-fl" label="发售时间" prop="releaseTime">
          <el-date-picker
            v-model="ruleForm.releaseTime"
            type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="作者" prop="author">
          <el-input v-model="ruleForm.author"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="插画师" prop="illustrator">
          <el-input v-model="ruleForm.illustrator"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="文件" prop="fileId">
          <el-button @click="dialogFormVisible = true">{{ruleForm.filesBtn}}</el-button>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="封面">
          <el-button @click="toggleShow">{{ruleForm.coverBtn}}</el-button>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="简介" prop="introduction">
          <el-input type="textarea" v-model="ruleForm.introduction"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%;float: left;">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <returnBtn></returnBtn>
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
  // 获取国家信息
  const GetCountryAll = vue => {
    const country = new Promise((resolve, reject) => {
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
    return country
  }
  // 获取书籍详情
  const GetFiction = vue => {
    const fiction = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/lightNovel/fictionInfo',
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
  // 添加渠道
  const AddFiction = vue => {
    const fiction = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/lightNovel/fictionInfo',
        data: {
          id: vue.$route.params.fictionId,
          ...vue.ruleForm
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
  export default {
    data () {
      return {
        props: {
          value: 'label',
          children: 'cities'
        },
        ruleForm: {
          bookName: '', // 书籍名称
          area: '0', // 地区
          releaseTime: this.$moment(), // 发售时间
          author: '', // 作者
          illustrator: '', // 插画师
          filesBtn: '点击上传文件', // 文件
          fileId: '', // 文件id
          coverBtn: '点击上传封面', // 封面
          coverId: '', // 封面id
          introduction: '' // 简介
        },
        core: {
          action: window.config.upload + '/api/upload/img',
          show: false,
          params: {
            token: '123456798',
            name: 'avatar'
          },
          headers: {
            smail: '*_~'
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
          releaseTime: [
            { required: true, message: '请输选择发售时间', trigger: 'blur' }
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
          fileId: [
            { required: true, message: '请上传文件', trigger: 'blur' }
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
        action: window.config.upload + '/api/upload',
        dialogImageUrl: '',
        dialogVisible: false,
        dialogFormVisible: false,
        limit: 1,
        areaOptions: [{
          value: '0',
          label: '日本'
        }, {
          value: '1',
          label: '中国'
        }],
        stateOptions: [{
          value: '0',
          label: '未激活'
        }, {
          value: '1',
          label: '激活'
        }],
        loading: true
      }
    },
    methods: {
      // 上传成功
      handleAvatarSuccess (res, file, fileList) {
        this.ruleForm.fileId = file.response.data.id
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
      toggleShow () {
        this.core.show = !this.core.show
      },
      // 封面上传成功
      cropUploadSuccess (jsonData, field) {
        this.ruleForm.coverId = jsonData.data.id
        this.ruleForm.coverBtn = jsonData.data.id
      },
      // 封面上传失败
      cropUploadFail (status, field) {
        console.log('上传失败')
        console.log(status)
        console.log('field: ' + field)
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.fileId !== '') {
              // 添加渠道
              const Fiction = AddFiction(this)

              Fiction.then((resolve) => {
                if (resolve.data.code === '200') {
                  this.$confirm('编辑轻小说成功', '提示', {
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
      }
    },
    components: {
      'my-upload': myUpload,
      returnBtn: returnBtn
    },
    created: function () {
      // 获取所有国家
      const Country = GetCountryAll(this)

      Country.then((resolve) => {
        let areaOptions = resolve.data.data.content.map(data => {
          return {
            value: data.id,
            label: data.name
          }
        })
        this.areaOptions = areaOptions
        this.loading = false
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取书籍详细信息
      const Fiction = GetFiction(this)

      Fiction.then((resolve) => {
        const ruleForm = {
          bookName: resolve.data.data.bookName,
          area: resolve.data.data.area,
          releaseTime: resolve.data.data.releaseTime,
          author: resolve.data.data.author,
          illustrator: resolve.data.data.illustrator,
          filesBtn: resolve.data.data.bookFile._id,
          fileId: resolve.data.data.bookFile,
          coverBtn: resolve.data.data.cover._id,
          coverId: resolve.data.data.cover,
          introduction: resolve.data.data.introduction
        }
        this.ruleForm = ruleForm
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
