<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form >
        <el-form-item label="目标卡密">
          <el-select v-model="temp.deltype" placeholder="请选择" clearable style="width: 180px" class="filter-item">
            <el-option v-for="item in statusOptionsAll" :key="item.id" :label="item.name" :value="item.value"/>
          </el-select>
          <el-select v-model="listQuery.cid" placeholder="所属分类" clearable style="width: 180px" class="filter-item" @change="changeCate" >
            <el-option v-for="item in categorys " :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-select v-model="listQuery.goodsId" placeholder="关联商品" clearable style="width: 180px" class="filter-item">
            <el-option v-for="item in categoryAll " :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-link" @click="handleDelete">执行删除</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      width="100%" >
      <el-table-column label="批量删除操作日志" align="center">
        <el-table-column label="操作名称" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.optDesc }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="删除方式" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.optParams.charAt(1) == 0">删除全部</span>
            <span v-if="scope.row.optParams.charAt(1) == 1">已使用的卡密</span>
            <span v-if="scope.row.optParams.charAt(1) == 2">未使用的卡密</span>
          </template>
        </el-table-column>
        <el-table-column label="删除时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.optUser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人ID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.optUserId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作IP" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.optIp }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :size.sync="listQuery.size" @pagination="getList" />

  </div>
</template>

<script>
import { getCardpwd } from '@/api/logs'
import goods from '@/api/goods'
import getCategories from '@/api/category'
import { deleteBatch } from '@/api/cardpwd'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // 分页组件 Secondary package based on el-pagination

export default {
  directives: { waves },
  components: { Pagination },
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
        size: 15,
        goodsId: null,
        cid: null
      },
      categorys: [],
      categoryAll: [],
      temp: {
        deltype: 1
      },
      deltype: 1,
      statusOptionsAll: [
        {
          name: '全部卡密',
          value: 0
        },
        {
          name: '已使用的卡密',
          value: 1
        }, {
          name: '未使用的卡密',
          value: 2
        }
      ],
      rules: {
        deltype: [{ required: true, message: '请选择一项要删除的卡密！', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getCate()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCardpwd(this.listQuery).then(response => {
        const c = response.data.data.content
        this.list = c
        this.total = c.length
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleDelete() {
      if (this.temp.deltype === undefined || this.temp.deltype === '') {
        this.$message('请选择一个删除方式！')
      } else {
        var msg = "确认删除？";
        if(this.listQuery.cid !== '' && this.listQuery.goodsId === '')
          msg = "确认删除此分类下所有商品的卡密？"
        this.$confirm(msg).then(_ =>{
          deleteBatch({ type: this.temp.deltype, cid: this.listQuery.cid, goodsId: this.listQuery.goodsId }).then(r => {
            if (r.data.data) {
              this.$notify({
                title: '成功',
                message: '删除卡密成功',
                type: 'success',
                duration: 4000
              })
              this.getList()
            }
          })
        })
      }
    },
    changeCate(cid){
      this.listQuery.goodsId = ''
      goods.goods({start:0,size:100,cid:cid}).then((r) => {
        this.categoryAll = r.data.data.content
      })
    },
    getCate(){
      getCategories.getCategories().then(r => {
        this.categorys = r.data.data
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
