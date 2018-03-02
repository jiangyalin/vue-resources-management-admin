<template>
  <div>
    <div class="m-menu">
      <el-button
        v-if="userType !== '0'"
        type="primary"
        icon="el-icon-download"
        @click="uploadFile"
        size="mini">下载模板</el-button>
      <el-upload
        v-if="userType !== '0'"
        class="upload-demo u-upload-none"
        :headers="headers"
        :action="upload.action"
        :on-success="uploadSuccess"
        :on-error="uploadError">
        <el-button type="primary" icon="el-icon-upload2" size="mini">导入模板</el-button>
      </el-upload>
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
      <el-form-item label="状态">
        <el-select v-model="formInline.stateOptions" placeholder="全部" @change="onSubmit">
          <el-option
            v-for="item in filter.stateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="s-fr">
        <el-form-item label="搜索">
          <el-input v-model="formInline.name" placeholder="联系人姓名/手机"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
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
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="checkOrder(scope)">查看订单</el-button>
          <el-button type="text" size="small" @click="removeSingle(scope)" v-if="(scope.row.state === '已取消' || scope.row.state === '冲突单') && userType !== '0'" disabled>取消订单</el-button>
          <el-button type="text" size="small" @click="removeSingle(scope)" v-if="(scope.row.state !== '已取消' && scope.row.state !== '冲突单') && userType !== '0'">取消订单</el-button>
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
      let state = '' // 状态
      if (data.status === 'all') {
        state = '全部'
      }
      if (data.status === 'confirmed') {
        state = '已确认'
      }
      if (data.status === 'booked') {
        state = '已预订(待入住)'
      }
      if (data.status === 'occupied') {
        state = '已入住'
      }
      if (data.status === 'left') {
        state = '已离店'
      }
      if (data.status === 'cancelled') {
        state = '已取消'
      }
      if (data.status === 'conflict') {
        state = '冲突单'
      }
      return {
        id: data.id,
        numbering: data.sn,
        owner: data.owner,
        room: data.roomSn + data.roomData.name,
        state: state,
        contactName: data.contact,
        mobile: data.phone,
        scheduledDate: window.moment(data.bookDate).format('YYYY-MM-DD HH:mm'),
        checkInDate: window.moment(data.checkIn).format('YYYY-MM-DD HH:mm'),
        dateOfDeparture: window.moment(data.checkOut).format('YYYY-MM-DD HH:mm'),
        amount: data.amount,
        channel: data.channel
      }
    })
    return {
      tableData: tableData,
      total: response.data.totalElements
    }
  }
  // 取消订单
  const DeleteOrders = (vue, code) => {
    const orders = new Promise((resolve, reject) => {
      vue.$http({
        method: 'patch',
        url: window.config.server + '/api/v1/orders/cancel',
        data: {
          sn: code,
          status: 'cancelled'
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
    return orders
  }
  // 获取订单列表
  const GetOrdersList = vue => {
    const ordersList = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/orders',
        params: {
          occupantType: '',
          status: vue.formInline.stateOptions,
          keyword: vue.formInline.name,
          ownerId: '',
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
    return ordersList
  }
  const oper = [{
    key: '0',
    columnLabel: '编号',
    prop: 'numbering',
    width: '180'
  }, {
    key: '1',
    columnLabel: '业主',
    prop: 'owner',
    width: '180'
  }, {
    key: '2',
    columnLabel: '房源',
    prop: 'room',
    width: '180'
  }, {
    key: '3',
    columnLabel: '联系人',
    prop: 'contactName',
    width: '80'
  }, {
    key: '4',
    columnLabel: '联系人电话',
    prop: 'mobile',
    width: '100'
  }, {
    key: '5',
    columnLabel: '状态',
    prop: 'state',
    width: '100'
  }, {
    key: '6',
    columnLabel: '预定日期',
    prop: 'scheduledDate',
    width: '180'
  }, {
    key: '7',
    columnLabel: '入住日期',
    prop: 'checkInDate',
    width: '180'
  }, {
    key: '8',
    columnLabel: '离店日期',
    prop: 'dateOfDeparture',
    width: '180'
  }, {
    key: '9',
    columnLabel: '金额',
    prop: 'amount',
    width: '180'
  }, {
    key: '10',
    columnLabel: '渠道',
    prop: 'channel'
  }]

  const manage = [{
    key: '0',
    columnLabel: '编号',
    prop: 'numbering',
    width: '180'
  }, {
    key: '1',
    columnLabel: '房源',
    prop: 'room',
    width: '180'
  }, {
    key: '2',
    columnLabel: '联系人',
    prop: 'contactName',
    width: '80'
  }, {
    key: '3',
    columnLabel: '联系人电话',
    prop: 'mobile',
    width: '100'
  }, {
    key: '4',
    columnLabel: '状态',
    prop: 'state',
    width: '100'
  }, {
    key: '5',
    columnLabel: '预定日期',
    prop: 'scheduledDate',
    width: '180'
  }, {
    key: '6',
    columnLabel: '入住日期',
    prop: 'checkInDate',
    width: '180'
  }, {
    key: '7',
    columnLabel: '离店日期',
    prop: 'dateOfDeparture',
    width: '180'
  }, {
    key: '8',
    columnLabel: '金额',
    prop: 'amount',
    width: '180'
  }, {
    key: '9',
    columnLabel: '渠道',
    prop: 'channel'
  }]
  export default {
    data () {
      return {
        headers: {
          'languageCode': this.$route.params.lang,
          'Authorization': 'Bearer ' + this.$cookie.get('token')
        },
        userType: '',
        upload: {
          action: window.config.server + '/api/v1/orders/import'
        },
        fileList: [], // 文件列表
        // 渲染筛选
        filter: {
          stateOptions: [{
            value: '',
            label: '全部'
          }, {
            value: 'confirmed',
            label: '已确认'
          }, {
            value: 'booked',
            label: '已预订(待入住)'
          }, {
            value: 'occupied',
            label: '已入住'
          }, {
            value: 'left',
            label: '已离店'
          }, {
            value: 'cancelled',
            label: '已取消'
          }, {
            value: 'conflict',
            label: '冲突单'
          }]
        },
        // 筛选值
        formInline: {
          stateOptions: '',
          name: '',
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        // 渲染表格
        tableTile: [],
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
        // 获取列表
        const OrdersList = GetOrdersList(this)

        OrdersList.then((resolve) => {
          const list = List(resolve)
          this.tableData = list.tableData
          this.formInline.total = list.total
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      },
      // 查询
      onSubmit () {
        this.loading = true
        this.formInline.currentPage = 1
        // 获取列表
        const OrdersList = GetOrdersList(this)

        OrdersList.then((resolve) => {
          const list = List(resolve)
          this.tableData = list.tableData
          this.formInline.total = list.total
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      },
      // 删除单项
      removeSingle (row) {
        const code = row.row.numbering
        this.$confirm('此操作将取消该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const Orders = DeleteOrders(this, code)

          Orders.then((resolve) => {
            if (resolve.data.code === '200') {
              this.$message({
                type: 'success',
                message: '取消订单成功!'
              })
              this.loading = true
              // 获取列表
              const OrdersList = GetOrdersList(this)

              OrdersList.then((resolve) => {
                const list = List(resolve)
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
      // 查看订单
      checkOrder (row) {
        const id = row.row.numbering
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/order/orderList/orderInfo/' + id)
      },
      // 下载模板
      uploadFile () {
        window.location.href = window.config.serverUpload + '/f/order_import.xlsx'
      },
      // 上传成功
      uploadSuccess (data) {
        if (data.code === '200') {
          this.$confirm('订单导入成功', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'success'
          }).then(() => {
            this.loading = true
            // 获取列表
            const OrdersList = GetOrdersList(this)

            OrdersList.then((resolve) => {
              const list = List(resolve)
              this.tableData = list.tableData
              this.formInline.total = list.total
              this.loading = false
            }).catch((reject) => {
              window.publicFunction.error(reject, this)
            })
          })
        } else {
          this.$message({
            type: 'info',
            message: '订单导入失败'
          })
        }
      },
      // 上传失败
      uploadError () {
        this.$message({
          type: 'info',
          message: '订单导入失败'
        })
      }
    },
    created: function () {
      // 判断用户类型
      this.userType = this.$cookie.get('userType')
      if (this.userType === '0') {
        this.tableTile = oper
      } else {
        this.tableTile = manage
      }
      // 获取列表
      const OrdersList = GetOrdersList(this)

      OrdersList.then((resolve) => {
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
  .u-upload-none{
    display: inline-block;
    margin-left: 10px;
  }
  .u-upload-none .el-upload-list{
    display: none;
  }
</style>
