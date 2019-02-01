<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form >
        <el-form-item label="目标卡密">
          <el-select v-model="temp.deltype" placeholder="请选择" clearable style="width: 150px" class="filter-item">
            <el-option v-for="item in statusOptionsAll" :key="item.id" :label="item.name" :value="item.value"/>
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
      <el-table-column label="商品名称" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1"><span style="color:#67C23A;">启用</span></el-tag>
          <el-tag v-if="scope.row.status == 2"><span style="color:#F67E7E;">禁用</span> </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="需要密码提取" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.needPwd == false"><span style="color:#F67E7E;"> 否</span></el-tag>
          <el-tag v-if="scope.row.needPwd == true"> <span style="color:#67C23A;">是</span></el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提取密码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pullPwd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" align="center">
        <template slot-scope="scope">
          <a :href=" scope.row.img " target="_blank" style="color: #1e6abc">{{ scope.row.img }}</a>
        </template>
      </el-table-column>
      <el-table-column label="库存卡密" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.kmCount }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :size.sync="listQuery.size" @pagination="getList" />

  </div>
</template>

<script>
import { deleteBatch, fetchList } from '@/api/cardpwd'
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
        name: undefined
      },
      temp: {},
      deltype: undefined,
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
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
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
        deleteBatch({ type: this.temp.deltype }).then(r => {
          if (r.data.data) {
            this.$notify({
              title: '成功',
              message: '删除卡密成功',
              type: 'success',
              duration: 4000
            })
          }
        })
      }
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
