<template>
  <div class="m-odr" v-loading="loading">
      <transition name="el-fade-in-linear">
        <div v-show="show.basis">
          <el-form
            :model="ruleForm1"
            :rules="rules1"
            ref="ruleForm1"
            label-width="140px"
            size="mini"
            class="demo-ruleForm s-ov-au">
            <el-form-item class="s-fl s-wd-50" label="房源编号" prop="propertyCode">
              <el-input v-model="ruleForm1.propertyCode"></el-input>
            </el-form-item>
            <el-form-item class="s-fl s-wd-50" label="房源名称" prop="propertyName">
              <el-input v-model="ruleForm1.propertyName"></el-input>
            </el-form-item>
            <el-form-item class="s-fl s-wd-50" label="房源位置" prop="propertyLocation">
              <el-cascader class="s-wd-100"
                :options="propertyLocationOptions"
                @active-item-change="handleItemChange"
                v-model="ruleForm1.propertyLocation"
                :props="props">
              </el-cascader>
            </el-form-item>
            <el-form-item class="s-fl s-wd-50" label="街道地址" prop="streetAddress">
              <el-input v-model="ruleForm1.streetAddress"></el-input>
            </el-form-item>
            <el-form-item class="s-fl s-wd-33" label="空间类型" prop="propertyType">
              <el-select class="s-wd-100" v-model="ruleForm1.propertyType">
                <el-option
                  v-for="item in propertyTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="s-fl s-wd-33" label="房屋类型" prop="propertySubtype">
              <el-select class="s-wd-100" v-model="ruleForm1.propertySubtype">
                <el-option
                  v-for="item in propertySubtypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="s-fl s-wd-33" label="房屋户型" prop="housingUnits">
              <el-cascader class="s-wd-100"
                :options="housingUnitsOptions"
                v-model="ruleForm1.housingUnits"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
            <el-form-item class="s-fl s-wd-33" label="独立卫生间数量" prop="numberIndependentBathroom">
              <el-input-number class="s-wd-100"
                v-model="ruleForm1.numberIndependentBathroom"
                :min="0"
                :max="10"></el-input-number>
            </el-form-item>
            <el-form-item class="s-fl s-wd-33" label="公共卫生间数量" prop="numberPublicToilets">
              <el-input-number class="s-wd-100"
                v-model="ruleForm1.numberPublicToilets"
                :min="0"
                :max="10"></el-input-number>
            </el-form-item>
            <el-form-item class="s-fl s-wd-33" label="房屋面积" prop="houseArea">
              <el-input placeholder="请输入内容" v-model="ruleForm1.houseArea">
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
            <el-form-item class="s-fl s-wd-100" label="交通信息" prop="travelInfo">
              <el-input type="textarea" v-model="ruleForm1.travelInfo"></el-input>
            </el-form-item>
            <el-form-item class="s-fl s-wd-100" label="周边信息" prop="peripheralInfo">
              <el-input type="textarea" v-model="ruleForm1.peripheralInfo"></el-input>
            </el-form-item>
            <el-form-item class="s-fl s-wd-100" label="房源特色" prop="propertyFeatures">
              <el-input type="textarea" v-model="ruleForm1.propertyFeatures"></el-input>
            </el-form-item>
            <el-form-item class="s-fl s-wd-100" label="房屋守则" prop="propertyRule">
              <el-input type="textarea" v-model="ruleForm1.propertyRule"></el-input>
            </el-form-item>
            <el-form-item class="s-fl">
              <el-button type="primary" @click="submitForm('ruleForm1', 'basis')">更新</el-button>
              <el-button type="primary" @click="nextPage('basis')">下一页</el-button>
              <el-button @click="resetForm('ruleForm1')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </transition>
      <transition name="el-fade-in-linear">
        <div v-show="show.supporting">
          <el-form
            :model="ruleForm2"
            :rules="rules2"
            ref="ruleForm2"
            label-width="140px"
            size="mini"
            class="demo-ruleForm s-ov-au">
            <el-form-item class="s-fl s-wd-33" label="单人床数量" prop="singleBed">
              <el-input-number class="s-wd-100"
                v-model="ruleForm2.singleBed"
                :min="0"
                :max="10"></el-input-number>
            </el-form-item>
            <el-form-item class="s-fl s-wd-33" label="双人床数量" prop="doubleBed">
              <el-input-number class="s-wd-100"
                v-model="ruleForm2.doubleBed"
                :min="0"
                :max="10"></el-input-number>
            </el-form-item>
            <el-form-item class="s-fl s-wd-33" label="双层床数量" prop="bunkBed">
              <el-input-number class="s-wd-100"
                v-model="ruleForm2.bunkBed"
                :min="0"
                :max="10"></el-input-number>
            </el-form-item>
            <el-form-item class="s-fl s-wd-33" label="儿童床数量" prop="childrenBed">
              <el-input-number class="s-wd-100"
                v-model="ruleForm2.childrenBed"
                :min="0"
                :max="10"></el-input-number>
            </el-form-item>
            <el-form-item class="s-fl s-wd-33" label="榻榻米数量" prop="tatami">
              <el-input-number class="s-wd-100"
                v-model="ruleForm2.tatami"
                :min="0"
                :max="10"></el-input-number>
            </el-form-item>
            <el-form-item class="s-fl s-wd-33" label="其他床数量" prop="otherBed">
              <el-input-number class="s-wd-100"
                v-model="ruleForm2.otherBed"
                :min="0"
                :max="10"></el-input-number>
            </el-form-item>
            <el-form-item class="s-fl">
              <el-button type="primary" @click="submitForm('ruleForm2', 'supporting')">更新</el-button>
              <el-button type="primary" @click="nextPage('supporting')">下一页</el-button>
              <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </transition>
      <transition name="el-fade-in-linear">
        <div v-show="show.service">
          <el-form
            :model="ruleForm3"
            :rules="rules3"
            ref="ruleForm3"
            label-width="140px"
            size="mini"
            class="demo-ruleForm s-ov-au">
            <el-form-item label="基础设施" prop="infrastructure">
              <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                :indeterminate="infrastructureIsIndeterminate"
                v-model="infrastructureCheckAll"
                @change="handleCheckAllChange1">全选</el-checkbox>
              <el-checkbox-group v-model="ruleForm3.infrastructure" @change="handleCheckedCitiesChange1">
                <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                  v-for="item in infrastructureOptions"
                  :label="item.value"
                  :key="item.value"
                  :value="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="生活设施" prop="livingFacilities">
              <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                :indeterminate="livingFacilitiesIsIndeterminate"
                v-model="livingFacilitiesCheckAll"
                @change="handleCheckAllChange2">全选</el-checkbox>
              <el-checkbox-group v-model="ruleForm3.livingFacilities" @change="handleCheckedCitiesChange2">
                <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                  v-for="item in livingFacilitiesOptions"
                  :label="item.value"
                  :key="item.value"
                  :value="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="洗浴用品" prop="toiletries">
              <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                :indeterminate="toiletriesIsIndeterminate"
                v-model="toiletriesCheckAll"
                @change="handleCheckAllChange4">全选</el-checkbox>
              <el-checkbox-group v-model="ruleForm3.toiletries" @change="handleCheckedCitiesChange4">
                <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                  v-for="item in toiletriesOptions"
                  :label="item.value"
                  :key="item.value"
                  :value="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="娱乐设施" prop="entertainmentFacilities">
              <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                :indeterminate="entertainmentFacilitiesIsIndeterminate"
                v-model="entertainmentFacilitiesCheckAll"
                @change="handleCheckAllChange3">全选</el-checkbox>
              <el-checkbox-group v-model="ruleForm3.entertainmentFacilities" @change="handleCheckedCitiesChange3">
                <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                  v-for="item in entertainmentFacilitiesOptions"
                  :label="item.value"
                  :key="item.value"
                  :value="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="安全设施" prop="safetyFacilities">
              <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                :indeterminate="safetyFacilitiesIsIndeterminate"
                v-model="safetyFacilitiesCheckAll"
                @change="handleCheckAllChange5">全选</el-checkbox>
              <el-checkbox-group v-model="ruleForm3.safetyFacilities" @change="handleCheckedCitiesChange5">
                <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                  v-for="item in safetyFacilitiesOptions"
                  :label="item.value"
                  :key="item.value"
                  :value="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="周边设施" prop="surroundingFacilities">
              <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                :indeterminate="surroundingFacilitiesIsIndeterminate"
                v-model="surroundingFacilitiesCheckAll"
                @change="handleCheckAllChange6">全选</el-checkbox>
              <el-checkbox-group v-model="ruleForm3.surroundingFacilities" @change="handleCheckedCitiesChange6">
                <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                  v-for="item in surroundingFacilitiesOptions"
                  :label="item.value"
                  :key="item.value"
                  :value="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="服务" prop="service">
              <el-checkbox-group v-model="ruleForm3.service">
                <el-checkbox class="s-ma-fl-15 s-pa-fr-15"
                  v-for="item in serviceOptions"
                  :label="item.value"
                  :key="item.value"
                  :value="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item class="s-fl">
              <el-button type="primary" @click="submitForm('ruleForm3', 'service')">更新</el-button>
              <el-button @click="resetForm('ruleForm3')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  // 解析选项数据
  const Equipment = (response) => {
    let equipment = []
    equipment = response.data.map((data) => {
      return {
        value: data.id,
        label: data.name
      }
    })
    return {
      equipment
    }
  }
  // 获取详情
  const GetInfo = (vue) => {
    const info = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rooms/' + vue.$route.params.propertyId + '/room',
        params: {
          roomId: vue.$route.params.propertyId
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
    return info
  }
  // 获取房屋空间类型
  const GetPropertyType = (vue) => {
    const propertyType = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/base/spaceTypes',
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
    return propertyType
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
  // 获取房源位置（国家）
  const GetCountries = vue => {
    const propertyLocationCountry = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/base/countries',
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
    return propertyLocationCountry
  }
  // 获取其他服务
  const GetOtherServices = vue => {
    const otherServices = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/base/otherServices',
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
    return otherServices
  }
  // 获取设备
  const GetFacilities = (vue, type) => {
    const facilities = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/base/facilities',
        params: {
          type: type
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
    return facilities
  }
  // 获取城市
  const GetCities = (vue, id) => {
    const cities = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/base/cities',
        params: {
          countryId: id
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
    return cities
  }
  // 编辑房源基础信息
  const EditRoom = vue => {
    const room = new Promise((resolve, reject) => {
      const propertyLocation = [] // 房源位置
      vue.propertyLocationOptions.forEach((data) => {
        if (data.label === vue.ruleForm1.propertyLocation[0]) {
          propertyLocation.push(data.value)
          data.cities.forEach((data) => {
            if (data.label === vue.ruleForm1.propertyLocation[1]) {
              propertyLocation.push(data.value)
            }
          })
        }
      })
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/rooms/' + vue.$route.params.propertyId + '/room',
        data: {
          languageCode: vue.$route.params.lang,
          ownerId: '1', // 拥有者id
          propertyCode: vue.ruleForm1.propertyCode, // 房源编号
          propertyName: vue.ruleForm1.propertyName, // 房源名称
          propertyLocation: propertyLocation, // 房源位置
          streetAddress: vue.ruleForm1.streetAddress, // 街道地址
          propertyType: vue.ruleForm1.propertyType, // 空间类型
          propertySubtype: vue.ruleForm1.propertySubtype, // 房屋类型
          housingUnits: vue.ruleForm1.housingUnits, // 房屋户型
          houseArea: vue.ruleForm1.houseArea, // 房屋面积
          travelInfo: vue.ruleForm1.travelInfo, // 交通环境
          peripheralInfo: vue.ruleForm1.peripheralInfo, // 周边信息
          propertyFeatures: vue.ruleForm1.propertyFeatures, // 房源特色
          propertyRule: vue.ruleForm1.propertyRule, // 房屋守则
          numberIndependentBathroom: vue.ruleForm1.numberIndependentBathroom, // 独立卫生间数量
          numberPublicToilets: vue.ruleForm1.numberPublicToilets // 公共卫生间数量
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
    return room
  }
  // 编辑房源床型信息
  const EditBedSetting = vue => {
    const bedSetting = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/rooms/' + vue.$route.params.propertyId + '/bedSetting',
        data: {
          singleBed: vue.ruleForm2.singleBed, // 单人床数量
          doubleBed: vue.ruleForm2.doubleBed, // 双人床数量
          bunkBed: vue.ruleForm2.bunkBed, // 双层床数量
          childrenBed: vue.ruleForm2.childrenBed, // 儿童床数量
          tatami: vue.ruleForm2.tatami, // 榻榻米数量
          otherBed: vue.ruleForm2.otherBed // 其他床数量
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
    return bedSetting
  }
  // 编辑房源设施信息
  const EditRoomFacilitiesAndOtherServices = vue => {
    const roomFacilitiesAndOtherServices = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/rooms/' + vue.$route.params.propertyId + '/roomFacilitiesAndOtherServices',
        data: {
          infrastructure: vue.ruleForm3.infrastructure, // 基础设施
          livingFacilities: vue.ruleForm3.livingFacilities, // 生活设施
          entertainmentFacilities: vue.ruleForm3.entertainmentFacilities, // 娱乐设施
          toiletries: vue.ruleForm3.toiletries, // 洗浴设施
          safetyFacilities: vue.ruleForm3.safetyFacilities, // 安全设施
          peripheralFacilities: vue.ruleForm3.surroundingFacilities, // 周边设施
          service: vue.ruleForm3.service // 其他服务
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
    return roomFacilitiesAndOtherServices
  }
  export default {
    data () {
      return {
        show: {
          basis: true,
          supporting: false,
          service: false
        },
        props: {
          value: 'label',
          children: 'cities'
        },
        ruleForm1: {
          propertyCode: '', // 房源编号
          propertyName: '', // 房源名称
          propertyLocation: [], // 房源位置
          streetAddress: '', // 街道地址
          propertyType: '', // 空间类型
          propertySubtype: '', // 房屋类型
          housingUnits: [], // 房屋户型
          houseArea: '', // 房屋面积
          travelInfo: '', // 交通信息
          peripheralInfo: '', // 周边信息
          propertyFeatures: '', // 房源特色
          propertyRule: '', // 房屋守则
          numberIndependentBathroom: '0', // 独立卫生间数量
          numberPublicToilets: '0' // 公共卫生间数量
        },
        ruleForm2: {
          singleBed: '0', // 单人床数量
          doubleBed: '0', // 双人床数量
          bunkBed: '0', // 双层床数量
          childrenBed: '0', // 儿童床数量
          tatami: '0', // 榻榻米数量
          otherBed: '0' // 其他床数量
        },
        ruleForm3: {
          infrastructure: [], // 基础设施
          livingFacilities: [], // 生活设施
          entertainmentFacilities: [], // 娱乐设施
          toiletries: [], // 洗浴用品
          safetyFacilities: [], // 安全设施
          surroundingFacilities: [], // 周边设施
          service: [] // 服务
        },
        rules1: {
          propertyCode: [
            { required: true, message: '请输入房源编号', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          propertyName: [
            { required: true, message: '请输入房源名称', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          propertyLocation: [
            { required: true, message: '请选择房源位置', trigger: 'blur' }
          ],
          streetAddress: [
            { required: true, message: '请输入街道地址', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          propertyType: [
            { required: true, message: '请选择空间类型', trigger: 'blur' }
          ],
          propertySubtype: [
            { required: true, message: '请选择房屋类型', trigger: 'blur' }
          ],
          housingUnits: [
            { required: true, message: '请选择房屋户型', trigger: 'blur' }
          ],
          houseArea: [
            { required: true, message: '请输入房屋面积', trigger: 'blur' },
            { pattern: /^\d{1,5}$/, message: '房屋面积应为0到99999之间的整数' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          associatedProperty: [],
          travelInfo: [
            { required: true, message: '请输入交通信息', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          peripheralInfo: [
            { required: true, message: '请输入周边信息', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          propertyFeatures: [
            { required: true, message: '请输入房源特色', trigger: 'blur' },
            { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          propertyRule: [
            { required: true, message: '请输入房屋守则', trigger: 'blur' },
            { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' },
            { pattern: /\S+/, message: '不能全为空格' }
          ],
          numberIndependentBathroom: [
            { required: true, message: '请输入独立卫生间数量', trigger: 'blur' }
          ],
          numberPublicToilets: [
            { required: true, message: '请输入公共卫生间数量', trigger: 'blur' }
          ]
        },
        rules2: {
          singleBed: [
            { required: true, message: '请输入单人床数量', trigger: 'blur' }
          ],
          doubleBed: [
            { required: true, message: '请输入双人床数量', trigger: 'blur' }
          ],
          bunkBed: [
            { required: true, message: '请输入双层床数量', trigger: 'blur' }
          ],
          childrenBed: [
            { required: true, message: '请输入儿童床数量', trigger: 'blur' }
          ],
          tatami: [
            { required: true, message: '请输入榻榻米数量', trigger: 'blur' }
          ],
          otherBed: [
            { required: true, message: '请输入其他床数量', trigger: 'blur' }
          ]
        },
        rules3: {
          infrastructure: [
            { required: false, message: '请选择基础设施', trigger: 'blur' }
          ],
          livingFacilities: [
            { required: false, message: '请选择生活设施', trigger: 'blur' }
          ],
          entertainmentFacilities: [
            { required: false, message: '请选择娱乐设施', trigger: 'blur' }
          ],
          toiletries: [
            { required: false, message: '请选择洗浴用品', trigger: 'blur' }
          ],
          safetyFacilities: [
            { required: false, message: '请选择安全设施', trigger: 'blur' }
          ],
          surroundingFacilities: [
            { required: false, message: '请选择周边设施', trigger: 'blur' }
          ],
          service: [
            { required: false, message: '请选择服务', trigger: 'blur' }
          ]
        },
        propertyLocationOptions: [],
        propertyTypeOptions: [],
        propertySubtypeOptions: [],
        infrastructureCheckAll: false,
        infrastructureIsIndeterminate: false,
        infrastructureOptions: [],
        livingFacilitiesCheckAll: false,
        livingFacilitiesIsIndeterminate: false,
        livingFacilitiesOptions: [],
        entertainmentFacilitiesCheckAll: false,
        entertainmentFacilitiesIsIndeterminate: false,
        entertainmentFacilitiesOptions: [],
        toiletriesCheckAll: false,
        toiletriesIsIndeterminate: false,
        toiletriesOptions: [],
        safetyFacilitiesCheckAll: false,
        safetyFacilitiesIsIndeterminate: false,
        safetyFacilitiesOptions: [],
        surroundingFacilitiesCheckAll: false,
        surroundingFacilitiesIsIndeterminate: false,
        surroundingFacilitiesOptions: [],
        housingUnitsOptions: [],
        serviceOptions: [],
        loading: true
      }
    },
    methods: {
      handleCheckAllChange1 (val) {
        const infrastructureAll = this.infrastructureOptions.map((data) => {
          return data.label
        })
        this.ruleForm3.infrastructure = val ? infrastructureAll : []
        this.infrastructureIsIndeterminate = false
      },
      handleCheckedCitiesChange1 (value) {
        let checkedCount = value.length
        this.infrastructureCheckAll = checkedCount === this.infrastructureOptions.length
        this.infrastructureIsIndeterminate = checkedCount > 0 && checkedCount < this.infrastructureOptions.length
      },
      handleCheckAllChange2 (val) {
        const infrastructureAll = this.livingFacilitiesOptions.map((data) => {
          return data.label
        })
        this.ruleForm3.livingFacilities = val ? infrastructureAll : []
        this.livingFacilitiesIsIndeterminate = false
      },
      handleCheckedCitiesChange2 (value) {
        let checkedCount = value.length
        this.livingFacilitiesCheckAll = checkedCount === this.livingFacilitiesOptions.length
        this.livingFacilitiesIsIndeterminate = checkedCount > 0 && checkedCount < this.livingFacilitiesOptions.length
      },
      handleCheckAllChange3 (val) {
        const infrastructureAll = this.entertainmentFacilitiesOptions.map((data) => {
          return data.label
        })
        this.ruleForm3.entertainmentFacilities = val ? infrastructureAll : []
        this.entertainmentFacilitiesIsIndeterminate = false
      },
      handleCheckedCitiesChange3 (value) {
        let checkedCount = value.length
        this.entertainmentFacilitiesCheckAll = checkedCount === this.entertainmentFacilitiesOptions.length
        this.entertainmentFacilitiesIsIndeterminate = checkedCount > 0 && checkedCount < this.entertainmentFacilitiesOptions.length
      },
      handleCheckAllChange4 (val) {
        const infrastructureAll = this.toiletriesOptions.map((data) => {
          return data.label
        })
        this.ruleForm3.toiletries = val ? infrastructureAll : []
        this.toiletriesIsIndeterminate = false
      },
      handleCheckedCitiesChange4 (value) {
        let checkedCount = value.length
        this.toiletriesCheckAll = checkedCount === this.toiletriesOptions.length
        this.toiletriesIsIndeterminate = checkedCount > 0 && checkedCount < this.toiletriesOptions.length
      },
      handleCheckAllChange5 (val) {
        const infrastructureAll = this.safetyFacilitiesOptions.map((data) => {
          return data.label
        })
        this.ruleForm3.safetyFacilities = val ? infrastructureAll : []
        this.safetyFacilitiesIsIndeterminate = false
      },
      handleCheckedCitiesChange5 (value) {
        let checkedCount = value.length
        this.safetyFacilitiesCheckAll = checkedCount === this.safetyFacilitiesOptions.length
        this.safetyFacilitiesIsIndeterminate = checkedCount > 0 && checkedCount < this.safetyFacilitiesOptions.length
      },
      handleCheckAllChange6 (val) {
        const infrastructureAll = this.surroundingFacilitiesOptions.map((data) => {
          return data.label
        })
        this.ruleForm3.surroundingFacilities = val ? infrastructureAll : []
        this.surroundingFacilitiesIsIndeterminate = false
      },
      handleCheckedCitiesChange6 (value) {
        let checkedCount = value.length
        this.surroundingFacilitiesCheckAll = checkedCount === this.surroundingFacilitiesOptions.length
        this.surroundingFacilitiesIsIndeterminate = checkedCount > 0 && checkedCount < this.surroundingFacilitiesOptions.length
      },
      // 编辑房源
      submitForm (formName, formShow) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formShow === 'basis') {
              this.loading = true
              // 编辑房源基础信息
              const Room = EditRoom(this)

              Room.then((resolve) => {
                if (resolve.data.code === '200') {
                  this.propertyId = resolve.data.roomId
                  this.$confirm('编辑房源基础信息成功', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'success'
                  }).then(() => {
                    this.show.basis = false
                    window.setTimeout(() => {
                      this.show.supporting = true
                    }, 300)
                  })
                }
                this.loading = false
              }).catch((reject) => {
                window.publicFunction.error(reject, this)
              })
            }
            if (formShow === 'supporting') {
              // 编辑房源床型信息
              const BedSetting = EditBedSetting(this)

              BedSetting.then((resolve) => {
                if (resolve.data.code === '200') {
                  this.propertyId = resolve.data.roomId
                  this.$confirm('编辑房源床型信息成功', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'success'
                  }).then(() => {
                    this.show.supporting = false
                    window.setTimeout(() => {
                      this.show.service = true
                    }, 300)
                  })
                }
                this.loading = false
              }).catch((reject) => {
                window.publicFunction.error(reject, this)
              })
            }
            if (formShow === 'service') {
              this.loading = true

              // 编辑房源设施信息
              const RoomFacilitiesAndOtherServices = EditRoomFacilitiesAndOtherServices(this)

              RoomFacilitiesAndOtherServices.then((resolve) => {
                if (resolve.data.code === '200') {
                  this.propertyId = resolve.data.roomId
                  this.$confirm('编辑房源设施信息成功', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'success'
                  }).then(() => {
                    this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList')
                  })
                }
                this.loading = false
              }).catch((reject) => {
                window.publicFunction.error(reject, this)
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 下一页
      nextPage (formShow) {
        if (formShow === 'basis') {
          this.show.basis = false
          window.setTimeout(() => {
            this.show.supporting = true
          }, 300)
        }
        if (formShow === 'supporting') {
          this.show.supporting = false
          window.setTimeout(() => {
            this.show.service = true
          }, 300)
        }
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      handleChange (value) {
        console.log(value)
      },
      // 房源位置
      handleItemChange (val) {
        const propertyLocationOptions = this.propertyLocationOptions
        let countryId = 0
        let propertyLocationIndex = 0
        propertyLocationOptions.forEach((data, index) => {
          if (data.label === val[0]) {
            countryId = data.value
            propertyLocationIndex = index
          }
        })

        // 获取城市
        const Cities = GetCities(this, countryId)

        Cities.then((resolve) => {
          let cities = []
          cities = resolve.data.map((data) => {
            return {
              value: data.id,
              label: data.name
            }
          })
          this.propertyLocationOptions[propertyLocationIndex].cities = cities
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      }
    },
    created: function () {
      // 初始化房屋户型
      let housingUnitsOptions = []
      for (let i = 0; i < 4; i++) {
        let node = []
        for (let j = 0; j < 4; j++) {
          let node2 = []
          for (let k = 0; k < 5; k++) {
            node2.push({
              value: k + '',
              label: k + '阳台'
            })
          }
          node.push({
            value: j + '',
            label: j + '厅',
            children: node2
          })
        }
        housingUnitsOptions.push({
          value: (i + 1) + '',
          label: (i + 1) + '室',
          children: node
        })
      }
      this.housingUnitsOptions = housingUnitsOptions

      // 获取房屋空间类型
      const PropertyType = GetPropertyType(this)

      PropertyType.then((resolve) => {
        let propertyTypeOptions = []
        propertyTypeOptions = resolve.data.map((data) => {
          return {
            value: data.id,
            label: data.name
          }
        })
        this.propertyTypeOptions = propertyTypeOptions
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取房屋类型
      const PropertySubtype = GetPropertySubtype(this)

      PropertySubtype.then((resolve) => {
        let propertySubtypeOptions = []
        propertySubtypeOptions = resolve.data.map((data) => {
          return {
            value: data.id,
            label: data.name
          }
        })
        this.propertySubtypeOptions = propertySubtypeOptions
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取房源位置（国家）
      const PropertyLocationCountry = GetCountries(this)

      PropertyLocationCountry.then((resolve) => {
        let propertyLocationOptions = []
        propertyLocationOptions = resolve.data.map((data) => {
          return {
            value: data.id,
            label: data.name,
            cities: []
          }
        })
        this.propertyLocationOptions = propertyLocationOptions
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取其他服务
      const Service = GetOtherServices(this)

      Service.then((resolve) => {
        let serviceOptions = []
        serviceOptions = resolve.data.map((data) => {
          return {
            value: data.id,
            label: data.name
          }
        })
        this.serviceOptions = serviceOptions
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取基础设备
      const Infrastructure = GetFacilities(this, 0)

      Infrastructure.then((resolve) => {
        const infrastructure = Equipment(resolve).equipment
        this.infrastructureOptions = infrastructure
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取生活设施
      const LivingFacilities = GetFacilities(this, 1)

      LivingFacilities.then((resolve) => {
        const livingFacilities = Equipment(resolve).equipment
        this.livingFacilitiesOptions = livingFacilities
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取洗浴设施
      const Toiletries = GetFacilities(this, 2)

      Toiletries.then((resolve) => {
        const toiletries = Equipment(resolve).equipment
        this.toiletriesOptions = toiletries
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取娱乐设施
      const EntertainmentFacilities = GetFacilities(this, 3)

      EntertainmentFacilities.then((resolve) => {
        const entertainmentFacilities = Equipment(resolve).equipment
        this.entertainmentFacilitiesOptions = entertainmentFacilities
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取安全设施
      const SafetyFacilities = GetFacilities(this, 4)

      SafetyFacilities.then((resolve) => {
        const safetyFacilities = Equipment(resolve).equipment
        this.safetyFacilitiesOptions = safetyFacilities
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取周边设施
      const SurroundingFacilities = GetFacilities(this, 5)

      SurroundingFacilities.then((resolve) => {
        const surroundingFacilities = Equipment(resolve).equipment
        this.surroundingFacilitiesOptions = surroundingFacilities
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取房源详细信息
      const Info = GetInfo(this)

      Info.then((resolve) => {
        let ruleForm1 = {
          propertyCode: resolve.data.room.sn, // 房源编号
          propertyName: resolve.data.attrValue.name, // 房源名称
          propertyLocation: [resolve.data.attrValue.countryName, resolve.data.attrValue.cityName], // 房源位置
          streetAddress: resolve.data.attrValue.address, // 街道地址
          propertyType: resolve.data.spaceType.id, // 空间类型
          propertySubtype: resolve.data.roomType.id, // 房屋类型
          housingUnits: [resolve.data.houseType.roomNum + '', resolve.data.houseType.hallNum + '', resolve.data.houseType.balconyNum + ''], // 房屋户型
          houseArea: resolve.data.attrValue.area, // 房屋面积
          numberIndependentBathroom: resolve.data.houseType.individualWashroomNum, // 独立卫生间数量
          numberPublicToilets: resolve.data.houseType.publicWashroomNum, // 公共卫生间数量
          travelInfo: resolve.data.environmentInfo.trafficInfo, // 交通信息
          peripheralInfo: resolve.data.environmentInfo.peripheralInfo, // 周边信息
          propertyFeatures: resolve.data.attrValue.description, // 房源特色
          propertyRule: resolve.data.attrValue.rule // 房屋守则
        }
        let ruleForm2 = {
          singleBed: resolve.data.bedSetting.singleBedNum, // 单人床数量
          doubleBed: resolve.data.bedSetting.doubleBedNum, // 双人床数量
          bunkBed: resolve.data.bedSetting.doubledeckBedNum, // 双层床数量
          childrenBed: resolve.data.bedSetting.childrenBedNum, // 儿童床数量
          tatami: resolve.data.bedSetting.tatamiNum, // 榻榻米数量
          otherBed: resolve.data.bedSetting.otherTypeNum // 其他床数量
        }
        let infrastructure = [] // 基础设施
        let livingFacilities = [] // 生活设施
        let entertainmentFacilities = [] // 娱乐设施
        let toiletries = [] // 洗浴设施
        let safetyFacilities = [] // 安全设施
        let surroundingFacilities = [] // 周边设施
        resolve.data.facilities.forEach((data) => {
          if (data.type === 0) infrastructure.push(data.id)
          if (data.type === 1) livingFacilities.push(data.id)
          if (data.type === 2) toiletries.push(data.id)
          if (data.type === 3) entertainmentFacilities.push(data.id)
          if (data.type === 4) safetyFacilities.push(data.id)
          if (data.type === 5) surroundingFacilities.push(data.id)
        })
        let services = [] // 服务
        services = resolve.data.services.map((data) => {
          return data.id
        })
        let ruleForm3 = {
          infrastructure: infrastructure, // 基础设施
          livingFacilities: livingFacilities, // 生活设施
          entertainmentFacilities: entertainmentFacilities, // 娱乐设施
          toiletries: toiletries, // 洗浴用品
          safetyFacilities: safetyFacilities, // 安全设施
          surroundingFacilities: surroundingFacilities, // 周边设施
          service: services // 服务
        }
        this.ruleForm1 = ruleForm1
        this.ruleForm2 = ruleForm2
        this.ruleForm3 = ruleForm3
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      Promise.all([PropertyLocationCountry, Info]).then((resolve) => {
        const propertyLocationOptions = this.propertyLocationOptions
        let countryId = 0
        let propertyLocationIndex = 0
        propertyLocationOptions.forEach((data, index) => {
          if (data.label === resolve[1].data.attrValue.countryName) {
            countryId = data.value
            propertyLocationIndex = index
          }
        })
        // 获取城市
        const Cities = GetCities(this, countryId)

        Cities.then((resolve) => {
          let cities = []
          cities = resolve.data.map((data) => {
            return {
              value: data.id,
              label: data.name
            }
          })
          this.propertyLocationOptions[propertyLocationIndex].cities = cities
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      Promise.all([PropertyType, PropertySubtype, PropertyLocationCountry, Service, Infrastructure, LivingFacilities, EntertainmentFacilities, Toiletries, SafetyFacilities, SurroundingFacilities, Info])
        .then((resolve) => {
          this.loading = false
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
    }
  }
</script>

<style scoped>
  .u-it{
    width: 551px;
  }
  .m-odr{
    overflow: auto;
    padding: 30px 30px 0 0;
  }
</style>
