// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import './directives.js'
import 'font-awesome/css/font-awesome.min.css'
import "./assets/icon-font/iconfont.css";
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import './assets/css/icon.css'

// import './assets/css/theme-green/index.css';       // 浅绿色主题
import VueWechatTitle from 'vue-wechat-title'
import VideoPlayer from 'vue-video-player'
import VueCookies from 'vue-cookies'
import './http'

Vue.use(VideoPlayer)
Vue.use(VueCookies)

Vue.use(VXETable)
/* 引入elementUI */
Vue.use(ElementUI, {
  size: 'small'
})

Vue.config.productionTip = false

Vue.use(VueWechatTitle)

// require('./mock');
// router.beforeEnter((to,form,next) => {
// 	if(to.meta.title){
// 		document.title = to.meta.title
// 	}
// 	next()
// })

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
