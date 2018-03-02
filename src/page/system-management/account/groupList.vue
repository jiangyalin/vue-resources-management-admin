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
        userName: data.account,
        name: data.name,
        eMail: data.email,
        mobile: data.mobile,
        qq: data.qq,
        wechat: data.wechat
      }
    })
    return {
      tableData: tableData,
      total: response.data.totalElements
    }
  }
  // 获取账户列表
  const GetGroupList = vue => {
    const groupList = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.serverLogin + '/api/v1/accounts',
        params: {
          accountType: 'USER_GROUP',
          page: vue.formInline.currentPage - 1,
          size: vue.formInline.pageSize
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
    return groupList
  }
  export default {
    data () {
      return {
        // 筛选值
        formInline: {
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        // 渲染表格
        tableTile: [{
          key: '0',
          columnLabel: '业主编号',
          prop: 'userName',
          width: '180'
        }, {
          key: '1',
          columnLabel: '业主名称',
          prop: 'name',
          width: '180'
        }, {
          key: '2',
          columnLabel: '邮箱',
          prop: 'eMail'
        }, {
          key: '3',
          columnLabel: '手机',
          prop: 'mobile'
        }, {
          key: '4',
          columnLabel: 'QQ',
          prop: 'qq'
        }, {
          key: '5',
          columnLabel: '微信',
          prop: 'wechat'
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
        // 获取用户列表
        const GroupList = GetGroupList(this)

        GroupList.then((resolve) => {
          const list = List(resolve)
          this.tableData = list.tableData
          this.formInline.total = list.total
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      },
      // 编辑
      edit (row) {
        const id = row.row.userName
        this.$router.push('/' + this.$route.params.lang + '/systemManagement/account/groupList/groupEdit/' + id)
      }
    },
    created: function () {
      // 获取用户列表
      const AccountList = GetGroupList(this)

      AccountList.then((resolve) => {
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
