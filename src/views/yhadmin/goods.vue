<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.cid" placeholder="分类" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in categoryAll " :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 150px" class="filter-item">
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
      <el-table-column label="单价/元" align="center">
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
          <el-tag><a href="javascript:void(0)" style="color: #1e6abc" @click="showImg(scope.row)">查看</a></el-tag>
        </template>
      </el-table-column>
      <el-table-column label="库存卡密" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.kmCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="false" style="width: 100%;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" >
        <el-form-item label="商品分类" prop="cid">
          <el-select v-model="temp.cid" placeholder="请选择" clearable style="width: 200px" class="filter-item">
            <el-option v-for="item in categoryAll " :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="temp.name" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="添加时间" >
          <el-date-picker v-model="temp.createDate" style="width: 200px;" type="datetime" placeholder="" disabled="disabled"/>
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
          <el-input v-model="temp.pullPwd" :disabled="temp.needPwd === true ? false : true" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="temp.sort"/>
        </el-form-item>
        <el-form-item label="商品图片" prop="img">
          <el-tag><a href="javascript:void(0)" style="color: #1e6abc" @click="showImg(temp)">查看图片</a></el-tag>
          <editorImage :btn-text="showText" color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"/>
        </el-form-item>
        <el-form-item label="商品描述" prop="goodsDesc">
          <tinymce v-model="temp.goodsDesc" :showImg="'0'" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="imgDialogFormVisible" :close-on-press-escape="false" title="查看图片">
      <el-row v-if="imgDialogs.imgs[0] != undefined">
        <el-col v-for="(img,index) in imgDialogs.imgs" :span="8" :key="img" >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="img" class="image">
            <div style="padding: 14px;">
              <div class="bottom clearfix">
                <time class="time">图片 {{ index+1 }}</time>
                <el-button type="text" class="button" @click="updateImage(img)">删除</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row v-if="imgDialogs.imgs[0] === undefined">
        <span>暂无图片</span>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="imgDialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, getByCondition, save, deleteById, updateImg } from '@/api/goods'
import categoryApi from '@/api/category'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // 分页组件 Secondary package based on el-pagination
import editorImage from '@/components/Tinymce/components/editorImage'
import tinymce from '@/components/Tinymce'

export default {
  directives: { waves },
  components: { Pagination, editorImage,tinymce: tinymce },
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
        name: undefined,
        status: undefined,
        cid: undefined
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
      showText: '上传图片',
      temp: {
        id: undefined,
        name: '',
        price: '',
        createDate: new Date(),
        goodsDesc: '',
        status: 1,
        img: '',
        needPwd: false,
        pullPwd: '',
        sort: 1
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
        name: [{ required: true, message: '名称不能为空哦！', trigger: 'blur' }],
        cid: [{ required: true, message: '必须选一个分类哦！', trigger: 'blur' }]
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
        this.isDisabled = false
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
        cid: '',
        sort: 1
      }
    },
    handleCreate() {
      this.showText = '上传图片'
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
        const tHeader = ['商品名称', '单价', '分类名称', '添加时间', '商品描述', '商品状态', '需要密码提取', '提取密码', '商品图片', '库存卡密']
        const filterVal = ['name', 'price', 'cname', 'createDate', 'goodsDesc', 'status', 'needPwd', 'pullPwd', 'img', 'kmCount']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '商品列表'
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
