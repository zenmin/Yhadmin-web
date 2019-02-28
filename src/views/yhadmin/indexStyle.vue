<template>
  <div class="app-container">
    <el-alert :closable="false" type="info" title="模板正在不断加入中，如果你需要定制模板请联系开发者！" show-icon style="width: 100%"/>
    <br>
    <el-form ref="dataForm" :model="temp" style="width: 100%;">
      <el-row>
        <el-col v-for="(o) in temp.temps" :span="4" :key="o.name" style="float: left;margin-left: 10px;">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="o.img" class="image" width="217px" height="282px">
            <div style="padding: 14px;">
              <span>{{ o.name }}</span>
              <el-button type="text" class="button" @click="saveCardPwd(o.path)">
                <el-tag>使用此模板
                  <i v-if="o.path == temp.index_style" class="el-icon-circle-check"/>
                </el-tag>
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { saveTemp, getByCondition } from '@/api/interface'
import { parseTime } from '@/utils'

export default {
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      temp: {
        type: 5,
        index_style: '',
        temps: [
          {
            path: 'webtemps/default',
            img: 'webtemps/default/index.jpg',
            name: 'default'
          }
        ]
      },
      isThisTemp: false

    }
  },
  created() {
    getByCondition({ type: 5 }).then(r => {
      this.temp = r.data.data
    })
  },
  methods: {
    saveCardPwd(path) {
      this.$confirm('是否使用此模板？').then(_ => {
        saveTemp({ type: this.temp.type, index_style: path }).then(r => {
          if (r.data.data) {
            this.$notify({
              title: '成功',
              message: '更新模板成功，立即生效',
              type: 'success',
              duration: 4000
            })
            getByCondition({ type: 5 }).then(r => {
              this.temp = r.data.data
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
<style>
  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

</style>
