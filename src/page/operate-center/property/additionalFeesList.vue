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
      <!--<el-table-column fixed="right" label="操作" width="60">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="text" size="small" @click="edit(scope)">编辑</el-button>-->
          <!--&lt;!&ndash;<el-button type="text" size="small" @click="remove(scope)">删除</el-button>&ndash;&gt;-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  const List = (response) => {
    let tableData = []
    tableData = response.data.data.map(data => {
      let frequency = '每次每间住宿'
      if (data.collectRate === 'EachNightEachRoom') frequency = '每间每晚'
      let name = ''
      if (data.code === 'service') name = '服务费'
      if (data.code === 'tax') name = '税费'
      if (data.code === 'clean') name = '清洁费'
      if (data.code === 'extraperson') name = '额外人员费用'
      let way = '（百分比）'
      if (data.chargeMode === 'num') way = '（数值）'
      return {
        id: data.id,
        name: name,
        frequency: frequency,
        way: data.feeValue + way
      }
    })
    return {
      tableData: tableData
    }
  }
  // 获取附加费用列表
  const GetExtraFeeMessagesList = vue => {
    const extraFeeMessages = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rate/' + vue.$route.params.propertyId + '/extraFeeMessages',
        params: {
          type: 2
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
    return extraFeeMessages
  }
  export default {
    data () {
      return {
        // 渲染筛选
        filter: {
        },
        // 筛选值
        formInline: {
        },
        // 渲染表格
        tableTile: [{
          key: '0',
          columnLabel: '名称',
          prop: 'name',
          width: '180'
        }, {
          key: '1',
          columnLabel: '收取频率',
          prop: 'frequency',
          width: '180'
        }, {
          key: '2',
          columnLabel: '收费方式',
          prop: 'way'
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
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/additionalFeesList/' + this.$route.params.propertyId + '/additionalFeesEdit/' + id)
      },
      // 返回
      backToInfo () {
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyInfo/' + this.$route.params.propertyId)
      }
    },
    created: function () {
      // 获取房源列表
      const ExtraFeeMessagesList = GetExtraFeeMessagesList(this)

      ExtraFeeMessagesList.then((resolve) => {
        const propertyRelatedList = List(resolve).tableData
        this.tableData = propertyRelatedList
        this.loading = false
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style>

</style>
