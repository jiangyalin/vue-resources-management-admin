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
      <el-button
        type="primary"
        icon="el-icon-setting"
        @click="linked('true')"
        size="mini">关联</el-button>
      <el-button
        type="primary"
        icon="el-icon-setting"
        @click="unlink('true')"
        size="mini">取消关联</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      border
      size="mini"
      style="width: 100%"
      @cell-click="toPathPropertyInfo"
      @selection-change="checkbox"
      tooltip-effect="dark"
      ref="multipleTable">
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        v-for="item in tableTile"
        :label="item.columnLabel"
        :prop="item.prop"
        :key="item.key"
        :width="item.width"
        show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="linked(scope)" v-if="scope.row.related === '未关联'">关联</el-button>
          <el-button type="text" size="small" @click="unlink(scope)" v-if="scope.row.related === '关联'">取消关联</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  const List = (response) => {
    let tableData = []
    tableData = response.data.map(data => {
      let state = '关联'
      let isLinked = true
      if (data.isCheck === 'unchecked') {
        state = '未关联'
        isLinked = false
      }
      return {
        id: data.roomId,
        numbering: data.roomCode,
        related: state,
        isLinked: isLinked,
        name: data.roomName
      }
    })
    return {
      tableData: tableData
    }
  }
  // 关联房源
  const EditRelation = (vue, list) => {
    const relation = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/rooms/' + vue.$route.params.propertyId + '/relation',
        data: {
          relationRoomIds: list
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
    return relation
  }
  // 获取房源列表
  const GetPropertyRelatedList = vue => {
    const propertyRelatedList = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rooms/' + vue.$route.params.propertyId + '/owner',
        params: {
          type: ''
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
    return propertyRelatedList
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
        checkboxArr: [],
        // 渲染表格
        tableTile: [{
          key: '0',
          columnLabel: '编号',
          prop: 'numbering',
          width: '180'
        }, {
          key: '1',
          columnLabel: '关联状态',
          prop: 'related',
          width: '180'
        }, {
          key: '2',
          columnLabel: '房源名称',
          prop: 'name'
        }],
        // 列表数据
        tableData: [],
        loading: true
      }
    },
    props: ['propertyInfo'],
    methods: {
      checkbox (row) {
        let checkboxArr = []
        row.forEach(data => {
          checkboxArr.push(data.id)
        })
        this.checkboxArr = checkboxArr
      },
      // 详情
      toPathPropertyInfo (row, column) {
        const id = row.id
        if (column.label === '编号' || column.label === '关联状态' || column.label === '房源名称') {
          this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyInfo/' + id)
        }
      },
      // 关联
      linked (row) {
        let id = []
        if (row === 'true') {
          id = this.checkboxArr
          this.tableData.forEach((data) => {
            if (id.indexOf(data.id) === -1 && data.isLinked) {
              id.push(data.id)
            }
          })
        } else {
          this.tableData.forEach((data) => {
            if (data.id !== row.row.id) {
              if (data.isLinked) {
                id.push(data.id)
              }
            } else {
              id.push(data.id)
            }
          })
        }
        this.$confirm('此操作将关联该房源, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const Relation = EditRelation(this, id)

          Relation.then((resolve) => {
            if (resolve.data.code === '200') {
              this.loading = true
              this.$message({
                type: 'success',
                message: '关联成功!'
              })

              // 获取房源列表
              const PropertyRelatedList = GetPropertyRelatedList(this)

              PropertyRelatedList.then((resolve) => {
                const PropertyRelatedList = List(resolve).tableData
                this.tableData = PropertyRelatedList
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
            message: '已取消操作'
          })
        })
      },
      // 取消关联
      unlink (row) {
        let id = []
        if (row === 'true') {
          this.tableData.forEach((data) => {
            if (this.checkboxArr.indexOf(data.id) === -1 && data.isLinked) {
              id.push(data.id)
            }
          })
        } else {
          this.tableData.forEach((data) => {
            if (data.id !== row.row.id && data.isLinked) {
              id.push(data.id)
            }
          })
        }
        this.$confirm('此操作将取消关联该房源, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const Relation = EditRelation(this, id)

          Relation.then((resolve) => {
            if (resolve.data.code === '200') {
              this.loading = true
              this.$message({
                type: 'success',
                message: '取消关联成功!'
              })

              // 获取房源列表
              const PropertyRelatedList = GetPropertyRelatedList(this)

              PropertyRelatedList.then((resolve) => {
                const PropertyRelatedList = List(resolve).tableData
                this.tableData = PropertyRelatedList
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
            message: '已取消操作'
          })
        })
      },
      // 返回
      backToInfo () {
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyInfo/' + this.$route.params.propertyId)
      }

    },
    created: function () {
      // 获取房源列表
      const PropertyRelatedList = GetPropertyRelatedList(this)

      PropertyRelatedList.then((resolve) => {
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
