<template>
  <div class="chart-container">

    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" >
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="iconfont-ok" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">成功订单</div>
            <count-to v-if="nowData" :start-val="0" :end-val="nowData.successCount" :duration="2600" class="card-panel-num"/><span>笔</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" >
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="lock" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">卡密总数</div>
            <count-to v-if="nowData" :start-val="0" :end-val="nowData.allCardPwds" :duration="3600" class="card-panel-num"/><span>个</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" >
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="shopping" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">售出卡密</div>
            <count-to v-if="nowData" :start-val="0" :end-val="nowData.successCardPwds" :duration="3000" class="card-panel-num"/><span>个</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" >
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">售出金额</div>
            <count-to v-if="nowData" :start-val="0.01" :end-val="nowData.allPrice" :duration="3600" :decimals="2" class="card-panel-num"/><span>元</span>
          </div>
        </div>
      </el-col>
    </el-row>


    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" >
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">客户总数</div>
            <count-to v-if="nowData" :start-val="0" :end-val="nowData.consumerCount" :duration="2600" class="card-panel-num"/><span>个</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" >
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="wechat" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">微信支付</div>
            <count-to v-if="nowData" :start-val="0" :end-val="nowData.payAlias[2].value" :duration="3000" class="card-panel-num"/><span>笔</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" >
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="alipay" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">支付宝支付</div>
            <count-to v-if="nowData" :start-val="0.01" :end-val="nowData.payAlias[0].value" :duration="3600" class="card-panel-num"/><span>笔</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" >
          <div class="card-panel-icon-wrapper  icon-message">
            <svg-icon icon-class="qq" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">QQ支付</div>
            <count-to v-if="nowData" :start-val="0" :end-val="nowData.payAlias[1].value" :duration="3600" class="card-panel-num"/><span>笔</span>
          </div>
        </div>
      </el-col>
    </el-row>


    <chart height="100%" width="100%"/>
  </div>
</template>

<script>
  import Chart from '@/components/Charts/keyboard'
  import CountTo from 'vue-count-to'
  import { getOrderAlia } from '@/api/orders'

  export default {
    name: 'KeyboardChart',
    components: { Chart,CountTo },
    data(){
      return {
        nowData: {
          allCardPwds: 0,
          allCount: 0,
          allPrice: 0.00,
          consumerCount: 0,
          payAlias: [
              { value: 0, name: 'alipay' },
              { value: 0, name: 'qqpay' },
              { value: 0, name: 'wxpay' }
            ],
          successCardPwds: 0,
          successCount: 0
        }


      }
    },
    created() {
      getOrderAlia().then(r=>{
        this.nowData = r.data.data
      })
    }

  }



</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .chart-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
  }
  .panel-group {
    margin-top: 18px;
    .card-panel-col{
      margin-bottom: 32px;
    }
    .card-panel {
      cursor: auto;
      height: 108px;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shopping {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shopping {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
        cursor: auto;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
        cursor: auto;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
          cursor: auto;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
