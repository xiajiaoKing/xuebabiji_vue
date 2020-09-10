<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="handleAdd">添加</el-button>
      </div>
      <div class="search-box" id="search-box" >
        <!-- 项目名称 -->
        <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
          <el-form-item label="项目名称">
            <el-input v-model="searchFrom.projectName" placeholder="点击输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>

      </div>
      <el-table :data="tableData" class="table" ref="multipleTable"
                v-loading="loading"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" label="选择"></el-table-column>
        <el-table-column type="index" label="序号" width="120" align="center"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" width="240"></el-table-column>
        <el-table-column prop="funCount" label="项目功能"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog v-dialogDrag title="添加" :visible.sync="editVisible" width="700px">
      <div class="form-wrapper">
        <el-form ref="createOrEditForm" :model="form" :rules="rules" label-width="100px" class="edit-form">
          <el-form-item class="grey-Label" label="项目名称" prop="projectId">
            <el-select v-model="form.projectId" @change="projectChange" style="width: 240px">
              <el-option v-for="(option, index) in projectListOptions" :key="index" :label="option.projectName"
                         :value="option.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button plain style="color: #AADD92; background-color: #EEF8E8;" @click="addModel">添加模块</el-button>
            <el-button v-show="modelChecked && modelChecked.length > 0" type="text" style="color: #F56C6C" @click="confirmDelModel">删除</el-button>
          </el-form-item>
          <el-checkbox-group v-model="modelChecked">
            <el-form-item v-for="(fun, index) in form.functions" :key="index">
              <function-item :fun="fun" :on-delete="onDelete"></function-item>
              <template v-slot:label>
                <el-checkbox class="model-checkbox" :label="index"></el-checkbox>
              </template>
            </el-form-item>
          </el-checkbox-group>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import projectService from '../../services/project/ProjectService'
import tbFunctionService from '../../services/project/TbFunctionService'
import FunctionItem from './components/FunctionItem'

const FORM_MODEL = {
  projectId: '',
  functions: []
}

const SEARCH_FROM_MODEL = {
  projectName: ''
}

const PROJECT_STATUS_OPTIONS = [
  {value: 1, label: '未开工'},
  {value: 2, label: '进行中'},
  {value: 3, label: '已完工'},
  {value: 4, label: '已竣工'}
]

const RULES = {
  projectId: [{required: true, message: '请选择项目'}]
}

export default {
  components: {
    FunctionItem
  },
  data () {
    return {
      form: this.deepCopy(FORM_MODEL),
      searchFrom: SEARCH_FROM_MODEL,
      tableData: [],
      loading: false,
      multipleSelection: [],
      editVisible: false,
      delVisible: false,
      rules: RULES,
      // 分页
      total: 0,
      pageSize: 10,
      currentPage: 1,

      // 下拉数据
      projectStatusOptions: PROJECT_STATUS_OPTIONS,
      projectListOptions: [],

      // 查看详情
      showDetailVisible: false,
      detailTableData: [],
      projectData: {},
      // 编辑框
      deleteIds: [],
      modelChecked: []
    }
  },
  created () {
    this.getData()
    this.init()
  },
  methods: {
    deepCopy (obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    init () {
      projectService.findAll().then(res => {
        if (this.isResponseErrorAndTip(res)) {
          this.projectListOptions = res.data.data
        }
      })
    },
    // 获取表格数据
    getData () {
      this.loading = true
      tbFunctionService.listData(this.searchFrom, {pageNum: this.currentPage, limit: this.pageSize}).then(res => {
        if (this.isResponseErrorAndTip(res)) {
          this.tableData = res.data.data.list
          this.currentPage = res.data.pageNum
          this.loading = false
        }
      })
    },
    isResponseErrorAndTip (res) {
      if (res.data.status === 1) {
        return true
      } else {
        this.$message.error(res.data.msg)
        return false
      }
    },
    showResponseMsg (res) {
      let bool = this.isResponseErrorAndTip(res)
      if (bool) {
        this.$message.success(res.data.msg)
      }
      return bool
    },
    // 分页导航
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    search () {
      this.currentPage = 1
      this.getData()
    },
    handleAdd () {
      this.form = this.deepCopy(FORM_MODEL)
      this.editVisible = true
      this.deleteIds = []
      this.modelChecked = []
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 保存编辑
    saveChange () {
      this.$refs['createOrEditForm'].validate((valid) => {
        if (valid) {
          let form = this.deepCopy(this.form)
          // 校验
          for (let i = 0; i < this.form.functions.length; i++) {
            let fun = form.functions[i]
            delete fun.visible
            let children = fun.children
            if (fun.name === '') {
              this.$message.warning('存在模块为空')
              return false
            }
            if (children && children.length > 0) {
              for (let j = 0; j < children.length; j++) {
                let sub = children[j]
                if (sub.name === '' || sub.name === undefined) {
                  this.$message.warning(`${fun.name}存在功能为空`)
                  return false
                }
              }
            }
          }
          form.deleteIds = this.deleteIds
          tbFunctionService.saveChange(form).then(res => {
            if (this.showResponseMsg(res)) {
              this.editVisible = false
              this.getData()
            }
          })
        } else {
          return false
        }
      })
    },
    projectStatusLabel (projectStatus) {
      for (let option of this.projectStatusOptions) {
        if (option.value === projectStatus) {
          return option.label
        }
      }
    },

    onDelete (item) {
      if (item.id) {
        this.deleteIds.push(item.id)
      }
    },

    addModel () {
      if (this.form.projectId) {
        this.form.functions.forEach(fun => {
          fun.visible = false
        })
        this.form.functions.push({id: '', name: '', parentId: 'ROOT', children: [], visible: false})
      } else {
        this.$message.warning('请选择项目')
      }
    },
    confirmDelModel () {
      this.$confirm('此操作将永久删除该模块和已添加功能，是否继续？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delModel()
      })
    },
    delModel () {
      this.modelChecked.sort()
      for (let i = this.modelChecked.length - 1; i >= 0; i--) {
        let index = this.modelChecked[i]
        let items = this.form.functions.splice(index, 1)
        if (this.onDelete) {
          this.onDelete(items[0])
        }
      }
      this.modelChecked = []
    },


    /**
     * 带出项目信息
     */
    projectChange (val) {
      if (!val) {
        this.form = this.deepCopy(FORM_MODEL)
        return
      }
      tbFunctionService.getFunByProject(val).then(res => {
        if (this.isResponseErrorAndTip(res)) {
          let form = res.data.data
          // 增加visible属性
          form.functions.forEach(fun => {
            fun.visible = false
          })

          this.form = form
        }
      })
    }
  }
}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }
  .edit-form {
    width: 500px;
    margin: auto;
    padding-right: 100px;
  }
  .list-item {
    margin: 0 0 7px 0;
  }

  .grey-Label >>> .el-form-item__label{
    color: #9B9B9B;
  }

  .form-wrapper {
    min-height: 200px;
    max-height: 60vh;
    overflow: auto;
  }

  /*模块前复选框*/
  /*去除标签*/
  .model-checkbox >>> .el-checkbox__label {
    display: none;
  }

  .model-checkbox >>> .el-checkbox__inner {
    border-radius: 50%;
  }
</style>
