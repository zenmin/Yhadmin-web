<template>
  <div class="app-container">
    <el-alert :closable="false" type="info" title="开关关闭后页面不在显示选项" show-icon style="width: 100%"/>
    <br>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="135px" style="width: 60%">
      <el-form-item label="微信支付开关" prop="switch_wx">
        <el-select v-model="temp.switch_wx" placeholder=""  :clearable="false" style="width: 230px" class="filter-item" >
          <el-option v-for="item in categoryAll " :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付宝支付开关" prop="switch_alipay">
        <el-select v-model="temp.switch_alipay" placeholder=""  :clearable="false" style="width: 230px" class="filter-item" >
          <el-option v-for="item in categoryAll " :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="QQ支付开关" prop="switch_qq">
        <el-select v-model="temp.switch_qq" placeholder=""  :clearable="false" style="width: 230px" class="filter-item" >
          <el-option v-for="item in categoryAll " :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="">
        <el-button type="primary" @click="saveCardPwd">保存配置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { save,getByCondition } from '@/api/interface'
import { parseTime } from '@/utils'

export default {
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      cardNo: undefined,
      status: undefined,
      goodsId: undefined,
      categoryAll: [
        {
          code: 1,
          name: '开启'
        },
        {
          code: 0,
          name: '关闭'
        }
        ],
      temp: {
        type: 4,
        switch_alipay: 1,
        switch_qq: 1,
        switch_wx: 1

      },
      isDisabled: true,
      rules: {
      }
    }
  },
  created() {
    getByCondition({ type: 4 }).then(r => {
      this.temp = r.data.data
    })
  },
  methods: {
    saveCardPwd() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          save(this.temp).then(r => {
            if (r.data.data) {
              this.$notify({
                title: '成功',
                message: '更新支付接口开关成功',
                type: 'success',
                duration: 4000
              })
            }else{
              this.$notify({
                title: '失败',
                message: r.data.msg,
                type: 'error',
                duration: 4000
              })
            }
          })
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
