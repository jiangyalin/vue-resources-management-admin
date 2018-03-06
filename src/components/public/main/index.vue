<template>
  <div class="g-mn">
    <el-container class="g-mn">
      <el-header>
        <topHeader></topHeader>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <navs @navDataTransfer="getNavData"></navs>
        </el-aside>
        <el-container direction="vertical" style="width: 1000px">
          <crumb :crumbs="crumb"></crumb>
          <div class="el-main">
            <div class="g-main">
              <router-view
                :propertyInfo="propertyInfo"
                @propertyInfoDataTransfer="getPropertyInfoData"></router-view>
            </div>
          </div>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
  import TopHeader from './../topHeader.vue'
  import Nav from './nav.vue'
  import Crumb from './../crumb.vue'
  export default {
    name: 'app',
    data () {
      return {
        crumb: [],
        propertyInfo: { // 房源信息
          name: '',
          numbering: ''
        }
      }
    },
    components: {
      topHeader: TopHeader,
      navs: Nav,
      crumb: Crumb
    },
    methods: {
      getNavData: function (msg) {
        this.crumb = msg
      },
      getPropertyInfoData: function (msg) {
        this.propertyInfo = msg
      }
    }
  }
</script>

<style scoped>
  .el-main{
    background: #f5f5f5;
  }
  .g-mn{
    background: #5d5d5d;
  }
</style>
