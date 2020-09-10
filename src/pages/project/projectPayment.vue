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
          <el-form-item label="归属年份">
            <el-date-picker
              v-model="searchFrom.year"
              type="year"
              value-format="yyyy"
              placeholder="请选择年份">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>

      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0,0,0,0.1)"
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
        <el-table-column
          fixed="right"
          label="项目总额"
          align="center"
          prop="totalMoney"
          width="100">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="实际已收"
          align="center"
          width="100">
          <template v-slot="{row}">
            <span v-if="row.paidMoney === 0">{{row.paidMoney}}</span>
            <span v-else @click="clickToShowPayments(row.projectId)" style="text-decoration: underline;text-decoration-thickness: 5px;text-underline: #4A9DF2; color: #4A9DF2; cursor: pointer"> {{row.paidMoney}}</span>
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
    <el-dialog v-dialogDrag title="添加收款" :visible.sync="editVisible" width="700px">
      <div class="form-wrapper">
        <el-form ref="createOrEditForm" :model="form" :rules="rules" label-width="170px" class="edit-form">
          <el-form-item label="项目名称" prop="id">
            <el-select v-model="form.id" @change="projectChange">
              <el-option v-for="option in projectListOptions" :key="option.id" :label="option.projectName"
                         :value="option.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="项目编号" prop="projectNumber">
            <el-input v-model="form.projectNumber" placeholder="" disabled></el-input>
          </el-form-item>

          <el-form-item label="建设单位" prop="contractorUnit">
            <el-input v-model="form.contractorUnit" placeholder="" disabled></el-input>
          </el-form-item>

          <el-form-item label="项目描述" prop="projectDesc">
            <el-input v-model="form.projectDesc" placeholder="" type="textarea" :rows="3" disabled></el-input>
          </el-form-item>

          <el-form-item label="收款金额" prop="money">
            <el-input v-model="form.money" placeholder="点击输入"></el-input>
          </el-form-item>

          <el-form-item label="收款日期" prop="payDate">
            <el-date-picker
              v-model="form.payDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 编辑弹出框 -->
    <el-dialog v-dialogDrag title="查看详情：" :visible.sync="showDetailVisible" width="500px" @close="clearForm" >
      <div class="detail-wrapper">
        <div style="margin-bottom: 20px">
          <div class="list-item">项目名称：{{projectData.projectName}}</div>
          <div class="list-item">项目编号：{{projectData.projectNumber}}</div>
          <div class="list-item">
            项目总额：<span style="color: #FC6264">{{projectData.totalMoney}}</span>
          </div>
        </div>
        <el-table :data="detailTableData" :header-cell-style="{'background-color': '#EFEFEF'}" max-height="300">
          <el-table-column type="index" label="序号"  align="center"/>
          <el-table-column prop="money" label="已收金额" align="center"></el-table-column>
          <el-table-column prop="payDate" label="收款日期" min-width="150" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import projectService from '../../services/project/ProjectService'
import paymentService from '../../services/project/PaymentService'

const FORM_MODEL = {
  id: '',
  projectName: '',
  year: '',
  projectNumber: '',
  contractorUnit: '',
  contractorManager: '',
  managerMobile: '',
  projectStatus: '',
  projectDesc: '',
  money: null,
  payDate: null
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
  id: [{required: true, message: '请选择项目', trigger: 'change'}],
  money: [
    {required: true, message: '请输入收款金额', trigger: 'change'},
    { pattern: /^\d+(\.\d*)?$/, message: '必须为数字值' },
    { pattern: /^\d+(\.\d{0,2})?$/, message: '最多精确到两位小数' },
    { pattern: /^[1-9]\d{0,9}(\.\d*)?$/, message: '数字超过范围' },
  ],
  payDate: [{required: true, message: '请输入收款日期', trigger: 'change'}]
}

export default {
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
      projectData: {}
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
      paymentService.listByProject(this.searchFrom, {pageNum: this.currentPage, limit: this.pageSize}).then(res => {
        if (this.isResponseErrorAndTip(res)) {
          this.tableData = res.data.data.list
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
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 保存编辑
    saveOrUpdate () {
      this.$refs['createOrEditForm'].validate((valid) => {
        if (valid) {
          let {id, money, payDate} = this.form
          let form = {projectId: id, money, payDate}
          paymentService.createOrUpdate(form).then(res => {
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

    /**
     * 带出项目信息
     */
    projectChange (val) {
      if (!val) {
        this.form = this.deepCopy(FORM_MODEL)
        return
      }
      projectService.get(val).then(res => {
        if (this.isResponseErrorAndTip(res)) {
          this.form = Object.assign(this.form, res.data.data)
        }
      })
    },

    clickToShowPayments (projectId) {
      paymentService.getProjectWithPayDetail(projectId).then(res => {
        if (this.isResponseErrorAndTip(res)) {
          this.detailTableData = res.data.data.payments
          this.projectData = res.data.data
          this.showDetailVisible = true
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
</style>
