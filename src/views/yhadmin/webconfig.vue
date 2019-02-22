<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 60%">
      <el-form-item label="网站域名" prop="webUrl">
        <el-input v-model="temp.webUrl"><template slot="prepend">http://</template></el-input>
      </el-form-item>
      <el-form-item label="网站主标题" >
        <el-input v-model="temp.mainTitle"/>
      </el-form-item>
      <el-form-item label="网站副标题" >
        <el-input v-model="temp.subTitle"/>
      </el-form-item>
      <el-form-item label="网站描述" >
        <el-input v-model="temp.titleDesc"/>
      </el-form-item>
      <el-form-item label="网站关键词">
        <el-input v-model="temp.keyWords"/>
      </el-form-item>
      <el-form-item label="主页公告" >
        <tinymce v-model="temp.mainNotice" />
      </el-form-item>
      <el-form-item label="查订单页面公告">
        <tinymce v-model="temp.subNotice" />
      </el-form-item>
      <el-form-item label="底部版权" >
        <el-input v-model="temp.copyRight"/>
      </el-form-item>
      <el-form-item label="网站LOGO">
        <el-input v-model="temp.logo"/>
      </el-form-item>
      <el-form-item label="首页背景图">
        <el-input v-model="temp.bgImg"/>
      </el-form-item>
      <el-form-item label="是否显示库存">
      <el-select v-model="temp.showStock" placeholder="" clearable style="width: 200px" class="filter-item" >
        <el-option v-for="item in categoryAll " :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      </el-form-item>
      <el-form-item label="网站状态">
        <el-select v-model="temp.webStatus" placeholder="" clearable style="width: 200px" class="filter-item" >
          <el-option v-for="item in categoryStatus " :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="" >
        <el-button @click="cancelForm">清空</el-button>
        <el-button type="primary" @click="save">保存配置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { save, get } from '@/api/webconfig'
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
      categoryAll: [
        {
          code: 1,
          name: '是'
        },
        {
          code: 0,
          name: '否'
        }
      ],
      categoryStatus: [
        {
          code: 1,
          name: '开启'
        },
        {
          code: 0,
          name: '关闭'
        }
      ],
      goodsAll: [],
      temp: {
        mainTitle: '',
        subTitle: '',
        titleDesc: '',
        keyWords: '',
        mainNotice: '',
        subNotice: '',
        copyRight: '',
        showStock: 1,
        wbeStyle: '',
        logo: '',
        bgImg: '',
        webUrl: '',
        webStatus: ''
      },
      isDisabled: true,
      rules: {
        webUrl: [{ required: true, message: '网站域名必填哦！', trigger: 'blur' }],
      },
      allKms: 0,
      cid: ''
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    cancelForm() {
      this.temp = {
        showStock: 1
      }
    },
    save() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          delete this.temp.createDate
          save(this.temp).then(r => {
            if (r.data.code === 100) {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 4000
              })
            }
          })
        }
      })
    },
    getConfig() {
      get().then(r => {
        this.temp = r.data.data
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
