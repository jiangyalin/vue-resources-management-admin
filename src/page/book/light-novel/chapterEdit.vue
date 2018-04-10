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
          <el-input-number v-model="ruleForm.sequence" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <!--<el-form-item class="s-wh-fl" label="文件" prop="file">-->
          <!--<el-button @click="dialogFormVisible = true">{{ruleForm.filesBtn}}</el-button>-->
        <!--</el-form-item>-->
        <div class="s-wh-fl u-quill">
          <quill-editor ref="myTextEditor" :content="ruleForm.content" :options="editorOption" @change="onEditorChange"></quill-editor>
        </div>
        <el-form-item style="width: 100%;float: left;">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import myUpload from 'vue-image-crop-upload'
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
  // 获取章详情
  const GetChapter = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/lightNovel/chapterInfo',
        params: {
          id: vue.$route.params.chapterId
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
          book: '', // 书籍名称
          volume: '', // 卷名称
          name: '', // 章节名称
          content: '',
          sequence: '' // 序列号
        },
        editorOption: {
          height: '500px'
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
          ],
          file: [
            { required: true, message: '请上传文件', trigger: 'blur' }
          ]
        },
        loading: true
      }
    },
    components: {
      'my-upload': myUpload
    },
    methods: {
      onEditorChange (event) {
        this.ruleForm.content = event.html
        console.log('event', event)
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
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.file !== '') {
              // 添加轻小说
              const Chapter = EditChapter(this)

              Chapter.then((resolve) => {
                if (resolve.data.code === '200') {
                  this.$confirm('编辑章成功', '提示', {
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
    created: function () {
      // 获取所有书籍名称
      const FictionAllName = GetFictionAllName(this)

      // 获取所有卷名称
      const Chapter = GetChapter(this)

      Promise.all([FictionAllName, Chapter])
        .then((resolve) => {
          this.bookNameOptions = resolve[0].data.data.book.map(data => {
            return {
              value: data._id,
              label: data.bookName
            }
          })

          this.ruleForm = {
            sequence: resolve[1].data.data.sequence, // 序列号
            volume: resolve[1].data.data.volume._id, // 卷名称
            name: resolve[1].data.data.name, // 章名称
            file: resolve[1].data.data.file._id, // 文件
            filesBtn: resolve[1].data.data.file._id, // 文件
            content: resolve[1].data.data.file.content,
            book: resolve[1].data.data.book._id // 书
          }

          // 获取所有卷名称
          const VolumeAllName = GetVolumeAllName(this)

          VolumeAllName.then((resolve) => {
            this.volumeNameOptions = resolve.data.data.volume.map(data => {
              return {
                value: data._id,
                label: data.name
              }
            })

            this.loading = false
          }).catch((reject) => {
            window.publicFunction.error(reject, this)
          })
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

  .u-quill{
    float: left;
    padding: 0 0 30px 30px;
    width: 100%;
    box-sizing: border-box;
  }
</style>
