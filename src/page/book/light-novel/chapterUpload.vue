<template>
  <div v-loading="loading">
    <transition name="el-fade-in-linear">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini" class="demo-ruleForm">
        <div class="s-wh-fl u-quill">
          <quill-editor ref="myTextEditor" :content="ruleForm.content" :options="editorOption" @change="onEditorChange"></quill-editor>
        </div>
        <el-form-item class="s-wh-fl">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  // 编辑书籍（章）
  const EditChapter = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/lightNovel/chapterInfo',
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
          content: ''
        },
        editorOption: {
          height: '500px'
        },
        nameOptions: [],
        volumeNameOptions: [],
        rules: {
          book: [
            { required: true, message: '请输入书籍名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          volume: [
            { required: true, message: '请输入卷名称', trigger: 'blur' },
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
          ]
        },
        loading: false
      }
    },
    components: {},
    methods: {
      onEditorChange (event) {
        this.ruleForm.content = event.html
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('ruleForm', this.ruleForm)
            // 编辑轻小说
//            const Chapter = EditChapter(this)
//
//            Chapter.then((resolve) => {
//              if (resolve.data.code === '200') {
//                this.$confirm('编辑章成功', '提示', {
//                  confirmButtonText: '确定',
//                  showCancelButton: false,
//                  type: 'success'
//                }).then(() => {
//                  this.$router.push('/' + this.$route.params.lang + '/book/lightNovel/fictionList')
//                })
//              }
//            })
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
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }

  .s-wh-fl{
    width: 50%;
    float: left;
  }

  .u-quill{
    float: left;
    padding-bottom: 30px;
    width: 100%;
    box-sizing: border-box;
  }
</style>

<style>
  .ql-container{
    height: 660px;
  }
</style>
