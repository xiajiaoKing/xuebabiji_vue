<template>
  <div class="l_miam">
    <div class="login_bg" >
      <div class="header-title">
          <!--<img class="ll_img_left" src="./images/login/logo.png" />-->
        <h3>{{applicationName}}</h3>
      </div>
     <div class="login_box">
         <div class="login_left">
             <img class="ll_img_left1" src="./images/login/mian_left.png" />
              <div class="l_login">

              <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="demo-ruleForm">
                <el-form-item  prop="username">
                  <el-input prefix-icon="el-icon-user" v-model="ruleForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input  prefix-icon="el-icon-lock" type="password" v-model="ruleForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-input prefix-icon="el-icon-circle-check" v-model="ruleForm.code" placeholder="验证码" @keyup.enter.native="loginEnter('ruleForm')">
                  </el-input>
                  <a  v-on:click="getCode"><img class="ll_code" :src="codeUrl" /></a>

                </el-form-item>
                <el-form-item>
                  <div class="btnmargin">
                    <p v-text="msg" style="color:red;height:32px"></p>
                    <el-button type="primary" id="sumbitBtn" @click="submitForm('ruleForm')" @keyup.enter.native="loginEnter('ruleForm')" style="font-size: 18px ">登录</el-button>
                  </div>
                </el-form-item>
              </el-form>

  </div>
        </div>
    </div>
    </div>
    </div>
</template>

<script>
import loginService from '@/services/login.js'
import AppConfig from '../../AppConfig'

const USER_MODEL = {
  username: '',
  password: '',
  code: ''
}

export default {
  name: 'Login',
  data () {
    return {
      applicationName: AppConfig.applicationName,
      ruleForm: USER_MODEL,
      box: 'll_box',
      msg: '',
      margin: 'margin-top:40px',
      jLogin: '',
      codeUrl: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { max: 20, message: '长度为20个字符', trigger: 'blur'}
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { max: 4, message: '长度为4个字符', trigger: 'blur'}

        ]
      }
    }
  },
  mounted: function () {
    this.ruleForm.username = localStorage.getItem('lastLoginedUser') || ''
    this.ruleForm.code = ''
    this.getCode()
    this.clearForm()
  },
  created () {

  },
  methods: {
    // 登录请求
    // handleUsernameInput(e) {
    //   this.user.username = e.target.value.replace(/[^\d]/g,'');
    // },

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const {username, password, code} = this.ruleForm
          loginService.doLogin(username, password, code)
            .then(successResponse => {
              // this.responseResult = JSON.stringify(successResponse.data)
              if (successResponse.data.status === 1) {
                localStorage.setItem('lastLoginedUser', username)
                // alert(successResponse.data.msg)
                this.$router.push({
                  path: '/dashboard'
                })
              } else {
                this.msg = successResponse.data.data.msg
                setTimeout(() => {
                  this.msg = ''
                }, 3000)
                this.getCode()
                this.ruleForm.code = ''
              }
            }).catch(error => {
              if (error.response.status === 403) {
                this.$message.error('服务器拒绝访问')
              } else if (error.response.status === 504) {
                this.$message.error('服务器连接异常')
              }
            })
        } else {
          return false
        }
      })
    },
    loginEnter (formName) {
      this.submitForm(formName)
    },

    clearForm () {
      this.ruleForm.username = '',
      this.ruleForm.password = '',
      this.ruleForm.code = ''
    },
    // 获取验证码
    getCode () {
      this.codeUrl = loginService.getVerifyCode()
    }
  }
}
</script>

<style scoped>
 @import "./css/login.css";

</style>

