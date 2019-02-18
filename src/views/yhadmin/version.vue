<template>
  <div class="app-container">
    <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition" style="width: 50%;float: left;">
      <div class="el-table__body-wrapper is-scrolling-none">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 820px;">
          <colgroup>
            <col name="el-table_1_column_1" width="180">
            <col name="el-table_1_column_2" width="180">
            <col name="el-table_1_column_3" width="460">
          </colgroup>
          <tbody>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>当前程序版本</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.version }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>客户端IP</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.ip }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>服务器时间</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.time }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>服务器时区</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.usertimezone }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>服务器HOST</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.host }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>服务器端口</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.port }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>服务端容器版本</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.serverinfo }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>登录超时时间</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.maxinactiveinterval }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>Java版本</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.javaversion }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>JVM版本</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.jvmversion }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>服务器所在国家</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.usercountry }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>当前程序进程ID</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.pid }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>程序安装目录</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.userdir }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>服务器操作系统</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.osname }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>当前程序缓存目录</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.javaiotmpdir }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>Java编译版本</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.javaclassversion }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>服务器程序编码</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.fileencoding }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>Java运行目录</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.javahome }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>服务器CPU类别</el-tag></div>
              </td>
              <td rowspan="1" colspan="1" class="el-table_1_column_3  ">
                <div class="cell">{{ temp.suncpuisalist }}</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td rowspan="1" colspan="1" class="el-table_1_column_2  ">
                <div class="cell"><el-tag>当前请求信息</el-tag></div>
              </td>
              <td rowspan="1" colspan="4" class="el-table_1_column_3  ">
                <div class="cell">{{ temp['user-agent'] }}</div>
              </td>
            </tr>
          </tbody>
        </table><!----><!----><!----><!----><!----><!---->
      </div>
      <div class="el-table__column-resize-proxy" style="display: none;"/>
    </div>

    <div style="width: 48%;float: left">
      <el-alert
        :closable="false"
        title="声明："
        show-icon
        description="
      本程序只作学习交流使用，仅供个人研究之用，请安装后在 24 小时内删除，请勿用于商业及非法用途，如由此引起的相关法律法规责任，与开发人员无关！"
        type="warning"/>
      <br ><br >

      <el-alert :closable="false" show-icon title="如果本程序对您有帮助，请捐助我们！" type="success" @close="changShow">
        <el-tag style="margin-left: 100px;"><a href="javascript:void(0)" type="success" @click="changShow">立即捐助</a></el-tag>
      </el-alert>
      <div v-show="isShow" id="payImg" style=" padding-left: 9%;">
        <img src="@/views/yhadmin/img/F7F60AEBB0F615DA9AAE7E307731A0D5.jpg" width="200" height="300" >
        <img src="@/views/yhadmin/img/2C88E7F1F0ACBB45C2BCCCA4667A4A38.jpg" width="200" height="300" >
      </div>
      <br ><br >

      <el-alert :closable="false" type="info" title="如果您想升级程序或需要技术援助，请点击此处！" show-icon >
        <el-tag style="margin-left: 40px;"><a :href="temp.updateurl" target="_blank" type="success">立即升级</a></el-tag>
      </el-alert>

    </div>

  </div>
</template>

<style>
</style>

<script>
import request from '@/utils/request'

export default {
  filters: {
  },
  data() {
    return {
      temp: {
      },
      isShow: false
    }
  },
  created() {
    this.getVersion().then(r => {
      this.temp = r.data.data
    })
  },
  methods: {
    getVersion() {
      return request({
        url: '/api/index/version',
        method: 'post',
        data: null
      })
    },
    changShow() {
      if (this.isShow === true) {
        this.isShow = false
      } else {
        this.isShow = true
      }
    }
  }
}
</script>
