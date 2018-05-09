<template>
  <div v-loading="loading">
    <el-table :data="tableData" stripe border size="mini" style="width: 100%" tooltip-effect="dark" ref="multipleTable">
      <el-table-column v-for="item in tableTile" :label="item.columnLabel" :prop="item.prop" :key="item.key" :width="item.width" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="170">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="skinEdit(scope)" v-if="scope.row.skin">皮肤</el-button>
          <el-button type="text" size="small" @click="view(scope)">查看</el-button>
          <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
          <el-button type="text" size="small" @click="remove(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="m-page" small layout="prev, pager, next" :total="formInline.total" @current-change="toPage" :pageSize="formInline.pageSize"></el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  const List = (vue, response) => {
    const tableData = response.data.data.content.map((data) => {
      let gender = ''
      vue.genderOptions.forEach(genderOptions => {
        if (genderOptions.value === data.gender) gender = genderOptions.label
      })
      return {
        id: data._id,
        name: data.name,
        nickname: data.nickname,
        gender: gender,
        phone: data.phone,
        eMail: data.eMail,
        skin: data.skin,
        birthDate: vue.$moment(data.birthDate).format('YYYY-MM-DD HH:mm')
      }
    })
    return {
      tableData: tableData,
      total: response.data.data.totalElements
    }
  }
  // 获取用户列表
  const GetUserList = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/user/user',
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
  }
  // 删除用户
  const DeleteUser = (vue, id) => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'delete',
        url: window.config.server + '/api/user/user',
        params: {
          id
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
  }
  export default {
    name: 'userList',
    data () {
      return {
        // 渲染筛选
        filter: {},
        // 筛选值
        formInline: {
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        // 渲染表格
        tableTile: [{
          key: '0',
          columnLabel: '姓名',
          prop: 'name'
        }, {
          key: '1',
          columnLabel: '昵称',
          prop: 'nickname'
        }, {
          key: '2',
          columnLabel: '性别',
          prop: 'gender'
        }, {
          key: '3',
          columnLabel: '手机',
          prop: 'phone'
        }, {
          key: '4',
          columnLabel: '电子邮箱',
          prop: 'eMail'
        }, {
          key: '5',
          columnLabel: '出生日期',
          prop: 'birthDate'
        }],
        // 列表数据
        tableData: [],
        genderOptions: [{
          value: '0',
          label: '保密'
        }, {
          value: '1',
          label: '男'
        }, {
          value: '2',
          label: '女'
        }],
        loading: true
      }
    },
    components: {},
    methods: {
      skinEdit (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/user/user/userList/skin/skinEdit/' + id)
      },
      view (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/user/user/userList/userInfo/' + id)
      },
      edit (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/user/user/userList/userEdit/' + id)
      },
      remove (row) {
        const id = row.row.id
        this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DeleteUser(this, id).then((resolve) => {
            if (resolve.data.code === '200') {
              this.loading = true
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              // 获取用户列表
              GetUserList(this).then((resolve) => {
                const list = List(this, resolve)
                this.tableData = list.tableData
                this.formInline.total = list.total
                this.loading = false
              }).catch((reject) => {
                window.publicFunction.error(reject, this)
              })
            }
          }).catch((reject) => {
            window.publicFunction.error(reject, this)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 分页
      toPage (page) {
        this.loading = true
        this.formInline.currentPage = page
        // 获取用户列表
        GetUserList(this).then((resolve) => {
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
      // 获取用户列表
      GetUserList(this).then((resolve) => {
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

<style scoped>

</style>
