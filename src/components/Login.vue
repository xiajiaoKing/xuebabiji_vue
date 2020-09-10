<template>
	<div class="l_miam">
		<div class="l_logo">
			<img class="ll_img" src="./images/login/logo.gif" />
		</div>
		<div class="l_top_right">
			<img class="ltr_img" src="./images/login/ellipse.png" />
		</div>
		<div class="l_middle">
			<div class="lm_left">
				<img class="lm_l_img" src="./images/login/mian_left.png" />
			</div>
			<div class="lm_right">
				<div class="l_login">
					<div :class="[box,box_username]">
						<img src="./images/login/username.png" />
						<input v-model="user.username" type="text" placeholder="请输入手机号码" />
					</div>
					<div :class="[box,box_password]">
						<img src="./images/login/password.png" />
						<input v-model="user.password" type="password" placeholder="请输入密码" />
					</div>
					<div :class="[box,box_code]">
						<img src="./images/login/code.png" />
						<input v-model="user.code" type="text" placeholder="验证码" />
						<a v-on:click="getCode"><img class="ll_code" :src="codeUrl" /></a>
					</div>
					<div class="ll_bottom">
						<p v-text="msg"></p>
						<button v-on:click="login" type="button" :class="[bLogin,jLogin]" :disabled="isdisabled">登&nbsp;录</button>
					</div>
				</div>
			</div>
		</div>
		<div class="l_bottom">
			<img class="lb_img" src="./images/login/bottom.png" />
		</div>
	</div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      user: {
        username: '',
        password: '',
        code: ''
      },
      box: 'll_box',
      box_username: '',
      box_password: '',
      box_code: '',
      msg: '',
      bLogin: 'll_botton',
      jLogin: '',
      codeUrl: ''
    }
  },
  mounted: function () {
    this.getCode()
  },
  methods: {
    // 登录请求
    login () {
      this.$axios
        .post(domain.url + '/loginCheck', this.$qs.stringify({
          username: this.user.username,
          password: this.user.password,
          code: this.user.code
        }))
        .then(successResponse => {
          // this.responseResult = JSON.stringify(successResponse.data)
          if (successResponse.data.status === 1) {
            // alert(successResponse.data.msg)
            this.$router.push({
              path: domain.url + successResponse.data.data
            })
          } else {
            // 							this.msg = successResponse.data.data.msg;
            this.updateBoxB(successResponse.data.data.type, successResponse.data.data.msg)
            this.deleteBoxB(successResponse.data.data.type)
            this.getCode()
            this.user.code = ''
          }
        })
        .catch(failResponse => {})
    },
    // 获取验证码
    getCode () {
      this.codeUrl = domain.url + '/getCode?date=' + Math.random()
    },
    // 下划线变红色
    updateBoxB (type, msg) {
      if (type == 1) {
        this.box_username = 'll_box_b'
      } else if (type == 2) {
        this.box_password = 'll_box_b'
      } else if (type == 3) {
        this.box_code = 'll_box_b'
      }
      this.msg = msg
    },
    // 3秒后下划线复原
    deleteBoxB (type) {
      setTimeout(() => {
        if (type == 1) {
          this.box_username = ''
        } else if (type == 2) {
          this.box_password = ''
        } else if (type == 3) {
          this.box_code = ''
        }
        this.msg = ''
      }, 3000)
    }
  },
  computed: {
    // 监控按钮 判断按钮是否能点击
    isdisabled () {
      if (this.user.username != '' && this.user.password != '' && this.user.code != '') {
        return false
      }
      return true
    }
  },
  watch: {
    // 监控按钮,并改变按钮样式  蓝色:可点击  天蓝色:不可点击
    user: {
      handler: function (val, oldval) {
        if (val.username != '' && val.password != '' && val.code != '') {
          this.jLogin = 'll_bottom_b'
        } else {
          this.jLogin = ''
        }
      },
      deep: true
    }
  }
}
</script>

<style>
	@import "./css/login.css";
</style>
