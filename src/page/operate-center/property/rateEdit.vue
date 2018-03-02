<template>
  <div class="s-max-width-10"
       v-loading="loading">
    <div class="m-menu" v-if="propertyInfo.numbering !== ''">
      <el-badge>房源编号: {{propertyInfo.numbering}}</el-badge>
      <el-badge style="margin-left: 10px">房源名称: {{propertyInfo.name}}</el-badge>
    </div>
    <transition name="el-fade-in-linear">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        size="mini"
        class="demo-ruleForm">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="ruleForm.date"
            size="mini"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="item.name"
          v-for="item in ruleForm.peoples"
          :key="item.index">
          <el-input v-model="item.people"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  // 获取房源可入住人数
  const GetPeoplenum = vue => {
    const peoplenum = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rate/' + vue.$route.params.propertyId + '/peoplenum',
        params: {},
        headers: {
          'languageCode': vue.$route.params.lang,
          'Authorization': 'Bearer ' + vue.$cookie.get('token')
        }
      }).then((response) => {
        resolve(response)
      }).catch(function (error) {
        reject(error)
      })
    })
    return peoplenum
  }
  // 设置基础价
  const EditPrice = vue => {
    const prices = vue.ruleForm.peoples.map(data => {
      return {
        price: data.people,
        type: data.index
      }
    })
    const price = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/rate/' + vue.$route.params.propertyId + '/price',
        data: {
          end: vue.$moment(vue.ruleForm.date[1]).format('YYYY-MM-DD'),
          prices: prices,
          start: vue.$moment(vue.ruleForm.date[0]).format('YYYY-MM-DD')
        },
        headers: {
          'languageCode': vue.$route.params.lang,
          'Authorization': 'Bearer ' + vue.$cookie.get('token')
        }
      }).then((response) => {
        resolve(response)
      }).catch(function (error) {
        reject(error)
      })
    })
    return price
  }
  export default {
    data () {
      return {
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now()
          }
        },
        props: {
          value: 'label',
          children: 'cities'
        },
        ruleForm: {
          date: '', // 日期
          peoples: []
        },
        rules: {
          date: [
            { required: true, message: '请选择日期', trigger: 'blur' }
          ],
          peoples: [
            { required: true, message: '请输入价格', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ]
        },
        loading: true
      }
    },
    props: ['propertyInfo'],
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let state = true
            this.ruleForm.peoples.forEach(data => {
              if (data.people === '' || isNaN(data.people)) {
                state = false
              }
            })

            if (state) {
              const Price = EditPrice(this)

              Price.then((resolve) => {
                if (resolve.data.code === '200') {
                  this.$confirm('房价信息编辑成功', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'success'
                  }).then(() => {
                    this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/rateList/' + this.$route.params.propertyId)
                  })
                } else {
                  this.$message.error('网络错误')
                }
              }).catch((reject) => {
                this.$message.error('网络错误')
                window.publicFunction.error(reject, this)
              })
            }
            if (!state) {
              this.$message({
                type: 'error',
                message: '价格错误'
              })
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
      // 获取最大可入住人数
      const Peoplenum = GetPeoplenum(this)

      Peoplenum.then((resolve) => {
        let peoples = []
        for (let i = 0; i < resolve.data; i++) {
          peoples.push({
            index: i + 1,
            name: (i + 1) + '人',
            people: ''
          })
        }
        this.ruleForm.peoples = peoples
        this.loading = false
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style>

</style>
