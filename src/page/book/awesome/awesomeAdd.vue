<template>
  <div class="m-odr" v-loading="loading">
    <transition name="el-fade-in-linear">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini" class="demo-ruleForm">
        <el-form-item class="s-wh-fl" label="书籍名称" prop="book">
          <el-select style="width: 100%;" v-model="ruleForm.book" filterable>
            <el-option v-for="item in nameOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="年/届" prop="year">
          <el-select style="width: 100%;" v-model="ruleForm.year" @change="selectYear">
            <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="排名" prop="rank">
          <el-select style="width: 100%;" v-model="ruleForm.rank">
            <el-option v-for="item in rankOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 100%;float: left;">
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
  // 添加书籍（卷）
  const AddAwesome = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/lightNovel/awesome',
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
  // 获取轻小说列表
  const GetAwesomeList = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/lightNovel/awesome',
        params: {
          pageNum: 0,
          year: vue.ruleForm.year
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
          year: '', // 年
          rank: '' // 排名
        },
        nameOptions: [],
        yearOptions: [],
        rankOptions: [],
        rules: {
          book: [
            { required: true, message: '请选择书籍', trigger: 'blur' }
          ],
          year: [
            { required: true, message: '请选择年/届', trigger: 'blur' }
          ],
          rank: [
            { required: true, message: '请选择排名', trigger: 'blur' }
          ]
        },
        fileList: [],
        images: [],
        headers: {
          'languageCode': this.$route.params.lang,
          'Authorization': 'Bearer ' + this.$cookie.get('token')
        },
        action: window.config.upload + '/api/upload/book',
        accept: 'text/*',
        dialogImageUrl: '',
        dialogVisible: false,
        dialogFormVisible: false,
        limit: 1,
        loading: true
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 添加轻小说
            AddAwesome(this).then((resolve) => {
              if (resolve.data.code === '200') {
                this.$confirm('添加榜单成功', '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  type: 'success'
                }).then(() => {
                  this.$router.push('/' + this.$route.params.lang + '/book/awesome/awesomeList')
                })
              } else {
                this.$confirm(resolve.data.message, '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  type: 'warning'
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
      selectYear () {
        GetAwesomeList(this).then((resolve) => {
          let arr = []
          for (let i = 1; i <= 20; i++) {
            let rank = i
            resolve.data.data.content.forEach(data => {
              if (i === data.rank) {
                rank = false
              }
            })
            if (rank) {
              arr.push({
                label: i,
                value: i
              })
            }
          }
          this.rankOptions = arr
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      }
    },
    created: function () {
      // 初始化年/届
      for (let i = this.$moment().format('YYYY'); i >= 2005; i--) {
        this.yearOptions.push({
          label: i,
          value: i
        })
      }
      // 获取所有书籍名称
      Promise.all([GetFictionAllName(this)])
        .then((resolve) => {
          this.nameOptions = resolve[0].data.data.book.map(data => {
            return {
              value: data._id,
              label: data.name
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
</style>
