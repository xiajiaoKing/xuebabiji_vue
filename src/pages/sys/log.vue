<template>
  <div>
    <div class="table">
      <!--查询条件-->
      <div style="margin: 15px 0">
        <el-form :model="obj" :inline="true" class="demo-form-inline">
          <el-form-item label="日期">
            <el-date-picker
              v-model="obj.date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="账号">
            <el-input maxlength="25" size="small" v-model="obj.userName" placeholder="请输入" class="handle-input mr5"></el-input>
          </el-form-item>
          <el-form-item label="IP地址">
            <el-input maxlength="25" size="small" v-model="obj.logIp" placeholder="请输入" class="handle-input mr5"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" v-on:click='reset()'>重置</el-button>
            <el-button type="primary" size="mini" v-on:click="selectResult">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main">
      <l-table
        :data="tabData"
        :label="data_label"
        :total="total"
        :loading="loading"
        :page_sizes="[10,20,30,40]"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange">
      </l-table>
    </div>
  </div>
</template>

<script>
import lTable from '../../components/lTable'
import serve from '../../services/sys/log.js'
export default {
  name: '',
  data () {
    return {
      obj: {
        userName: '',
        date: '', // 时间
        logIp: '',
        // iDisplayStart: '',
        // iDisplayLength: ''
      },
      currentPage: 1,
      pagesize: 10,
      loading: false,
      total: 1,
      data: [],
      data_label: [
        { prop: 'createTime', label: '日期' },
        { prop: 'userName', label: '登录账号' },
        { prop: 'logType', label: '登录类型' },
        { prop: 'logIp', label: '登录IP' },
        { prop: 'message', label: '日志详情' }
      ],
      tabData: []
    }
  },
  created () {
    // serve.getAllUserLog().then(res => {
    //   this.getData(res.data.data.list)
    //   this.total = res.data.data.total
    // })
    this.selectResult()
  },
  methods: {
    reset () {
      this.obj.userName = ''
      this.obj.date = ''
      this.obj.logIp = ''
    },
    selectResult () {
      this.obj.iDisplayStart = 1
      this.obj.iDisplayLength = 10
      var n = this.obj
      // this.obj.createTimea=this.obj.createTime;
      serve.getSelectResult(n).then(res => {
        this.getData(res.data.data.list)
        this.total = res.data.data.total
        this.PageSize = 10
        this.currentPage = 1
      })
    },
    getData (data) {
      var tabData = []
      for (var i = 0; i < data.length; i++) {
        var time = new Date(data[i].createTime)
        var month = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
        var day = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()
        var hour = time.getHours() >= 10 ? time.getHours() : '0' + time.getHours()
        var min = time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes()
        var second = time.getSeconds() >= 10 ? time.getSeconds() : '0' + time.getSeconds()
        var timea = time.getFullYear() + '-' + month + '-' + day + hour + ':' + min + ':' + second
        var a = {'userName': data[i].userName,
					       'createTime': data[i].createTime,
								 'logType': data[i].logType,
								 'logIp': data[i].logIp,
								 'message': data[i].message
					      }
				  tabData.push(a)
      }
      this.tabData = tabData
    },
    // 每页显示的条数
    handleSizeChange (val) {
      // 改变每页显示的条数
      this.PageSize = val
      // 点击每页显示的条数时，显示第一页
      this.currentPage = 1
      this.getPage(1, val)
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
    },
    // 显示第几页
    handleCurrentChange (val) {
      // 改变默认的页数
      this.currentPage = (val)
      // 切换页码时，要获取每页显示的条数
      this.getPage(this.currentPage, this.pagesize)
    },
    getPage (iDisplayStart, iDisplayLength) {
      this.obj.iDisplayStart = iDisplayStart
      this.obj.iDisplayLength = iDisplayLength
      serve.getSelectResult(this.obj).then(res => {
        this.getData(res.data.data.list)
        this.total = res.data.data.total
      })
    },
    filterInput (val) {
      // 这里过滤的是除了英文字母和数字的其他字符
      return val.replace(/[^A-z0-9]/, '')
    }
  },
  components: {
    lTable
  }
}
</script>

<style scoped>
  .main {
    margin-top: 10px;
    background: #fff;
    height: 580px
  }
</style>
