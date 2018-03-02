<template>
  <el-button size="mini" @click="returnBtn">返回</el-button>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    data () {
      return {}
    },
    components: {},
    methods: {
      returnBtn () {
        window.history.go(-1)
      }
    }
  }
</script>

<style scoped>

</style>
