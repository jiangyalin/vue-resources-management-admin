<template>
  <div class="m-nav-s">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="data in crumbs"
        :to="'/' + $route.params.lang + data.path"
        :key="data.index">{{data.text}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'crumb',
    data () {
      return {}
    },
    props: ['crumbs'],
    components: {},
    methods: {}
  }
</script>
<style scoped>
  .m-nav-s{
    padding: 20px;
    width: 100%;
    height: 30px;
    background-color: #f5f5f5;
    box-sizing: border-box;
  }
</style>

<style>
  .m-nav-s .el-breadcrumb__inner, .m-nav-s .el-breadcrumb__inner a{
    font-weight: 500;
  }
  .m-nav-s .el-breadcrumb{
    font-size: 12px;
  }
</style>
