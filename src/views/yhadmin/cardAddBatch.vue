<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px">
      <el-form-item label="分类" prop="cid">
        <el-select v-model="temp.cid" placeholder="选择分类" clearable style="width: 200px" class="filter-item" @change="checkCate" >
          <el-option v-for="item in categoryAll " :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品" prop="goodsId">
        <el-select v-model="temp.goodsId" placeholder="选择商品" clearable style="width: 200px" class="filter-item" @change="checkGoods">
          <el-option v-for="item in goodsAll " :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="卡密" prop="cardNo">
        <el-tag>当前商品库存卡密：{{ allKms }}</el-tag>
        <el-tag style="color: #ffa50f">注意：卡密一行一张卡，格式自定义即可！例如：卡号-卡密 、卡号 卡密、卡号 等</el-tag>
        <br>
        <el-input :rows="20" v-model="temp.cardNo" :disabled="isDisabled" type="textarea" style="width: 50%;min-height: 400px;" placeholder="输入卡密" />
      </el-form-item>
      <el-form-item label="" prop="">
        <el-button @click="cancelForm">清空</el-button>
        <el-button type="primary" @click="saveCardPwd">保存卡密</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { save } from '@/api/cardpwd'
import { getByCondition } from '@/api/goods'
import categoryApi from '@/api/category'
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
      categoryAll: [],
      goodsAll: [],
      temp: {},
      isDisabled: true,
      rules: {
        cardNo: [{ required: true, message: '卡密不能为空哦！', trigger: 'blur' }],
        cid: [{ required: true, message: '必须选一个分类哦！', trigger: 'blur' }],
        goodsId: [{ required: true, message: '必须选一个商品哦！', trigger: 'blur' }]
      },
      allKms: 0,
      cid: ''
    }
  },
  created() {
    this.getCategories().then(r => {
      this.categoryAll = r
    })
  },
  methods: {
    getGoodsAll(cid) {
      return getByCondition({cid:cid}).then((r) => {
        if(r.data.data.content.length>0)
          return r.data.data.content
        else
          return []
      })
    },
    getCategories() {
      return categoryApi.getCategories().then((r) => {
        return r.data.data
      })
    },
    checkCate(data) {
      this.temp.goodsId = null
      this.allKms = 0
      this.isDisabled = true
      this.getGoodsAll(data).then(r => {
        this.goodsAll = r
      })
    },
    checkGoods(data) {
      if (data != null) {
        this.isDisabled = false
        getByCondition({id:data}).then(r => {
          if(r.data.data.content.length>0)
            this.allKms = r.data.data.content[0].kmCount
          else
            this.allKms = 0
        })
      } else {
        this.isDisabled = true
      }
    },
    cancelForm() {
      this.temp = {}
    },
    saveCardPwd() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.temp.cid == '' || this.temp.goodsId == '' || this.cardNo == '')
            return
          save(this.temp).then(r => {
            if (r.data.code === 100) {
              this.$notify({
                title: '成功',
                message: '添加卡密成功',
                type: 'success',
                duration: 4000
              })
              this.temp.cardNo = ''
              getByCondition({ id: this.temp.goodsId }).then(r => {
                this.allKms = r.data.data.content[0].kmCount
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
