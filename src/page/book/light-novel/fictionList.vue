<template>
  <div v-loading="loading">
    <el-table :data="tableData" stripe border size="mini" style="width: 100%" tooltip-effect="dark" ref="multipleTable">
      <el-table-column v-for="item in tableTile" :label="item.columnLabel" :prop="item.prop" :key="item.key" :width="item.width" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="down(scope)" v-if="scope.row.file !== ''">下载</el-button>
          <el-button type="text" size="small" @click="view(scope)">查看</el-button>
          <el-button type="text" size="small" @click="volume(scope)">卷</el-button>
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
      let file = ''
      if (data.file) file = data.file
      return {
        id: data._id,
        area: data.area.name,
        name: data.name,
        author: data.author,
        illustrator: data.illustrator,
        library: data.library.name,
        file
      }
    })
    return {
      tableData: tableData,
      total: response.data.data.totalElements
    }
  }
  // 获取轻小说列表
  const GetFictionList = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/lightNovel/fiction',
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
  // 删除轻小说
  const DeleteFiction = (vue, id) => {
    return new Promise((resolve, reject) => {
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
  }
  // 纪录下载
  const SetDownRecords = (vue, id) => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/basis/statistics/down/' + id,
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
  }
  // 纪录点击
  const SetClickRecords = (vue, id) => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/basis/statistics/click/' + id,
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
          prop: 'name'
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
          columnLabel: '地区',
          prop: 'area'
        }, {
          key: '4',
          columnLabel: '文库',
          prop: 'library'
        }],
        // 列表数据
        tableData: [],
        loading: true
      }
    },
    methods: {
      down (row) {
        const file = row.row.file
        window.open(window.config.upload + '/api/download/' + file, '_self')

        SetDownRecords(this, row.row.id)
      },
      view (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/book/lightNovel/fictionList/fictionInfo/' + id)

        SetClickRecords(this, row.row.id)
      },
      volume (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/book/lightNovel/fictionList/volumeList/' + id)
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
