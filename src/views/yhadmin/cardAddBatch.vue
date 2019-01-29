<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.goodsId" placeholder="关联商品" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in categoryAll " :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusOptionsAll" :key="item.id" :label="item.name" :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加商品</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      width="100%" >
      <el-table-column label="卡密编码" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.cardNo }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡密状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0"><span style="color:#67C23A;">未使用</span></el-tag>
          <el-tag v-if="scope.row.status == 1"><span style="color:#F67E7E;">已使用</span> </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleUpdate(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="deleteCate(scope.$index, scope.row.id,list)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :size.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="卡密编号">
          <span>{{ tempMsg.cardNo }}</span>
        </el-form-item>
        <el-form-item label="添加时间">
          <span>{{ tempMsg.createDate }}</span>
        </el-form-item>
        <el-form-item label="添加人">
          <span>{{ tempMsg.createUser }}</span>
        </el-form-item>
        <el-form-item label="关联商品名称">
          <span>{{ tempMsg.goodsName }}</span>
        </el-form-item>
        <el-form-item label="卡密状态">
          <span v-if="tempMsg.status == 1">已使用</span>
          <span v-if="tempMsg.status == 0">未使用</span>
        </el-form-item>
        <el-form-item label="提取时间">
          <span>{{ tempMsg.useDate }}</span>
        </el-form-item>
        <el-form-item label="提取人联系方式">
          <span>{{ tempMsg.useUser }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, getByCondition, save, deleteById } from '@/api/cardpwd'
import { getAll } from '@/api/goods'
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
        size: 20,
        cardNo: undefined,
        status: undefined,
        goodsId: undefined
      },
      isDisabled: true,
      importanceOptions: [1, 2],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [
        {
          name: '已使用',
          value: 1
        }, {
          name: '未使用',
          value: 0
        }
      ],
      statusOptionsAll: [
        {
          name: '全部',
          value: null
        },
        {
          name: '已使用',
          value: 1
        }, {
          name: '未使用',
          value: 0
        }
      ],
      needPwdOpt: [
        {
          name: '否',
          value: false
        }, {
          name: '是',
          value: true
        }
      ],
      categoryAll: [],
      showReviewer: false,
      temp: {
        id: undefined,
        name: '',
        price: '',
        createDate: new Date(),
        goodsDesc: '',
        status: 1,
        img: '',
        needPwd: false,
        pullPwd: ''
      },
      tempMsg: {
        cardNo: '',
        createDate: '',
        createUser: '',
        createUserId: '',
        goodsId: '',
        goodsName: '',
        status: '',
        useDate: null,
        useUser: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新商品',
        create: '添加商品'
      },
      pvData: [],
      rules: {
        name: [{ required: true, message: '名称不能为空哦！', trigger: 'blur' }],
        cid: [{ required: true, message: '必须选一个分类哦！', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getCategories().then(r => {
      this.categoryAll = r
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        const c = response.data.data.content
        this.list = c
        this.total = response.data.data.totalElements
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    getByCondition() {
      this.listLoading = true
      // 删除空值
      for (const i in this.listQuery) {
        if (this.listQuery[i] === '') {
          delete this.listQuery[i]
        }
      }
      getByCondition(this.listQuery).then(response => {
        const c = response.data.data.content
        this.list = c
        this.total = response.data.data.totalElements
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.start = 0
      this.getByCondition()
    },
    deleteCate(index, id, list) {
      this.$confirm('确认删除？')
        .then(_ => {
          const obj = {}
          obj.id = id
          deleteById(obj).then((respose) => {
            if (respose.data.code === 100) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 4000
              })
              list.splice(index, 1)
              this.total--
            } else {
              this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'error',
                duration: 4000
              })
            }
          })
        }).catch(reason => {})
    },
    getCategories() {
      return getAll(null).then((r) => {
        return r.data.data.content
      })
    },
    checkOpts(data) {
      if (data) {
        this.isDisabled = false
        this.temp.pullPwd = ''
      } else {
        this.temp.pullPwd = ''
        this.isDisabled = true
      }
    },
    resetTemp() {
      this.temp = {
        name: '',
        price: '',
        createDate: new Date(),
        goodsDesc: '',
        status: 1,
        img: '',
        needPwd: false,
        pullPwd: '',
        cid: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData: function() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          delete this.temp.createDate
          save(this.temp).then(() => {
            this.temp.createDate = new Date()
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      const json = {}
      json.id = row.id
      getByCondition(json).then(r => {
        r.data.content = this.tempMsg
      })
      this.tempMsg = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          delete tempData.createDate
          save(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 4000
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['分类名称', '分类描述', '创建时间', '排序', '状态']
        const filterVal = ['name', 'categoryDesc', 'createDate', 'sort', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '分类列表'
        })
        this.downloadLoading = false
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
