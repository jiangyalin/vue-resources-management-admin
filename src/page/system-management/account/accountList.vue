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
          <el-button type="text" size="small" @click="removeSingle(scope)">删除</el-button>
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
        userName: data.account,
        name: data.name,
        eMail: data.email
      }
    })
    return {
      tableData: tableData,
      total: response.data.totalElements
    }
  }
  // 获取账户列表
  const GetAccountList = vue => {
    const accountList = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.serverLogin + '/api/v1/accounts',
        params: {
          accountType: 'USER',
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
    return accountList
  }
  // 删除账户
  const DeleteAccount = (vue, id) => {
    const account = new Promise((resolve, reject) => {
      vue.$http({
        method: 'delete',
        url: window.config.serverLogin + '/api/v1/accounts/' + id,
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
    return account
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
          columnLabel: '登录名',
          prop: 'userName',
          width: '180'
        }, {
          key: '1',
          columnLabel: '姓名',
          prop: 'name',
          width: '180'
        }, {
          key: '2',
          columnLabel: '邮箱',
          prop: 'eMail'
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
        const AccountList = GetAccountList(this)

        AccountList.then((resolve) => {
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
        this.$router.push('/' + this.$route.params.lang + '/systemManagement/account/accountList/accountEdit/' + id)
      },
      // 删除单项
      removeSingle (row) {
        const id = row.row.userName
        this.$confirm('此操作将删除该账户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const Account = DeleteAccount(this, id)

          Account.then((resolve) => {
            this.loading = true
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 获取用户列表
            const AccountList = GetAccountList(this)

            AccountList.then((resolve) => {
              const list = List(resolve)
              this.tableData = list.tableData
              this.formInline.total = list.total
              this.loading = false
            }).catch((reject) => {
              window.publicFunction.error(reject, this)
            })
          }).catch((reject) => {
            window.publicFunction.error(reject, this)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    created: function () {
      // 获取用户列表
      const AccountList = GetAccountList(this)

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

<style scoped>
  .m-odr{
    overflow: auto;
    padding: 30px 30px 0 0;
  }
</style>
