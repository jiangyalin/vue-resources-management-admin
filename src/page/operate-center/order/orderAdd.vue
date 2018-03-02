<template>
  <div class="m-odr" v-loading="loading">
    <transition name="el-fade-in-linear">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        size="mini"
        class="demo-ruleForm">
        <el-form-item style="width: 50%;float: left;" label="房源" prop="propertyName">
          <el-select style="width: 100%;" v-model="ruleForm.propertyName" filterable @change="getPeople">
            <el-option
              v-for="item in propertyNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="渠道" prop="channel">
          <el-select style="width: 100%;" v-model="ruleForm.channel" @change="getDatesPrice">
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="入住人数" prop="numberOfPeople">
          <el-select style="width: 100%;" v-model="ruleForm.numberOfPeople" @change="getDatesPrice">
            <el-option
              v-for="item in numberOfPeopleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;height: 32px" label="入离日期" prop="date">
          <el-date-picker
            v-model="ruleForm.date"
            type="daterange"
            @change="getDatesPrice"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item style="width: 50%;float: left;" label="预订日期" prop="bookingDate">
          <el-date-picker
            v-model="ruleForm.bookingDate"
            type="date">
          </el-date-picker>
        </el-form-item>

        <el-form-item style="width: 50%;float: left;" label="金额" prop="amount">
          <el-input v-model="ruleForm.amount"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="渠道订单号" prop="channelOrderNumber">
          <el-input v-model="ruleForm.channelOrderNumber"></el-input>
        </el-form-item>

        <el-form-item style="width: 50%;float: left;" label="入住人姓" prop="contactsLastName">
          <el-input v-model="ruleForm.contactsLastName"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="入住人名" prop="contactName">
          <el-input v-model="ruleForm.contactName"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="入住人电话" prop="contactNumber">
          <el-input v-model="ruleForm.contactNumber"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="入住人邮件" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" label="联系人地址" prop="contactAddress">
          <el-input v-model="ruleForm.contactAddress"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%;float: left;" label="备注" prop="remarks">
          <el-input type="textarea" v-model="ruleForm.remarks"></el-input>
        </el-form-item>
        <el-form-item style="width: 50%;float: left;" >
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  // 获取全部物业
  const GetOwner = vue => {
    const owner = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rooms/owner',
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
    return owner
  }
  // 获取渠道列表
  const GetChannels = vue => {
    const channels = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/channels/' + vue.ruleForm.propertyName,
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
    return channels
  }
  // 获取物业可入住人数
  const GetPeoplenum = vue => {
    const peoplenum = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rate/' + vue.ruleForm.propertyName + '/peoplenum',
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
    return peoplenum
  }
  // 获取订单金额
  const GetDatesPrice = vue => {
    const datesPrice = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/roomState/' + vue.ruleForm.propertyName + '/' + vue.ruleForm.channel + '/datesPrice',
        params: {
          beginDate: vue.$moment(vue.ruleForm.date[0]).format('YYYY-MM-DD'),
          endDate: vue.$moment(vue.ruleForm.date[1]).format('YYYY-MM-DD'),
          peopleNum: vue.ruleForm.numberOfPeople
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
    return datesPrice
  }
  // 创建订单
  const AddOrders = vue => {
    let owner = ''
    let roomCode = ''
    vue.propertyNameOptions.forEach(data => {
      if (vue.ruleForm.propertyName === data.value) {
        owner = data.owner
        roomCode = data.code
      }
    })
    let channel = ''
    vue.channelOptions.forEach(data => {
      if (vue.ruleForm.channel === data.value) {
        channel = data.code
      }
    })
    const orders = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/orders/pc',
        data: {
          amount: vue.ruleForm.amount,
          channel: channel,
          channelSn: vue.ruleForm.channelOrderNumber,
          bookDate: vue.$moment(vue.ruleForm.bookingDate).format('YYYY-MM-DD'),
          checkIn: vue.$moment(vue.ruleForm.date[0]).format('YYYY-MM-DD'),
          checkOut: vue.$moment(vue.ruleForm.date[1]).format('YYYY-MM-DD'),
          memo: vue.ruleForm.remarks,
          status: 'confirmed',
          occupants: [
            {
              address: vue.ruleForm.contactAddress,
              email: vue.ruleForm.email,
              firstName: vue.ruleForm.contactName,
              lastName: vue.ruleForm.contactsLastName,
              occupantType: 'occupant',
              phone: vue.ruleForm.contactNumber
            }
          ],
          owner: owner,
          people: vue.ruleForm.numberOfPeople, // 入住人数
          roomSn: roomCode
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
    return orders
  }
  export default {
    data () {
      return {
        props: {
          value: 'label',
          children: 'cities'
        },
        ruleForm: {
          propertyName: '', // 物业名
          numberOfPeople: '', // 入住人数
          channelOrderNumber: '', // 渠道订单编号
          amount: '', // 金额
          channel: '', // 渠道
          contactsLastName: '', // 联系人姓氏
          contactName: '', // 联系人名
          contactNumber: '', // 联系人手机
          email: '', // 联系人邮箱
          contactAddress: '', // 联系人地址
          remarks: '', // 备注
          bookingDate: '', // 预定日期
          date: '' // 日期
        },
        rules: {
          propertyName: [
            { required: true, message: '请选择物业', trigger: 'blur' }
          ],
          numberOfPeople: [
            { required: true, message: '请选择入住人数', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '请输入金额', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          channel: [
            { required: true, message: '请选择渠道', trigger: 'blur' }
          ],
          channelOrderNumber: [
            { required: true, message: '请输入渠道订单编号', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          contactsLastName: [
            { required: true, message: '请输入联系人姓氏', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          contactName: [
            { required: true, message: '请输入联系人名', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          contactNumber: [
            { required: true, message: '请输入联系人手机', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          email: [
            { required: true, message: '请输入联系人邮箱', trigger: 'blur' },
            { pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: 'E-mail格式错误', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          contactAddress: [
            { required: false, message: '请输入联系人地址', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          remarks: [
            { required: false, message: '请输入备注', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          bookingDate: [
            { required: true, message: '请选择日期', trigger: 'blur' }
          ],
          date: [
            { required: true, message: '请选择预订日期', trigger: 'blur' }
          ]
        },
        propertyNameOptions: [],
        numberOfPeopleOptions: [],
        channelOptions: [],
        loading: true
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.$moment(this.ruleForm.date[0]).format('YYYY-MM-DD HH:mm') !== this.$moment(this.ruleForm.date[1]).format('YYYY-MM-DD HH:mm')) {
              // 创建订单
              const Orders = AddOrders(this)

              Orders.then((resolve) => {
                if (resolve.data.code === '200') {
                  this.$confirm('创建订单成功', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'success'
                  }).then(() => {
                    this.$router.push('/' + this.$route.params.lang + '/operateCenter/order/orderList')
                  })
                }
                if (resolve.data.code === '500') {
                  if (resolve.data.message === '100') {
                    this.$message({
                      type: 'warning',
                      message: '此房源未审核通过'
                    })
                  }
                  if (resolve.data.message === '101') {
                    this.$message({
                      type: 'warning',
                      message: '此订单已关房'
                    })
                  }
                  if (resolve.data.message === '102') {
                    this.$message({
                      type: 'warning',
                      message: '此订单已满房'
                    })
                  }
                  if (resolve.data.message === '103') {
                    this.$message({
                      type: 'warning',
                      message: '此订单大于最大可预定日期或小于最小可预定日期'
                    })
                  }
                  if (resolve.data.message === '104') {
                    this.$message({
                      type: 'warning',
                      message: '此订单超出最大可入住人数'
                    })
                  }
                  if (resolve.data.message === '105') {
                    this.$message({
                      type: 'warning',
                      message: '此订单金额不正确'
                    })
                  }
                }
              }).catch((reject) => {
                window.publicFunction.error(reject, this)
              })
            } else {
              this.$message({
                type: 'warning',
                message: '入离日期不能是同一天'
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
      },
      // 获取当前物业可入住人数,渠道
      getPeople () {
        this.ruleForm.channel = ''
        // 获取渠道列表
        const Channels = GetChannels(this)

        Channels.then((resolve) => {
          let channelOptions = []
          channelOptions = resolve.data.map((data) => {
            return {
              code: data.code,
              value: data.id,
              label: data.code
            }
          })
          this.channelOptions = channelOptions
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })

        // 获取当前物业可入住人数
        const Peoplenum = GetPeoplenum(this)

        Peoplenum.then((resolve) => {
          let numberOfPeopleOptions = []
          for (let i = 0; i < resolve.data; i++) {
            numberOfPeopleOptions.push({
              value: i + 1,
              label: i + 1
            })
          }
          this.ruleForm.numberOfPeople = ''
          this.numberOfPeopleOptions = numberOfPeopleOptions
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      },
      // 获取订单金额
      getDatesPrice () {
        if (this.ruleForm.date !== '' && this.ruleForm.numberOfPeople !== '' && this.ruleForm.propertyName && this.ruleForm.channel) {
          const DatesPrice = GetDatesPrice(this)

          DatesPrice.then((resolve) => {
            this.ruleForm.amount = resolve.data
          }).catch((reject) => {
            window.publicFunction.error(reject, this)
          })
        }
      }
    },
    created: function () {
      // 获取全部物业
      const Owner = GetOwner(this)

      Owner.then((resolve) => {
        let propertyNameOptions = []
        propertyNameOptions = resolve.data.map(data => {
          return {
            code: data.roomCode,
            owner: data.owner,
            value: data.roomId,
            label: data.roomCode + data.roomName
          }
        })
        this.propertyNameOptions = propertyNameOptions
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      Promise.all([Owner])
        .then((resolve) => {
          this.ruleForm.propertyName = parseInt(this.$route.params.propertyId)
          // 获取渠道列表
          const Channels = GetChannels(this)

          Channels.then((resolve) => {
            let channelOptions = []
            channelOptions = resolve.data.map((data) => {
              return {
                code: data.code,
                value: data.id,
                label: data.code
              }
            })
            this.channelOptions = channelOptions
          }).catch((reject) => {
            window.publicFunction.error(reject, this)
          })

          // 获取当前物业可入住人数
          const Peoplenum = GetPeoplenum(this)

          Peoplenum.then((resolve) => {
            let numberOfPeopleOptions = []
            for (let i = 0; i < resolve.data; i++) {
              numberOfPeopleOptions.push({
                value: i + 1,
                label: i + 1
              })
            }
            this.ruleForm.numberOfPeople = ''
            this.numberOfPeopleOptions = numberOfPeopleOptions
          }).catch((reject) => {
            window.publicFunction.error(reject, this)
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
</style>

<style>
  .u-tt{
    width: 80px;
    min-width: 80px;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }

</style>
