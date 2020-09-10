<template>
  <div class="hello">
    <el-row :gutter="20">
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
    <div>
      <i class="el-icon-edit"></i>
      <i class="el-icon-share"></i>
      <i class="el-icon-delete"></i>
      <el-button type="primary" icon="el-icon-search">搜索</el-button>
    </div>
    <div>
      <el-input v-model="loginInfoVo.username" placeholder="账号"></el-input>
      <el-input v-model="loginInfoVo.password" placeholder="密码"></el-input>
      <el-button type="primary" v-on:click="login" round>登录</el-button>
      登录验证情况：<textarea cols="30" rows="10" v-model="responseResult"></textarea>
    </div>
     <input type="button" v-on:click="a=!a" v-bind:class="{changeColor:a,changeWidth:a}" value="change!">
		 <el-row>
  <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
  <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
  <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
</el-row>
  </div>

</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      loginInfoVo: { username: '', password: '' },
      responseResult: [],
      a: false
    }
  },
  methods: {
    login () {
      // var Qs = require('Qs')
      this.$axios
        .post('/api/login', this.$qs.stringify({
          username: this.loginInfoVo.username,
          password: this.loginInfoVo.password
        }))
        .then(successResponse => {
          this.responseResult = JSON.stringify(successResponse.data)
          if (successResponse.data.status === 1) {
            alert('成功')
          }
        })
        .catch(failResponse => {})
    }
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .changeColor{
    background: brown;
    color: #ffffff;
  }
  .changeWidth{
    width: 200px;
  }
</style>
