<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 18%;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.realName" placeholder="真实姓名" style="width: 18%;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.phone" placeholder="手机号" style="width: 18%;" class="filter-item" @keyup.enter.native="handleFilter"/>

      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusOptionsAll" :key="item.id" :label="item.name" :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加管理员</el-button>
      <el-alert :closable="true" type="info" title="超级管理员拥有对平台所有角色管理权限" show-icon />
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      width="100%" >
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.userName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isAdministrator === 1 ? '超级管理员' : '普通管理员' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登录时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastloginTime }} </span>
        </template>
      </el-table-column>
      <el-table-column label="上次登录IP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastloginIP }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1"><span style="color:#67C23A;">启用</span> </el-tag>
          <el-tag v-if="scope.row.status == 0"><span style="color:#F67E7E;">禁用</span></el-tag>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wx }}</span>
        </template>
      </el-table-column>
      <el-table-column label="QQ" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.qq }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.adminEmail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.isAdministrator !== 1" size="mini" type="danger" @click="deleteCate(scope.$index, scope.row.id,list)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :size.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" :disabled="dialogStatus === 'update'"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create'" label="密码" prop="passWord">
          <el-input v-model="temp.passWord" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'update'" label="是否重置密码" prop="isResetPwd">
          <el-select v-model="temp.isResetPwd">
            <el-option v-for="item in isOK" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" >
          <el-select v-model="temp.status" class="filter-item" >
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="temp.realName" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="temp.qq" />
        </el-form-item>
        <el-form-item label="微信" prop="wx">
          <el-input v-model="temp.wx" />
        </el-form-item>
        <el-form-item label="邮箱" prop="wx">
          <el-input v-model="temp.adminEmail" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, getByCondition, save, deleteById } from '@/api/adminuser'
import categoryApi from '@/api/category'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // 分页组件 Secondary package based on el-pagination
import editorImage from '@/components/Tinymce/components/editorImage'

export default {
  directives: { waves },
  components: { Pagination, editorImage },
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
        start: 1,
        size: 15,
        userName: undefined,
        realName: undefined,
        phone: undefined
      },
      isDisabled: true,
      importanceOptions: [1, 2],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [
        {
          name: '启用',
          value: 1
        }, {
          name: '禁用',
          value: 0
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
          value: 0
        }
      ],
      isOK: [
        {
          name: '是',
          value: 1
        }, {
          name: '否',
          value: 0
        }
      ],
      categoryAll: [],
      showReviewer: false,
      showText: '上传图片',
      temp: {
        status: 1,
        userName: '',
        passWord: '',
        realName: '',
        phone: '',
        qq: '',
        wx: '',
        isResetPwd: 0,
        adminEmail: ''
      },
      resTemp: {
        status: 1,
        userName: '',
        passWord: '',
        realName: '',
        phone: '',
        qq: '',
        wx: '',
        isResetPwd: 0,
        adminEmail: ''
      },
      dialogFormVisible: false,
      imgDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新管理员信息',
        create: '添加管理员'
      },
      pvData: [],
      rules: {
        userName: [{ required: true, message: '用户名不能为空哦！', trigger: 'blur' }],
        passWord: [{ required: true, message: '用户名不能为空哦！', trigger: 'blur' }]
      },
      downloadLoading: false,
      selectRow: undefined
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
                message: '删除管理员成功',
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
      return categoryApi.getCategories().then((r) => {
        return r.data.data
      })
    },
    checkOpts(data) {
      if (data) {
        this.temp.disDate = undefined
      }
    },
    handleCreate() {
      this.temp = this.resTemp
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
          save(this.temp).then(r => {
            if (r.data.code !== 100) {
              this.$message({
                type: 'error',
                message: r.data.msg
              })
              return
            }
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加管理员成功',
              type: 'success',
              duration: 4000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.showText = '查看图片'
      row.isResetPwd = 0
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
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
          delete tempData.lastloginTime
          delete tempData.lastloginIP
          delete tempData.isAdministrator
          save(tempData).then(r => {
            if (r.data.code !== 100) {
              this.$notify({
                title: '失败',
                message: r.data.msg,
                type: 'error',
                duration: 4000
              })
              return
            }
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            let msg = '更新成功'
            if (this.temp.isResetPwd === 1) {
              msg = ' 更新成功，该管理员密码已重置为123456 '
            }
            this.$notify({
              title: '成功',
              message: msg,
              type: 'success',
              duration: 6000
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['优惠券编码', '描述', '创建时间', '创建人', '折扣%', '状态', '是否长期有效', '有效期截止', '使用时间', '使用人']
        const filterVal = ['couponNo', 'couponDesc', 'createDate', 'createUser', 'saleRate', 'validLong', 'disDate', 'useDate', 'useUser', 'kmCount']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '优惠券列表'
        })
        this.downloadLoading = false
      })
    },
    imageSuccessCBK(data) {
      let urls = ''
      for (var i in data) {
        urls += data[i].url + ','
      }
      urls = urls.substring(0, urls.length - 1)
      if (this.temp.img === '') { this.temp.img += urls } else { this.temp.img += ',' + urls }
    },
    showImg(row) {
      const images = row.img
      const goodsId = row.id
      this.selectRow = row
      this.imgDialogFormVisible = true
      this.imgDialogs.goodsId = goodsId
      this.imgDialogs.imgs = []
      if (images !== '') {
        if (images.indexOf(',') != -1) {
          this.imgDialogs.imgs = images.split(',')
        } else {
          this.imgDialogs.imgs.push(images)
        }
      } else {
        this.imgDialogs.imgs = []
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
<style>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
