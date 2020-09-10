<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" @click="handleEdit(0)">添加</el-button>
        <el-button type="success" icon="el-icon-edit-outline" @click="handleEdit(1)">编辑</el-button>
        <!--<el-button type="warning" icon="el-icon-remove-outline" @click="">停用</el-button>-->
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
        <el-button type="success" icon="el-icon-remove-outline" @click="initPasswordClick">初始化密码</el-button>
        <!--<el-button type="primary" icon="add" @click="handleEdit">新增</el-button>-->
        <!--<el-input v-model="cond_userName" placeholder="用户名" class="handle-input mr5"></el-input>-->
        <!--<el-input v-model="cond_realName" placeholder="真实姓名" class="handle-input mr5"></el-input>-->
        <!--<el-button type="default" icon="search" @click="search">搜索</el-button>-->
        <!--<el-button type="info" icon="reset" @click="reset">重置</el-button>-->
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable"

                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0,0,0,0.1)"
                @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="70"></el-table-column>

        <el-table-column type="selection" width="55" header-align="center"  align="center" label="选择"></el-table-column>
        <!--<el-table-column prop="" label="用户头像" width="120"></el-table-column>-->
        <el-table-column prop="realName" label="真实姓名"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="120"></el-table-column>
        <el-table-column prop="roles" label="用户角色"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <!--<el-table-column prop="" label="公司"></el-table-column>-->
        <el-table-column prop="department" label="部门"></el-table-column>
        <el-table-column prop="email" label="用户状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.userStatus===1?'success':'danger'">{{scope.row.userStatus===1?'启用':'停用'}}</el-tag>
          </template>
        </el-table-column>
        <!--<el-table-column prop="email" label="是否单点登录" align="center" width="70">-->
          <!--<template slot-scope="scope">-->
            <!--<el-tag :type="scope.row.userStatus===1?'success':'danger'">{{scope.row.userStatus===1?'启用':'停用'}}</el-tag>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog v-dialogDrag :title="title" :before-close="handleClose" :visible.sync="editVisible" width="30%">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="title!=='编辑'" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" v-if="title!=='编辑'" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" :disabled="!form.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleIdArr">
          <el-select v-model="form.roleIdArr" @change="roleIdArrChange" multiple placeholder="请选择角色">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <select-tree v-model="form.departmentId" :options="departs" :props="selectTreeProps" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            style="display: block;margin-top: 5px;"
            v-model="form.userStatusSwitch"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="停用">
          </el-switch>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="delVisible"
      width="30%">
      <span>删除不可恢复，是否确定删除？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delVisible = false">取 消</el-button>
    <el-button type="primary" @click="deleteRow">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import sysUserService from '@/services/sys/user'
import sysRoleService from '@/services/sys/role'
import sysDepartmentService from '@/services/sys/department'
import SelectTree from '@/components/SelectTree.vue'

const USER_MODEL = {
  id: '',
  userName: '',
  realName: '',
  password: '',
  phone: '',
  email: '',
  remark: '',
  departmentId: '',
  imageUrl: '',
  userStatus: 1,
  roleIds: '',
  confirmPassword: '',
  userStatusSwitch: false
}

const selectTreeProps = {
  parent: 'parentId', // 父级唯一标识
  value: 'id', // 唯一标识
  label: 'name', // 标签显示
  children: 'children' // 子级
}

