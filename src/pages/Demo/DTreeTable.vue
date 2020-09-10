<template>
  <div class="app-container">
    <tree-table :data="datas" :columns="columns" border>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="50px">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
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
import treeTable from '@/components/TreeTable'
import sysMenuService from '@/services/sys/menu.js'

const MENU_MODEL = {
  id: '',
  createTime: '',
  createUserId: '',
  updateTime: '',
  updateUserId: null,
  parentId: 'ROOT',
  name: '用车管理',
  type: null,
  url: '',
  visible: 1,
  icon: 'fa-codepen',
  sort: 1,
  remark: '',
  children: []
}

export default {
  name: 'treeTableDemo',
  components: { treeTable },
  data () {
    return {
      columns: [
        {
          text: '菜单名称',
          value: 'name',
          width: 300
        },
        {
          text: '图标',
          value: 'icon'
        },
        {
          text: '路径',
          value: 'url'
        }, {
          text: '备注',
          value: 'remark'
        }
      ],
      datas: [],
      form: MENU_MODEL,
      editVisible: false,
      delVisible: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      var self = this
      sysMenuService.findAll().then((resp) => {
        if (resp.data.status === 1) {
          self.datas = resp.data.data
        }
      })
    },
    saveEdit () {
      var self = this
      sysMenuService.save(self.form).then((resp) => {
        if (resp.data.status === 1) {
          this.$message({
            message: '保存菜单成功',
            type: 'success'
          })
        }
      })
    },
    deleteRow () {
      sysMenuService.remove(this.form.id).then(() => {
        this.$message({
          message: '删除菜单成功',
          type: 'success'
        })
        this.delVisible = false
        this.loadData()
      })
    },
    handleEdit (index, row) {
      this.form = row
      this.editVisible = true
    },
    handleDelete (index, row) {
      this.delVisible = true
      this.form = row
    }
  }
}
</script>
