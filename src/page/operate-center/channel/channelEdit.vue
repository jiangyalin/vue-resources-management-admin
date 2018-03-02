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
        <el-form-item style="width: 50%;float: left;" label="渠道编号" prop="channelNumber">
          <el-input v-model="ruleForm.channelNumber" disabled></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="渠道名称" prop="channelName">
          <el-input v-model="ruleForm.channelName"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="渠道类型" prop="channelType">
          <el-select style="width: 100%;" v-model="ruleForm.channelType">
            <el-option
              v-for="item in channelTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="联系电话" prop="contactNumber">
          <el-input v-model="ruleForm.contactNumber"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="E-mail" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="传真" prop="fax">
          <el-input v-model="ruleForm.fax"></el-input>
        </el-form-item>
        <!--<el-form-item label="排序" prop="sort">-->
          <!--<el-input v-model="ruleForm.sort" type="number"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item style="width: 50%;float: left;" label="状态" prop="state">
          <el-select v-model="ruleForm.state">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 100%;float: left;" >
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  // 添加渠道
  const EditChannel = vue => {
    const channel = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/channels/channelId/channel',
        data: {
          id: vue.$route.params.channelId,
          code: vue.ruleForm.channelNumber,
          name: vue.ruleForm.channelName,
          type: vue.ruleForm.channelType,
          mobile: vue.ruleForm.contactNumber,
          fax: vue.ruleForm.fax,
          email: vue.ruleForm.email,
          status: vue.ruleForm.state
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
    return channel
  }
  // 获取渠道信息
  const GetChannelInfo = vue => {
    const channelInfo = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/channels/' + vue.$route.params.channelId + '/channel',
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
    return channelInfo
  }
  export default {
    data () {
      return {
        props: {
          value: 'label',
          children: 'cities'
        },
        ruleForm: {
          channelNumber: '',
          channelName: '', // 渠道名称
          channelType: '0', // 渠道类型
          contactNumber: '', // 联系电话
          fax: '', // 传真
          email: '', // 电子邮箱
          sort: '', // 排序
          state: '0' // 状态
        },
        rules: {
          channelNumber: [
            { required: true, message: '请输入渠道编号', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          channelName: [
            { required: true, message: '请输入渠道名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          channelType: [
            { required: true, message: '请选择渠道类型', trigger: 'blur' }
          ],
          contactNumber: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          fax: [
            { required: false, message: '请输入传真', trigger: 'blur' },
            { pattern: /^(\d{3,4}-)?\d{7,8}$/, message: '传真格式错误', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          email: [
            { required: true, message: '请输入E-mail', trigger: 'blur' },
            { pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: 'E-mail格式错误', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          sort: [
            { required: true, message: '请输入排序值', trigger: 'blur' },
            { pattern: /^[1-9]\d*|0$/, message: '排序必须为非负整数', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 13 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          state: [
            { required: true, message: '请选择渠道类型', trigger: 'blur' }
          ]
        },
        channelTypeOptions: [{
          value: '0',
          label: '国内渠道'
        }],
        stateOptions: [{
          value: '0',
          label: '未激活'
        }, {
          value: '1',
          label: '激活'
        }],
        loading: false
      }
    },
    methods: {
      // 提交
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 编辑渠道
            const Channel = EditChannel(this)

            Channel.then((resolve) => {
              if (resolve.data.code === '200') {
                this.$confirm('渠道信息编辑成功', '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  type: 'success'
                }).then(() => {
                  this.$router.push('/' + this.$route.params.lang + '/operateCenter/channel/channelList')
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
      // 获取渠道信息
      const ChannelInfo = GetChannelInfo(this)

      ChannelInfo.then((resolve) => {
        this.ruleForm.channelNumber = resolve.data.code
        this.ruleForm.channelName = resolve.data.name
        this.ruleForm.channelType = resolve.data.type + ''
        this.ruleForm.contactNumber = resolve.data.mobile
        this.ruleForm.fax = resolve.data.fax
        this.ruleForm.email = resolve.data.email
        this.ruleForm.state = resolve.data.status + ''
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
