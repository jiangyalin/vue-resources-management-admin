<template>
  <div v-loading="loading">
    <el-table
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
      <el-table-column fixed="right" label="操作" width="170">
        <template slot-scope="scope">
          <a class="el-button el-button--text el-button--small" style="text-decoration: none" :href="scope.row.file" download="w3logo">下载</a>
          <el-button type="text" size="small" @click="view(scope)">查看</el-button>
          <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
          <el-button type="text" size="small" @click="remove(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="m-page" small layout="prev, pager, next" :total="formInline.total" @current-change="toPage"></el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  const List = (vue, response) => {
    let tableData = []
    tableData = response.data.data.content.map((data) => {
      return {
        id: data._id,
        bookName: data.bookName,
        author: data.author,
        illustrator: data.illustrator,
        releaseTime: vue.$moment(data.releaseTime).format('YYYY-MM-DD HH:mm'),
        file: window.config.server + data.bookFile.path + data.bookFile.name
      }
    })
    return {
      tableData: tableData,
      total: response.data.data.totalElements
    }
  }
  // 获取轻小说列表
  const GetFictionList = vue => {
    const fiction = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/lightNovel/fiction',
        params: {
          id: vue.$cookie.get('userId'),
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
    return fiction
  }
  // 删除轻小说
  const DeleteFiction = (vue, id) => {
    const fiction = new Promise((resolve, reject) => {
      vue.$http({
        method: 'delete',
        url: window.config.server + '/api/lightNovel/fiction',
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
    return fiction
  }
  export default {
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
          columnLabel: '书名',
          prop: 'bookName'
        }, {
          key: '1',
          columnLabel: '作者',
          prop: 'author'
        }, {
          key: '2',
          columnLabel: '插画师',
          prop: 'illustrator'
        }, {
          key: '3',
          columnLabel: '更新时间',
          prop: 'releaseTime'
        }],
        // 列表数据
        tableData: [],
        loading: true
      }
    },
    methods: {
      view (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/book/lightNovel/fictionList/fictionInfo/' + id)
      },
      edit (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/book/lightNovel/fictionList/fictionEdit/' + id)
      },
      remove (row) {
        const id = row.row.id
        this.$confirm('此操作将删除该轻小说, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const Fiction = DeleteFiction(this, id)

          Fiction.then((resolve) => {
            if (resolve.data.code === '200') {
              this.loading = true
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              // 获取轻小说列表
              const fictionList = GetFictionList(this)

              fictionList.then((resolve) => {
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
        // 获取轻小说列表
        const fictionList = GetFictionList(this)

        fictionList.then((resolve) => {
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
      // 获取轻小说列表
      const fictionList = GetFictionList(this)

      fictionList.then((resolve) => {
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
