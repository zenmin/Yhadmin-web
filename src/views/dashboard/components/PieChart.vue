<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    payWay: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    let that = this
    setTimeout(function() {
      that.initChart()
    },1000)
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      const pys = []
      this.payWay.forEach(p => {
        let v = ''
        if(p.name === 'wxpay'){
          v = '微信支付'
        }
        if(p.name === 'qqpay'){
          v = 'QQ支付'
        }
        if(p.name === 'alipay'){
          v = '支付宝支付'
        }
        p.name = v
        pys.push(v)
      })
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: pys
        },
        calculable: true,
        series: [
          {
            name: '支付方式',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.payWay,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
