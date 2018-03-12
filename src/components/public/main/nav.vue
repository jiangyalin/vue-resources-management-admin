<template>
  <div class="m-nav">
    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          :default-active="openNav"
          class="el-menu-vertical-demo"
          :unique-opened="nav.uniqueOpened"
          text-color="#fff">
          <el-submenu
            v-for="item in navData"
            :index="item.index"
            :ref="item.name"
            :key="item.index">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>{{item.text}}</span>
            </template>
            <el-menu-item
              v-for="node in item.node"
              :index="node.index"
              @click="to($event, node.index)"
              :data-to="'/' + $route.params.lang + node.path"
              :key="node.index">{{node.text}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
  import home from './nav/home'
  import book from './nav/book'
  import user from './nav/user'
  // 初始化激活
  const InitActive = vue => {
    let active = ''
    const path = vue.$route.path
    vue.navData.forEach((result) => {
      result.node.forEach((result) => {
        if (path.indexOf(result.path) !== -1) {
          active = result.index
        }
      })
    })
    vue.nav.active = active
  }
  // 计算面包屑导航
  const CalculateCrumb = vue => {
    let crumb = []
    const node1 = vue.navIndex
    crumb.push(node1)
    let crumbActive = (nav, path) => {
      nav.forEach((result) => {
        if (path.indexOf(result.path) !== -1) {
          const node2 = {
            text: result.text,
            name: result.name,
            path: result.path,
            index: result.index
          }
          crumb.push(node2)
          if (result.node !== undefined) return crumbActive(result.node, path)
        }
        return false
      })
    }
    crumbActive(vue.navData, vue.$route.path)
    vue.$emit('navDataTransfer', crumb)
  }
  export default {
    name: '',
    data () {
      return {
        nav: {
          text: '首页',
          name: 'Home',
          active: '0',
          uniqueOpened: true
        },
        navData: [],
        navIndex: {}
      }
    },
    components: {},
    computed: {
      openNav () {
        return this.nav.active
      }
    },
    methods: {
      // 跳转激活
      to (event, index) {
        const path = event.$attrs['data-to']
        this.$router.push(path)
        this.activeIndex = index
      }
    },
    beforeCreate: () => {},
    created: function () {
      let nav = {}
      if (this.$route.path.indexOf('home') !== -1) nav = home
      if (this.$route.path.indexOf('book') !== -1) nav = book
      if (this.$route.path.indexOf('user') !== -1) nav = user

      this.navIndex = nav.node

      this.navData = nav.data(this)

      // 初始化激活
      InitActive(this)

      // 计算面包屑导航
      CalculateCrumb(this)
    },
    watch: {
      $route: function () {
        let nav = {}
        if (this.$route.path.indexOf('home') !== -1) nav = home
        if (this.$route.path.indexOf('book') !== -1) nav = book
        if (this.$route.path.indexOf('user') !== -1) nav = user

        this.navIndex = nav.node

        this.navData = nav.data(this)

        // 初始化激活
        InitActive(this)

        // 计算面包屑导航
        CalculateCrumb(this)
      }
    }
  }
</script>

<style scoped>
  .m-nav{
    height: 100%;
    background-color: #404654;
  }

  .el-aside{ overflow:hidden;}
  .m-nav{ background-color:#6b6b6b;}
  .el-submenu__title{ color:#fff;}
  .el-menu-item.is-active{ color:#fff; background:#757575;}
  .el-menu-item{ color:#fff;}


  .el-submenu__title:hover{background-color:#6b6b6b;}
  .el-submenu .el-menu-item:hover{background:#757575;}
  .m-nav-s{ background-color:#f5f5f5;}
</style>

<style>
  .m-nav .el-menu{ border-right:0;}
  .m-nav .el-submenu__title:hover{background-color:#757575;}
</style>
