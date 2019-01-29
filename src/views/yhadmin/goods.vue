<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.cid" placeholder="分类" clearable style="width: 90px" class="filter-item">
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="deleteCate(scope.$index, scope.row.id,list)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :size.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="商品分类" prop="cid">
          <el-select v-model="temp.cid" placeholder="请选择" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in categoryAll " :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="添加时间" >
          <el-date-picker v-model="temp.createDate" type="datetime" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input-number v-model="temp.price"/>
        </el-form-item>
        <el-form-item label="状态" prop="status" >
          <el-select v-model="temp.status" class="filter-item" >
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="需要密码提取" prop="needPwd" >
          <el-select v-model="temp.needPwd" class="filter-item" @change="checkOpts">
            <el-option v-for="item in needPwdOpt" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="提取密码" prop="pullPwd">
          <el-input v-model="temp.pullPwd" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item label="商品图片" prop="img">
          <el-input v-model="temp.img"/>
        </el-form-item>
        <el-form-item label="商品描述" prop="goodsDesc">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.goodsDesc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, getByCondition, save, deleteById } from '@/api/goods'
import categoryApi from '@/api/category'
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
        name: undefined,
        status: undefined,
        cid: undefined
      },
      isDisabled: false,
      importanceOptions: [1, 2],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [
        {
          name: '启用',
          value: 1
        }, {
          name: '禁用',
          value: 2
        }
      ],
      statusOptionsAll: [
        {
          name: '全部',
          value: null
        },
        {
          name: '启用',
          value: 1
        }, {
          name: '禁用',
          value: 2
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新分类',
        create: '新建分类'
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
        this.total = c.length
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
        this.total = c.length
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
      return categoryApi.getCategories().then((r) => {
        return r.data.data
      })
    },
    checkOpts(data) {
      if (data) {
        this.isDisabled = true
        this.temp.pullPwd = '无需提取密码'
      } else {
        this.temp.pullPwd = ''
        this.isDisabled = false
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
      this.temp = Object.assign({}, row) // copy obj
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
