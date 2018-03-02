<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
      }
    },
    components: {
    },
    methods: {
    },
    created: function () {
    }
  }
</script>

<style lang="sass">
  @import "style/app/app.scss";
  @import "style/public/public.scss";
</style>

<style>
  body,h1,h2,h3,h4,h5,h6,hr,p,blockquote,dl,dt,dd,ul,ol,li,pre,form,fieldset,legend,button,input,textarea,th,td,select{}
  body,button,input,select,textarea{font-family:"PingFang SC","PingHei","STHeitiSC-Light", "Myriad Set Pro", "Lucida Grande","Helvetica Neue", "Helvetica","microsoft yahei","SimHei", "tahoma", "Arial","Verdana", "sans-serif";}

  /*菜单*/
  .el-main{
    background:#f5f5f5;
  }
  .g-mn{
    background:#5d5d5d;
  }
  .el-menu{
    background:none;
  }
  .el-menu--horizontal .el-menu-item{
    color:#fff;
  }
  .el-menu--horizontal>.el-menu-item.is-active, .el-menu--horizontal>.el-submenu.is-active .el-submenu__title,
  .el-menu--horizontal>.el-menu-item.is-active:hover, .el-menu--horizontal>.el-submenu.is-active .el-submenu__title:hover{
    background:#ff8948;
    border-bottom:0;
    color:#fff;
  }
  .el-menu--horizontal .el-menu-item:hover{
    background:#656565;
    color:#fff;
  }

  /*皮肤*/
  .el-button--primary,.el-button--primary:hover,.el-button--primary:active,.el-button--primary:visited,.el-button--primary:focus{
    background-color: #ff8948;
    border-color: #ff8948;
  }

  /*浏览器滚动条*/
  ::-webkit-scrollbar/*整体部分*/{width:5px;height:5px;}
  ::-webkit-scrollbar-track/*滑动轨道*/{border-radius: 0px;
    background:rgba(255,255,255,0);}
  ::-webkit-scrollbar-thumb/*滑块*/{border-radius:5px;
    background:#e7e7e7;}
  ::-webkit-scrollbar-thumb:hover/*滑块效果*/{border-radius:5px;
    background:#e7e7e7;}
</style>
