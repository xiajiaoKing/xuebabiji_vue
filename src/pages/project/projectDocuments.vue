<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="handleAdd">添加</el-button>
      </div>
      <div class="search-box" id="search-box">
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
          <el-form-item label="项目状态">
            <el-select v-model="searchFrom.projectStatus" placeholder="请选择" clearable>
              <el-option v-for="option in projectStatusOptions" :key="option.value" :label="option.label"
                         :value="option.value"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>

      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable"
                v-loading="loading"
                @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="70"></el-table-column>

        <el-table-column type="selection" width="55" label="选择"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" min-width="200"></el-table-column>
        <el-table-column prop="projectNumber" label="项目编号" width="150"></el-table-column>
        <el-table-column label="项目状态" width="150">
          <template slot-scope="scope">
            {{projectStatusLabel(scope.row.projectStatus)}}
          </template>
        </el-table-column>
        <el-table-column v-for="option in stageTypeOptions" :key="option.label" :label="option.label" align="center" width="110">
          <template v-slot="scope">
            <div :class="scope.row[option.field] > 0 ? 'has-doc' : 'empty-doc'" @click="clickToShowDocument(scope.row.projectId, option.value, scope.row[option.field])">{{scope.row[option.field] > 0 ?
              scope.row[option.field] : ''}}
            </div>
          </template>
        </el-table-column>
        <!--
        <el-table-column label="需求确认书" align="center" width="110">
          <template v-slot="scope">
            <div :class="scope.row.demandDocumentNum > 0 ? 'has-doc' : 'empty-doc'">{{scope.row.demandDocumentNum > 0 ? scope.row.demandDocumentNum : ''}}</div>
          </template>
        </el-table-column>
        <el-table-column label="报价文件" align="center" width="110">
          <template v-slot="scope">
            <div :class="scope.row.priceDocumentNum > 0 ? 'has-doc' : 'empty-doc'">{{scope.row.priceDocumentNum > 0 ? scope.row.priceDocumentNum : ''}}</div>
          </template>
        </el-table-column>
        <el-table-column label="设计界面" align="center" width="110">
          <template v-slot="scope">
            <div :class="scope.row.designDocumentNum > 0 ? 'has-doc' : 'empty-doc'">{{scope.row.designDocumentNum > 0 ? scope.row.designDocumentNum : ''}}</div>
          </template>
        </el-table-column>
        <el-table-column label="开发周期" align="center" width="110">
          <template v-slot="scope">
            <div :class="scope.row.developmentCycleNum > 0 ? 'has-doc' : 'empty-doc'">{{scope.row.developmentCycleNum > 0 ? scope.row.developmentCycleNum : ''}}</div>
          </template>
        </el-table-column>
        <el-table-column label="阶段性开发情况" align="center" width="110">
          <template v-slot="scope">
            <div :class="scope.row.developmentStageDocumentNum > 0 ? 'has-doc' : 'empty-doc'">{{scope.row.developmentStageDocumentNum > 0 ? scope.row.developmentStageDocumentNum : ''}}</div>
          </template>
        </el-table-column>-->
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
    <el-dialog v-dialogDrag title="添加" :visible.sync="editVisible" width="500px" @close="clearForm">
      <div class="form-wrapper">
        <el-form ref="createOrEditForm" :model="form" :rules="rules" label-width="100px" class="edit-form">
          <el-form-item label="项目名称" prop="id">
            <el-select v-model="form.id" @change="projectChange">
              <el-option v-for="option in projectListOptions" :key="option.id" :label="option.projectName"
                         :value="option.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="项目编号" prop="projectNumber">
            <el-input v-model="form.projectNumber" placeholder="请输入项目编号" disabled></el-input>
          </el-form-item>

          <el-form-item label="建设单位" prop="contractorUnit">
            <el-input v-model="form.contractorUnit" placeholder="请输入建设单位" disabled></el-input>
          </el-form-item>

          <el-form-item label="项目描述" prop="projectDesc">
            <el-input v-model="form.projectDesc" placeholder="请输入项目描述" type="textarea" :rows="3" disabled></el-input>
          </el-form-item>

          <el-form-item label="文档类型" prop="stageType">
            <el-select v-model="form.stageType" placeholder="请选择文档类型">
              <el-option v-for="option in stageTypeOptions" :key="option.value" :label="option.label"
                         :value="option.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-col :span="12">
              <el-upload
                :action="uploadUrl"
                :on-success="handlePdfUploadSuccess"
                multiple
                :on-remove="handlePdfRemove"
                :file-list="pdfFileList"
                accept=".pdf"
                :before-upload="handleOnlyPdf"
              >
                <el-button size="small" type="primary">pdf文件</el-button>
              </el-upload>
            </el-col>
            <el-col :span="12">
              <el-upload
                :action="uploadUrl"
                :on-success="handleOtherUploadSuccess"
                :on-remove="handleOtherRemove"
                :file-list="otherFileList"
                multiple
              >
                <el-button size="small" type="primary">非PDF文件</el-button>
              </el-upload>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 编辑弹出框 -->
    <el-dialog v-dialogDrag title="查看详情" :visible.sync="showDetailVisible" width="500px" @close="clearForm">
      <div class="detail-wrapper">
        <el-table :data="detailTableData" :header-cell-style="{'background-color': '#EFEFEF'}">
          <el-table-column type="index" label="序号"  align="center"/>
          <el-table-column prop="createTime" label="上传日期" align="center">
            <template v-slot="{row}">
              {{row.createTime.slice(0, 10)}}
            </template>
          </el-table-column>
          <el-table-column prop="createUserName" label="上传人" align="center"></el-table-column>
          <el-table-column prop="fileName" label="上传文件" min-width="150" align="center">
            <template v-slot="{row}">
              <a :href="url + row.fileUrl" target="_blank">{{row.fileName}}</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import documentService from '../../services/project/DocumentService'
