<template>
    <div class="header flex-row-between " :class="{'content-collapse':collapse}">
      <!--<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">-->
        <!--<el-menu-item v-for="(v,i) in items"  @click="changeNav(i)" index="3">-->
          <!--<i v-if="v.icon && v.icon!==''" :class="[v.icon]" class="n-icon"></i> <span class="item-text" :class="[navIndex===i?'nav-item-actived':'nav-item-unactive']">{{v.name}}</span>-->
        <!--</el-menu-item>-->
      <!--</el-menu>-->
      <div class="flex-row-start">
        <div v-for="(v,i) in items" class="flex-center header-menu" :key="v.name">

          <div v-if="v.visible == 1" class="flex-center header-menu-item" :class="[navIndex===i?'nav-actived':'nav-unactive']" @click="changeNav(i)">
            <i v-if="v.icon && v.icon!==''" :class="[v.icon]" class="n-icon"></i>
            <span class="item-text" :class="[navIndex===i?'nav-item-actived':'nav-item-unactive']">{{v.name}}</span>
          </div>
        </div>
      </div>
        <div class="header-right">
            <div class="header-user-con">
              <div class="header-part">
                    <span class="el-dropdown-link">
                      <span class="user-avator"><img src="@/assets/images/img.jpg"></span>
                    </span>
                    <el-button type="text" size="medium" style="font-size: 20px" @click="modifiedData" >{{username}}</el-button>
                    <span class="part-top">，欢迎您！</span>
                  <span divided  @click="loginout" class="loginout">退出</span>
              </div>
            </div>
        </div>
      <el-dialog title="修改账户密码" :before-close="handleClose" :visible.sync="editVisible" width="35%" :modal-append-to-body="false">
        <el-form ref="ValidateForm" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="当前密码" prop='lastPassword'>
            <el-input v-model="form.lastPassword" type="password" placeholder="请输入旧密码" style="width: 70%;">
            </el-input>
          </el-form-item>
          <el-form-item label="新密码" prop='password'>
            <el-input v-model="form.password" type="password" placeholder="请输入新密码" style="width: 70%" >
              <i  :slot="passwordShow?'suffix':''" :class="passwordBoolean?'el-icon-circle-check':'el-icon-circle-close'" :style="{color:passwordBoolean?'#5daf34':'red'}"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="请再次确认密码" style="width: 70%">
              <i  :slot="confirmPasswordShow?'suffix':''" :class="confirmPasswordBoolean?'el-icon-circle-check':'el-icon-circle-close'" :style="{color:confirmPasswordBoolean?'#5daf34':'red'}"></i>
            </el-input>
          </el-form-item>
          <div style="padding-top: 10px;padding-left: 25%;">
            <ol>
              <li>字符长度8~19位</li>

              <li>必须为大小写字母、数字、键盘上的符号任意两者的组合</li>
              <li>不可与当前密码、初始化密码相同</li>
              <li>密码不可与用户名相同</li>
            </ol>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="alterUserData">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>
<script>
import bus from '../common/bus'
import sysMenuService from '@/services/sys/menu.js'
import sysUser from '@/services/sys/user.js'
import log from '@/services/login.js'

