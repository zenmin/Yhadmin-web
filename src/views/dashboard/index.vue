<template>
  <div class="dashboard-editor-container">

    <github-corner style="position: absolute; top: 0px; border: 0; right: 0;"/>

    <panel-group :nowData="indexData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :payWay="payWayChart"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart :nowData="ordersChart"/>
        </div>
      </el-col>
    </el-row>

    <transaction-table />

  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'

const lineChartData = {
  newVisitis: {
    expectedData: [],
    actualData: [],
    dateData:[]
  }
}

import { getDashboard,getPayway,getNowOrder } from '@/api/index'
import { parseTime } from '@/utils'

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      indexData: undefined,
      payWayChart: undefined,
      ordersChart: undefined
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData(){
      getDashboard().then(r=>{
        this.indexData = r.data.data
        // this.lineChartData.expectedData =
        let orders =  this.indexData.sevenOrders
        if(orders.length>0){
          //订单数量
          const expectedData = []
          const actualData = []
          const dateData = []
          orders.forEach(c => {
            expectedData.push(c.num)
            actualData.push(c.price)
            dateData.push(c.date)
          })
          this.lineChartData.expectedData = expectedData
          this.lineChartData.actualData = actualData
          this.lineChartData.dateData = dateData
          this.$emit('setNowData', r.data.data)
        }else{
          this.lineChartData.expectedData = 0
          this.lineChartData.actualData = 0
          this.lineChartData.dateData = parseTime(new Date(),'yyyy-MM-dd')
        }
      })
      this.getPaywayChart()
    },
    getPaywayChart() {
      getPayway().then(r=>{
        this.payWayChart = r.data.data.payAlias
        this.ordersChart = r.data.data.finishOrderAlias
        return r.data.data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
