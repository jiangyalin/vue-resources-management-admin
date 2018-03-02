<template>
  <div>
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
    </el-table>
    <el-pagination class="m-page" small layout="prev, pager, next" :total="500"></el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        // 渲染筛选
        filter: {},
        // 筛选值
        formInline: {},
        // 渲染表格
        tableTile: [{
          key: '0',
          columnLabel: '时间',
          prop: 'date'
        }, {
          key: '1',
          columnLabel: 'IP',
          prop: 'ip'
        }],
        // 列表数据
        tableData: [{
          id: '465',
          date: '2015-05-05 08:55',
          ip: '192.168.15.158'
        }, {
          id: '465',
          date: '2015-05-05 08:55',
          ip: '192.168.15.158'
        }, {
          id: '465',
          date: '2015-05-05 08:55',
          ip: '192.168.15.158'
        }, {
          id: '465',
          date: '2015-05-05 08:55',
          ip: '192.168.15.158'
        }, {
          id: '465',
          date: '2015-05-05 08:55',
          ip: '192.168.15.158'
        }, {
          id: '465',
          date: '2015-05-05 08:55',
          ip: '192.168.15.158'
        }, {
          id: '465',
          date: '2015-05-05 08:55',
          ip: '192.168.15.158'
        }, {
          id: '465',
          date: '2015-05-05 08:55',
          ip: '192.168.15.158'
        }, {
          id: '465',
          date: '2015-05-05 08:55',
          ip: '192.168.15.158'
        }, {
          id: '465',
          date: '2015-05-05 08:55',
          ip: '192.168.15.158'
        }],
        loading: false
      }
    },
    methods: {}
  }
</script>

<style>

</style>
