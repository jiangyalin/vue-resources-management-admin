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
  const List = (vue, response) => {
    let tableData = []
    tableData = response.data.content.map(data => {
      let messageType = ''
      if (data.type === 'order') {
        messageType = '订单'
      }
      if (data.type === 'service') {
        messageType = '服务'
      }
      return {
        id: data.id,
        userName: data.userName,
        time: vue.$moment(data.createDate).format('YYYY-MM-DD HH:mm'),
        messageType: messageType,
        state: '启用',
        messageDescription: data.description
      }
    })
    return {
      tableData: tableData,
      total: response.data.totalElements
    }
  }
  // 获取推送消息列表
  const GetMessages = vue => {
    const messages = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/base/messages',
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
    return messages
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
          columnLabel: '用户名',
          prop: 'userName',
          width: '180'
        }, {
          key: '1',
          columnLabel: '时间',
          prop: 'time',
          width: '180'
        }, {
          key: '2',
          columnLabel: '消息类型',
          prop: 'messageType',
          width: '180'
        }, {
          key: '3',
          columnLabel: '状态',
          prop: 'state',
          width: '180'
        }, {
          key: '4',
          columnLabel: '消息描述',
          prop: 'messageDescription'
        }],
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
        // 获取推送消息列表
        const Messages = GetMessages(this)

        Messages.then((resolve) => {
          const list = List(this, resolve)
          this.tableData = list.tableData
          this.formInline.total = list.total
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      }
    },
    created: function () {
      // 获取推送消息列表
      const Messages = GetMessages(this)

      Messages.then((resolve) => {
        const list = List(this, resolve)
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
