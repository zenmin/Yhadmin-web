<template>
  <el-table title="最新订单" :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="订单编号" align="left">
      <template slot-scope="scope">
        {{ scope.row.orderNo }}
      </template>
    </el-table-column>
    <el-table-column label="创建时间" align="center">
      <template slot-scope="scope">
        {{ scope.row.createDate }}
      </template>
    </el-table-column>
    <el-table-column label="订单总价" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.allPrice }}
      </template>
    </el-table-column>
    <el-table-column label="订单状态" align="right">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status === 0" type="error">未完成</el-tag>
        <el-tag v-if="scope.row.status === 1" type="success">已完成</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import { getNowOrder } from '@/api/index'

export default {
  props: {
    nowData:{
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    getNowOrder().then(r=>{
      this.list =  r.data.data
    })
  },
  mounted() {

  },
  methods: {
  }
}
</script>
