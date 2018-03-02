<template>
  <div>
    <div class="m-menu" v-if="propertyInfo.numbering !== ''">
      <el-badge>房源编号: {{propertyInfo.numbering}}</el-badge>
      <el-badge style="margin-left: 10px">房源名称: {{propertyInfo.name}}</el-badge>
    </div>
    <div class="m-menu">
      <el-button
        type="primary"
        icon="el-icon-setting"
        @click="backToInfo"
        size="mini">返回</el-button>
      <el-button
        type="primary"
        icon="el-icon-setting"
        @click="rateEdit"
        size="mini">房价维护</el-button>
    </div>
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
      size="mini">
      <!--<el-form-item label="时间段">-->
        <!--<el-date-picker-->
          <!--v-model="formInline.date"-->
          <!--size="mini"-->
          <!--type="daterange"-->
          <!--range-separator="至"-->
          <!--start-placeholder="开始日期"-->
          <!--@change="onSubmit"-->
          <!--end-placeholder="结束日期">-->
        <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <el-form-item label="渠道">
        <el-select v-model="formInline.channel" placeholder="全部" @change="onSubmit">
          <el-option
            v-for="item in channelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="s-fr">
        <el-form-item v-if="formInline.channel === '' && switchRoomState">
          <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
          <el-button type="primary" @click="switchRoom(0)">开房</el-button>
          <el-button class="s-btn-switch-room" type="primary" @click="switchRoom(1)">关房</el-button>
        </el-form-item>
      </div>
    </el-form>
    <fullCalendar
      :events="fcEvents"
      locale="en"
      @changeMonth="changeMonth"
      @eventClick="moreClick"></fullCalendar>
  </div>
</template>

