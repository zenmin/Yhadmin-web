<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.orderNo" placeholder="订单编号" style="width: 200px;margin-top: 8px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.phone" placeholder="手机号" style="width: 200px;margin-top: 8px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.userContact"   placeholder="联系方式" style="width: 200px;margin-top: 8px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker v-model="listQuery.beginTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="起始时间" @keyup.enter.native="handleFilter"/>
      <el-date-picker v-model="listQuery.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.goodsId"  placeholder="关联商品" clearable style="width: 120px;margin-top: 8px;" class="filter-item">
        <el-option v-for="item in categoryAll " :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px;margin-top: 8px;" class="filter-item">
        <el-option v-for="item in statusOptionsAll" :key="item.id" :label="item.name" :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-top: 8px;" @click="handleFilter">搜索</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" style="margin-top: 8px;" @click="handleDownload">导出</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      width="100%" >
      <el-table-column label="订单编号" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.orderNo }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否使用优惠券" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.couponNo !== null &&  scope.row.couponNo !=='' "><el-tag style="color:#67C23A;">是</el-tag></span>
          <span v-else ><el-tag style="color:#F67E7E;">否</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="订单总价/元" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.allPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0"><span style="color:#F67E7E;">未完成</span></el-tag>
          <el-tag v-if="scope.row.status == 1"><span style="color:#67C23A;">已完成</span> </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.payWay === 'wxpay'" ><svg-icon icon-class="wechat" /></span>
          <span v-if="scope.row.payWay === 'qqpay'" ><svg-icon icon-class="qq" /></span>
          <span v-if="scope.row.payWay === 'alipay'" ><svg-icon icon-class="alipay" /></span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payStatus === 0"><span style="color:#F67E7E;">待支付</span></el-tag>
          <el-tag v-if="scope.row.payStatus === 1"><span style="color:#67C23A;">已支付</span> </el-tag>
          <el-tag v-if="scope.row.payStatus === 2"><span style="color:#F67E7E;">支付超时</span> </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button type="success" @click="handleDetail(scope.row)">订单详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :size.sync="listQuery.size" @pagination="getList" />

    <el-dialog title="订单详情" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="订单编号">
          <span>{{ tempMsg.orderNo }}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{ tempMsg.createDate }}</span>
        </el-form-item>
        <el-form-item label="商品名称">
          <span>{{ tempMsg.goodsName }}</span>
        </el-form-item>
        <el-form-item label="商品单价">
          <span>{{ tempMsg.price }}</span>
        </el-form-item>
        <el-form-item label="购买数量">
          <span>{{ tempMsg.num }}</span>
        </el-form-item>
        <el-form-item label="订单总价">
          <span>{{ tempMsg.allPrice }}</span>
        </el-form-item>
        <el-form-item label="优惠券编码">
          <span v-if="tempMsg.couponNo !== '' && tempMsg.couponNo !== null ">{{ tempMsg.couponNo }} <el-tag> {{ saleRate }}</el-tag></span>

          <span v-else>未使用优惠券</span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span v-if="tempMsg.payWay === 'wxpay'" >微信支付</span>
          <span v-if="tempMsg.payWay === 'qqpay'" >QQ支付</span>
          <span v-if="tempMsg.payWay === 'alipay'" >支付宝支付</span>
        </el-form-item>
        <el-form-item label="支付结果">
          <span v-if="tempMsg.payStatus === 0">待支付</span>
          <span v-if="tempMsg.payStatus === 1">已支付</span>
          <span v-if="tempMsg.payStatus === 2">支付超时</span>
        </el-form-item>
        <el-form-item label="购买人联系方式">
          <span>{{ tempMsg.userContact }}</span>
        </el-form-item>
        <el-form-item label="购买人手机号">
          <span>{{ tempMsg.phone }}</span>
        </el-form-item>
        <el-form-item label="购买到的卡密">
          <el-tag v-if="tempMsg.cardPwds.indexOf(',') == -1">{{ tempMsg.cardPwds }}</el-tag>
          <div v-else v-for="c in tempMsg.cardPwds.split(',')" :key="c">
            <el-tag >{{ c }}</el-tag>
            <br>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, getByCondition,getCouponByCondition } from '@/api/orders'
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
        start: 1,
        size: 15,
        orderNo: undefined,
        status: undefined,
        goodsId: undefined,
        userContact: undefined,
        beginTime: undefined
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
          name: '已完成',
          value: 1
        }, {
          name: '未完成',
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
        useUser: null,
        cardPwds: ''
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
      downloadLoading: false,
      saleRate: ''
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
    handleDetail(data){
      this.tempMsg = data
      this.dialogFormVisible = true
      if(data.couponNo !== '' && data.couponNo !== null){
        console.log(data)
        getCouponByCondition({couponNo:data.couponNo}).then(r=>{
          if(r.data.data.content.length === 0)
            this.saleRate = "该优惠券已被删除"
          else
            this.saleRate = '折扣'+ r.data.data.content[0].saleRate+'%'
        })
      }
    },
    handleFilter() {
      this.listQuery.start = 0
      this.getByCondition()
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['订单编号', '关联商品', '创建时间', '订单总价', '订单状态', '支付方式','购买商品数量','购买人手机号','购买人联系方式','购买到的卡密']
        const filterVal = ['orderNo', 'goodsName', 'createDate', 'allPrice', 'status',"payWay",'num','phone','userContact','cardPwds']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '订单列表'
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
