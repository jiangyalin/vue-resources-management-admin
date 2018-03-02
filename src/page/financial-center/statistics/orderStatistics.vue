<template>
  <div>
    <el-form
      :inline="true"
      :rules="rules"
      :model="formInline"
      ref="formInline"
      class="demo-form-inline"
      size="mini">
      <el-form-item label="时间段" prop="date">
        <el-date-picker
          v-model="formInline.date"
          size="mini"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          @change="onSubmit('formInline')"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <div class="s-fr">
        <el-form-item>
          <el-button type="primary" @click="onSubmit('formInline')">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
    <ve-line
      v-loading="loading"
      :data="chartData"
      :settings="chartSettings"></ve-line>
  </div>
</template>

<script type="text/ecmascript-6">
  // 获取报表数据
  const GetStatistics = vue => {
    const statistics = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/orders/statistics',
        params: {
          ownerId: '1',
          roomSn: '',
          from: vue.$moment(vue.formInline.date[0]).format('YYYY-MM-DD'),
          to: vue.$moment(vue.formInline.date[1]).format('YYYY-MM-DD')
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
    return statistics
  }
  export default {
    name: '',
    data () {
      return {
        // 筛选值
        formInline: {
          date: [this.$moment().subtract(7, 'days').format(), this.$moment().format()]
        },
        rules: {
          date: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ]
        },
        chartData: {
          columns: ['日期', '预订数', '离店数', '取消数', '入住数'],
          rows: []
        },
        chartSettings: {
          metrics: ['预订数', '离店数', '取消数', '入住数'],
          dimension: ['日期']
        },
        loading: true
      }
    },
    components: {},
    methods: {
      // 搜索
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            // 获取报表数据
            const Statistics = GetStatistics(this)

            Statistics.then((resolve) => {
              let rows = []
              for (let i = 0; i < resolve.data.booked.length; i++) {
                rows.push({
                  '日期': this.$moment(resolve.data.booked[i].date).format('YYYY-MM-DD'),
                  '预订数': resolve.data.booked[i].count,
                  '离店数': resolve.data.left[i].count,
                  '取消数': resolve.data.cancelled[i].count,
                  '入住数': resolve.data.occupied[i].count
                })
              }
              this.chartData = {
                columns: ['日期', '预订数', '离店数', '取消数', '入住数'],
                rows: rows
              }
              this.chartSettings = {
                metrics: ['预订数', '离店数', '取消数', '入住数'],
                dimension: ['日期']
              }
              this.loading = false
            }).catch((reject) => {
              window.publicFunction.error(reject, this)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    created: function () {
      // 获取报表数据
      const Statistics = GetStatistics(this)

      Statistics.then((resolve) => {
        let rows = []
        for (let i = 0; i < resolve.data.booked.length; i++) {
          rows.push({
            '日期': this.$moment(resolve.data.booked[i].date).format('YYYY-MM-DD'),
            '预订数': resolve.data.booked[i].count,
            '离店数': resolve.data.left[i].count,
            '取消数': resolve.data.cancelled[i].count,
            '入住数': resolve.data.occupied[i].count
          })
        }
        this.chartData = {
          columns: ['日期', '预订数', '离店数', '取消数', '入住数'],
          rows: rows
        }
        this.chartSettings = {
          metrics: ['预订数', '离店数', '取消数', '入住数'],
          dimension: ['日期']
        }
        this.loading = false
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style scoped>

</style>