<script type="text/ecmascript-6">
  import FullCalendar from 'vue-fullcalendar'
  const List = (response, vue) => {
    let fcEvents = []
    fcEvents = response.data.map((data, index) => {
      let offTheRoom = false
      let order = false
      let title = '￥' + data.price
      let cssClass = 'm-fer s-rate-de'
      if (data.status === 'closed') {
        offTheRoom = true
        title = '关房'
        cssClass = 'm-fer s-rate-closed'
      }
      if (data.status === 'ordered') {
        order = true
        title = '已租'
        cssClass = 'm-fer s-rate-ordered'
      }
      return {
        title: title,
        start: data.day,
        end: data.day,
        cssClass: cssClass,
        YOUR_DATA: {
          id: index + '',
          offTheRoom: offTheRoom,
          order: order
        }
      }
    })
    return fcEvents
  }
  // 获取渠道列表
  const GetChannels = vue => {
    const channels = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/channels/' + vue.$route.params.propertyId,
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
    return channels
  }
  // 获取房价房态列表
  const GetPrice = vue => {
    const price = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rooms/' + vue.$route.params.propertyId + '/prices/' + vue.formInline.channel,
        params: {
          start: vue.$moment(vue.formInline.date[0]).format('YYYY-MM-DD'),
          end: vue.$moment(vue.formInline.date[1]).format('YYYY-MM-DD')
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
  // 设置开房
  const SetOpen = (vue, date) => {
    const open = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/roomState/' + vue.$route.params.propertyId + '/trigger/open',
        data: {
          day: date
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
    return open
  }
  // 设置关房
  const SetClose = (vue, date) => {
    const close = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/roomState/' + vue.$route.params.propertyId + '/trigger/close',
        data: {
          day: date
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
    return close
  }
  const basisTableTile = [{
    key: '0',
    columnLabel: '日期',
    prop: 'date',
    width: '180'
  }, {
    key: '1',
    columnLabel: '渠道',
    prop: 'channel',
    width: '180'
  }, {
    key: '3',
    columnLabel: '房价',
    prop: 'rate'
  }]
  const channelTableTile = [{
    key: '0',
    columnLabel: '日期',
    prop: 'date',
    width: '180'
  }, {
    key: '1',
    columnLabel: '渠道',
    prop: 'channel',
    width: '180'
  }, {
    key: '2',
    columnLabel: '房态',
    prop: 'roomState',
    width: '180'
  }, {
    key: '3',
    columnLabel: '房价',
    prop: 'rate'
  }]
  var demoEvents = [{
    title: '￥312',
    start: '2018-01-01',
    end: '2018-01-01',
    cssClass: 'm-fer',
    YOUR_DATA: {
      id: '1',
      offTheRoom: false,
      order: false
    }
  }, {
    title: '关房',
    start: '2018-01-13',
    end: '2018-01-13',
    cssClass: 'm-fer',
    YOUR_DATA: {
      id: '13',
      offTheRoom: true,
      order: false
    }
  }, {
    title: '订单',
    start: '2018-01-14',
    end: '2018-01-14',
    cssClass: 'm-fer',
    YOUR_DATA: {
      id: '14',
      offTheRoom: false,
      order: true
    }
  }]
  export default {
    data () {
      return {
        fcEvents: demoEvents,
        channelShowState: 'false',
        count: 0,
        switchRoomState: false,
        // 筛选值
        formInline: {
          date: [this.$moment(this.$moment(this.count).format('YYYY-MM')).startOf('month'),
            this.$moment(this.$moment(this.count).format('YYYY-MM')).endOf('month')],
          channel: '', // 渠道
          roomState: '', // 房态
          total: 10,
          pageSize: 10,
          currentPage: 1
        },
        channelOptions: [{
          id: '',
          value: '',
          label: '基础价'
        }],
        roomStateOptions: [{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '开启'
        }, {
          value: '1',
          label: '关闭'
        }],
        // 渲染表格
        tableTile: basisTableTile,
        // 列表数据
        tableData: [],
        loading: true
      }
    },
    props: ['propertyInfo'],
    components: {
      fullCalendar: FullCalendar
    },
    methods: {
      moreClick (event, jsEvent, pos) {
        let fcEvents = []
        fcEvents = this.fcEvents.map(data => {
          if (event.YOUR_DATA.id === data.YOUR_DATA.id && !data.YOUR_DATA.order) {
            if (data.cssClass.indexOf('s-fer-active') === -1) {
              return {
                ...data,
                cssClass: 'm-fer s-fer-active'
              }
            } else {
              return {
                ...data,
                cssClass: 'm-fer'
              }
            }
          } else {
            return data
          }
        })
        this.fcEvents = fcEvents
        this.switchRoomState = false
        this.fcEvents.forEach(data => {
          if (data.cssClass.indexOf('s-fer-active') !== -1) {
            this.switchRoomState = true
          }
        })
      },
      changeMonth (start, end, current) {
        this.count = current
        this.formInline.date = [this.$moment(this.$moment(this.count).format('YYYY-MM')).startOf('month'),
          this.$moment(this.$moment(this.count).format('YYYY-MM')).endOf('month')]
        this.onSubmit()
      },
      // 房价维护
      rateEdit () {
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/rateList/' + this.$route.params.propertyId + '/rateEdit')
      },
      // 返回
      backToInfo () {
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyInfo/' + this.$route.params.propertyId)
      },
      // 开关房
      switchRoom (state) {
        const date = []
        this.fcEvents.forEach(data => {
          if (data.cssClass.indexOf('s-fer-active') !== -1) {
            date.push(data.start)
          }
        })
        this.$confirm('您正在进行开关房操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 开房
          if (state === 0) {
            const Open = SetOpen(this, date)

            Open.then((resolve) => {
              if (resolve.data.code === '200') {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })

                this.onSubmit()
              }
            }).catch((reject) => {
              window.publicFunction.error(reject, this)
            })
          }
          // 关房
          if (state === 1) {
            const Close = SetClose(this, date)

            Close.then((resolve) => {
              if (resolve.data.code === '200') {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })

                this.onSubmit()
              }
            }).catch((reject) => {
              window.publicFunction.error(reject, this)
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      // 查询
      onSubmit () {
        this.loading = true
        const Price = GetPrice(this)

        Price.then((resolve) => {
          const fcEvents = List(resolve, this)
          this.fcEvents = fcEvents
          this.loading = false
          if (this.formInline.channel !== '') {
            this.tableTile = channelTableTile
            this.channelShowState = 'true'
          }
          if (this.formInline.channel === '') {
            this.tableTile = basisTableTile
            this.channelShowState = 'false'
          }
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      }
    },
    created: function () {
      // 获取渠道列表
      const Channels = GetChannels(this)

      Channels.then((resolve) => {
        let channelOptions = []
        channelOptions = resolve.data.map((data) => {
          return {
            id: data.id,
            value: data.code,
            label: data.code
          }
        })
        channelOptions.unshift({
          id: '',
          value: '',
          label: '基础价'
        })
        this.channelOptions = channelOptions

        const Price = GetPrice(this)

        Price.then((resolve) => {
          const fcEvents = List(resolve, this)
          this.fcEvents = fcEvents
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
  .s-btn-switch-room,.s-btn-switch-room:hover,.s-btn-switch-room:active,.s-btn-switch-room:visited,.s-btn-switch-room:focus{
    background-color: #48affa;
    border-color: #48affa;
  }
</style>

<style>
  .comp-full-calendar{
    max-width: none !important;
  }
  .comp-full-calendar .events-day{
    position: relative;
  }
  .comp-full-calendar .day-number{
    position: absolute;
    z-index: 999;
    /*width: 100%;*/
    box-sizing: border-box;
  }
  .comp-full-calendar .m-fer{
    margin-left: 1px !important;
    margin-right: 1px !important;
    padding-top: 34px !important;
    width: 100%;
    height: 79px !important;
    text-align: center;
    background-color: rgba(0,0,0,0) !important;
    box-sizing: border-box;
  }
  .comp-full-calendar .s-rate-de{
    color: #ff8948 !important;
  }
  .comp-full-calendar .s-fer-active{
    background-color: #faeee7 !important;
  }

  .full-calendar-body .weeks{
    height: 45px !important;
    line-height: 45px !important;
    background: #f5f5f5 !important;
  }
  .comp-full-calendar{
    padding: 0 !important;
  }
  .full-calendar-body .dates .dates-events .events-week .events-day{
    max-height: 80px !important;
    min-height: 80px !important;
  }
  .full-calendar-body .dates .week-row .day-cell{
    min-height: 71px !important;
  }
  .comp-full-calendar .s-rate-closed{
    background-color: #f5f5f5 !important;
  }
  .full-calendar-body .dates .week-row .day-cell{
    border-color: #f1f1f1 !important;
  }
  .full-calendar-body .dates .week-row{
    border-color: #f1f1f1 !important;
  }
  .full-calendar-body .weeks .week{
    border-color: #f1f1f1 !important;
  }
  .full-calendar-body .weeks{
    border-color: #f1f1f1 !important;
  }
  .comp-full-calendar .day-number{
    color: #888 !important;
  }
</style>
