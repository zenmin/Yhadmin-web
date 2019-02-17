<template>
  <div class="app-container">
    <el-alert :closable="false" type="info" title="订单支付成功后会发送邮件到用户留下的邮箱" show-icon style="width: 60%"/>
    <br>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="135px" style="width: 60%">
      <el-form-item label="发送邮件开关" prop="status">
        <el-select v-model="temp.status" placeholder=""  :clearable="false" style="width: 230px" class="filter-item" >
          <el-option v-for="item in categoryAll " :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="邮件SMTP服务器" prop="mailSMTP">
         <el-input v-model="temp.mailSMTP">
           <template slot="append">如：smtp.qq.com</template>
         </el-input>
      </el-form-item>
      <el-form-item label="邮箱账号" prop="mailAccount">
        <el-input v-model="temp.mailAccount">
          <template slot="append">如：123456789@qq.com</template>
        </el-input>
      </el-form-item>
      <el-form-item label="邮箱授权码" prop="mailPwd">
        <el-input v-model="temp.mailPwd"></el-input>
        <el-alert :closable="false" type="info" title="邮箱的第二密码。以QQ邮箱为例：可以到邮箱控制台-设置-账户-POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务-生成授权码" show-icon />
      </el-form-item>
      <el-form-item label="邮件标题" prop="mailTitle">
        <el-input v-model="temp.mailTitle"></el-input>
      </el-form-item>
      <el-form-item label="邮件内容" prop="mailContent">
        <tinymce v-model="temp.mailContent" />
        <el-alert :closable="false" type="info" title="例如：“你购买的卡密为${km} ， 订单编号为${orderNo} ”，${km}表示本次购买到的卡密，${orderNo}为本次下单的订单号！ " show-icon />
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
import tinymce from '@/components/Tinymce'

export default {
  filters: {
  },
  components: {
    tinymce: tinymce
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
        type: 2,
        mailSMTP: '',
        mailAccount: '',
        mailPwd: '',
        mailTitle: '',
        mailContent: '<b>你购买的卡密为${km}</b> <br> <b>订单编号为${orderNo}</b>'

      },
      isDisabled: true,
      rules: {
        status: [{ required: true, message: '不能为空哦！', trigger: 'blur' }],
        mailSMTP: [{ required: true, message: '不能为空哦！', trigger: 'blur' }],
        mailAccount: [{ required: true, message: '不能为空哦！', trigger: 'blur' }],
        mailPwd: [{ required: true, message: '不能为空哦！', trigger: 'blur' }],
        mailTitle: [{ required: true, message: '不能为空哦！', trigger: 'blur' }],
        mailContent: [{ required: true, message: '不能为空哦！', trigger: 'blur' }]
      }
    }
  },
  created() {
    getByCondition({type:2}).then(r=>{
      this.temp = r.data.data
    })
  },
  methods: {
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
                message: '更新邮件配置成功',
                type: 'success',
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
