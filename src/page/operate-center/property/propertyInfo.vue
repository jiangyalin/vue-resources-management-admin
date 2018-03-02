<template>
  <div class="s-info" v-loading="loading">
    <div class="m-it-gp-img" v-if="userType === '1'">
      <h3 class="u-tt">附加信息</h3>
      <div class="u-ct-s">
        <div class="m-it-gp">
          <h3 class="u-tt-s">快捷通道</h3>
          <el-tooltip
            class="item"
            effect="dark"
            content="点击查看图片"
            placement="top-start">
            <el-button
              @click="editPropertyImage"
              size="mini">图片</el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="点击查看规则"
            placement="top-start">
            <el-button
              @click="checkInRules"
              size="mini">规则</el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="点击查看房价房态"
            placement="top-start">
            <el-button
              @click="rateList"
              size="mini">房价房态</el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="点击查看价格公式"
            placement="top-start">
            <el-button
              @click="channelPrice"
              size="mini">价格公式</el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="点击查看附加费用"
            placement="top-start">
            <el-button
              @click="attached"
              size="mini">附加费用</el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="点击查看房源政策"
            placement="top-start">
            <el-button
              @click="propertyPolicy"
              size="mini">房源政策</el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="点击查看房源关联"
            placement="top-start">
            <el-button
              @click="propertyRelated"
              size="mini">房源关联</el-button>
          </el-tooltip>
          <!--<el-tooltip-->
            <!--class="item"-->
            <!--effect="dark"-->
            <!--content="点击删除房源"-->
            <!--placement="top-start">-->
            <!--<el-button-->
              <!--@click="removeSingle"-->
              <!--size="mini">删除</el-button>-->
          <!--</el-tooltip>-->
        </div>
      </div>
    </div>
    <div class="m-it-gp-img">
      <h3 class="u-tt">图片</h3>
      <div class="u-ct-s">
        <div class="m-it-gp">
          <h3 class="u-tt-s">查看图片</h3>
          <div>
            <el-upload
              class="u-img-view-none"
              action="http://192.168.199.204:8083/bb/nav/upload"
              list-type="picture-card"
              disabled
              :on-preview="handlePictureCardPreview"
              :file-list="fileList">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog
              :visible.sync="dialogVisible">
              <img
                width="100%"
                :src="dialogImageUrl"
                alt="">
            </el-dialog>
        </div>
        </div>
      </div>
    </div>

    <div class="m-it-list" v-for="item in infoData">
      <div class="m-it-gp" v-if="item.type !== 'img'">
        <h3 class="u-tt">{{item.title}}</h3>
        <p class="u-ct" v-if="item.type === 'text'">{{item.text}}</p>
        <div class="u-ct-s" v-if="item.type === 'array'">
          <div class="m-it-gp u-it-gp-s" v-for="item in item.node" v-if="item.type !== 'images'">
            <h3 class="u-tt-s">{{item.title}}</h3>
            <p class="u-ct" v-if="item.type === 'text'">{{item.text}}</p>
            <div class="u-ct-s" v-if="item.type === 'array'">
              <p class="u-ct" v-for="item in item.node">{{item.text}}</p>
            </div>
          </div>
          <!--图片特例处理-->
          <div class="m-it-gp u-it-gp-s u-img-s" v-for="item in item.node" v-if="item.type === 'images'">
            <h3 class="u-tt-s">{{item.title}}</h3>
            <div v-if="item.type === 'images'">
              <el-upload
                class="u-img-view-none"
                action="http://192.168.199.204:8083/bb/nav/upload"
                list-type="picture-card"
                disabled
                :on-preview="handlePictureCardPreview"
                :file-list="item.text">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog
                :visible.sync="dialogVisible">
                <img
                  width="100%"
                  :src="dialogImageUrl">
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="s-ma-fl-140">
      <el-button size="mini" @click="by" v-if="userType === '0'">通过</el-button>
      <el-button size="mini" @click="fail" v-if="userType === '0'">不通过</el-button>
      <returnBtn></returnBtn>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tabs from './../../../components/public/tabs.vue'
  import returnBtn from './../../../components/public/returnBtn.vue'
  // 获取房源详情
  const GetRoom = vue => {
    const room = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rooms/' + vue.$route.params.propertyId + '/room',
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
    return room
  }
  // 获取图片列表
  const GetImagesList = (vue, id) => {
    const imagesList = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rooms/' + id + '/pictures',
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
    return imagesList
  }
  // 获取图片信息
  const GetImgInfo = (vue, list) => {
    const imgInfo = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.serverFile + '/api/v1/files/' + list.code,
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
    return imgInfo
  }
  // 获取关联房源信息
  const GetRelation = vue => {
    const relation = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rooms/' + vue.$route.params.propertyId + '/relation',
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
    return relation
  }
  // 删除房源
  const deleteRoom = vue => {
    const room = new Promise((resolve, reject) => {
      vue.$http({
        method: 'delete',
        url: window.config.server + '/api/v1/rooms/' + vue.$route.params.propertyId + '/room',
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
    return room
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
  export default {
    data () {
      return {
        fileList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        propertyInfo: {
          name: '',
          numbering: ''
        },
        infoData: [{
          name: 'address',
          title: '基础信息',
          type: 'array',
          node: [{
            name: 'propertyName',
            title: '房源名称',
            text: '',
            type: 'text'
          }, {
            name: 'propertyLocation',
            title: '房源位置',
            text: '',
            type: 'text'
          }, {
            name: 'streetAddress',
            title: '街道地址',
            text: '',
            type: 'text'
          }, {
            name: 'propertyType',
            title: '空间类型',
            text: '',
            type: 'text'
          }, {
            name: 'propertySubtype',
            title: '房屋类型',
            text: '',
            type: 'text'
          }, {
            name: 'housingUnits',
            title: '房屋户型',
            text: '',
            type: 'text'
          }, {
            name: 'numberIndependentBathroom',
            title: '独立卫生间数量',
            text: '',
            type: 'text'
          }, {
            name: 'numberPublicToilets',
            title: '公共卫生间数量',
            text: '',
            type: 'text'
          }, {
            name: 'houseArea',
            title: '房屋面积',
            text: '',
            type: 'text'
          }, {
            name: 'travelInfo',
            title: '交通信息',
            text: '',
            type: 'text'
          }, {
            name: 'peripheralInfo',
            title: '周边信息',
            text: '',
            type: 'text'
          }, {
            name: 'propertyFeatures',
            title: '房源特色',
            text: '',
            type: 'text'
          }, {
            name: 'propertyRule',
            title: '房屋守则',
            text: '',
            type: 'text'
          }]
        }, {
          name: 'occupancy',
          title: '必要设施',
          type: 'array',
          node: [{
            name: 'singleBed',
            title: '单人床数量',
            text: '',
            type: 'text'
          }, {
            name: 'doubleBed',
            title: '双人床数量',
            text: '',
            type: 'text'
          }, {
            name: 'bunkBed',
            title: '双层床数量',
            text: '',
            type: 'text'
          }, {
            name: 'childrenBed',
            title: '儿童床数量',
            text: '',
            type: 'text'
          }, {
            name: 'tatami',
            title: '榻榻米数量',
            text: '',
            type: 'text'
          }, {
            name: 'otherBed',
            title: '其他床数量',
            text: '',
            type: 'text'
          }]
        }, {
          name: 'contact',
          title: '附加设施',
          type: 'array',
          node: [{
            name: 'infrastructure',
            title: '基础设施',
            text: '',
            type: 'text'
          }, {
            name: 'livingFacilities',
            title: '生活设施',
            text: '',
            type: 'text'
          }, {
            name: 'toiletries',
            title: '洗浴用品',
            text: '',
            type: 'text'
          }, {
            name: 'entertainmentFacilities',
            title: '娱乐设施',
            text: '',
            type: 'text'
          }, {
            name: 'safetyFacilities',
            title: '安全设施',
            text: '',
            type: 'text'
          }]
        }, {
          name: 'service',
          title: '其他',
          type: 'array',
          node: [{
            name: 'service',
            title: '服务',
            text: '',
            type: 'text'
          }]
        }, {
          name: 'associatedProperty',
          title: '关联房源1',
          type: 'array',
          node: [{
            name: 'associatedPropertyName',
            title: '关联房源名称',
            text: '',
            type: 'text'
          }, {
            name: 'images',
            title: '图片',
            text: [],
            type: 'images'
          }]
        }],
        loading: true
      }
    },
    components: {
      tabs: Tabs,
      returnBtn: returnBtn
    },
    methods: {
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      // 入住规则
      checkInRules () {
        const propertyInfo = {
          name: this.propertyInfo.name,
          numbering: this.propertyInfo.numbering
        }
        this.$emit('propertyInfoDataTransfer', propertyInfo)
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/checkInRules/' + this.$route.params.propertyId)
      },
      // 房价列表
      rateList () {
        const propertyInfo = {
          name: this.propertyInfo.name,
          numbering: this.propertyInfo.numbering
        }
        this.$emit('propertyInfoDataTransfer', propertyInfo)
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/rateList/' + this.$route.params.propertyId)
      },
      // 渠道价格
      channelPrice () {
        const propertyInfo = {
          name: this.propertyInfo.name,
          numbering: this.propertyInfo.numbering
        }
        this.$emit('propertyInfoDataTransfer', propertyInfo)
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/channelPrice/' + this.$route.params.propertyId)
      },
      // 附加费用
      attached () {
        const propertyInfo = {
          name: this.propertyInfo.name,
          numbering: this.propertyInfo.numbering
        }
        this.$emit('propertyInfoDataTransfer', propertyInfo)
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/additionalFeesList/' + this.$route.params.propertyId)
      },
      // 房源政策
      propertyPolicy () {
        const propertyInfo = {
          name: this.propertyInfo.name,
          numbering: this.propertyInfo.numbering
        }
        this.$emit('propertyInfoDataTransfer', propertyInfo)
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyPolicy/' + this.$route.params.propertyId)
      },
      // 房源关联
      propertyRelated () {
        const propertyInfo = {
          name: this.propertyInfo.name,
          numbering: this.propertyInfo.numbering
        }
        this.$emit('propertyInfoDataTransfer', propertyInfo)
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyRelated/' + this.$route.params.propertyId)
      },
      // 编辑房源图片
      editPropertyImage () {
        const propertyInfo = {
          name: this.propertyInfo.name,
          numbering: this.propertyInfo.numbering
        }
        this.$emit('propertyInfoDataTransfer', propertyInfo)
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyImageEdit/' + this.$route.params.propertyId)
      },
      // 删除单项房源
      removeSingle () {
        this.$confirm('此操作将删除该房源, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const Room = deleteRoom(this)

          Room.then((resolve) => {
            if (resolve.data.code === '200') {
              this.loading = true
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList')
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
      // 审核通过
      by () {
        this.$confirm('您正在通过该房源的审核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 审核通过
          const AuditBy = SetAuditingBy(this, [this.$route.params.propertyId])

          AuditBy.then((resolve) => {
            if (resolve.data.code === '200') {
              this.$message({
                type: 'success',
                message: '通过成功!'
              })
              this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyAudit')
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
      fail () {
        this.$confirm('您正在打回该房源的审核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 审核打回
          const AuditFail = SetAuditingFail(this, [this.$route.params.propertyId])

          AuditFail.then((resolve) => {
            if (resolve.data.code === '200') {
              this.$message({
                type: 'success',
                message: '打回成功!'
              })
              this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyAudit')
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
      }
    },
    created: function () {
      // 判断用户类型
      this.userType = this.$cookie.get('userType')

      // 获取房源详情信息
      const Room = GetRoom(this)

      // 获取关联房源信息
      const Relation = GetRelation(this)

      Promise.all([Room, Relation])
        .then((resolve) => {
          let infrastructure = '' // 基础设施
          let livingFacilities = '' // 生活设施
          let entertainmentFacilities = '' // 娱乐设施
          let toiletries = '' // 洗浴设施
          let safetyFacilities = '' // 安全设施
          let surroundingFacilities = '' // 周边设施
          resolve[0].data.facilities.forEach((data) => {
            if (data.type === 0) infrastructure += data.name + '、'
            if (data.type === 1) livingFacilities += data.name + '、'
            if (data.type === 2) toiletries += data.name + '、'
            if (data.type === 3) entertainmentFacilities += data.name + '、'
            if (data.type === 4) safetyFacilities += data.name + '、'
            if (data.type === 5) surroundingFacilities += data.name + '、'
          })
          let singleBedNum = '' // 单人床数量
          let doubleBedNum = '' // 双人床数量
          let doubledeckBedNum = '' // 双层床数量
          let childrenBedNum = '' // 儿童床数量
          let tatamiNum = '' // 榻榻米数量
          let otherTypeNum = '' // 其他床数量
          if (resolve[0].data.bedSetting === null) {
            singleBedNum = ''
            doubleBedNum = ''
            doubledeckBedNum = ''
            childrenBedNum = ''
            tatamiNum = ''
            otherTypeNum = ''
          } else {
            singleBedNum = resolve[0].data.bedSetting.singleBedNum + '张'
            doubleBedNum = resolve[0].data.bedSetting.doubleBedNum + '张'
            doubledeckBedNum = resolve[0].data.bedSetting.doubledeckBedNum + '张'
            childrenBedNum = resolve[0].data.bedSetting.childrenBedNum + '张'
            tatamiNum = resolve[0].data.bedSetting.tatamiNum + '张'
            otherTypeNum = resolve[0].data.bedSetting.otherTypeNum + '张'
          }
          let services = '' // 服务
          resolve[0].data.services.forEach((data) => {
            services += data.name + '、'
          })
          this.propertyInfo = {
            name: resolve[0].data.attrValue.name,
            numbering: resolve[0].data.room.sn
          }
          let infoData = [{
            name: 'address',
            title: '基础信息',
            type: 'array',
            node: [{
              name: 'propertyName',
              title: '房源名称',
              text: resolve[0].data.attrValue.name,
              type: 'text'
            }, {
              name: 'propertyNumbering',
              title: '房源编号',
              text: resolve[0].data.room.sn,
              type: 'text'
            }, {
              name: 'propertyLocation',
              title: '房源位置',
              text: resolve[0].data.attrValue.countryName + '/' + resolve[0].data.attrValue.cityName,
              type: 'text'
            }, {
              name: 'streetAddress',
              title: '街道地址',
              text: resolve[0].data.attrValue.address,
              type: 'text'
            }, {
              name: 'propertyType',
              title: '空间类型',
              text: resolve[0].data.spaceType.name,
              type: 'text'
            }, {
              name: 'propertySubtype',
              title: '房屋类型',
              text: resolve[0].data.roomType.name,
              type: 'text'
            }, {
              name: 'housingUnits',
              title: '房屋户型',
              text: resolve[0].data.houseType.roomNum + '室' + resolve[0].data.houseType.hallNum + '厅' + resolve[0].data.houseType.balconyNum + '阳台',
              type: 'text'
            }, {
              name: 'numberIndependentBathroom',
              title: '独立卫生间数量',
              text: resolve[0].data.houseType.individualWashroomNum + '间',
              type: 'text'
            }, {
              name: 'numberPublicToilets',
              title: '公共卫生间数量',
              text: resolve[0].data.houseType.publicWashroomNum + '间',
              type: 'text'
            }, {
              name: 'houseArea',
              title: '房屋面积',
              text: resolve[0].data.attrValue.area + 'm2',
              type: 'text'
            }, {
              name: 'travelInfo',
              title: '交通信息',
              text: resolve[0].data.environmentInfo.trafficInfo,
              type: 'text'
            }, {
              name: 'peripheralInfo',
              title: '周边信息',
              text: resolve[0].data.environmentInfo.peripheralInfo,
              type: 'text'
            }, {
              name: 'propertyFeatures',
              title: '房源特色',
              text: resolve[0].data.attrValue.description,
              type: 'text'
            }, {
              name: 'propertyRule',
              title: '房屋守则',
              text: resolve[0].data.attrValue.rule,
              type: 'text'
            }]
          }, {
            name: 'occupancy',
            title: '必要设施',
            type: 'array',
            node: [{
              name: 'singleBed',
              title: '单人床数量',
              text: singleBedNum,
              type: 'text'
            }, {
              name: 'doubleBed',
              title: '双人床数量',
              text: doubleBedNum,
              type: 'text'
            }, {
              name: 'bunkBed',
              title: '双层床数量',
              text: doubledeckBedNum,
              type: 'text'
            }, {
              name: 'childrenBed',
              title: '儿童床数量',
              text: childrenBedNum,
              type: 'text'
            }, {
              name: 'tatami',
              title: '榻榻米数量',
              text: tatamiNum,
              type: 'text'
            }, {
              name: 'otherBed',
              title: '其他床数量',
              text: otherTypeNum,
              type: 'text'
            }]
          }, {
            name: 'contact',
            title: '附加设施',
            type: 'array',
            node: [{
              name: 'infrastructure',
              title: '基础设施',
              text: infrastructure,
              type: 'text'
            }, {
              name: 'livingFacilities',
              title: '生活设施',
              text: livingFacilities,
              type: 'text'
            }, {
              name: 'toiletries',
              title: '洗浴用品',
              text: toiletries,
              type: 'text'
            }, {
              name: 'entertainmentFacilities',
              title: '娱乐设施',
              text: entertainmentFacilities,
              type: 'text'
            }, {
              name: 'safetyFacilities',
              title: '安全设施',
              text: safetyFacilities,
              type: 'text'
            }, {
              name: 'surroundingFacilities',
              title: '周边设施',
              text: surroundingFacilities,
              type: 'text'
            }]
          }, {
            name: 'service',
            title: '其他',
            type: 'array',
            node: [{
              name: 'service',
              title: '服务',
              text: services,
              type: 'text'
            }]
          }]
          this.infoData = infoData
          resolve[1].data.forEach((data, index) => {
            let imgList = []
            // 获取图片列表
            const ImagesList = GetImagesList(this, data.relationRoomId)

            ImagesList.then((resolve) => {
              const imgs = resolve.data.data.map((data) => {
                return {
                  id: data.id,
                  code: data.pictureUrl
                }
              })

              imgs.forEach((data, index) => {
                // 获取图片信息
                const ImgInfo = GetImgInfo(this, data)

                ImgInfo.then((resolve) => {
                  const Img = {
                    id: resolve.data.id,
                    url: resolve.data.url,
                    code: resolve.data.code
                  }
                  imgList.push(Img)
                }).catch((reject) => {
                  window.publicFunction.error(reject, this)
                })
              })
            }).catch((reject) => {
              window.publicFunction.error(reject, this)
            })
            const relation = {
              name: 'associatedProperty',
              title: '关联房源' + (index + 1),
              type: 'array',
              node: [{
                name: 'associatedPropertyName',
                title: '关联房源名称',
                text: data.relationName,
                type: 'text'
              }, {
                name: 'images',
                title: '图片',
                text: imgList,
                type: 'images'
              }]
            }
            this.infoData.push(relation)
            this.loading = false
          })
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })

      // 获取图片列表
      const ImagesList = GetImagesList(this, this.$route.params.propertyId)

      ImagesList.then((resolve) => {
        const imgs = resolve.data.data.map((data) => {
          return {
            id: data.id,
            code: data.pictureUrl
          }
        })

        imgs.forEach((data) => {
          // 获取图片信息
          const ImgInfo = GetImgInfo(this, data)

          ImgInfo.then((resolve) => {
            const Img = {
              id: resolve.data.id,
              url: resolve.data.url,
              code: resolve.data.code
            }
            this.fileList.push(Img)
          }).catch((reject) => {
            window.publicFunction.error(reject, this)
          })
        })
        this.loading = false
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style scoped>
  .m-it-list{
    float: left;
    width: 100%;
  }
  .s-info{

  }
  .m-it-gp{
    display: flex;
    margin-bottom: 18px;
    line-height: 28px;
  }
  .u-it-gp-s{
    float: left;
    width: 50%;
  }
  .u-img-s{
    width: 100%;
  }
  .m-it-gp-img{
    display: flex;
    width: 100%;
    line-height: 28px;
  }
  .u-tt{
    margin: 0;
    padding-right: 12px;
    width: 80px;
    min-width: 80px;
    height: 28px;
    font-size: 14px;
    font-weight: 500;
    color: #5a5e66;
    text-align: right;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .u-tt-s{
    margin: 0;
    padding-right: 12px;
    width: 120px;
    min-width: 120px;
    height: 28px;
    font-size: 14px;
    font-weight: 500;
    color: #5a5e66;
    text-align: right;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .u-ct-s{
    margin: 0;
    flex: 1;
  }
  .u-ct{
    margin: 0;
    flex: 1;
    font-size: 12px;
    text-indent: .5em;
    border-bottom: 1px solid #dfe4e8;
  }
</style>
