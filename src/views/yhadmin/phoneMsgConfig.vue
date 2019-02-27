<template>
  <div class="app-container">
    <el-alert :closable="false" type="info" title="本系统集成阿里云短信(阿里大于)接口，详见：https://dysms.console.aliyun.com" show-icon />
    <br>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="230px" style="width: 50%">
      <el-form-item label="发送短信开关" prop="status">
        <el-select v-model="temp.status" placeholder=""  :clearable="false" style="width: 230px" class="filter-item" >
          <el-option v-for="item in categoryAll " :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="阿里云ACCESS_KEY_ID" prop="app_id">
         <el-input v-model="temp.app_id">
            <el-button slot="append" icon="el-icon-question" title="去阿里云获取" @click="toAliyun(true)"></el-button>
         </el-input>
      </el-form-item>
      <el-form-item label="阿里云ACCESS_KEY_SECRET" prop="app_key">
        <el-input v-model="temp.app_key">
          <el-button slot="append" icon="el-icon-question" title="去阿里云获取" @click="toAliyun(true)"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="模板CODE" prop="smsTemplateCode">
        <el-input v-model="temp.smsTemplateCode"><template slot="append">如：SMS_85445010</template></el-input>
      </el-form-item>
      <el-form-item label="短信签名" prop="smsSignName">
        <el-input v-model="temp.smsSignName">
          <el-button slot="append" icon="el-icon-question" title="去阿里云获取" @click="toAliyun(false)"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="模板参数" prop="smsTemplate">
        <el-input v-model="temp.smsTemplate"></el-input>
        <el-alert :closable="false" type="info" title="如您的模板是 “你的本次购买的卡密是${code}，感谢使用！” ，那么这里模板参数只需填入code，多个参数用“,”隔开即可！" show-icon />
      </el-form-item>
      <el-form-item label="" prop="">
        <el-button @click="cancelForm">清空</el-button>
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
          code: 0,
          name: '关闭'
        },
        {
          code: 1,
          name: '开启'
        }
        ],
      temp: {
        status: 0,
        app_id: '',
        app_key: '',
        smsTemplateCode: '',
        smsTemplate: 'code',
        smsSignName: '',
        type: 1
      },
      isDisabled: true,
      rules: {
        status: [{ required: true, message: '不能为空哦！', trigger: 'blur' }],
        app_id: [{ required: true, message: '不能为空哦！', trigger: 'blur' }],
        app_key: [{ required: true, message: '不能为空哦！', trigger: 'blur' }],
        smsTemplateCode: [{ required: true, message: '不能为空哦！', trigger: 'blur' }],
        smsTemplate: [{ required: true, message: '不能为空哦！', trigger: 'blur' }],
        smsSignName: [{ required: true, message: '不能为空哦！', trigger: 'blur' }]
      }
    }
  },
  created() {
    getByCondition({type:1}).then(r=>{
      this.temp = r.data.data
    })
  },
  methods: {
    toAliyun(openUser){
      if(openUser)
        window.open("https://usercenter.console.aliyun.com");
      else
        window.open("https://dysms.console.aliyun.com/dysms.htm#/domestic/text/sign");
    },
    cancelForm() {
      this.temp = {
        status: 0,
        app_id: '',
        app_key: '',
        smsTemplateCode: '',
        smsTemplate: '',
        smsSignName: '',
        type: 1
      }
    },
    saveCardPwd() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          save(this.temp).then(r => {
            if (r.data.data) {
              this.$notify({
                title: '成功',
                message: '更新短信接口成功',
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
