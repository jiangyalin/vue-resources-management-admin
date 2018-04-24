<template>
  <div v-loading="loading">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
      <el-form-item label="年/届">
        <el-select v-model="formInline.year" :placeholder="$t('message.all')" @change="getAwesomeList">
          <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe border size="mini" style="width: 100%" tooltip-effect="dark" ref="multipleTable">
      <el-table-column v-for="item in tableTile" :label="item.columnLabel" :prop="item.prop" :key="item.key" :width="item.width" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="50">
        <template slot-scope="scope">
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
      return {
        id: data._id,
        book: data.book.name,
        year: data.year,
        rank: data.rank
      }
    })
    return {
      tableData: tableData,
      total: response.data.data.totalElements
    }
  }
  // 获取轻小说列表
  const GetAwesomeList = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/lightNovel/awesome',
        params: {
          pageNum: vue.formInline.currentPage - 1,
          pageSize: vue.formInline.pageSize,
          year: vue.formInline.year
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
  const DeleteAwesome = (vue, id) => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'delete',
        url: window.config.server + '/api/lightNovel/awesome/' + id,
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
          currentPage: 1,
          year: this.$moment().format('YYYY')
        },
        // 渲染表格
        tableTile: [{
          key: '0',
          columnLabel: '书名',
          prop: 'book'
        }, {
          key: '1',
          columnLabel: '年/届',
          prop: 'year'
        }, {
          key: '2',
          columnLabel: '名次',
          prop: 'rank'
        }],
        // 列表数据
        tableData: [],
        yearOptions: [],
        loading: true
      }
    },
    methods: {
      // 获取榜单列表
      getAwesomeList () {
        GetAwesomeList(this).then((resolve) => {
          const list = List(this, resolve)
          this.tableData = list.tableData
          this.formInline.total = list.total
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      },
      remove (row) {
        const id = row.row.id
        this.$confirm('此操作将删除该轻小说, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DeleteAwesome(this, id).then((resolve) => {
            if (resolve.data.code === '200') {
              this.loading = true
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              // 获取榜单列表
              this.getAwesomeList()
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
        // 获取榜单列表
        this.getAwesomeList()
      }
    },
    created: function () {
      // 初始化年/届
      for (let i = this.$moment().format('YYYY'); i >= 2005; i--) {
        this.yearOptions.push({
          label: i,
          value: i
        })
      }
      // 获取榜单列表
      this.getAwesomeList()
    }
  }
</script>

<style>

</style>
