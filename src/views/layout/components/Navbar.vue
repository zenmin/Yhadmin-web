<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!--<error-log class="errLog-container right-menu-item"/>-->

        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>

        <lang-select class="international right-menu-item"/>

        <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided>
            <span>你好 {{ Username }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;text-align: center" @click="updatePwdDiag = true">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;text-align: center" @click="logout">注销登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改密码" :visible.sync="updatePwdDiag">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="原密码" prop="oldPwd">
          <el-input v-model="temp.oldPwd"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="temp.newPwd"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPwd2">
          <el-input v-model="temp.newPwd2"/>
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
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import { getUserName } from '@/utils/auth'
import { updatePwd } from '@/api/adminuser'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  data(){
    return {
      Username: '',
      updatePwdDiag: false,
      temp: {
        oldPwd: '',
        newPwd: '',
        newPwd2: '',
      },
      rules: {
        oldPwd: [{ required: true, message: '请填写必填项！', trigger: 'blur' }],
        newPwd: [{ required: true, message: '请填写必填项！', trigger: 'blur' }],
        newPwd2: [{ required: true, message: '请填写必填项！', trigger: 'blur' }]
      }
    }
  },
  created(){
    this.Username = getUserName()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.temp.newPwd !== this.temp.newPwd2){
            this.$message({
              type: 'error',
              message: '两次密码输入不一致！'
            })
            return
          }
          updatePwd(this.temp).then(response => {
            this.updatePwdDiag = false
            if(response.data.data == true){
              this.$message({
                type: 'success',
                message: '修改密码成功，请重新登录！'
              })
              const that = this
              setTimeout(function() {
                that.$store.dispatch('LogOut').then(() => {
                  location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                })
              },1000)
            }else{
              this.$notify({
                title: '失败',
                message: response.data.msg,
                type: 'error',
                duration: 4000
              })
            }
          })
        }
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
