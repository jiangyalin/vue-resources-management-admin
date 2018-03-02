<template>
  <div>
    <div class="m-menu">
      <el-button
        type="primary"
        icon="el-icon-setting"
        @click="binding('true')"
        size="mini">关联</el-button>
      <el-button
        type="primary"
        icon="el-icon-setting"
        @click="cancelBinding('true')"
        size="mini">取消关联</el-button>
    </div>
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
      size="mini">
      <el-form-item label="绑定状态">
        <el-select v-model="formInline.bindingStateOptions" placeholder="全部" @change="onSubmit">
          <el-option
            v-for="item in filter.bindingStateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="城市">
        <el-select v-model="formInline.cityOptions" placeholder="全部" @change="onSubmit">
          <el-option
            v-for="item in filter.cityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业主">
        <el-select v-model="formInline.ownerOptions" placeholder="全部" @change="onSubmit">
          <el-option
            v-for="item in filter.ownerOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="s-fr">
        <el-form-item label="搜索">
          <el-input v-model="formInline.name" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      size="mini"
      style="width: 100%"
      tooltip-effect="dark"
      :row-class-name="tableRowClassName"
      @selection-change="checkbox"
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
      <el-table-column fixed="right" label="操作" width="90">
        <template slot-scope="scope">
          <el-button type="text" size="small" class="s-binding" @click="binding(scope)">关联</el-button>
          <el-button type="text" size="small" class="s-cancel" @click="cancelBinding(scope)">取消关联</el-button>
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
      const channel = response.data.content[0].channelCode
      let state = '已上架'
      if (data.releaseStatus === 0) {
        state = '未上架'
      }
      let approval = '通过'
      if (data.auditingStatus === 0) {
        approval = '未提交'
      } else if (data.auditingStatus === 1) {
        approval = '待审核'
      } else if (data.auditingStatus === 2) {
        approval = '打回'
      }
      return {
        id: data.id,
        related: data.related,
        channel: channel,
        numbering: data.sn,
        name: data.name,
        sn: data.name,
        city: data.countryName + data.cityName,
        address: data.address,
        type: data.roomTypename,
        accumulative: data.orderCount,
        state: state,
        approval: approval
      }
    })
    return {
      tableData: tableData,
      total: response.data.totalElements
    }
  }
  // 获取房源列表
  const GetRoomChannels = vue => {
    const roomChannels = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/channels/' + vue.$route.params.channelId + '/roomchannels',
        params: {
          related: vue.formInline.bindingStateOptions,
          cityId: vue.formInline.cityOptions,
          owner: vue.formInline.ownerOptions,
          sn: vue.formInline.name,
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
    return roomChannels
  }
  // 获取城市
  const GetCities = vue => {
    const cities = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/base/cities',
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
    return cities
  }
  // 获取业主信息
  const GetAccountsList = (vue, id, status) => {
    const accounts = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.serverLogin + '/api/v1/accounts',
        params: {
          accountType: 'USER_GROUP'
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
    return accounts
  }
  // 设置关联状态
  const SetBinding = (vue, propertyId) => {
    const binding = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/channels/' + vue.$route.params.channelId + '/roomchannels/add',
        data: {
          rooms: propertyId
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
    return binding
  }
  // 删除关联状态
  const SetCancelBinding = (vue, propertyId) => {
    const cancelBinding = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/channels/' + vue.$route.params.channelId + '/roomchannels/remove',
        data: {
          rooms: propertyId
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
    return cancelBinding
  }
  export default {
    data () {
      return {
        // 渲染筛选
        filter: {
          bindingStateOptions: [{
            value: '',
            label: '全部'
          }, {
            value: 'true',
            label: '已绑定'
          }, {
            value: 'false',
            label: '未绑定'
          }],
          cityOptions: [],
          ownerOptions: []
        },
        checkboxArr: [],
        // 筛选值
        formInline: {
          bindingStateOptions: '', // 绑定状态
          cityOptions: '', // 城市
          ownerOptions: '', // 业主
          name: '',
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        // 渲染表格
        tableTile: [{
          key: '0',
          columnLabel: '编号',
          prop: 'numbering',
          width: '80'
        }, {
          key: '1',
          columnLabel: '房源名称',
          prop: 'name',
          width: '180'
        }, {
          key: '2',
          columnLabel: '渠道',
          prop: 'channel',
          width: '80'
        }, {
          key: '3',
          columnLabel: '国家、城市',
          prop: 'city',
          width: '180'
        }, {
          key: '4',
          columnLabel: '地址',
          prop: 'address',
          width: '180'
        }, {
          key: '5',
          columnLabel: '类型',
          prop: 'type',
          width: '80'
        }, {
          key: '6',
          columnLabel: '累计订单',
          prop: 'accumulative',
          width: '80'
        }, {
          key: '7',
          columnLabel: '状态',
          prop: 'state',
          width: '80'
        }, {
          key: '8',
          columnLabel: '审核状态',
          prop: 'approval',
          width: ''
        }],
        // 列表数据
        tableData: [],
        loading: true
      }
    },
    methods: {
      tableRowClassName ({row, rowIndex}) {
        if (row.related === true) {
          return 'success-row'
        }
        return ''
      },
      checkbox (row) {
        let checkboxArr = []
        row.forEach(data => {
          checkboxArr.push(data.id)
        })
        this.checkboxArr = checkboxArr
      },
      // 关联
      binding (row) {
        let id = []
        if (row === 'true') {
          id = this.checkboxArr
        } else {
          id.push(row.row.id)
        }
        this.$confirm('您正在关联该房源, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const Binding = SetBinding(this, id)

          Binding.then((resolve) => {
            if (resolve.data) {
              this.$message({
                type: 'success',
                message: '关联成功!'
              })
              this.loading = true

              // 获取房源列表
              const RoomChannels = GetRoomChannels(this)

              RoomChannels.then((resolve) => {
                const list = List(resolve)
                this.tableData = list.tableData
                this.formInline.total = list.total
                this.loading = false
              }).catch((reject) => {
                window.publicFunction.error(reject, this)
              })
            } else {
              this.$message({
                type: 'info',
                message: '操作失败'
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
      cancelBinding (row) {
        let id = []
        if (row === 'true') {
          id = this.checkboxArr
        } else {
          id.push(row.row.id)
        }
        this.$confirm('您正在取消渠道与房源的关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const CancelBinding = SetCancelBinding(this, id)

          CancelBinding.then((resolve) => {
            if (resolve.data) {
              this.$message({
                type: 'success',
                message: '取消关联成功!'
              })
              this.loading = true

              // 获取房源列表
              const RoomChannels = GetRoomChannels(this)

              RoomChannels.then((resolve) => {
                const list = List(resolve)
                this.tableData = list.tableData
                this.formInline.total = list.total
                this.loading = false
              }).catch((reject) => {
                window.publicFunction.error(reject, this)
              })
            } else {
              this.$message({
                type: 'info',
                message: '操作失败'
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
      // 搜索
      onSubmit () {
        this.loading = true
        this.formInline.currentPage = 1
        // 获取房源列表
        const RoomChannels = GetRoomChannels(this)

        RoomChannels.then((resolve) => {
          const list = List(resolve)
          this.tableData = list.tableData
          this.formInline.total = list.total
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      },
      // 分页
      toPage (page) {
        this.loading = true
        this.formInline.currentPage = page
        // 获取房源列表
        const RoomChannels = GetRoomChannels(this)

        RoomChannels.then((resolve) => {
          const list = List(resolve)
          this.tableData = list.tableData
          this.formInline.total = list.total
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      }
    },
    created: function () {
      // 获取业主信息
      const AccountsList = GetAccountsList(this)

      AccountsList.then((resolve) => {
        let ownerOptions = []
        ownerOptions = resolve.data.content.map(data => {
          return {
            label: data.name,
            value: data.account
          }
        })
        ownerOptions.unshift({
          label: '全部',
          value: ''
        })
        this.filter.ownerOptions = ownerOptions
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
      // 获取城市
      const Cities = GetCities(this)

      Cities.then((resolve) => {
        let cityOptions = []
        cityOptions = resolve.data.map(data => {
          return {
            label: data.name,
            value: data.id
          }
        })
        cityOptions.unshift({
          label: '全部',
          value: ''
        })
        this.filter.cityOptions = cityOptions
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取房源列表
      const RoomChannels = GetRoomChannels(this)

      RoomChannels.then((resolve) => {
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
  .el-table .s-cancel{
    display: none;
  }
  .el-table .success-row{
    background: #f0f9eb;
  }
  .el-table .success-row .s-binding{
    display: none;
  }
  .el-table .success-row .s-cancel{
    margin: 0;
    display: inline;
  }
</style>
