<template>
  <div>
    <!--<div class="m-menu">-->
      <!--<el-button type="primary" icon="el-icon-circle-plus-outline" size="mini">{{ $t("message.add") }}</el-button>-->
    <!--</div>-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
      <!--<el-form-item :label="$t('message.type')">-->
        <!--<el-select v-model="formInline.typeOptions" :placeholder="$t('message.all')">-->
          <!--<el-option-->
            <!--v-for="item in filter.typeOptions"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
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
      <el-form-item label="审核状态">
        <el-select v-model="formInline.approvalStatusOptions" :placeholder="$t('message.all')" @change="onSubmit">
          <el-option
            v-for="item in filter.approvalStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('message.city')">
        <el-select v-model="formInline.cityOptions" :placeholder="$t('message.all')" @change="onSubmit">
          <el-option
            v-for="item in filter.cityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="s-fr">
        <el-form-item :label="$t('message.searchFor')">
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
          <el-button type="text" size="small" @click="checkProperty(scope)">{{ $t('message.view') }}</el-button>
          <el-button type="text" size="small" @click="editProperty(scope)">{{ $t('message.edit') }}</el-button>
          <el-button type="text" size="small" @click="addOrder(scope)" v-if="scope.row.approval === '通过' && scope.row.state === '已上架'">创建订单</el-button>
          <el-button type="text" size="small" @click="submit(scope)" v-if="scope.row.approval === '未提交' || scope.row.approval === '打回'">提交</el-button>
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
  // 获取类型
  const GetRoomTypes = (vue) => {
    const roomTypes = new Promise((resolve, reject) => {
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
    return roomTypes
  }
  // 获取城市
  const GetCities = (vue) => {
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
  // 获取房源列表
  const GetRooms = (vue) => {
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
  // 提交审核
  const SubmitAudit = (vue, id) => {
    const auditing = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/rooms/' + id + '/auditing',
        data: {
          status: '1'
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
  export default {
    data () {
      return {
        // 渲染筛选
        filter: {
          propertyListInfo: [],
          typeOptions: [],
          shelvesStateOptions: [{
            value: '',
            label: '全部'
          }, {
            value: '0',
            label: '未上架'
          }, {
            value: '1',
            label: '已上架'
          }],
          approvalStatusOptions: [{
            value: '',
            label: '全部'
          }, {
            value: '0',
            label: '未提交'
          }, {
            value: '1',
            label: '待审核'
          }, {
            value: '2',
            label: '打回'
          }, {
            value: '3',
            label: '通过'
          }],
          cityOptions: []
        },
        // 筛选值
        formInline: {
          typeOptions: '', // 类型
          shelvesStateOptions: '', // 上架状态
          approvalStatusOptions: '', // 审核状态
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
          columnLabel: '国家、城市',
          prop: 'city',
          width: '180'
        }, {
          key: '3',
          columnLabel: '地址',
          prop: 'address',
          width: '180'
        }, {
          key: '4',
          columnLabel: '类型',
          prop: 'type',
          width: '80'
        }, {
          key: '5',
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
      // 搜索
      onSubmit () {
        this.loading = true
        this.formInline.currentPage = 1
        // 获取房源列表
        const Rooms = GetRooms(this)

        Rooms.then((resolve) => {
          this.propertyListInfo = resolve.data.content
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
        const Rooms = GetRooms(this)

        Rooms.then((resolve) => {
          this.propertyListInfo = resolve.data.content
          const list = List(resolve)
          this.tableData = list.tableData
          this.formInline.total = list.total
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      },
      // 查看房源
      checkProperty (row) {
        const id = row.row.id
        const propertyInfo = {
          name: row.row.name,
          numbering: row.row.numbering
        }
        this.$emit('propertyInfoDataTransfer', propertyInfo)
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyInfo/' + id)
      },
      // 编辑房源
      editProperty (row) {
        const id = row.row.id
        const propertyInfo = {
          name: row.row.name,
          numbering: row.row.numbering
        }
        this.$emit('propertyInfoDataTransfer', propertyInfo)
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyEdit/' + id)
      },
      // 创建订单
      addOrder (row) {
        const id = row.row.id
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/order/orderAdd/' + id)
      },
      // 提交
      submit (row) {
        const id = row.row.id
        // 提交审核
        const Auditing = SubmitAudit(this, id)

        Auditing.then((resolve) => {
          if (resolve.data.code === '200') {
            this.$confirm('提交审核已成功', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'success'
            }).then(() => {
              this.loading = true
              // 获取房源列表
              const Rooms = GetRooms(this)

              Rooms.then((resolve) => {
                this.propertyListInfo = resolve.data.content
                const list = List(resolve)
                this.tableData = list.tableData
                this.formInline.total = list.total
                this.loading = false
              }).catch((reject) => {
                window.publicFunction.error(reject, this)
              })
            })
          }
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      }
    },
    created: function () {
      // 获取类型
      const RoomTypes = GetRoomTypes(this)

      RoomTypes.then((resolve) => {
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
      const Rooms = GetRooms(this)

      Rooms.then((resolve) => {
        this.propertyListInfo = resolve.data.content
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
