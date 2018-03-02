<template>
  <div class="m-odr"
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
        class="demo-ruleForm s-ov-au">
        <el-form-item label="货币类型" prop="currencyType">
          <el-select v-model="ruleForm.currencyType" disabled>
            <el-option
              v-for="item in currencyTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付政策" prop="paymentPolicy">
          <el-select v-model="ruleForm.paymentPolicy">
            <el-option
              v-for="item in paymentPolicyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取消政策" prop="cancellationPolicy">
          <el-checkbox-group v-model="ruleForm.cancellationPolicy">
            <el-checkbox
              class="u-lbl"
              v-for="item in cancellationPolicyOptions"
              :label="item.value"
              :key="item.value"
              :value="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
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
  // 获取货币政策
  const GetCurrency = vue => {
    const currency = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/base/currencies',
        params: {},
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
    return currency
  }
  // 获取支付与取消政策列表
  const GetPoliciesList = (vue, type) => {
    const policies = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/base/policies',
        params: {
          type: type
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
    return policies
  }
  // 获取支付与取消政策
  const GetPayAndCancelPolicy = vue => {
    const payAndCancelPolicy = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rate/' + vue.$route.params.propertyId + '/payAndCancelPolicy',
        params: {},
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
    return payAndCancelPolicy
  }
  // 获取当前货币币种
  const GetCurrencyRate = vue => {
    const currency = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rate/currency',
        params: {},
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
    return currency
  }
  // 编辑政策
  const EditPayAndCancelPolicy = vue => {
    let payAndCancelPolicys = []
    payAndCancelPolicys = vue.ruleForm.cancellationPolicy.map(data => {
      return {
        policyCode: data
      }
    })
    payAndCancelPolicys.push({
      policyCode: vue.ruleForm.paymentPolicy
    })
    const payAndCancelPolicy = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/rate/' + vue.$route.params.propertyId + '/payAndCancelPolicy',
        data: {
          payAndCancelPolicys: payAndCancelPolicys
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
    return payAndCancelPolicy
  }
  export default {
    data () {
      return {
        props: {
          value: 'label',
          children: 'cities'
        },
        ruleForm: {
          currencyType: '￥', // 货币类型
          paymentPolicy: '', // 支付政策
          cancellationPolicy: [] // 取消政策
        },
        rules: {
          currencyType: [
            { required: true, message: '请选择货币类型', trigger: 'blur' }
          ],
          paymentPolicy: [
            { required: true, message: '请选择担保政策', trigger: 'blur' }
          ],
          cancellationPolicy: [
            { required: true, message: '请选择取消政策', trigger: 'blur' }
          ]
        },
        currencyTypeOptions: [], // 货币类型
        paymentPolicyOptions: [{
          value: 'payall',
          label: '全额预付'
        }],
        cancellationPolicyOptions: [{
          value: 'fullrefund7day',
          label: '距离入住日期至少7天时取消预订可获50%退款（服务费除外）'
        }, {
          value: 'partrefund6day',
          label: '距离入住日期不足7天时取消预订将不予退款'
        }, {
          value: 'partrefund80',
          label: '尚未入住、且在预订确认后48小时内取消的预订，将退还服务费'
        }],
        loading: true
      }
    },
    props: ['propertyInfo'],
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const PayAndCancelPolicy = EditPayAndCancelPolicy(this)

            PayAndCancelPolicy.then((resolve) => {
              if (resolve.data.code === '200') {
                this.$confirm('政策信息编辑成功', '提示', {
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
      // 获取货币政策
      const Currency = GetCurrency(this)

      Currency.then((resolve) => {
        let currencyTypeOptions = []
        currencyTypeOptions = resolve.data.map(data => {
          return {
            value: data.code,
            label: data.symbol
          }
        })
        this.currencyTypeOptions = currencyTypeOptions
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取支付列表
      const PoliciesPay = GetPoliciesList(this, 'pay')

      PoliciesPay.then((resolve) => {
//        let paymentPolicyOptions = []
//        paymentPolicyOptions = resolve.data.map(data => {
//          return {
//            value: data.code,
//            label: data.code
//          }
//        })
//        this.paymentPolicyOptions = paymentPolicyOptions
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取取消政策列表
      const Policies = GetPoliciesList(this, 'cancel')

      Policies.then((resolve) => {
//        let cancellationPolicyOptions = []
//        cancellationPolicyOptions = resolve.data.map(data => {
//          return {
//            value: data.id,
//            label: data.code
//          }
//        })
//        this.cancellationPolicyOptions = cancellationPolicyOptions
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取当前货币币种
      const CurrencyRate = GetCurrencyRate(this)

      CurrencyRate.then((resolve) => {
        this.ruleForm.currencyType = resolve.data.data
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 数据回显
      const PayAndCancelPolicy = GetPayAndCancelPolicy(this)

      PayAndCancelPolicy.then((resolve) => {
        let paymentPolicy = ''
        let cancellationPolicy = []
        resolve.data.data.forEach(data => {
          if (data.policyType === 'pay') {
            paymentPolicy = data.policyCode
          }
          if (data.policyType === 'cancel') {
            cancellationPolicy.push(data.policyCode)
          }
        })
        this.ruleForm.paymentPolicy = paymentPolicy
        this.ruleForm.cancellationPolicy = cancellationPolicy
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      Promise.all([Currency, PoliciesPay, Policies, PayAndCancelPolicy, CurrencyRate])
        .then((resolve) => {
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
    padding: 0 30px 0 0;
  }
  .u-lbl{
    margin-left: 0 !important;
    width: 100%;
  }
</style>
