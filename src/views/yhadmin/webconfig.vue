<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 60%">
      <el-form-item label="网站主标题" prop="mainTitle">
         <el-input v-model="temp.mainTitle"></el-input>
      </el-form-item>
      <el-form-item label="网站副标题" prop="subTitle">
        <el-input v-model="temp.subTitle"></el-input>
      </el-form-item>
      <el-form-item label="网站描述" prop="titleDesc">
        <el-input v-model="temp.titleDesc"></el-input>
      </el-form-item>
      <el-form-item label="主页公告" prop="mainNotice">
        <tinymce v-model="temp.mainNotice" ></tinymce>
      </el-form-item>
      <el-form-item label="查订单页面公告" prop="subNotice">
        <tinymce v-model="temp.subNotice" ></tinymce>
      </el-form-item>
      <el-form-item label="底部版权" prop="copyRight">
        <el-input v-model="temp.copyRight"></el-input>
      </el-form-item>
      <el-form-item label="首页风格" prop="wbeStyle">
        <el-input v-model="temp.wbeStyle"></el-input>
      </el-form-item>
      <el-form-item label="网站LOGO" prop="logo">
        <el-input v-model="temp.logo"></el-input>
      </el-form-item>
      <el-form-item label="首页背景图" prop="bgImg">
        <el-input v-model="temp.bgImg"></el-input>
      </el-form-item>
      <el-form-item label="是否显示库存" prop="showStock">
        <el-select v-model="temp.showStock" placeholder="" clearable style="width: 200px" class="filter-item" >
          <el-option v-for="item in categoryAll " :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="">
        <el-button @click="cancelForm">清空</el-button>
        <el-button type="primary" @click="save">保存配置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { save } from '@/api/cardpwd'
import { getByCondition } from '@/api/goods'
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
        bgImg: ''
      },
      isDisabled: true,
      rules: {
        cardNo: [{ required: true, message: '卡密不能为空哦！', trigger: 'blur' }]
      },
      allKms: 0,
      cid: ''
    }
  },
  created() {
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
          console.log(this.temp)
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