export default {
  name: 'basetable',
  components: {
    SelectTree
  },
  data () {
    var passwordValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 8 || value.length > 19) {
        callback(new Error('密码长度8~19位'))
      } else {
        const regular = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\d(\d)])+$)([^(0-9a-zA-Z)]|[\d(\d)]|[a-z]|[A-Z]|[0-9]){8,19}$/
        const boole = regular.test(value)
        if (!boole) {
          callback(new Error('必须为大小写字母、数字、键盘上的符号任意两者的组合'))
        } else {
          callback()
        }
      }
    }
    var confirmPasswordValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认密码不能为空'))
      } else if (value !== this.form.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      url: '@/mock/vuetable.json',
      total: 0,
      tableData: [],
      cur_page: 1,
      loading: false,
      multipleSelection: [],
      cond_realName: '',
      cond_userName: '',
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      form: JSON.parse(JSON.stringify(USER_MODEL)),
      idx: -1,
      options: [],
      departs: [],
      selectTreeProps,
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        roleIdArr: [
          { required: true, message: '请选择用户角色', trigger: 'blur' }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur,change'
          }
        ],
        password: [
          { required: true, trigger: 'blur', validator: passwordValidator}
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: confirmPasswordValidator}
        ]
      },
      title: '' // 标题
    }
  },
  created () {
    this.getData()
  },
  methods: {
    handleClose (done) {
      done()
      this.$refs.ruleForm.resetFields()
      this.form = JSON.parse(JSON.stringify(USER_MODEL))
    },
    // 分页导航
    handleCurrentChange (val) {
      this.cur_page = val
      this.getData()
    },
    // 获取 easy-mock 的模拟数据
    getData () {
      var departMap = {}
      var roleMap = {}
      this.loading = true
      sysDepartmentService.findAll().then(resp => {
        if (resp.data.status === 1) {
          this.departs = resp.data.data
        }
      })
      sysDepartmentService
        .page(1, 10000)
        .then(resp => {
          if (resp.data.status === 1) {
            const { list } = resp.data.data
            for (var i in list) {
              departMap[list[i].id] = list[i].name
            }
            return sysRoleService.findAll()
          }
        })
        .then(resp => {
          this.loading = false
          const list = resp.data.data
          this.options = []
          list.forEach(e => {
            this.options.push({
              value: e.id,
              label: e.roleName
            })
            roleMap[e.id] = e.roleName
          })
        })
        .then(() => {
          // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
          sysUserService
            .page(this.cur_page, 10, this.cond_userName, this.cond_realName)
            .then(resp => {
              if (resp.data.status === 1) {
                const { list, total } = resp.data.data
                list.forEach(e => {
                  if (e.roleIds && e.roleIds !== '') {
                    var roleIds = e.roleIds.split(',')
                    var roles = roleIds.map(r => {
                      return roleMap[r]
                    })
                    e.roles = roles.join(',')
                  }
                  e.department = departMap[e.departmentId] || ''
                })
                this.tableData = list
                this.total = total
              }
            })
        })
    },
    reset () {
      this.cur_page = 1
      this.cond_userName = ''
      this.cond_realName = ''
      this.getData()
    },
    search () {
      this.cur_page = 1
      this.getData()
    },
    formatter (row, column) {
      return row.address
    },
    filterTag (value, row) {
      return row.tag === value
    },
    handleEdit (sign) {
      if (sign === 0) {
        this.title = '添加'
        this.form = JSON.parse(JSON.stringify(USER_MODEL))
        this.editVisible = true
      } else {
        this.title = '编辑'
        if (this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择一个用户进行编辑',
            type: 'warning'
          })
          return
        }
        if (this.multipleSelection.length > 1) {
          this.$message({
            message: '只能选择一个用户进行编辑',
            type: 'warning'
          })
          return
        }
        var multipleSelection = this.multipleSelection[0]
        // debugger
        var obj = {}
        for (var p in USER_MODEL) {
          obj[p] = multipleSelection[p]
        }
        obj.userStatusSwitch = !!obj.userStatus
        this.form = obj
        this.form.roleIdArr = obj.roleIds.split(',')
        this.editVisible = true
      }
      this.form.password = ''
      this.form.confirmPassword = ''
    },
    handleDelete (index, row) {
      this.idx = index
      this.delVisible = true
    },
    delAll () {
      const length = this.multipleSelection.length
      let str = ''
      this.del_list = this.del_list.concat(this.multipleSelection)
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' '
      }
      this.$message.error('删除了' + str)
      this.multipleSelection = []
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 保存编辑
    saveEdit () {
      if (this.form.password && this.form.password !== '') {
        if (!this.form.confirmPassword || this.form.confirmPassword === '') {
          this.$message.error('改写密码时请填写确认密码')
          return
        } else if (this.form.password !== this.form.confirmPassword) {
          this.$message.error('两次填写的密码不匹配')
          return
        }
      }
      var _this = this
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          var obj = {}
          for (var p in USER_MODEL) {
            obj[p] = this.form[p]
          }
          obj.roleIds = (_this.form.roleIdArr || []).join(',')
          obj.userStatus = obj.userStatusSwitch ? 1 : 0
          sysUserService.save(obj).then(resp => {
            if (resp.data.status === 1) {
              this.$message.success('保存用户信息成功')
              this.editVisible = false
              this.getData()
            } else {
              this.$message.error(resp.data.msg || '保存用户信息失败')
            }
          })
          return true
        } else {
          return false
        }
      })
    },
    // 确定删除
    deleteRow () {
      var ids = ''
      for (var i = 0; i < this.multipleSelection.length; i++) {
        ids += this.multipleSelection[i].id + ','
      }
      if (ids.length > 0) {
        ids = ids.substr(0, ids.length - 1)
      }
      sysUserService.batchRemove(ids).then(resp => {
        if (resp.data.status) {
          this.$message.success('已成功删除用户')
          this.delVisible = false
          this.getData()
        } else {
          this.$message.error(resp.data.msg || '删除用户失败')
        }
      })
    },
    // 初始化密码
    initPasswordClick () {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择一个用户进行编辑',
          type: 'warning'
        })
        return
      }
      if (this.multipleSelection.length > 1) {
        this.$message({
          message: '只能选择一个用户进行编辑',
          type: 'warning'
        })
      }
      sysUserService.initPassword(this.multipleSelection[0].id).then(res =>{
        if (res.data.status === 1){
          this.$message.success(res.data.msg)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // change --->
    roleIdArrChange () {
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
.handle-select {
  width: 120px;
}

.handle-input {
  width: 150px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  height: 100%;
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
  /deep/ .el-table__body, .el-table__footer, .el-table__header{
    text-align-last: center
  }
  /deep/ .el-table__header {
    text-align-last: center;
  }
</style>
