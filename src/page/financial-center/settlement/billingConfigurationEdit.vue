<template>
  <div class="m-odr"
       v-loading="loading">
    <transition name="el-fade-in-linear">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        size="mini"
        class="demo-ruleForm">
        <el-form-item style="width: 50%;float: left;" label="渠道名称">
          <el-input v-model="ruleForm.channelName" disabled></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="结算方式" prop="settlementMethod">
          <el-select style="width: 100%;" v-model="ruleForm.settlementMethod">
            <el-option
              v-for="item in settlementMethodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="金额比例" prop="amountProportion" v-if="ruleForm.settlementMethod === '0'">
          <el-input v-model="ruleForm.amountProportion">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="固定金额" prop="amount" v-if="ruleForm.settlementMethod === '1'">
          <el-input v-model="ruleForm.amount"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="结算日期" prop="settlementDate">
          <el-input v-model="ruleForm.settlementDate"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="结算日期描述" prop="dateDescription">
          <el-input type="textarea" v-model="ruleForm.dateDescription"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="结算规则描述" prop="ruleDescription">
          <el-input type="textarea" v-model="ruleForm.ruleDescription"></el-input>
        </el-form-item>
        <el-form-item class="s-fl s-wd-100">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  // 获取结算配置
  const GetRules = vue => {
    const rules = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/bills/rules/' + vue.$route.params.billingConfigurationId,
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
    return rules
  }
  // 设置结算配置
  const EditRules = vue => {
    let amount = vue.ruleForm.amount
    if (vue.ruleForm.settlementMethod === '0') {
      amount = ''
    }
    let percent = vue.ruleForm.amountProportion
    if (vue.ruleForm.settlementMethod === '1') {
      percent = ''
    }
    const rules = new Promise((resolve, reject) => {
      vue.$http({
        method: 'put',
        url: window.config.server + '/api/v1/bills/rules',
        data: {
          amount: amount,
          billDate: vue.ruleForm.settlementDate,
          channel: vue.ruleForm.channelName,
          dateDesc: vue.ruleForm.dateDescription,
          id: vue.ruleForm.channelNumber,
          owner: vue.ruleForm.owner,
          percent: percent,
          ruleDesc: vue.ruleForm.ruleDescription
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
    return rules
  }
  export default {
    data () {
      return {
        props: {
          value: 'label',
          children: 'cities'
        },
        ruleForm: {
          channelNumber: '3232', // 渠道编号
          channelName: '渠道甲', // 渠道名称
          settlementMethod: '0', // 结算方式
          settlementDate: '', // 结算日期
          amountProportion: '', // 金额比例
          amount: '', // 固定金额
          dateDescription: '', // 结算日期描述
          ruleDescription: '' // 结算规则描述
        },
        rules: {
          settlementDate: [
            { required: true, message: '请输入结算日期', trigger: 'blur' },
            { pattern: /^\d{1,2}$/, message: '结算日期应为0到99之间的整数' }
          ],
          amountProportion: [
            { required: true, message: '请输入金额百分比', trigger: 'blur' },
            { pattern: /^\d{1,2}$/, message: '金额百分比应为0到99之间的整数' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          amount: [
            { required: true, message: '请输入金额', trigger: 'blur' },
            { pattern: /^\d{1,9}$/, message: '金额应为0到999999999之间的整数' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          dateDescription: [
            { required: true, message: '结算规则描述', trigger: 'blur' }
          ],
          ruleDescription: [
            { required: true, message: '结算规则描述', trigger: 'blur' }
          ]
        },
        settlementMethodOptions: [{
          value: '0',
          label: '按比例结算'
        }, {
          value: '1',
          label: '按固定金额结算'
        }],
        loading: false
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const Rules = EditRules(this)

            Rules.then((resolve) => {
              if (resolve.data.code === '200') {
                this.$confirm('结算配置编辑成功', '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  type: 'success'
                }).then(() => {
                  this.$router.push('/' + this.$route.params.lang + '/financialCenter/settlement/billingConfigurationList')
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
      }
    },
    created: function () {
      const Rules = GetRules(this)

      Rules.then((resolve) => {
        let settlementMethod = '0'
        if (resolve.data.amount !== '' && resolve.data.amount !== null) {
          settlementMethod = '1'
        }
        let amount = resolve.data.amount
        if (resolve.data.amount === null) {
          amount = ''
        }
        let amountProportion = resolve.data.percent
        if (resolve.data.percent === null) {
          amountProportion = ''
        }
        const ruleForm = {
          owner: resolve.data.owner,
          channelNumber: resolve.data.id, // 渠道编号
          channelName: resolve.data.channel, // 渠道名称
          settlementMethod: settlementMethod, // 结算方式
          settlementDate: resolve.data.billDate + '', // 结算日期
          amountProportion: amountProportion, // 金额比例
          amount: amount, // 固定金额
          dateDescription: resolve.data.dateDesc, // 结算日期描述
          ruleDescription: resolve.data.ruleDesc // 结算规则描述
        }
        this.ruleForm = ruleForm
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style>
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
</style>

<style scoped>
  .m-odr{
    overflow: auto;
    padding: 30px 30px 0 0;
  }
</style>
