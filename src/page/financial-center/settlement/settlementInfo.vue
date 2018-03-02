<template>
  <div class="s-info" v-loading="loading">
    <div class="m-it-gp" v-for="item in infoData">
      <h3 class="u-tt">{{item.title}}</h3>
      <p class="u-ct" v-if="item.type === 'text'">{{item.text}}</p>
      <div class="u-ct-s" v-if="item.type === 'array'">
        <div class="m-it-gp" style="width: 50%;float: left;" v-for="item in item.node">
          <h3 class="u-tt-s">{{item.title}}</h3>
          <p class="u-ct" v-if="item.type === 'text'">{{item.text}}</p>
          <div class="u-ct-s" v-if="item.type === 'array'">
            <p class="u-ct" v-for="item in item.node">{{item.text}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="s-ma-fl-140">
      <returnBtn></returnBtn>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import returnBtn from './../../../components/public/returnBtn.vue'
  // 获取订单信息
  const GetOrderInfo = vue => {
    const orderInfo = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/orders/' + vue.$route.params.settlementOrderId,
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
    return orderInfo
  }
  export default {
    data () {
      return {
        infoData: [],
        loading: true
      }
    },
    components: {
      returnBtn: returnBtn
    },
    methods: {},
    created: function () {
      const OrderInfo = GetOrderInfo(this)

      OrderInfo.then((response) => {
        let conflicted = '否'
        if (response.data.conflicted.length !== 0) conflicted = '是'
        let infoData = [{
          name: 'address',
          title: '基础信息',
          text: '这是地址',
          type: 'array',
          node: [{
            name: 'orderNumber',
            title: '订单编号',
            text: response.data.sn,
            type: 'text'
          }, {
            name: 'roomCode',
            title: '房源',
            text: response.data.roomSn + response.data.roomData.name,
            type: 'text'
          }, {
            name: 'checkInDate',
            title: '入住日期',
            text: this.$moment(response.data.checkIn).format('YYYY-MM-DD HH:mm'),
            type: 'text'
          }, {
            name: 'leaveDate',
            title: '离开日期',
            text: this.$moment(response.data.checkOut).format('YYYY-MM-DD HH:mm'),
            type: 'text'
          }, {
            name: 'amount',
            title: '金额',
            text: response.data.amount,
            type: 'text'
          }, {
            name: 'numberOfPeople',
            title: '人数',
            text: response.data.people,
            type: 'text'
          }, {
            name: 'memo',
            title: '备注',
            text: response.data.memo,
            type: 'text'
          }, {
            name: 'conflict',
            title: '冲突与否',
            text: conflicted,
            type: 'text'
          }]
        }]
        infoData.push({
          name: 'channel',
          title: '渠道',
          type: 'array',
          node: [{
            name: 'name',
            title: '名称',
            text: response.data.channel,
            type: 'text'
          }, {
            name: 'order',
            title: '渠道单号',
            text: response.data.channelSn,
            type: 'text'
          }]
        })
        if (response.data.conflicted.length !== 0) {
          let conflictedList = ''
          response.data.conflicted.forEach(data => {
            conflictedList += data.sn + ', '
          })
          infoData.push({
            name: 'contact',
            title: '冲突单',
            type: 'array',
            node: [{
              name: 'name',
              title: '编号',
              text: conflictedList,
              type: 'text'
            }]
          })
        }
        let priceNode = []
        let dp = {
          name: 'dayPrice',
          title: '每日价格',
          type: 'array',
          node: priceNode
        }
        infoData.push(dp)
        response.data.daysPrice.channelPrices.forEach((price, index) => {
          let a = {
            name: 'date',
            title: '日期',
            text: price.date,
            type: 'text'
          }
          let b = {
            name: 'price',
            title: '价格',
            text: price.channelPrice,
            type: 'text'
          }
          priceNode.push(a)
          priceNode.push(b)
        })
        let count = 0
        response.data.occupants.forEach((data, index) => {
          if (data.occupantType === 'occupant') {
            count++
            let occupancy = {
              name: 'occupancy',
              title: '入住人' + count,
              type: 'array',
              node: [{
                name: 'name',
                title: '姓名',
                text: data.lastName + data.firstName,
                type: 'text'
              }, {
                name: 'E-mail',
                title: '电子邮箱',
                text: data.email,
                type: 'text'
              }, {
                name: 'phone',
                title: '电话',
                text: data.phone,
                type: 'text'
              }]
            }
            infoData.push(occupancy)
          }
        })
        let contact = {}
        response.data.occupants.forEach((data) => {
          if (data.occupantType === 'contact') {
            contact = {
              name: 'contact',
              title: '联系人',
              type: 'array',
              node: [{
                name: 'name',
                title: '姓名',
                text: data.lastName + data.firstName,
                type: 'text'
              }, {
                name: 'E-mail',
                title: '电子邮箱',
                text: data.email,
                type: 'text'
              }, {
                name: 'phone',
                title: '电话',
                text: data.phone,
                type: 'text'
              }]
            }
          }
        })
        infoData.push(contact)
        this.infoData = infoData
        this.loading = false
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style scoped>
  .s-info{

  }
  .m-it-gp{
    display: flex;
    margin-bottom: 18px;
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
