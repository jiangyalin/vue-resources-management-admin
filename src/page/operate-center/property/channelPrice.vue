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
    </div>
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
          <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  const List = (response) => {
    let tableData = []
    tableData = response.data.priceFormulas.map(data => {
      let calculateMethodA = ''
      if (data.calculateMethodA === 0 && (data.numA + '').indexOf('-') === -1) calculateMethodA = '+'
      if (data.calculateMethodA === 1) calculateMethodA = '*'
      let calculateMethodB = ''
      if (data.calculateMethodB === 0 && (data.numB + '').indexOf('-') === -1) calculateMethodB = '+'
      if (data.calculateMethodB === 1) calculateMethodB = '*'
      return {
        id: data.id,
        channelName: data.channelCode,
        formula1: calculateMethodA + data.numA,
        formula2: calculateMethodB + data.numB
      }
    })
    return {
      tableData: tableData,
      total: response.data.totalElements
    }
  }
  // 获取渠道价格公式
  const GetPrices = vue => {
    const prices = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rate/channel/' + vue.$route.params.propertyId + '/prices',
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
    return prices
  }
  export default {
    data () {
      return {
        // 渲染表格
        tableTile: [{
          key: '0',
          columnLabel: '渠道',
          prop: 'channelName',
          width: '180'
        }, {
          key: '1',
          columnLabel: '公式1',
          prop: 'formula1',
          width: '180'
        }, {
          key: '2',
          columnLabel: '公式2',
          prop: 'formula2'
        }],
        // 列表数据
        tableData: [],
        loading: true
      }
    },
    props: ['propertyInfo'],
    methods: {
      // 编辑
      edit (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/channelPrice/' + this.$route.params.propertyId + '/channelPriceEdit/' + id)
      },
      // 返回
      backToInfo () {
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyInfo/' + this.$route.params.propertyId)
      }
    },
    created: function () {
      // 获取渠道公式列表
      const Prices = GetPrices(this)

      Prices.then((resolve) => {
        const list = List(resolve)
        this.tableData = list.tableData
        this.loading = false
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style>

</style>
