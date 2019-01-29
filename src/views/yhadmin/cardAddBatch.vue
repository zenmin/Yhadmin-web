<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px">
      <el-form-item label="分类" prop="cid">
        <el-select v-model="listQuery.cid" placeholder="选择分类" clearable style="width: 200px" class="filter-item" @change="checkCate" >
          <el-option v-for="item in categoryAll " :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品" prop="goodsId">
        <el-select v-model="listQuery.goodsId" placeholder="选择商品" clearable style="width: 200px" class="filter-item" @change="checkGoods">
          <el-option v-for="item in goodsAll " :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="卡密" prop="goodsDesc">
        <el-tag>当前商品库存卡密：{{ allKms }}</el-tag>
        <el-tag style="color: #ffa50f">注意：卡密一行一张卡，格式自定义即可！例如：卡号-卡密 、卡号 卡密、卡号 等</el-tag>
        <br>
        <el-input :rows="20" v-model="temp.goodsDesc" :disabled="isDisabled" type="textarea" style="width: 50%;min-height: 400px;" placeholder="输入卡密" />
      </el-form-item>
      <el-form-item label="" prop="">
        <el-button @click="cancelForm">清空</el-button>
        <el-button type="primary" @click="saveCardPwd">保存卡密</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { saveBatch } from '@/api/cardpwd'
import { getByCondition } from '@/api/goods'
import categoryApi from '@/api/category'
import { parseTime } from '@/utils'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        start: 0,
        size: 20,
        cardNo: undefined,
        status: undefined,
        goodsId: undefined
      },
      categoryAll: [],
      goodsAll: [],
      temp: {},
      isDisabled: true,
      rules: {
        cardNo: [{ required: true, message: '名称不能为空哦！', trigger: 'blur' }],
        cid: [{ required: true, message: '必须选一个分类哦！', trigger: 'blur' }]
      },
      allKms: 0
    }
  },
  created() {
    this.getCategories().then(r => {
      this.categoryAll = r
    })
  },
  methods: {
    getGoodsAll(cid) {
      const json = {}
      json.cid = cid
      return getByCondition(json).then((r) => {
        return r.data.data.content
      })
    },
    getCategories() {
      return categoryApi.getCategories().then((r) => {
        return r.data.data
      })
    },
    checkCate(data) {
      this.getGoodsAll(data).then(r => {
        this.goodsAll = r
      })
    },
    checkGoods(data) {
      if (data != null) {
        this.isDisabled = false
        const json = {}
        json.id = data
        getByCondition(json).then(r => {
          this.allKms = r.data.data.content[0].kmCount
        })
      } else {
        this.isDisabled = true
      }
    },
    cancelForm() {
    },
    saveCardPwd() {
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
