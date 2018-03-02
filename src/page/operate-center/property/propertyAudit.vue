<template>
  <div>
    <div class="m-menu" v-if="formInline.approvalStatusOptions === '1'">
      <el-button
        type="primary"
        icon="el-icon-setting"
        @click="by('true')"
        size="mini">通过</el-button>
      <el-button
        type="primary"
        icon="el-icon-setting"
        @click="fail('true')"
        size="mini">不通过</el-button>
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
      <el-form-item :label="$t('message.type')">
        <el-select v-model="formInline.approvalStatusOptions" placeholder="审核状态" @change="onSubmit">
          <el-option
            v-for="item in filter.approvalStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item :label="$t('message.addedToTheState')">-->
        <!--<el-select v-model="formInline.shelvesStateOptions" :placeholder="$t('message.all')">-->
          <!--<el-option-->
            <!--v-for="item in filter.shelvesStateOptions"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
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
      stripe
      border
      size="mini"
      style="width: 100%"
      tooltip-effect="dark"
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
      <el-table-column fixed="right" label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="checkProperty(scope)">查看</el-button>
          <el-button type="text" size="small" v-if="formInline.approvalStatusOptions === '1'" @click="by(scope)">通过</el-button>
          <el-button type="text" size="small" v-if="formInline.approvalStatusOptions === '1'" @click="fail(scope)">不通过</el-button>
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
    tableData = response[0].data.content.map(data => {
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
        numbering: data.sn,
        name: data.name,
        ownerId: response[1][data.ownerId].name,
        contact: response[1][data.ownerId].mobile,
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
      total: response[0].data.totalElements
    }
  }
  // 获取房源列表
  const GetRoomsList = vue => {
    const rooms = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rooms',
        params: {
          roomTypeId: vue.formInline.typeOptions,
          releaseStatus: vue.formInline.shelvesStateOptions,
          auditingStatus: vue.formInline.approvalStatusOptions,
          cityId: vue.formInline.cityOptions,
          sn: vue.formInline.name,
          pageNum: vue.formInline.currentPage - 1,
          pageSize: vue.formInline.pageSize,
          ownerId: ''
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
    return rooms
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
  // 获取房屋类型
  const GetPropertySubtype = (vue) => {
    const propertySubtype = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/base/roomTypes',
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
    return propertySubtype
  }
  // 审核通过
  const SetAuditingBy = (vue, id) => {
    const auditing = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/rooms/auditing/confirm',
        data: {
          rooms: id
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
    return auditing
  }
  // 审核不通过
  const SetAuditingFail = (vue, id) => {
    const auditing = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/rooms/auditing/deny',
        data: {
          rooms: id
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
    return auditing
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
        let Accounts = {}
        response.data.content.forEach(data => {
          Accounts[data.account] = data
        })
        resolve(Accounts)
      }).catch((error) => {
        reject(error)
      })
    })
    return accounts
  }
  export default {
    data () {
      return {
        // 渲染筛选
        filter: {
          approvalStatusOptions: [{
            value: '1',
            label: '待审核'
          }, {
            value: '2',
            label: '打回'
          }, {
            value: '3',
            label: '通过'
          }],
          shelvesStateOptions: [{
            value: '',
            label: '全部'
          }, {
            value: '0',
            label: '未上架'
          }, {
            value: '1',
            label: '已上架'
          }]
        },
        checkboxArr: [],
        // 筛选值
        formInline: {
          typeOptions: '', // 类型
          shelvesStateOptions: '', // 上架状态
          approvalStatusOptions: '1', // 审核状态
          cityOptions: '', // 城市
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
          columnLabel: '业主',
          prop: 'ownerId',
          width: '180'
        }, {
          key: '3',
          columnLabel: '业主联系电话',
          prop: 'contact',
          width: '180'
        }, {
          key: '4',
          columnLabel: '国家、城市',
          prop: 'city',
          width: '180'
        }, {
          key: '5',
          columnLabel: '地址',
          prop: 'address',
          width: '180'
        }, {
          key: '6',
          columnLabel: '类型',
          prop: 'type',
          width: '80'
        }, {
          key: '7',
          columnLabel: '累计订单',
          prop: 'accumulative',
          width: '80'
        }, {
          key: '8',
          columnLabel: '状态',
          prop: 'state',
          width: '80'
        }, {
          key: '9',
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
      checkbox (row) {
        let checkboxArr = []
        row.forEach(data => {
          checkboxArr.push(data.id)
        })
        this.checkboxArr = checkboxArr
      },
      // 查看房源
      checkProperty (row) {
        const id = row.row.id
        const propertyInfo = {
          name: row.row.name,
          numbering: row.row.numbering
        }
        this.$emit('propertyInfoDataTransfer', propertyInfo)
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyAudit/propertyInfo/' + id)
      },
      // 通过
      by (row) {
        let id = []
        if (row === 'true') {
          id = this.checkboxArr
        } else {
          id.push(row.row.id)
        }
        this.$confirm('您正在通过该房源的审核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 审核通过
          const AuditBy = SetAuditingBy(this, id)

          AuditBy.then((resolve) => {
            if (resolve.data.code === '200') {
              this.$message({
                type: 'success',
                message: '通过成功!'
              })

              this.loading = true
              this.formInline.currentPage = 1

              const RoomsList = GetRoomsList(this)
              // 获取业主信息
              const AccountsList = GetAccountsList(this)

              Promise.all([RoomsList, AccountsList]).then((resolve) => {
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
            message: '已取消操作'
          })
        })
      },
      // 不通过
      fail (row) {
        let id = []
        if (row === 'true') {
          id = this.checkboxArr
        } else {
          id.push(row.row.id)
        }
        this.$confirm('您正在打回该房源的审核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 审核打回
          const AuditFail = SetAuditingFail(this, id)

          AuditFail.then((resolve) => {
            if (resolve.data.code === '200') {
              this.$message({
                type: 'success',
                message: '打回成功!'
              })

              this.loading = true
              this.formInline.currentPage = 1

              const RoomsList = GetRoomsList(this)
              // 获取业主信息
              const AccountsList = GetAccountsList(this)

              Promise.all([RoomsList, AccountsList]).then((resolve) => {
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
            message: '已取消操作'
          })
        })
      },
      // 搜索
      onSubmit () {
        this.loading = true
        this.formInline.currentPage = 1

        const RoomsList = GetRoomsList(this)
        // 获取业主信息
        const AccountsList = GetAccountsList(this)

        Promise.all([RoomsList, AccountsList]).then((resolve) => {
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

        const RoomsList = GetRoomsList(this)
        // 获取业主信息
        const AccountsList = GetAccountsList(this)

        Promise.all([RoomsList, AccountsList]).then((resolve) => {
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
      // 获取类型
      const PropertySubtype = GetPropertySubtype(this)

      PropertySubtype.then((resolve) => {
        let typeOptions = []
        typeOptions = resolve.data.map(data => {
          return {
            label: data.name,
            value: data.id
          }
        })
        typeOptions.unshift({
          label: '全部',
          value: ''
        })
        this.filter.typeOptions = typeOptions
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
      const RoomsList = GetRoomsList(this)

      // 获取业主信息
      const AccountsList = GetAccountsList(this)

      Promise.all([RoomsList, AccountsList])
        .then((resolve) => {
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
