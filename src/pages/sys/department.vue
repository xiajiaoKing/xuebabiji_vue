<template>
  <div class="app-container">
    <el-tree
      :data="datas"
      :props="defaultProps"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-plus"
            class="green"
            @click="() => handleAdd(node,data)">
            添加下级
          </el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            :disabled="data.id==='' || !data.id"
            @click="() => handleEdit(node,data)">
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            class="red"
            :disabled="data.id==='' || !data.id"
            @click="() => handleRemove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <!-- 编辑弹出框 -->
    <el-dialog :title="title" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="上级名称">
          <el-input v-model="parentName" :disabled="true"></el-input>
        </el-form-item>

        <!--<el-form-item label="类型" v-show="showTeamOrJob"  required >-->
          <!--<el-select v-model="showType" placeholder="请选择" >-->
              <!--<el-option-->
                <!--label="班组"-->
                <!--:value="3">-->
              <!--</el-option>-->
              <!--<el-option-->
                <!--label="岗位"-->
                <!--:value="4">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->

      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
import sysDepartmentService from '@/services/sys/department.js'

const DEPARTMENT_MODEL = {
  id: '',
  parentId: 'ROOT',
  name: '',
  type: null,
  children: []
}
const EXCLUDE_FIELDS = {
  'children': 1,
  'parent': 1,
  'updateTime': 1,
  'createTime': 1
}
export default {
  name: 'departmentPage',
  data () {
    return {
      datas: [],
      form: JSON.parse(JSON.stringify(DEPARTMENT_MODEL)),
      editVisible: false,
      delVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      parentName: '',
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      // 是否展示 让他选择 班组 岗位
      showTeamOrJob: false,
      // 第三方的 type
      showType: '',
      title: ''

    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      var self = this
      sysDepartmentService.findAll().then((resp) => {
        if (resp.data.status === 1) {
          var rootNode = Object.assign({}, DEPARTMENT_MODEL)
          rootNode.name = '根节点'
          rootNode.id = 'ROOT'
          rootNode.children = resp.data.data
          self.datas = [rootNode]
        }
      })
    },
    // 保存部门
    saveEdit () {
      if (this.showType !== null && this.showType !== '') {
        this.form.type = this.showType
      }
      if (this.form.type === 3 && (this.showType === null || this.showType === '')) {
        this.$message.error('请选择类型！')
        return false
      }
      var self = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var obj = {}
          for (var p in this.form) {
            !EXCLUDE_FIELDS[p] && (obj[p] = this.form[p])
          }
          sysDepartmentService.save(obj).then((resp) => {
            if (resp.data.status === 1) {
              self.$message({
                message: '保存部门成功',
                type: 'success'
              })
              this.showType = ''// 重置
              this.editVisible = false
              this.loadData()
            }
          })
          return true
        } else {
          return false
        }
      })
    },
    deleteRow () {
      sysDepartmentService.remove(this.form.id).then(() => {
        this.$message({
          message: '删除部门成功',
          type: 'success'
        })
        this.delVisible = false
        this.loadData()
      })
    },
    // 添加下级
    handleAdd (node, data) {
      this.title = '添加'
      this.showType = ''
      this.form = JSON.parse(JSON.stringify(DEPARTMENT_MODEL))
      this.$nextTick(() => {
        if (data.type === null) {
          data.type = 0
        }
        this.form.parentId = data.id
        this.parentName = data.name
        this.form.type = data.type + 1
        // 如果添加下级的时候，是班组岗位的话
        if (this.form.type === 3) {
          this.showTeamOrJob = true
          this.showType = 3
        } else {
          this.showTeamOrJob = false
        }
        this.editVisible = true
      })
    },
    handleEdit (node, data) {
      this.title = '编辑'
      sysDepartmentService.get(data.id).then(res => {
        this.form = res.data.data
        this.parentName = node.parent.data.name
        this.editVisible = true
      })
    },
    handleRemove (node, data) {
      this.form = data
      this.delVisible = true
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
</style>
