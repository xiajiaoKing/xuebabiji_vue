<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
        <el-dialog title="修改账户密码" :before-close="handleClose" :visible.sync="editVisible" width="35%" :modal-append-to-body="false" @close="cancel(status)">
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
          <el-button @click="cancel(status)">取 消</el-button>
          <el-button type="primary" @click="alterUserData">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
import loginService from '../../services/login.js'
import vHead from './Header.vue'
import vSidebar from './Sidebar.vue'
import vTags from './Tags.vue'
import bus from './bus'
import sysUser from '@/services/sys/user.js'

const USER_ALTER = {
  password: '',
  confirmPassword: '',
  lastPassword: ''
}
export default {
  data () {
    var lastPasswordValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入当前密码'))
      } else {
        callback()
      }
    }
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
      tagsList: [],
      collapse: false,
      editVisible: false,
      status: false,
      // -------------修改密码弹框 start
      form: USER_ALTER,
      rules: {
        lastPassword: [
          { required: true, trigger: 'blur', validator: lastPasswordValidator }
        ],
        password: [
          { required: true, trigger: 'blur', validator: passwordValidator}
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: confirmPasswordValidator}
        ]
      },
      // 图标
      lastPasswordBoolean: false,
      passwordBoolean: false,
      confirmPasswordBoolean: false,

      // 图标 显示
      lastPasswordShow: false,
      passwordShow: false,
      confirmPasswordShow: false,
      // -------------修改密码弹框 end
      // ----------- 定时器属性 start
      timer: ''
      // ----------- 定时器属性 end
    }
  },
  components: {
    vHead, vSidebar, vTags
  },
  created () {
    this.timer = setInterval(this.expireFlagCookie, 1000)
    bus.$on('collapse', msg => {
      this.collapse = msg
    })

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      let arr = []
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name)
      }
      this.tagsList = arr
    })
    loginService.getStatus().then(res => {
      if (res.data.status === 1) {
        this.$confirm(res.data.data, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.modifiedData()
        }).catch(() => {
          this.loginout()
        })
      } else {
      }
    }).catch(error => {
      if (error.response.status === 401) {
        this.$message.error('没有操作权限,请重新登录')
      } else if (error.response.status === 403) {
        this.$message.error('服务器拒绝访问')
      } else if (error.response.status === 504) {
        this.$message.error('服务器连接异常')
      }
    })
  },
  methods: {
    handleClose (done) {
      done()
      this.$refs.ValidateForm.resetFields()
      this.clearForm()
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
              this.status = true
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
    cancel (val) {
      if (!val) {
        this.$refs.ValidateForm.resetFields()
        this.editVisible = false
        this.clearForm()
        let _this = this
        setTimeout(function () {
          _this.loginout()
        }, 3000)
        this.$message({
          message: '您未修改密码，请重新登录后修改',
          type: 'error'
        })
      } else {}
    },
    // ================修改弹框 end
    // 清空表单
    clearForm () {
      this.form.userName = '',
      this.form.realName = '',
      this.form.password = '',
      this.form.confirmPassword = '',
      this.form.lastPassword = '',

      // 图标 更换
      this.lastPasswordBoolean = false,
      this.passwordBoolean = false,
      this.confirmPasswordBoolean = false,
      // 图标 显示
      this.lastPasswordShow = false,
      this.passwordShow = false,
      this.confirmPasswordShow = false
    },
    loginout () {
      loginService.doLogout().then(res => {
        if (res.status === 200) {
          localStorage.removeItem('lastLoginedUser')
          this.$router.push('/login')
        }
      })
    },
    // ================= 判断cookie start
    expireFlagCookie () {
      if (!this.$cookies.isKey('expireFlag')) {
        this.loginout()
      }
    }
    // ================= 判断cookie end
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