import projectService from '../../services/project/ProjectService'
import domin from '@/domain'

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
  stageType: null
}

const SEARCH_FROM_MODEL = {
  projectName: '',
  year: '',
  projectStatus: ''
}

const PROJECT_STATUS_OPTIONS = [
  {value: 1, label: '未开工'},
  {value: 2, label: '进行中'},
  {value: 3, label: '已完工'},
  {value: 4, label: '已竣工'}
]

const STAGE_TYPE_OPTIONS = [
  {value: 1, label: '需求确认书', field: 'demandDocumentNum'},
  {value: 2, label: '报价文档', field: 'priceDocumentNum'},
  {value: 3, label: '设计界面', field: 'designDocumentNum'},
  {value: 4, label: '开发周期', field: 'developmentCycleNum'},
  {value: 5, label: '阶段性开发情况', field: 'developmentStageDocumentNum'}
]

const RULES = {
  id: [{required: true, message: '请选择项目', trigger: 'change'}],
  stageType: [{required: true, message: '请选择文档类型', trigger: 'change'}]
}

export default {
  name: 'project',
  data () {
    return {
      url: domin.url,
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
      stageTypeOptions: STAGE_TYPE_OPTIONS,

      // 文件
      uploadUrl: domin.url + '/file/upload',
      pdfFileList: [],
      otherFileList: [],

      // 查看详情
      showDetailVisible: false,
      detailTableData: []
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
      let pageBean = {pageNum: this.currentPage, limit: this.pageSize}
      documentService.listByProject(this.searchFrom, pageBean).then(res => {
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
    handleSubmit () {
      this.$refs['createOrEditForm'].validate((valid) => {
        if (valid) {
          let documents = []
          let pdfs = this.pdfFileList.map(f => ({
            projectId: this.form.id,
            fileType: 1, // 1代表pdf
            stageType: this.form.stageType,
            fileUrl: f.url,
            fileName: f.name
          }))
          documents = documents.concat(pdfs)
          let others = this.otherFileList.map(f => ({
            projectId: this.form.id,
            fileType: 2, // 2代表其他文件
            stageType: this.form.stageType,
            fileUrl: f.url,
            fileName: f.name
          }))
          documents = documents.concat(others)
          if (documents.length === 0) {
            this.$message.warning('请上传文件')
            return false
          }
          documentService.createDocuments(documents).then(res => {
            if (this.showResponseMsg(res)) {
              this.editVisible = false
              this.getData() // 刷新表
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

    /**
       * 文件上传
       */
    handlePdfUploadSuccess (response, file, fileList) {
      if (response.status !== 1) {
        this.$message.error(response.msg)
        let idx = fileList.indexOf(file)
        if (idx !== -1) {
          fileList.splice(idx, 1)
        }
      } else {
        this.pdfFileList = this._getOuterFileList(fileList)
      }
    },
    _getOuterFileList (fileList) {
      return fileList.map(f => {
        if (f.name && f.url) {
          return f
        } else {
          let data = f.response.data
          return {name: data.fileName, url: data.fileUrl, id: data.id}
        }
      })
    },

    handlePdfRemove (file, fileList) {
      this.pdfFileList = this._getOuterFileList(fileList)
    },
    /**
       * 限制只能上传pdf
       * @param file
       */
    handleOnlyPdf (file) {
      let isPdf = file.name && file.name.toLowerCase().endsWith('.pdf')
      if (!isPdf) {
        this.$message.warning('只能上传pdf')
      }
      return isPdf
    },

    /**
       * 其他文件上传
       */
    handleOtherUploadSuccess (response, file, fileList) {
      if (response.status !== 1) {
        this.$message.error(response.msg)
        let idx = fileList.indexOf(file)
        if (idx !== -1) {
          fileList.splice(idx, 1)
        }
      } else {
        this.otherFileList = this._getOuterFileList(fileList)
      }
    },

    handleOtherRemove (file, fileList) {
      this.otherFileList = this._getOuterFileList(fileList)
    },

    // 清除表单
    clearForm () {
      this.pdfFileList = []
      this.otherFileList = []
      this.form = this.deepCopy(FORM_MODEL)
    },

    clickToShowDocument (projectId, stageType, docNum) {
      if (docNum === 0) {
        return
      }

      documentService.findByProjectAndStage(projectId, stageType).then(res => {
        if (this.isResponseErrorAndTip(res)) {
          this.detailTableData = res.data.data
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
    width: 400px;
    margin: auto;
    padding-right: 100px;
  }

  .form-wrapper {
    margin-bottom: 50px;
  }

  .has-doc {
    background-color: #409EFF;
    color: white;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .empty-doc {
    background-color: #C0C4CC;
    color: #C0C4CC;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin: auto;
  }

  .detail-wrapper {
    padding: 0 20px 50px 20px;
  }
</style>
