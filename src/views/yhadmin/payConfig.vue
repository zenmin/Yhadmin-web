<template>
  <div class="app-container">
    <el-alert :closable="false" type="info" title="目前集成的较稳定的码支付接口，如需其他接口可联系开发者定制！" show-icon style="width: 60%"/>
    <br>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 60%">
      <el-form-item label="接口类型" prop="payType">
        <el-select v-model="temp.payType" placeholder=""  :clearable="false" class="filter-item" >
          <el-option v-for="item in categoryAll " :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="商户ID" prop="app_id">
        <el-input v-model="temp.app_id"></el-input>
      </el-form-item>
      <el-form-item label="Token" prop="app_key">
        <el-input v-model="temp.app_key"></el-input>
        <br>
        <br>
        <el-alert :closable="false" type="info" title="可到第三方支付商户控制台获取，以码支付为例：商户后台-系统设置 获取码支付ID和Token" show-icon style="width: 100%"/>
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
          code: 'MAPAY',
          name: '码支付'
        }
        ],
      temp: {
        type: 3,
        payType: 'MAPAY',
        app_id: '',
        app_key: ''

      },
      isDisabled: true,
      rules: {
      }
    }
  },
  created() {
    getByCondition({ type: 3 }).then(r => {
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
                message: '更新支付接口配置成功',
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
