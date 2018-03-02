<template>
  <div class="m-odr" v-loading="loading">
    <transition name="el-fade-in-linear">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        size="mini"
        class="demo-ruleForm s-ov-au">
        <el-form-item class="s-fl s-wd-33" label="规则一公式" prop="formula1">
          <el-select class="s-wd-100" v-model="ruleForm.formula1">
            <el-option
              v-for="item in formula1Options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="规则一数值" prop="number1">
          <el-input v-model="ruleForm.number1"></el-input>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="规则一小数位" prop="decimalPlaces1">
          <el-select class="s-wd-100" v-model="ruleForm.decimalPlaces1">
            <el-option
              v-for="item in decimalPlaces1Options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="规则一取舍" prop="choose1">
          <el-select class="s-wd-100" v-model="ruleForm.choose1">
            <el-option
              v-for="item in choose1Options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="规则二公式" prop="formula2">
          <el-select class="s-wd-100" v-model="ruleForm.formula2">
            <el-option
              v-for="item in formula2Options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="规则二数值" prop="number2">
          <el-input v-model="ruleForm.number2"></el-input>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="规则二小数位" prop="decimalPlaces2">
          <el-select class="s-wd-100" v-model="ruleForm.decimalPlaces2">
            <el-option
              v-for="item in decimalPlaces2Options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-fl s-wd-33" label="规则二取舍" prop="choose2">
          <el-select class="s-wd-100" v-model="ruleForm.choose2">
            <el-option
              v-for="item in choose2Options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
  // 编辑渠道价格公式
  const EditPriceFormula = vue => {
    const priceFormula = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/rate/' + vue.$route.params.channelId + '/priceFormula',
        data: {
          calculateMethodA: vue.ruleForm.formula1,
          calculateMethodB: vue.ruleForm.formula2,
          choiceModeA: vue.ruleForm.choose1,
          choiceModeB: vue.ruleForm.choose2,
          decimalModeA: vue.ruleForm.decimalPlaces1,
          decimalModeB: vue.ruleForm.decimalPlaces2,
          numA: vue.ruleForm.number1,
          numB: vue.ruleForm.number2
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
    return priceFormula
  }
  // 获取公式详情
  const GetPriceFormula = vue => {
    const priceFormula = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rate/' + vue.$route.params.channelId + '/priceFormula',
        data: {},
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
    return priceFormula
  }
  export default {
    data () {
      return {
        ruleForm: {
          formula1: '', // 公式1
          number1: '', // 数值1
          decimalPlaces1: '', // 小数位1
          choose1: '', // 取舍1
          formula2: '', // 公式2
          number2: '', // 数值2
          decimalPlaces2: '', // 小数位2
          choose2: '' // 取舍2
        },
        rules: {
          formula1: [
            { required: true, message: '请选择公式', trigger: 'blur' }
          ],
          number1: [
            { required: true, message: '请输入数值', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          decimalPlaces1: [
            { required: true, message: '请选择小数位', trigger: 'blur' }
          ],
          choose1: [
            { required: true, message: '请选择取舍', trigger: 'blur' }
          ],
          formula2: [
            { required: true, message: '请选择公式', trigger: 'blur' }
          ],
          number2: [
            { required: true, message: '请输入数值', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          decimalPlaces2: [
            { required: true, message: '请选择小数位', trigger: 'blur' }
          ],
          choose2: [
            { required: true, message: '请选择取舍', trigger: 'blur' }
          ]
        },
        formula1Options: [{
          value: '0',
          label: '+'
        }, {
          value: '1',
          label: '*'
        }],
        decimalPlaces1Options: [{
          value: '0',
          label: '小数点后两位'
        }, {
          value: '1',
          label: '整数'
        }],
        choose1Options: [{
          value: '0',
          label: '四舍五入'
        }, {
          value: '1',
          label: '逢一进一'
        }, {
          value: '2',
          label: '全部舍去'
        }],
        formula2Options: [{
          value: '0',
          label: '+'
        }, {
          value: '1',
          label: '*'
        }],
        decimalPlaces2Options: [{
          value: '0',
          label: '小数点后两位'
        }, {
          value: '1',
          label: '整数'
        }],
        choose2Options: [{
          value: '0',
          label: '四舍五入'
        }, {
          value: '1',
          label: '逢一进一'
        }, {
          value: '2',
          label: '全部舍去'
        }],
        loading: false
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 编辑渠道价格公式
            const PriceFormula = EditPriceFormula(this)

            PriceFormula.then((resolve) => {
              if (resolve.data.code === '200') {
                this.propertyId = resolve.data.roomId
                this.$confirm('编辑渠道价格公式成功', '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  type: 'success'
                }).then(() => {
                  this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/channelPrice/' + this.$route.params.propertyId)
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
      // 数据回显
      const PriceFormula = GetPriceFormula(this)

      PriceFormula.then((resolve) => {
        const ruleForm = {
          formula1: resolve.data.calculateMethodA + '', // 公式1
          number1: resolve.data.numA + '', // 数值1
          decimalPlaces1: resolve.data.decimalModeA + '', // 小数位1
          choose1: resolve.data.choiceModeA + '', // 取舍1
          formula2: resolve.data.calculateMethodB + '', // 公式2
          number2: resolve.data.numB + '', // 数值2
          decimalPlaces2: resolve.data.decimalModeB + '', // 小数位2
          choose2: resolve.data.choiceModeB + '' // 取舍2
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
</style>
