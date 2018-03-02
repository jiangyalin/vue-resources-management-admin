<template>
  <div class="m-odr" v-loading="loading">
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
        class="demo-ruleForm s-ov-au">
        <el-form-item class="s-fl s-wd-33" label="可住人数" prop="numberOfOccupants">
          <el-input-number class="s-wd-100"
            v-model="ruleForm.numberOfOccupants"
            :min="0"
            :max="20"></el-input-number>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="成人数" prop="adult">
          <el-input-number class="s-wd-100"
            v-model="ruleForm.adult"
            :min="0"
            :max="20"></el-input-number>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="儿童数" prop="child">
          <el-input-number class="s-wd-100"
            v-model="ruleForm.child"
            :min="0"
            :max="20"></el-input-number>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="最长入住天数" prop="longest">
          <el-input-number class="s-wd-100"
            v-model="ruleForm.longest"
            :min="ruleForm.shortest"
            :max="100000"></el-input-number>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="最短入住天数" prop="shortest">
          <el-input-number class="s-wd-100"
            v-model="ruleForm.shortest"
            :min="0"
            :max="ruleForm.longest"></el-input-number>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="最早入住时间" prop="earliest">
          <el-time-picker class="s-wd-100"
            v-model="ruleForm.earliest">
          </el-time-picker>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="最晚退房时间" prop="latest">
          <el-time-picker class="s-wd-100"
            v-model="ruleForm.latest">
          </el-time-picker>
        </el-form-item>
        <el-form-item class="s-fl s-wd-100">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button
            @click="backToInfo"
            size="mini">返回</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  // 获取入住规则
  const GetOccupancyRule = vue => {
    const occupancyRule = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rate/' + vue.$route.params.propertyId + '/occupancyRule',
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
    return occupancyRule
  }
  // 设置入住规则
  const EditOccupancyRule = vue => {
    const occupancyRule = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/rate/' + vue.$route.params.propertyId + '/occupancyRule',
        data: {
          adultNum: vue.ruleForm.adult,
          arrivalTime: vue.$moment(vue.ruleForm.earliest).format('HH:mm:ss'),
          childrenNum: vue.ruleForm.child,
          departureTime: vue.$moment(vue.ruleForm.latest).format('HH:mm:ss'),
          maxStayThrough: vue.ruleForm.longest,
          minStayThrough: vue.ruleForm.shortest,
          stayNum: vue.ruleForm.numberOfOccupants
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
    return occupancyRule
  }
  export default {
    data () {
      return {
        props: {
          value: 'label',
          children: 'cities'
        },
        ruleForm: {
          numberOfOccupants: 0, // 可住人数
          adult: 0, // 成人数
          child: 0, // 儿童数
          shortest: 0, // 最短入住天数
          longest: 0, // 最长入住天数
          earliest: this.$moment(), // 最早入住时间
          latest: this.$moment() // 最晚入住时间
        },
        rules: {
          numberOfOccupants: [
            { required: true, message: '可住人数', trigger: 'blur' }
          ],
          adult: [
            { required: true, message: '成人数', trigger: 'blur' }
          ],
          child: [
            { required: true, message: '儿童数', trigger: 'blur' }
          ],
          shortest: [
            { required: true, message: '最短入住天数', trigger: 'blur' }
          ],
          longest: [
            { required: true, message: '最长入住天数', trigger: 'blur' }
          ],
          earliest: [
            { required: true, message: '最早入住时间', trigger: 'blur' }
          ],
          latest: [
            { required: true, message: '最晚退房时间', trigger: 'blur' }
          ]
        },
        loading: false
      }
    },
    props: ['propertyInfo'],
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const OccupancyRule = EditOccupancyRule(this)

            OccupancyRule.then((resolve) => {
              if (resolve.data.code === '200') {
                this.$confirm('入住规则编辑成功', '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  type: 'success'
                }).then(() => {
                  this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyInfo/' + this.$route.params.propertyId)
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
      // 返回
      backToInfo () {
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyInfo/' + this.$route.params.propertyId)
      }

    },
    created: function () {
      // 获取最大可入住人数
      const OccupancyRule = GetOccupancyRule(this)

      OccupancyRule.then((resolve) => {
        let longest = resolve.data.data.maxStayThrough
        if (resolve.data.data.maxStayThrough === null) {
          longest = 0
        }
        let earliest = resolve.data.data.arrivalTime
        if (earliest === 'Invalid date' || earliest === null || earliest === '') earliest = '00:00:00'
        let latest = resolve.data.data.departureTime
        if (latest === 'Invalid date' || latest === null || latest === '') latest = '00:00:00'
        const ruleForm = {
          numberOfOccupants: resolve.data.data.stayNum, // 可住人数
          adult: resolve.data.data.adultNum, // 成人数
          child: resolve.data.data.childrenNum, // 儿童数
          shortest: resolve.data.data.minStayThrough, // 最短入住天数
          longest: longest, // 最长入住天数
          earliest: new Date(this.$moment('2017-01-01 ' + earliest).format('YYYY-MM-DD HH:mm:ss')), // 最早入住时间
          latest: new Date(this.$moment('2017-01-01 ' + latest).format('YYYY-MM-DD HH:mm:ss')) // 最晚入住时间
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
    padding: 0 30px 0 0;
  }
</style>
