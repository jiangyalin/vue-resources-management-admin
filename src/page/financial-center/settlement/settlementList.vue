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
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      border
      size="mini"
      style="width: 100%"
      tooltip-effect="dark"
      ref="multipleTable">
      <el-table-column
        v-for="item in tableTile"
        :label="item.columnLabel"
        :prop="item.prop"
        :key="item.key"
        :width="item.width"
        show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewInfo(scope)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="m-page"
      small
      layout="prev, pager, next"
      :total="formInline.total"
      :page-size="formInline.pageSize"
      :current-page="formInline.currentPage"
      @current-change="toPage"></el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  const List = (response, vue) => {
    let tableData = []
    tableData = response.data.content.map(data => {
      return {
        id: data.id,
        date: vue.$moment(data.date).format('YYYY-MM-DD'),
        totalOrder: data.orderAmount,
        settlementAmount: data.amount,
        owner: data.owner
      }
    })
    return {
      tableData: tableData,
      total: response.data.totalElements
    }
  }
  // 获取对账单列表
  const GetBills = vue => {
    const bills = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/bills',
        params: {
          from: vue.$moment(vue.formInline.date[0]).format('YYYY-MM-DD'),
          to: vue.$moment(vue.formInline.date[1]).format('YYYY-MM-DD'),
          details: '',
          authenticated: '',
          pageNum: vue.formInline.currentPage - 1,
          pageSize: vue.formInline.pageSize
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
    return bills
  }
  const operateTableData = [{
    key: '0',
    columnLabel: '日期',
    prop: 'date',
    width: '180'
  }, {
    key: '1',
    columnLabel: '订单总额',
    prop: 'totalOrder',
    width: '180'
  }, {
    key: '2',
    columnLabel: '结算金额',
    prop: 'settlementAmount',
    width: '180'
  }, {
    key: '3',
    columnLabel: '业主',
    prop: 'owner'
  }]
  const ownerTableData = [{
    key: '0',
    columnLabel: '日期',
    prop: 'date',
    width: '180'
  }, {
    key: '1',
    columnLabel: '订单总额',
    prop: 'totalOrder',
    width: '180'
  }, {
    key: '2',
    columnLabel: '结算金额',
    prop: 'settlementAmount'
  }]
  export default {
    data () {
      return {
        // 筛选值
        formInline: {
          date: [this.$moment().subtract(1, 'months').format(), this.$moment().format()],
          total: 10,
          pageSize: 10,
          currentPage: 1
        },
        rules: {
          date: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ]
        },
        // 渲染表格
        tableTile: [],
        // 列表数据
        tableData: [],
        loading: true
      }
    },
    methods: {
      // 查看详情
      viewInfo (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/financialCenter/settlement/settlementList/settlementOrderList/' + id)
      },
      // 分页
      toPage (page) {
        this.loading = true
        this.formInline.currentPage = page

        const Bills = GetBills(this)

        Bills.then((resolve) => {
          const list = List(resolve, this)
          this.tableData = list.tableData
          this.formInline.total = list.total
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      },
      // 搜索
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            const Bills = GetBills(this)

            Bills.then((resolve) => {
              const list = List(resolve, this)
              this.tableData = list.tableData
              this.formInline.total = list.total
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
      // 判断用户类型
      if (this.$cookie.get('userType') === '0') {
        this.tableTile = operateTableData
      }
      if (this.$cookie.get('userType') === '1') {
        this.tableTile = ownerTableData
      }

      const date = new Date()
      const firstDay = new Date(date.getFullYear(), (date.getMonth() - 2), 1)
      this.defaultValue = firstDay

      const Bills = GetBills(this)

      Bills.then((resolve) => {
        const list = List(resolve, this)
        this.tableData = list.tableData
        this.formInline.total = list.total
        this.loading = false
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style>

</style>
