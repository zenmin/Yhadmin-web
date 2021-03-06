<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.optName" placeholder="操作模块名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.optDesc" placeholder="操作详细" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.optIp" placeholder="按IP查询" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.optUser" placeholder="操作人" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
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
      <el-table-column label="操作模块" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.optName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.optDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人IP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.optIp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center">
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
      <el-table-column label="请求参数" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="openDiag(scope.row.optParams)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :size.sync="listQuery.size" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" title="参数详细">
      <el-tag>请求参数</el-tag>
      <el-tag><a href="http://www.bejson.com/" target="_blank">格式化</a></el-tag>
      <br>
      <span style="width: 600px; height: 100px; word-break: break-all;">{{ this.paramsTemp }}</span>
    </el-dialog>

  </div>
</template>

<script>
import { optList, getByCondition } from '@/api/logs'
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
        optName: '',
        optDesc: '',
        optIp: '',
        optUser: ''
      },
      dialogFormVisible: false,
      isDisabled: true,
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
      },
      dialogStatus: '',
      pvData: [],
      rules: {
        name: [{ required: true, message: '名称不能为空哦！', trigger: 'blur' }],
        cid: [{ required: true, message: '必须选一个分类哦！', trigger: 'blur' }]
      },
      downloadLoading: false,
      paramsTemp: undefined
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      optList(this.listQuery).then(response => {
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
    openDiag(data) {
      if (this.dialogFormVisible === true) {
        this.dialogFormVisible = false
      } else {
        this.dialogFormVisible = true
      }
      this.paramsTemp = data
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['操作模块', '操作描述', '操作人IP', '操作时间', '操作人', '操作人ID', '请求参数']
        const filterVal = ['optName', 'optDesc', 'optIp', 'createDate', 'optUser', 'optUserId', 'optParams']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '操作日志'
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
