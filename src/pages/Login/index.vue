<template>
  <div class="container">
    <div class="login-panel">
      <div class="img-class">图片</div>
      <div class="login-form-wrapper">
        <div class="login-form-title">
          用户登录
        </div>
        <div class="login-form">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="demo-ruleForm">
            <el-form-item  prop="username" class="my-form-item">
              <el-input prefix-icon="iconfont icon-touxiang" v-model="ruleForm.username" autocomplete="off" size="large" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <hr class="grey-hr"></hr>
            <el-form-item prop="password" class="my-form-item">
              <el-input  prefix-icon="iconfont icon-suo" type="password" v-model="ruleForm.password" autocomplete="off" size="large" placeholder="请输入密码"></el-input>
            </el-form-item>
            <hr class="grey-hr"></hr>
            <el-form-item prop="code" class="my-form-item">
              <el-input prefix-icon="iconfont icon-anquan" v-model="ruleForm.code" placeholder="验证码" style="width: calc(100% - 96px)" size="large" @keyup.enter.native="loginEnter('ruleForm')">
              </el-input>
              <div  v-on:click="getCode" class="my-form-item__code"><img alt="验证码" :src="codeUrl" /></div>
            </el-form-item>
            <hr class="grey-hr"></hr>
          </el-form>

          <div>
            <div v-text="msg" style="color:red;height:32px"></div>
            <div class="my-form-login">
              <el-button type="primary" class="my-form-login__button" @click="submitForm('ruleForm')" @keyup.enter.native="loginEnter('ruleForm')">登录</el-button>
            </div>
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
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {max: 20, message: '长度为20个字符', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {max: 4, message: '长度为4个字符', trigger: 'blur'}

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

  body {
    padding: 0;
    margin: 0;
  }
  .container {
    background: linear-gradient(to right bottom, #4A9DF2 50%, #FFF 50%);
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    border: white 0;
    border-radius: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-panel {
    min-height: 400px;
    min-width: 800px;
    height: 35vw;
    width: 70vw;
    background: white;
    border-radius: 1%;
    box-shadow: 1px 1px 3px 0 grey;
    display: flex;
    justify-content: space-between;

    /*文字不可选中*/
    -moz-user-select:none;/*火狐*/
    -webkit-user-select:none;/*webkit浏览器*/
    -ms-user-select:none;/*IE10*/
    -khtml-user-select:none;/*早期浏览器*/
    user-select:none;
  }
  .img-class {
    width: 50%;
    height: 100%;
    background-color: rgba(103, 224, 227, 0.5);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: white;
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  .login-form-wrapper {
    width: 50%;
    flex: 1 1 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
  }

  /*用户登录文本框*/
  .login-form-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    flex: 0.25 2 150px;
    font: calc(1rem + 1vw) bold;
  }
  .login-form {
    width: 70%;
    flex: 0.75 1 450px;
  }

  .my-form-item >>> .el-input__inner{
    border-width: 0;
  }
  .my-form-item {
    margin: calc(5px + 1vw) 0;
  }

  .grey-hr{
    background-color: #EFEFEF;
    height: 1px;
    border-style: none;
  }

  /*验证码*/
  .my-form-item__code {
    cursor: pointer;
    display: inline-block;
    float: right;
    width: 95px;
    height: 40px;
  }

  .my-form-item__code img{
    width: 95px;
    height: 40px;
  }

  .my-form-login {
    display: flex;
    padding-top: 5%;
    justify-content: center;
    width: 100%;
  }

  .my-form-login__button {
    width: 80%;
    font-size: calc(0.9rem + 0.1vw);
    padding: 16px 15px;
    border-radius: 80px;
  }
  /*表单样式*/
  .demo-ruleForm >>> .el-input{
    font-size: calc(0.9rem + 0.3vw);
  }

  .demo-ruleForm >>> .el-input__prefix .el-input__icon{
    font-size: calc(0.9rem + 0.3vw);
    color: #4A9DF2;
  }

  .demo-ruleForm >>> .el-form-item__error {
    font-size: calc(0.6rem + 0.2vw);
  }
</style>
