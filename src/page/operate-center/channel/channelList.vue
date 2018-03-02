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
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
          <el-button type="text" size="small" @click="binding(scope)">关联</el-button>
          <!--<el-button type="text" size="small" @click="price(scope)">价格</el-button>-->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  const List = (vue, response) => {
    let tableData = []
    tableData = response.data.map((data) => {
      let state = '未激活'
      if (data.status === 1) {
        state = '激活'
      }
      let type = ''
      if (data.type === 0) {
        type = '国内渠道'
      }
      return {
        id: data.id,
        channelNumber: data.code,
        channelName: data.name,
        channelType: type,
        phone: data.mobile,
        state: state,
        updated: vue.$moment(data.updateTime).format('YYYY-MM-DD HH:mm')
      }
    })
    return {
      tableData: tableData
    }
  }
  // 获取渠道列表
  const GetChannelList = vue => {
    const channelList = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/channels',
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
    return channelList
  }
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
        tableTile: [{
          key: '0',
          columnLabel: '渠道编号',
          prop: 'channelNumber',
          width: '80'
        }, {
          key: '1',
          columnLabel: '渠道名称',
          prop: 'channelName',
          width: '180'
        }, {
          key: '2',
          columnLabel: '渠道类型',
          prop: 'channelType',
          width: '80'
        }, {
          key: '3',
          columnLabel: '电话',
          prop: 'phone',
          width: '180'
        }, {
          key: '4',
          columnLabel: '状态',
          prop: 'state',
          width: '100'
        }, {
          key: '5',
          columnLabel: '更新日期',
          prop: 'updated'
        }],
        // 列表数据
        tableData: [],
        loading: true
      }
    },
    methods: {
      // 编辑
      edit (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/channel/channelList/channelEdit/' + id)
      },
      // 绑定
      binding (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/channel/channelList/channelBinding/' + id)
      }
    },
    created: function () {
      // 获取渠道列表
      const ChannelList = GetChannelList(this)

      ChannelList.then((resolve) => {
        const list = List(this, resolve)
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