const USER_ALTER = {
  password: '',
  confirmPassword: '',
  lastPassword: ''
}
export default {
  data () {
    var passwordValidator = (rule, value, callback) => {
      this.passwordShow = true
      this.passwordBoolean = false
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.form.lastPassword) {
        callback(new Error('与当前密码相同'))
      } else if (value.length < 8 || value.length > 19) {
        callback(new Error('密码长度8~19位'))
      } else if (value === this.userName) {
        callback(new Error('不可与用户名相同'))
      } else {
        const regular = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\d(\d)])+$)([^(0-9a-zA-Z)]|[\d(\d)]|[a-z]|[A-Z]|[0-9]){8,19}$/
        const boole = regular.test(value)
        if (!boole) {
          callback(new Error('必须为大小写字母、数字、键盘上的符号任意两者的组合'))
        } else {
          this.passwordBoolean = true
          callback()
        }
      }
    }
    var confirmPasswordValidator = (rule, value, callback) => {
      this.confirmPasswordShow = true
      this.confirmPasswordBoolean = false
      if (value === '') {
        callback(new Error('确认密码不能为空'))
      } else if (value !== this.form.password) {
        callback(new Error('两次密码不一致'))
      } else {
        this.confirmPasswordBoolean = true
        callback()
      }
    }
    return {
      editVisible: false,

      collapse: false,
      fullscreen: false,
      name: '',
      message: 2,
      navIndex: 0,
      items: [],

      // -------------修改密码弹框 start
      form: USER_ALTER,
      rules: {
        lastPassword: [
          { required: true, message: '当前密码不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: passwordValidator}
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: confirmPasswordValidator}
        ]
      },
      // 图标
      passwordBoolean: false,
      confirmPasswordBoolean: false,

      // 图标 显示
      passwordShow: false,
      confirmPasswordShow: false
      // -------------修改密码弹框 end

    }
  },

  computed: {
    username () {
      let username = localStorage.getItem('lastLoginedUser')
      return username || this.name
    }
  },
  created () {
    this.initNavItems()
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  },
  methods: {

    initNavItems () {
      var self = this
      sysMenuService.findAll().then(resp => {
        if (resp.data.status === 1) {
          self.items = resp.data.data

          self.$nextTick(() => {
            self.changeSubMenu(0)
          })
        }
      })
    },
    changeSubMenu (index) {
      bus.$emit('CHANGE_SUB_MENU', this.items[index].children || [])
    },
    // 用户名下拉菜单选择事件
    loginout () {
      log.doLogout().then(res => {
        if (res.status === 200) {
          localStorage.removeItem('lastLoginedUser')
          this.$router.push('/login')
        }
      })
    },
    // 全屏事件
    handleFullScreen () {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    changeNav (index) {
      this.navIndex = index
      this.changeSubMenu(index)
    },
    // --------------- 新加项 start
    handleClose (done) {
      done()
      this.$refs.ValidateForm.resetFields()
      this.clearForm()
    },
    // 清空表单
    clearForm () {
      this.form.password = '',
      this.form.confirmPassword = '',
      this.form.lastPassword = '',

      // 图标 更换
      this.passwordBoolean = false,
      this.confirmPasswordBoolean = false,
      // 图标 显示
      this.lastPasswordShow = false,
      this.passwordShow = false,
      this.confirmPasswordShow = false
    },
    // ================修改弹框 start
    // 修改密码 触发按钮
    modifiedData () {
      this.visible = false
      this.form.userName = this.userName
      this.editVisible = true
      this.clearForm()
    },
    // 修改用户资料
    alterUserData () {
      this.$refs['ValidateForm'].validate((valid) => {
        if (valid) {
          sysUser.updataPassword(this.form).then(res => {
            if (res.data.status === 1) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.editVisible = false
              let _this = this
              setTimeout(function () {
                _this.loginout()
                localStorage.removeItem('lastLoginedUser')
                _this.$router.push('/login')
              }, 3000)
            } else {
              this.$message.error(res.data.msg)
            }
          })
          return true
        } else {
          return false
        }
      })
    },
    cancel () {
      this.$refs.ValidateForm.resetFields()
      this.editVisible = false
      this.clearForm()
    },
    // ================修改弹框 end
    // ---------------- 新增项 end
  }
}
</script>
<style scoped>
    .header {
        position: absolute;
        box-sizing: border-box;
        right: 0;
        top: 0;
        left: 220px;
        height: 40px;
        border-bottom:1px solid #e8e2e2;
        font-size: 22px;
        color: #333333;
        -webkit-transition: left .3s ease-in-out;
        transition: left .3s ease-in-out;
        z-index: 110;
    }
    .header-menu {
      width:130px;height:40px;
    }
    .header-menu-item:hover {
      cursor: pointer;
      background-color: #eeeeee;
    }
    .header-menu-item {
      width:130px;height:40px;
    }
    .header-right{
        padding-right:20px;
    }
    .header-user-con{
        display: flex;
        height: 40px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .item-text {
      font-size: 16px;
      color: #333333;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #333333;
    }
    .btn-bell .el-icon-bell{
        color: #333333;
    }
    .user-avator{
        margin-left: 20px;
        float: left;
    }
    .loginout{
      font-size: 14px;
      color:#C0C4CC;
      text-decoration:underline;
      cursor: pointer
    }
    .user-avator img{
        display: block;
        width:30px;
        height:30px;
        border-radius: 50%;
        margin-right:7px;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .header-name-part {
      flex-direction:column;justify-content: flex-start;display:flex;color:#333333;align-items: flex-end;margin-left: 10px;
    }
    .part-top {
      font-size:14px;color: #909399;
    }
    .part-bottom {
      font-size:14px;color: #7E7E7E
    }
    .n-icon {

      color:#909399;
      margin-left: 5px;
      margin-right: 5px;
      font-size:18px;
    }
    .nav-actived .n-icon{
      color: #409EFF;
    }
    .header-menu-item .nav-item-actived {
      color: #409EFF;
    }
    .header-menu-item .nav-item-unactive {
      color: #909399;
    }
</style>
