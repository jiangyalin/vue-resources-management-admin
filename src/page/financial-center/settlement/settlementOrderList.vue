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
        id: data.orderId,
        orderNumber: data.orderSn,
        propertyCode: data.roomSn + data.roomName,
        bookingDate: window.moment(data.order.bookDate).format('YYYY-MM-DD'),
        channel: data.channel,
        channelSn: data.order.channelSn,
        amount: data.orderAmount,
        settlementAmount: data.billAmount
      }
    })
    return {
      tableData: tableData,
      total: response.data.totalElements
    }
  }
  // 获取对账单详情列表
  const GetBills = vue => {
    const bills = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/bills/' + vue.$route.params.settlementId,
        params: {
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
  export default {
    data () {
      return {
        // 筛选值
        formInline: {
          date: '',
          total: 10,
          pageSize: 10,
          currentPage: 1
        },
        // 渲染表格
        tableTile: [{
          key: '0',
          columnLabel: '订单编号',
          prop: 'orderNumber',
          width: '150'
        }, {
          key: '1',
          columnLabel: '房源',
          prop: 'propertyCode',
          width: '180'
        }, {
          key: '2',
          columnLabel: '预定日期',
          prop: 'bookingDate',
          width: '120'
        }, {
          key: '3',
          columnLabel: '渠道',
          prop: 'channel',
          width: '100'
        }, {
          key: '4',
          columnLabel: '渠道订单号',
          prop: 'channelSn',
          width: '180'
        }, {
          key: '5',
          columnLabel: '金额',
          prop: 'amount'
        }, {
          key: '6',
          columnLabel: '结算金额',
          prop: 'settlementAmount'
        }],
        // 列表数据
        tableData: [],
        loading: true
      }
    },
    methods: {
      // 查看详情
      viewInfo (row) {
        const id = row.row.orderNumber
        this.$router.push('/' + this.$route.params.lang + '/financialCenter/settlement/settlementList/settlementOrderList/' + this.$route.params.settlementId + '/settlementInfo/' + id)
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
      }
    },
    created: function () {
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
