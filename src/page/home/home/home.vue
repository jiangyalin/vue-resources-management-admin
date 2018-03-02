<template>
  <div class="g-home-mn">
    <div class="m-sis-gp">
      <div class="u-box">
        <div class="u-box-mn">
          <i class="fa fa-file-text-o"></i>
          <div class="u-tc">
            <p class="u-p">今日订单总数</p>
            <span class="u-sn">{{order.today}}</span>
          </div>
        </div>
      </div>
      <div class="u-box">
        <div class="u-box-mn">
          <i class="fa fa-money"></i>
          <div class="u-tc">
            <p class="u-p">今日入住总数</p>
            <span class="u-sn">{{order.occupied}}</span>
          </div>
        </div>
      </div>
      <div class="u-box">
        <div class="u-box-mn">
          <i class="fa fa-credit-card"></i>
          <div class="u-tc">
            <p class="u-p">今日退房总数</p>
            <span class="u-sn">{{order.left}}</span>
          </div>
        </div>
      </div>
      <div class="u-box">
        <div class="u-box-mn">
          <i class="fa fa-line-chart"></i>
          <div class="u-tc">
            <p class="u-p">今日收入总额</p>
            <span class="u-sn">{{order.income}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="m-odr">
      <div class="m-odr-mn">
        <p class="u-tt">订单状态统计</p>
        <div class="u-ct">
          <ul class="u-box">
            <li class="u-li">
              <p class="u-p">总预订订单数</p>
              <p class="u-mo">(<span class="u-sn">{{order.totalBooked}}</span>)</p>
            </li>
            <li class="u-li">
              <p class="u-p">总取消订单数</p>
              <p class="u-mo">(<span class="u-sn">{{order.totalCancelled}}</span>)</p>
            </li>
          </ul>
          <ul class="u-box">
            <li class="u-li">
              <p class="u-p">总冲突订单数</p>
              <p class="u-mo">(<span class="u-sn">{{order.totalConflict}}</span>)</p>
            </li>
            <li class="u-li">
              <p class="u-p">总离店订单数</p>
              <p class="u-mo">(<span class="u-sn">{{order.totalLeft}}</span>)</p>
            </li>
          </ul>
          <ul class="u-box">
            <li class="u-li">
              <p class="u-p">总入住订单数</p>
              <p class="u-mo">(<span class="u-sn">{{order.totalOccupied}}</span>)</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="m-srt">
      <div class="m-odr-mn">
        <p class="u-tt">快捷入口</p>
        <div class="u-ct">
          <ul class="u-list">
            <li class="u-li" to="/" @click="toPath('/operateCenter/order/orderList')">
              <i class="fa fa-plus-square-o"></i>
              <p class="u-p">订单导入</p>
            </li>
            <li class="u-li" to="/" @click="toPath('/operateCenter/order/orderList')">
              <i class="fa fa-file-text-o"></i>
              <p class="u-p">订单列表</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="m-pey">
      <div class="m-odr-mn">
        <p class="u-tt">房源总览</p>
        <div class="u-ct">
          <ul class="u-list">
            <li class="u-li">
              <span class="u-sn">{{property.unSubmit}}</span>
              <p class="u-p">未提交</p>
            </li>
            <li class="u-li">
              <span class="u-sn">{{property.submit}}</span>
              <p class="u-p">待审核</p>
            </li>
            <li class="u-li">
              <span class="u-sn">{{property.release}}</span>
              <p class="u-p">已上架</p>
            </li>
            <li class="u-li">
              <span class="u-sn">{{property.all}}</span>
              <p class="u-p">全部</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="m-chart">
      <div class="m-odr-mn">
        <p class="u-tt">近一周订单统计(单)</p>
        <div class="u-ct">
          <ve-line
            style="width: 100%;height: 380px"
            :data="chartData"
            :legend-visible="false"
            :settings="chartSettings"></ve-line>
        </div>
      </div>
    </div>
    <div class="m-chart">
      <div class="m-odr-mn">
        <p class="u-tt">近一周收入统计(元)</p>
        <div class="u-ct">
          <ve-line
            style="width: 100%;height: 380px"
            :data="chartData1"
            :legend-visible="false"
            :settings="chartSettings1"></ve-line>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 获取房源统计信息
  const GetStatistics = vue => {
    const statistics = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rooms/statistics',
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
    return statistics
  }
  // 获取订单概要信息
  const GetOutline = vue => {
    const outline = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/orders/statistics/outline',
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
    return outline
  }
  export default {
    data () {
      return {
        order: {
          today: '',
          booked: '',
          left: '',
          occupied: '',
          income: '',
          totalBooked: '',
          totalCancelled: '',
          totalConflict: '',
          totalLeft: '',
          totalOccupied: ''
        },
        property: {
          all: '',
          release: '',
          submit: '',
          unRelease: '',
          unSubmit: ''
        },
        chartData: {
          columns: ['日期', '订单数'], // 10-100
          rows: [{ '日期': '1月1日', '订单数': 81 },
            { '日期': '1月2日', '订单数': 123 },
            { '日期': '1月3日', '订单数': 111 },
            { '日期': '1月4日', '订单数': 144 },
            { '日期': '1月5日', '订单数': 164 },
            { '日期': '1月6日', '订单数': 170 },
            { '日期': '1月7日', '订单数': 199 }]
        },
        chartSettings: {
          stack: { '售价': ['成本', '利润'] },
          area: true,
          lineStyle: {
            normal: {
              color: '#69acf0' // 连线颜色
            }
          },
          areaStyle: {
            normal: {
              color: 'rgba(140, 193, 242, 0.2)' // 连线颜色
            }
          },
          itemStyle: {
            normal: {
              color: '#f09b45'
            }
          }
        },
        title: {
          show: false
        },
        chartData1: {
          columns: ['日期', '营业额'], // 一单500
          rows: [{ '日期': '1月1日', '营业额': 40780 },
            { '日期': '1月2日', '营业额': 64250 },
            { '日期': '1月3日', '营业额': 55524 },
            { '日期': '1月4日', '营业额': 72534 },
            { '日期': '1月5日', '营业额': 84512 },
            { '日期': '1月6日', '营业额': 94312 },
            { '日期': '1月7日', '营业额': 103554 }]
        },
        chartSettings1: {
          stack: { '售价': ['成本', '利润'] },
          area: true,
          lineStyle: {
            normal: {
              color: '#75d9bf' // 连线颜色
            }
          },
          areaStyle: {
            normal: {
              color: 'rgba(117, 217, 191, 0.2)' // 连线颜色
            }
          },
          itemStyle: {
            normal: {
              color: '#f09b45'
            }
          }
        },
        loading: false
      }
    },
    methods: {
      toPath (path) {
        this.$router.push('/' + this.$route.params.lang + path)
      }
    },
    created: function () {
      const chartData = this.chartData.rows.map((data, index) => {
        return {
          ...data,
          '日期': this.$moment().day(index).format('MM-DD')
        }
      })
      this.chartData.rows = chartData

      const chartData1 = this.chartData1.rows.map((data, index) => {
        return {
          ...data,
          '日期': this.$moment().day(index).format('MM-DD')
        }
      })
      this.chartData1.rows = chartData1

      // 获取房源统计信息
      const Statistics = GetStatistics(this)

      Statistics.then((resolve) => {
        this.property.all = resolve.data.all
        this.property.release = resolve.data.release
        this.property.submit = resolve.data.submit
        this.property.unRelease = resolve.data.unRelease
        this.property.unSubmit = resolve.data.unSubmit
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })

      // 获取订单概要信息
      const Outline = GetOutline(this)

      Outline.then((resolve) => {
        const order = {
          today: resolve.data.today,
          booked: resolve.data.booked,
          left: resolve.data.left,
          occupied: resolve.data.occupied,
          income: resolve.data.income,
          totalBooked: resolve.data.totalBooked,
          totalCancelled: resolve.data.totalCancelled,
          totalConflict: resolve.data.totalConflict,
          totalLeft: resolve.data.totalLeft,
          totalOccupied: resolve.data.totalOccupied
        }
        this.order = order
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style scoped>
  .g-home-mn{
    margin-left: -20px;
    margin-right: -20px;
  }

  .m-sis-gp{
    display: flex;
    margin-bottom: 20px;
    width: 100%;
    height: 100px;
  }
  .m-sis-gp .u-box{
    padding: 0 20px;
    flex: 1;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-sis-gp .u-box-mn{
    display: flex;
    padding: 9px 0;
    width: 100%;
    height: 100%;
    border: 1px solid rgb(213, 214, 213);
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-sis-gp .u-box:nth-of-type(1) .u-box-mn{
    padding-left: 0;
  }
  .m-sis-gp .fa{
    width: 100px;
    height: 80px;
    font-size: 60px;
    color: #1abc9c;
    line-height: 80px;
    text-align: center;
  }
  .m-sis-gp .u-tc{
    padding: 10px 0;
    flex: 1;
    line-height: 30px;
  }
  .m-sis-gp .u-p{
    margin: 0;
    font-size: 14px;
  }

  .m-odr{
    margin-bottom: 20px;
    padding: 0 20px;
    width: 100%;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-odr .m-odr-mn{
    width: 100%;
    border: 1px solid rgb(213, 214, 213);
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-odr .u-tt{
    margin: 0;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-indent: 1.5em;
    border-bottom: 1px solid rgb(213, 214, 213);
    /*background-color: rgba(243, 243, 243, 1);*/
  }
  .m-odr .u-ct{
    display: flex;
    width: 100%;
    height: 155px;
  }
  .m-odr .u-box{
    margin: 0;
    padding: 10px 20px 0 20px;
    flex: 1;
    list-style: none;
  }
  .m-odr .u-li{
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    border-bottom: 1px solid rgb(236, 237, 236);
  }
  .m-odr .u-p{
    margin: 0;
    height: 40px;
    font-size: 13px;
    line-height: 40px;
  }
  .m-odr .u-mo{
    margin: 0;
    height: 40px;
    font-size: 14px;
    line-height: 40px;
  }
  .m-odr .u-sn{
    color: rgb(240, 72, 68);
  }

  .m-srt{
    margin-bottom: 20px;
    padding: 0 20px;
    width: 100%;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-srt .m-odr-mn{
    width: 100%;
    border: 1px solid rgb(213, 214, 213);
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-srt .u-tt{
    margin: 0;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-indent: 1.5em;
    border-bottom: 1px solid rgb(213, 214, 213);
    /*background-color: rgba(243, 243, 243, 1);*/
  }
  .m-srt .u-ct{
    width: 100%;
    height: 155px;
  }
  .m-srt .u-list{
    display: flex;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    list-style: none;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-srt .u-li{
    padding: 20px 0;
    width: 140px;
    cursor: pointer;
    border-left: 1px solid rgba(213, 214, 213, 0);
    border-right: 1px solid rgba(213, 214, 213, 0);
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-srt .u-li:hover{
    background-color: #f5f8f8;
    border-left: 1px solid rgba(213, 214, 213, 1);
    border-right: 1px solid rgba(213, 214, 213, 1);
  }
  .m-srt .u-li:nth-of-type(1):hover{
    border-left: 1px solid rgba(213, 214, 213, 0);
  }
  .m-srt .fa{
    width: 100%;
    height: 80px;
    font-size: 60px;
    color: #aeabab;
    line-height: 80px;
    text-align: center;
  }
  .m-srt .u-p{
    margin: 0;
    width: 100%;
    font-size: 13px;
    text-align: center;
  }
  .m-srt .u-li:hover .fa{
    color: #1abc9c;
  }
  .m-srt .u-li:hover .u-p{
    color: #1abc9c;
  }

  .m-pey{
    padding: 0 20px;
    width: 100%;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-pey .m-odr-mn{
    width: 100%;
    border: 1px solid rgb(213, 214, 213);
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-pey .u-tt{
    margin: 0;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-indent: 1.5em;
    border-bottom: 1px solid rgb(213, 214, 213);
    /*background-color: rgba(243, 243, 243, 1);*/
  }
  .m-pey .u-ct{
    width: 100%;
    height: 125px;
  }
  .m-pey .u-p{
    font-size: 13px;
  }
  .m-pey .u-list{
    display: flex;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    list-style: none;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-pey .u-li{
    padding: 35px 0;
    width: 140px;
    text-align: center;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-pey .u-sn{
    font-size: 24px;
    color: #F04844;
  }

  .m-chart{
    float: left;
    margin-bottom: 20px;
    padding: 0 10px;
    width: 50%;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-chart .m-odr-mn{
    width: 100%;
    border: 1px solid rgb(213, 214, 213);
    border-radius: 5px;
    background-color: #fefefe;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .m-chart .u-tt{
    margin: 0;
    width: 100%;
    height: 38px;
    font-size: 14px;
    color: #666;
    line-height: 38px;
    text-indent: 1.5em;
    border-bottom: 1px solid rgb(213, 214, 213);
    background-color: #fbfbfb;
    /*background-color: rgba(243, 243, 243, 1);*/
  }
  .m-chart .u-ct{
    display: flex;
    width: 100%;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  /*home*/
  .m-pey .u-li{ width:25%; padding:25px 0 0 0;}
  .m-srt .u-li{
    border-left:0 solid rgba(213, 214, 213, 0);
    border-right:0 solid rgba(213, 214, 213, 0);
  }
  .m-srt .u-li:hover{
    background-color:#fff;
    border-left: 0 solid rgba(213, 214, 213, 1);
    border-right: 0 solid rgba(213, 214, 213, 1);
  }
  .m-srt .u-li:nth-of-type(1):hover{
    border-left: 0 solid rgba(213, 214, 213, 0);
  }
  .m-srt .u-li:hover .fa{
    color: #fc8229;
  }
  .m-srt .u-li:hover .u-p{
    color: #fc8229;
  }
  .m-odr .u-tt,.m-srt .u-tt,.m-pey .u-tt{ background:#fbfbfb;}
  .m-sis-gp .u-box-mn,.m-odr .m-odr-mn,.m-srt .m-odr-mn,.m-pey .m-odr-mn,.m-odr .u-tt,.m-srt .u-tt,.m-pey .u-tt{ border-color:#e5e5e5;}
  .fa-file-text-o:before,.fa-money:before,.fa-credit-card:before,.fa-line-chart:before,.fa-plus-square-o:before{content:none;}
  .m-sis-gp .fa.fa-file-text-o{ background:url(./../../../assets/images/home/home_icon1.png) no-repeat center center;background-size: 40px;}
  .m-sis-gp .fa.fa-money{background:url(./../../../assets/images/home/home_icon2.png) no-repeat center center;background-size: 40px;}
  .m-sis-gp .fa.fa-credit-card{background:url(./../../../assets/images/home/home_icon3.png) no-repeat center center;background-size: 40px;}
  .m-sis-gp .fa.fa-line-chart{background:url(./../../../assets/images/home/home_icon4.png) no-repeat center center;background-size: 40px;}
  .m-srt .fa.fa-plus-square-o{ background:url(./../../../assets/images/home/home_icon5.png) no-repeat center center; opacity:0.75; background-size:30px;}
  .m-srt .fa.fa-file-text-o{ background:url(./../../../assets/images/home/home_icon6.png) no-repeat center center; opacity:0.75; background-size:30px;}

  .m-odr{ float:left; width:50%; overflow:hidden;padding:0 10px;}
  .m-srt{ float:left; width:25%; overflow:hidden;padding:0 10px;}
  .m-pey{ width:25%; overflow:hidden;padding:0 10px;}
  .m-pey .u-ct{ height:155px;}
  .m-pey .u-li{ padding-top:45px;}
  .el-main{ padding:10px;}
  .m-sis-gp .u-box{ padding:0 10px;}
  .g-home-mn{ margin-left:-10px; margin-right:-10px;}

  .m-sis-gp .u-box-mn,
  .m-odr .m-odr-mn,
  .m-srt .m-odr-mn,
  .m-pey .m-odr-mn{border-radius: 5px; overflow:hidden;}
  .m-srt .u-li{ width:50%;}
  /*.m-sis-gp .fa.fa-file-text-o{ background:url(icon_01.png) no-repeat center center;}*/
  /*.m-sis-gp .fa.fa-money{ background:url(icon_02.png) no-repeat center center;}*/
  /*.m-sis-gp .fa.fa-credit-card{ background:url(icon_03.png) no-repeat center center;}*/
  /*.m-sis-gp .fa.fa-line-chart{ background:url(icon_04.png) no-repeat center center;}*/
  .g-main{ background:none;}
  .m-sis-gp .u-box:first-of-type .u-box-mn,
  .m-sis-gp .u-box-mn,
  .m-sis-gp .u-box-mn, .m-odr .m-odr-mn,
  .m-srt .m-odr-mn,
  .m-pey .m-odr-mn{ background:#fefefe;}
  .m-odr .u-tt,
  .m-srt .u-tt,
  .m-pey .u-tt{ height:38px; line-height:38px; font-size:14px; color:#666;}
  .m-odr .u-ct,
  .m-srt .u-ct,
  .m-pey .u-ct{ height:125px;}
  .m-odr .u-box{ padding-top:21px;}
  .m-odr .u-li{ border-color:#f7f7f7;}
  .m-srt .fa{ height:52px;}
  .m-pey .u-li{ padding-top:32px;}
</style>
