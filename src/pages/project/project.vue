<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-button type="success" @click="handleEdit">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
        <el-button type="export" @click="handleExport">导出</el-button>
      </div>
      <div class="search-box" id="search-box" >
        <!-- 项目名称 -->
        <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
          <el-form-item label="项目名称">
            <el-input v-model="searchFrom.projectName" placeholder="点击输入"></el-input>
          </el-form-item>
          <el-form-item label="归属年份">
            <el-date-picker
              v-model="searchFrom.year"
              type="year"
              value-format="yyyy"
              placeholder="请选择年份">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目编号">
            <el-input v-model="searchFrom.projectNumber" placeholder="点击输入"></el-input>
          </el-form-item>
          <el-form-item label="项目状态">
            <el-select v-model="searchFrom.projectStatus" placeholder="请选择" clearable>
              <el-option v-for="option in projectStatusOptions" :key="option.value" :label="option.label" :value="option.value" />
            </el-select>
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
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column prop="year" label="归属年份" width="80">
          <template v-slot="{row}">{{row.year}}年</template>
        </el-table-column>
        <el-table-column prop="projectNumber" label="项目编号" min-width="120"></el-table-column>
        <el-table-column prop="contractorUnit" label="建设单位" min-width="120"></el-table-column>
        <el-table-column label="项目描述" min-width="120">
          <template v-slot="{row}">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="row.projectDesc">
              <span slot="reference" style="overflow: hidden; white-space: nowrap" v-text="row.projectDesc"></span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="contractorManager" label="建设单位负责人" min-width="120"></el-table-column>
        <el-table-column prop="managerMobile" label="建设单位负责人联系电话" min-width="120"></el-table-column>
        <el-table-column label="项目状态" min-width="100">
          <template slot-scope="scope">
            {{projectStatusLabel(scope.row.projectStatus)}}
          </template>
        </el-table-column>
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
    <el-dialog v-dialogDrag :title="form.id === '' ? '新增' : '编辑'" :visible.sync="editVisible" width="700px">
      <div class="form-wrapper">
        <el-form ref="createOrEditForm" :model="form" :rules="rules" label-width="170px" class="edit-form">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="form.projectName" placeholder="请输入项目名称"></el-input>
          </el-form-item>

          <el-form-item label="归属年份" prop="year">
            <el-input v-model.number="form.year" placeholder="请输入归属年份"></el-input>
          </el-form-item>

          <el-form-item label="项目编号" prop="projectNumber">
            <el-input v-model="form.projectNumber" placeholder="请输入项目编号"></el-input>
          </el-form-item>

          <el-form-item label="建设单位" prop="contractorUnit">
            <el-input v-model="form.contractorUnit" placeholder="请输入建设单位"></el-input>
          </el-form-item>

          <el-form-item label="建设单位负责人" prop="contractorManager">
            <el-input v-model="form.contractorManager" placeholder="请输入建设单位负责人"></el-input>
          </el-form-item>

          <el-form-item label="建设单位负责人联系电话" prop="managerMobile">
            <el-input v-model="form.managerMobile" placeholder="请输入建设单位负责人联系电话"></el-input>
          </el-form-item>

          <el-form-item label="项目状态" prop="projectStatus">
            <el-select v-model="form.projectStatus" placeholder="请选择">
              <el-option v-for="option in projectStatusOptions" :key="option.value" :label="option.label" :value="option.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="项目描述" prop="projectDesc">
            <el-input v-model="form.projectDesc" placeholder="请输入项目描述" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import projectService from '../../services/project/ProjectService'

const FORM_MODEL = {
  id: '',
  projectName: '',
  year: '',
  projectNumber: '',
  contractorUnit: '',
  contractorManager: '',
  managerMobile: '',
  projectStatus: '',
  projectDesc: ''
}

const SEARCH_FROM_MODEL = {
  projectName: '',
  year: '',
  projectNumber: '',
  projectStatus: ''
}

const PROJECT_STATUS_OPTIONS = [
  {value: 1, label: '未开工'},
  {value: 2, label: '进行中'},
  {value: 3, label: '已完工'},
  {value: 4, label: '已竣工'}
]

const RULES = {
  projectName: [
    { required: true, message: '请输入项目名称' },
    { max: 30, message: '长度在30个字符以内' }
  ],
  year: [
    { required: true, message: '请输入所属年份' },
    { type: 'number', message: '年龄必须为数字值' },
    { type: 'number', min: 1990, max: 2100, message: '取值在1990-2100之间' }
  ],
  projectNumber: [
    { required: true, message: '请输入项目编号' },
    { max: 20, message: '长度在20个字符以内' }
  ],
  contractorUnit: [
    { required: true, message: '请输入建设单位' },
    { max: 30, message: '长度在30个字符以内' }
  ],
  contractorManager: [
    { required: true, message: '请输入建设单位负责人' },
    { max: 10, message: '长度在10个字符以内' }
  ],
  managerMobile: [
    { required: true, message: '请输入建设单位负责人联系电话' },
    // eslint-disable-next-line standard/object-curly-even-spacing
    { max: 15, message: '长度在15个字符以内'}
  ],
  projectStatus: [
    { required: true, message: '请选择项目状态' }
  ],
  projectDesc: [
    { required: true, message: '请输入项目描述' },
    { max: 255, message: '长度在155个字符以内' }
  ]
}

export default {
  name: 'project',
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
    }
  },
  created () {
    this.getData()
  },
  methods: {
    deepCopy (obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    // 获取表格数据
    getData () {
      this.loading = true
      projectService.likeSearchPage(this.searchFrom, this.currentPage, this.pageSize).then(res => {
        if (this.isResponseErrorAndTip(res)) {
          this.tableData = res.data.data.list
          this.currentPage = res.data.pageNum
          this.total = res.data.total
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
    },
    handleEdit () {
      let selectNum = this.multipleSelection.length
      if (selectNum === 0) {
        this.$message.warning('请选择要编辑的记录')
        return
      } else if (selectNum > 1) {
        this.$message.warning('只能选择一条记录进行编辑')
        return
      }
      let id = this.multipleSelection[0].id
      projectService.get(id).then(res => {
        if (this.isResponseErrorAndTip(res)) {
          this.form = res.data.data
          this.editVisible = true
          this.getData()
        }
      })
    },
    handleExport () {
      projectService.exportExcel(this.searchFrom)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 保存编辑
    saveOrUpdate () {
      this.$refs['createOrEditForm'].validate((valid) => {
        if (valid) {
          projectService.createOrUpdate(this.form).then(res => {
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

    handleDelete () {
      let selectNum = this.multipleSelection.length
      if (selectNum === 0) {
        this.$message.warning('请选择要删除的记录')
        return
      }
      let ids = this.multipleSelection.map(row => row.id).join(',')
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => projectService.batchDeleteByIds(ids))
        .then(res => {
          if (this.showResponseMsg(res)) {
            this.getData()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    projectStatusLabel (projectStatus) {
      for (let option of this.projectStatusOptions) {
        if (option.value === projectStatus) {
          return option.label
        }
      }
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

</style>
