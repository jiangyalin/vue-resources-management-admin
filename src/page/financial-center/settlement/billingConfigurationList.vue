<template>
  <div>
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
      <el-table-column fixed="right" label="操作" width="80" v-if="userType === '0'">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope)">配置</el-button>
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
  const List = (response) => {
    let tableData = []
    tableData = response.data.content.map(data => {
      return {
        id: data.id,
        channel: data.channel,
        settlementDate: data.dateDesc,
        user: data.owner,
        amount: data.ruleDesc
      }
    })
    return {
      tableData: tableData,
      total: response.data.totalElements
    }
  }
  // 获取结算配置列表
  const GetRules = vue => {
    const rules = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/bills/rules',
        params: {
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
    return rules
  }
  const operateTableData = [{
    key: '0',
    columnLabel: '渠道',
    prop: 'channel',
    width: '180'
  }, {
    key: '1',
    columnLabel: '结算日期（每月）',
    prop: 'settlementDate',
    width: '180'
  }, {
    key: '2',
    columnLabel: '用户',
    prop: 'user',
    width: '180'
  }, {
    key: '3',
    columnLabel: '金额',
    prop: 'amount'
  }]
  const ownerTableData = [{
    key: '0',
    columnLabel: '渠道',
    prop: 'channel',
    width: '180'
  }, {
    key: '1',
    columnLabel: '结算日期（每月）',
    prop: 'settlementDate',
    width: '180'
  }, {
    key: '3',
    columnLabel: '金额',
    prop: 'amount'
  }]
  export default {
    data () {
      return {
        // 筛选值
        formInline: {
          total: 10,
          pageSize: 10,
          currentPage: 1
        },
        // 渲染表格
        tableTile: [],
        // 列表数据
        tableData: [],
        loading: true
      }
    },
    methods: {
      // 分页
      toPage (page) {
        this.loading = true
        this.formInline.currentPage = page
        // 获取结算配置列表
        const Rules = GetRules(this)

        Rules.then((resolve) => {
          const list = List(resolve)
          this.tableData = list.tableData
          this.formInline.total = list.total
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      },
      // 配置
      edit (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/financialCenter/settlement/billingConfigurationList/billingConfigurationEdit/' + id)
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
      this.userType = this.$cookie.get('userType')

      // 获取结算配置列表
      const Rules = GetRules(this)

      Rules.then((resolve) => {
        const list = List(resolve)
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
