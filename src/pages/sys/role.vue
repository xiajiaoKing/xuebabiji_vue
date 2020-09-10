<template>
  <div class="table">
    <div class>
      <div class="add-container mbt1020">
        <p class="label-p">基础操作</p>
        <el-button type="primary" @click="handleEdit">新增</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>

      <div class="content-center">
        <el-table
          :data="tableData"
          class="table"
          ref="multipleTable"
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="roleCode" label="角色名" width="200"></el-table-column>
          <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="success" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="primary" @click="handleRoleMenus(scope.$index, scope.row)">菜单权限</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="page_obj.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog :title="title" :before-close="handleClose" :closeOnClickModal="false" :visible.sync="editVisible" width="40%">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色编号" prop="roleCode">
          <el-input v-model="form.roleCode"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRuleForm">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="菜单授权" :closeOnClickModal="false" :visible.sync="menuVisible" width="40%">
      <el-tree
        ref="tree"
        :data="menus"
        :props="menuProps"
        default-expand-all
        highlight-current
        show-checkbox
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="menuVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import server from '../../services/sys/system'

const ROLE_MODEL = {
  id: '',
  roleCode: '',
  roleName: '',
  remark: ''
}

function treeToPath (tree) {
  var arr = []
  for (var i in tree) {
    if (tree[i].children && tree[i].children.length) {
      arr = arr.concat(treeToPath(tree[i].children))
    }
    arr.push(tree[i].id)
  }
  return arr
}

export default {
  name: 'basetable',
  data () {
    return {
      url: '@/mock/vuetable.json',
      total: 0,
      tableData: [],
      loading: false,
      multipleSelection: [],
      del_list: [],
      is_search: false,
      editVisible: false,
      pageSizes: [10, 20, 30, 40, 50],
      currentPage: 1,
      delVisible: false,
      title: '新增角色',
      form: JSON.parse(JSON.stringify(ROLE_MODEL)),
      idx: -1,
      roleId: '',
      roleMenus: [],
      menus: [],
      menuVisible: false,
      rules: {
        roleCode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      menuProps: {
        children: 'children',
        label: 'name'
      },
      tabPosition: 'left',
      entire_array: [], // 要设置的节点数组
      fujiid: [],
      ids: [],
      // 获取角色列表字段
      page_obj: {
        pageNum: 1,
        limit: 10,
        roleCode: '',
        roleName: ''
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    handleClose (done) {
      done()
      this.cancelRuleForm()
    },
    /** 获取已经选择节点 */
    getCheckedNodes () {
      this.ids = []
      this.fujiid = []
      // 获取勾选节点
      // 遍历
      this.$refs.tree.getCheckedNodes().forEach(e => {
        this.ids.push(e.parentId)
        this.ids.push(e.id)
      })
      // 去重
      this.ids = this.ids.filter(function (item, index, arr) {
        // 当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
        return arr.indexOf(item, 0) === index
      })
      // 合并数组
      // let b = this.fujiid.concat(this.ids);
      server
        .role_saveMenu(this.roleId, this.ids.join(','))
        .then(resp => {
          if (resp.data.status) {
            this.$message.success(resp.data.msg || '保存角色菜单授权成功')
            this.menuVisible = false
          } else {
            this.$message.error(resp.data.msg || '保存角色菜单授权失败')
          }
        })
        .catch(() => {
          this.$message.error('保存角色菜单授权失败')
        })
    },
    handleRoleMenus (index, row) {
      this.menuVisible = true
      this.entire_array = []
      setTimeout(() => {
        // 角色id
        this.roleId = row.id
        // 这是去请求该角色的的权限数据
        server.roleList(row.id).then(resp => {
          if (resp.data.status && resp.data.data !== null) {
            resp.data.data.forEach(item => {
              if (item.selected === true) {
                if (item.children !== null) {
                  item.children.forEach(item2 => {
                    if (item2.selected === true) {
                      if (item2.children !== null) {
                        item2.children.forEach(item3 => {
                          if (item3.selected === true) {
                            this.entire_array.push(item3.id)
                          }
                        })
                      } else {
                        this.entire_array.push(item2.id)
                      }
                    }
                  })
                }
              }
            })
          }
          // 设置勾选
          this.$refs.tree.setCheckedKeys(this.entire_array)
        })
      }, 200)
    },

    // 选择显示条数
    handleSizeChange (val) {
      this.page_obj.limit = val
      this.getData()
    },
    // 点击页数
    handleCurrentChange (val) {
      this.page_obj.pageNum = val
      this.getData()
    },
    // 获取 easy-mock 的模拟数据
    getData () {
      this.loading = true
      // this.cur_page, 10, this.cond_roleCode, this.cond_roleName
      server.role_page(this.page_obj).then(resp => {
        const { list, total } = resp.data.data
        this.tableData = list
        this.total = total
      })
      server.role_findAll().then(resp => {
        if (resp.data.status) {
          let rootNode = { id: 'ROOT', name: '全部' }
          rootNode.children = resp.data.data
          this.menus = [rootNode]
          this.loading = false
        }
      })
    },
    handleEdit (index, row) {
      this.editVisible = true
      if (row) {
        this.title = '编辑角色'
        this.idx = index
        const item = this.tableData[index]
        let obj = {}
        for (let p in ROLE_MODEL) {
          obj[p] = item[p]
        }
        this.form = obj
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate()
        })
      } else {
        this.form = JSON.parse(JSON.stringify(ROLE_MODEL))
        this.title = '新增角色'
      }
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
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let obj = {}
          for (let p in ROLE_MODEL) {
            obj[p] = this.form[p]
          }
          server.role_save(obj).then(resp => {
            if (resp.data.status === 1) {
              this.$message.success('保存角色信息成功')
              this.editVisible = false
              this.$nextTick(() => {
                this.$refs.ruleForm.resetFields()
              })
              this.form = JSON.parse(JSON.stringify(ROLE_MODEL))
              this.getData()
            } else {
              this.$message.error(resp.data.msg || '保存角色信息失败')
            }
          })
          return true
        } else {
          return false
        }
      })
    },

    handleDelete () {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择一个角色进行删除',
          type: 'warning'
        })
        return
      }
      if (this.multipleSelection.length > 1) {
        this.$message({
          message: '只能选择一个角色进行删除',
          type: 'warning'
        })
        return
      }
      this.delVisible = true
    },
    // 确定删除
    deleteRow () {
      server.role_del(this.multipleSelection[0].id).then(resp => {
        if (resp.data.status) {
          this.$message.success(resp.data.msg || '已成功删除该角色')
          this.delVisible = false
          this.getData()
        } else {
          this.$message.error(resp.data.msg || '删除角色失败')
        }
      })
    },
    cancelRuleForm () {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
      this.form = JSON.parse(JSON.stringify(ROLE_MODEL))
      this.editVisible = false
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
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.mr10 {
  margin-right: 10px;
}

.label-p {
  color: #c0c4cc;
  font-size: 12px;
  margin: 10px 0;
}

.blue {
  color: #3498db;
}
/deep/ .el-table .cell{
  padding-right: 0px
}
</style>
