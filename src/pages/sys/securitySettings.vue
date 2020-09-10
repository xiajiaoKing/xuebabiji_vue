<template>
  <div class="app-container">
    <div class="form-page">
      <el-form ref="form"  :model="form" label-width="100px" id="form">
        <el-form-item label="密码更改周期" >
          <el-radio-group v-model="form.period">
            <el-radio :label="'90'">90天</el-radio>
            <el-radio :label="'60'">60天</el-radio>
            <el-radio :label="'30'">30天</el-radio>
            <el-radio :label="'0'">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码登录限制">
          <el-radio-group v-model="form.astrict">
            <el-radio :label="'3,15'">连续错3次,锁定账户15分钟</el-radio>
            <el-radio :label="'5,30'">连续错5次,锁定账户30分钟</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="闲置时间设置">
          <el-radio-group v-model="form.leaveUnused">
            <el-radio  :label="'30'">空闲30分钟，系统默认用户自动退出</el-radio>
            <el-radio  :label="'0'">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset()">重置</el-button>
          <el-button type="primary" @click="securitySubmit()">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import security from '@/services/sys/securitySetting'

// form表单
const SECURITY_SETTING = {
  period: '90',
  astrict: '3,15',
  leaveUnused: '30'
}
export default {
  name: 'departmentPage',
  data () {
    return {
      securitylist: [],
      form: SECURITY_SETTING
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      security.find().then(res => {
        if (res.data.status === 1) {
          var value = res.data.data
          for (var i = 0; i < value.length; i++) {
            if (value[i].securitySettingKeys === 'leave_unused') {
              this.form.leaveUnused = value[i].securitySettingValues
            }
            if (value[i].securitySettingKeys === 'password_astrict') {
              this.form.astrict = value[i].securitySettingValues
            }
            if (value[i].securitySettingKeys === 'password_period') {
              this.form.period = value[i].securitySettingValues
            }
          }
        } else {
          this.securitySubmit()
        }
      })
    },
    securitySubmit () {
      this.securitylist = [
        {
          securitySettingKeys: 'leave_unused',
          securitySettingValues: this.form.leaveUnused
        }, {
          securitySettingKeys: 'password_astrict',
          securitySettingValues: this.form.astrict
        }, {
          securitySettingKeys: 'password_period',
          securitySettingValues: this.form.period
        }
      ]
      security.alter(this.securitylist).then(res => {
        if (res.data.status === 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 重置
    reset () {
      this.form.period = '90'
      this.form.astrict = '3,15'
      this.form.leaveUnused = '30'
    }
  }

}
</script>
<style scope>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    margin: 10px 0;
  }
  .app-container {
    width: 50%;
  }
  .red{
    color: #ff0000;
  }
  .green {
    color: #2ecc71;
  }
  .form-page{
    padding-left: 52px;
  }
  #form .el-form-item{
    padding-top: 42px;
  }
</style>
