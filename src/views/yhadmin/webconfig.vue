<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 60%">
      <el-form-item label="网站域名" prop="webUrl">
        <el-input v-model="temp.webUrl"><template slot="prepend">http://</template><template slot="append">有端口请加上端口</template></el-input>
      </el-form-item>
      <el-form-item label="网站主标题" >
        <el-input v-model="temp.mainTitle"/>
      </el-form-item>
      <el-form-item label="网站副标题" >
        <el-input v-model="temp.subTitle"/>
      </el-form-item>
      <el-form-item label="网站描述" >
        <el-input v-model="temp.titleDesc"/>
      </el-form-item>
      <el-form-item label="网站关键词">
        <el-input v-model="temp.keyWords"/>
      </el-form-item>
      <el-form-item label="主页公告" >
        <tinymce v-model="temp.mainNotice" />
      </el-form-item>
      <el-form-item label="查订单页面公告">
        <tinymce v-model="temp.subNotice" />
      </el-form-item>
      <el-form-item label="底部版权" >
        <el-input v-model="temp.copyRight"/>
      </el-form-item>
      <el-form-item label="首页背景图">
        <!--<el-input v-model="temp.bgImg"/>-->
        <el-tag style="float: left;margin-top: 4px;"><a href="javascript:void(0)" style="color: #1e6abc" @click="showImg()">查看图片</a></el-tag>
        <editorImage btn-text="关闭" color="#1890ff" class="editor-upload-btn" style="float: left;margin-left: 3px;" @successCBK="imageSuccessCBK"/>
        <el-alert :closable="false" type="warning" title="首页背景图只可上传一张" show-icon />
      </el-form-item>
      <el-form-item label="是否显示库存">
        <el-select v-model="temp.showStock" placeholder="" clearable style="width: 200px" class="filter-item" >
          <el-option v-for="item in categoryAll " :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="库存警戒值">
        <el-input-number v-model="temp.kmNotice"/>
        <el-alert :closable="false" type="info" title="库存低于警戒值时会发送邮件到超级管理员邮箱，0为不发送" show-icon />
      </el-form-item>
      <el-form-item label="网站状态">
        <el-select v-model="temp.webStatus" placeholder="" clearable style="width: 200px" class="filter-item" >
          <el-option v-for="item in categoryStatus " :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
        <el-alert :closable="false" type="info" title="关闭后发卡首页将重定向到http://baidu.com" show-icon />
      </el-form-item>
      <el-form-item label="" >
        <el-button @click="cancelForm">清空</el-button>
        <el-button type="primary" @click="save">保存配置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="imgDialogFormVisible" :close-on-press-escape="false" title="查看图片">
      <el-row v-if="temp.bgImg !== ''">
        <img :src="temp.bgImg" width="100%" height="50%">
      </el-row>
      <el-row v-if="temp.bgImg === ''">
        <span>暂无图片</span>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="temp.bgImg !== ''" class="el-button--primary" @click="delBgimg">删除</el-button>
        <el-button @click="imgDialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { save, get } from '@/api/webconfig'
import { parseTime } from '@/utils'
import tinymce from '@/components/Tinymce'
import editorImage from '@/components/Tinymce/components/editorImage'

export default {
  filters: {
  },
  components: {
    tinymce: tinymce,
    editorImage: editorImage
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      categoryAll: [
        {
          code: 1,
          name: '是'
        },
        {
          code: 0,
          name: '否'
        }
      ],
      categoryStatus: [
        {
          code: 1,
          name: '开启'
        },
        {
          code: 0,
          name: '关闭'
        }
      ],
      imgDialogFormVisible: false,
      goodsAll: [],
      temp: {
        mainTitle: '',
        subTitle: '',
        titleDesc: '',
        keyWords: '',
        mainNotice: '',
        subNotice: '',
        copyRight: '',
        showStock: 1,
        wbeStyle: '',
        bgImg: '',
        webUrl: '',
        webStatus: '',
        kmNotice: 10
      },
      isDisabled: true,
      rules: {
        webUrl: [{ required: true, message: '网站域名必填哦！', trigger: 'blur' }]
      },
      allKms: 0,
      cid: ''
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    cancelForm() {
      this.temp = {
        showStock: 1
      }
    },
    save() {
      if(this.temp.webUrl === '' || this.temp.webUrl === null){
        this.$message({
          type: 'error',
          message: '网站域名必填哦！'
        })
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          delete this.temp.createDate
          save(this.temp).then(r => {
            if (r.data.code === 100) {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 4000
              })
            }else{
              this.$notify({
                title: '失败',
                message: r.data.msg,
                type: 'error',
                duration: 4000
              })
            }
          })
        }
      })
    },
    getConfig() {
      get().then(r => {
        this.temp = r.data.data
      })
    },
    showImg() {
      this.imgDialogFormVisible = true
    },
    imageSuccessCBK(data) {
      if (data.length > 0) { this.temp.bgImg = data[0].url }
    },
    delBgimg() {
      this.$confirm('确认删除首页背景图吗？').then(_ => {
        this.temp.bgImg = ''
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
