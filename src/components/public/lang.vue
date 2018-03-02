<template>
  <el-select
    disabled
    class="u-gzn"
    v-model="value"
    size="mini"
    @change="to(value)">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  export default {
    name: 'globalization',
    data () {
      return {
        options: [{
          value: 'zh-cn',
          label: '简体中文',
          description: '简体中文'
        }, {
          value: 'en',
          label: 'English',
          description: '英语'
        }, {
          value: 'ja',
          label: '日本語',
          description: '日语'
        }, {
          value: 'fr',
          label: 'Français',
          description: '法语'
        }, {
          value: 'de',
          label: 'Deutsch',
          description: '德语'
        }],
        value: 'zh-cn'
      }
    },
    components: {},
    methods: {
      to: function (value) {
        let path = this.$route.path
        const lang = this.$route.params.lang
        const length = lang.length + 1
        path = '/' + value + path.substring(length)
        this.$router.push(path)
        Vue.config.lang = this.$route.params.lang
        window.location.reload()
      }
    },
    created: function () {
      const lang = this.$route.params.lang
      this.value = lang
      Vue.config.lang = lang
    }
  }
</script>
<style scoped>
  .u-gzn{
    width: 100px;
    padding-right: 18px;
  }
</style>
