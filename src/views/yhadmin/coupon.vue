<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.couponNo" placeholder="优惠券编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusOptionsAll" :key="item.id" :label="item.name" :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加优惠券</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
      <el-alert :closable="false" type="info" title="折扣后价格 = 商品原价 - 商品原价 x 折扣 " show-icon />
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      width="100%" >
      <el-table-column label="优惠券编码" align="center" min-width="130">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.couponNo }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.validLong === 1 ? '长期优惠券' : '一次性优惠券' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.couponDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.saleRate }} % </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0"><span style="color:#F67E7E;">禁用</span></el-tag>
          <el-tag v-if="scope.row.status == 1"><span style="color:#67C23A;">启用</span> </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否长期有效" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.validLong == 0"><span style="color:#F67E7E;"> 否</span></el-tag>
          <el-tag v-if="scope.row.validLong == 1"> <span style="color:#67C23A;">是</span></el-tag>
        </template>
      </el-table-column>
      <el-table-column label="有效期截止" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.disDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.useDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.useUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="deleteCate(scope.$index, scope.row.id,list)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :size.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="优惠券编码">
          <span>系统自动生成</span>
        </el-form-item>
        <el-form-item label="折扣%" prop="saleRate">
          <el-input-number v-model="temp.saleRate"/>
        </el-form-item>
        <el-form-item label="状态" prop="status" >
          <el-select v-model="temp.status" class="filter-item" >
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否多次使用" prop="validLong">
          <el-select v-model="temp.validLong" class="filter-item" @change="checkOpts">
            <el-option v-for="item in isLong" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="失效时间" prop="disDate">
          <el-date-picker v-model="temp.disDate" :disabled="temp.validLong === 0" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder=""/>
        </el-form-item>
        <el-form-item label="描述" prop="couponDesc">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.couponDesc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="imgDialogFormVisible" :close-on-press-escape="false" title="生成优惠券成功">
      <el-row style="text-align: center">
        <el-tag>折扣 {{ finishSale }}%</el-tag>
        <br>
        <span>优惠券编码：</span><span style="font-size: 28px">{{ finishCoupon }}</span><br>

      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="imgDialogFormVisible = false" >关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, getByCondition, save, deleteById } from '@/api/coupon'
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
        couponNo: undefined,
        status: undefined
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
      isLong: [
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
        couponDesc: '',
        couponNo: '',
        disDate: undefined,
        disDateField: '',
        saleRate: 0,
        status: 1,
        validLong: 1
      },
      resTemp: {
        couponDesc: '',
        couponNo: '',
        disDate: undefined,
        disDateField: '',
        saleRate: 0,
        status: 1,
        validLong: 1
      },
      dialogFormVisible: false,
      imgDialogFormVisible: false,
      imgDialogs: {
        imgs: [],
        goodsId: ''
      },
      dialogStatus: '',
      textMap: {
        update: '更新商品',
        create: '添加商品'
      },
      pvData: [],
      rules: {
        saleRate: [{ required: true, message: '折扣不能为空哦！', trigger: 'blur' }]
      },
      downloadLoading: false,
      selectRow: undefined,
      finishCoupon: '',
      finishSale: ''
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
          this.temp.disDateField = this.temp.disDate
          delete this.temp.disDate
          if (!this.validateInput()) {
            return
          }
          save(this.temp).then(r => {
            this.temp.createDate = new Date()
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加优惠券成功',
              type: 'success',
              duration: 4000
            })
            this.imgDialogFormVisible = true
            this.finishCoupon = r.data.data.couponNo
            this.finishSale = r.data.data.saleRate
          })
        }
      })
    },
    handleUpdate(row) {
      this.showText = '查看图片'
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
          delete tempData.createUser
          delete tempData.useDate
          delete tempData.useUser
          delete tempData.couponNo
          tempData.disDateField = tempData.disDate
          delete tempData.disDate
          if (!this.validateInput()) {
            return
          }
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
    validateInput() {
      if (this.temp.saleRate <= 0 || this.temp.saleRate > 100) {
        this.$message({
          message: '折扣必须在1~100之间！',
          type: 'error'
        })
        return false
      }
      if (this.temp.validLong === 0 && (this.temp.disDateField === null || this.temp.disDateField === '')) {
        this.$message({
          message: '非长期有效优惠券必须填写失效时间！',
          type: 'error'
        })
        return false
      }
      return true
    },
    updateImage(img) {
      this.$confirm('是否删除？').then(_ => {
        var imgs = []
        this.imgDialogs.imgs.forEach(function(i) {
          if (i !== img) { imgs.push(i) }
        })
        this.imgDialogs.imgs = imgs
        // 发送请求修改图片
        var nowImgs = ''
        for (var i = 0; i < this.imgDialogs.imgs.length; i++) {
          nowImgs += this.imgDialogs.imgs[i] + ','
        }
        nowImgs = nowImgs.substring(0, nowImgs.length - 1)
        this.selectRow.img = nowImgs
        updateImg({ id: this.imgDialogs.goodsId, imgs: nowImgs }).then(r => {
          if (r.data.code === 100) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 4000
            })
          } else {
            this.$message({
              message: r.data.msg,
              type: 'warning',
              duration: 4000
            })
            return
          }
        })
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
