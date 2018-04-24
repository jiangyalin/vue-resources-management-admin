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
          <el-select style="width: 100%;" v-model="ruleForm.book" @change="getVolume" filterable>
            <el-option
              v-for="item in bookNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="卷名称" prop="volume">
          <el-select style="width: 100%;" v-model="ruleForm.volume" filterable>
            <el-option
              v-for="item in volumeNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="章名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="序列号" prop="sequence">
          <el-input-number v-model="ruleForm.sequence" :min="0" :max="100"></el-input-number>
        </el-form-item>
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
  // 获取此书籍下所有卷名称
  const GetVolumeAllName = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/lightNovel/volumeAllName',
        params: {
          id: vue.ruleForm.book
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
  // 添加书籍（章）
  const AddChapter = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/lightNovel/chapter',
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
  // 验证章
  const VerificationChapter = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/lightNovel/chapter/verification',
        params: {
          book: vue.ruleForm.book, // 书籍名称
          volume: vue.ruleForm.volume, // 卷名称
          name: vue.ruleForm.name, // 章节名称
          sequence: vue.ruleForm.sequence // 序列号
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
    data () {
      return {
        props: {
          value: 'label',
          children: 'cities'
        },
        ruleForm: {
          book: '', // 书籍名称
          volume: '', // 卷名称
          name: '', // 章节名称
          content: '',
          sequence: '1' // 序列号
        },
        editorOption: {
          height: '500px',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'], // 加粗/斜体/下划线/删除线
              ['blockquote', 'code-block'], // 底纹
              [{ 'header': 1 }, { 'header': 2 }], // 标题大小
              [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 序号
              [{ 'script': 'sub' }, { 'script': 'super' }], // 上标，角标
              [{ 'indent': '-1' }, { 'indent': '+1' }], // 文本方向
              [{ 'direction': 'rtl' }], // 行方向
              [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 标题分级
              [{ 'color': [] }, { 'background': [] }], // 字体颜色，底色
              [{ 'align': [] }],
              ['link', 'image'], // 超链接/图片/视频/公式
              ['clean'] // 清楚格式
            ]
          }
        },
        bookNameOptions: [],
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
        loading: true
      }
    },
    methods: {
      onEditorChange (event) {
        this.ruleForm.content = event.html
      },
      // 获取所有卷名称
      getVolume () {
        const Volume = GetVolumeAllName(this)

        Volume.then((resolve) => {
          this.volumeNameOptions = resolve.data.data.volume.map(data => {
            return {
              value: data._id,
              label: '第' + this.$NzhCn.encodeS(data.sequence) + '卷 ' + data.name
            }
          })
          this.ruleForm.volume = this.volumeNameOptions[0].value
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      },
      addChapter () {
        // 添加轻小说
        AddChapter(this).then((resolve) => {
          if (resolve.data.code === '200') {
            this.$confirm('添加章成功', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'success'
            }).then(() => {
              this.$router.push('/' + this.$route.params.lang + '/book/lightNovel/fictionList/volumeList/' + this.ruleForm.book + '/chapterList/' + this.ruleForm.volume)
            })
          }
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 验证章
            VerificationChapter(this).then((resolve) => {
              if (resolve.data.code !== '200') {
                const text = resolve.data.message + '，是否确认覆盖此章'
                this.$confirm(text, '提示', {
                  confirmButtonText: '确定',
                  type: 'success'
                }).then(() => {
                  this.addChapter()
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消操作'
                  })
                })
              } else {
                this.addChapter()
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
      }
    },
    created: function () {
      // 获取所有书籍名称
      const FictionAllName = GetFictionAllName(this)

      Promise.all([FictionAllName])
        .then((resolve) => {
          this.bookNameOptions = resolve[0].data.data.book.map(data => {
            return {
              value: data._id,
              label: data.bookName
            }
          })
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

  .u-quill{
    float: left;
    padding: 0 0 30px 30px;
    width: 100%;
    box-sizing: border-box;
  }
</style>
