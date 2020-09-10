<template>
  <div class="table">
    <div class>
      <div class="add-container mbt1020">
        <p class="label-p">基础操作</p>
        <el-button type="primary" @click="handleEdit">新增</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" :inline="true">

        <el-form-item label="学生名称"   label-width="150px"  >
          <el-input v-model="page_obj.studentName"></el-input>
        </el-form-item>

        <el-form-item label="电话"   label-width="150px">
          <el-input v-model="page_obj.phone"></el-input>
        </el-form-item>

        <el-form-item label="录取分数线(大于)"   label-width="150px">
          <el-input v-model="page_obj.enrollmentScore"></el-input>
        </el-form-item>

        <el-button @click="cancelSearchParms">重 置</el-button>
        <el-button type="primary" @click="searchParms">搜 索</el-button>

      </el-form>

      <div>


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
          <el-table-column prop="studentName" label="学生名称" width="200"></el-table-column>
          <el-table-column prop="toSchoolName" label="被录取学校" width="200"></el-table-column>
          <el-table-column prop="enrollmentScore" label="录取分数" width="200"></el-table-column>
          <el-table-column prop="fromSchoolName" label="来自那个院校"></el-table-column>
          <el-table-column prop="phone" label="电话" width="200"></el-table-column>
          <el-table-column prop="subject" label="科目（文科理科）"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>

          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="success" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

        <el-form-item label="学生名称"   label-width="150px">
          <el-input v-model="form.studentName"></el-input>
        </el-form-item>
        <el-form-item label="科目（文科理科）"   label-width="150px">
          <el-input v-model="form.subject"></el-input>
        </el-form-item>

        <el-form-item label="录取分数"  label-width="150px">
          <el-input v-model="form.enrollmentScore"></el-input>
        </el-form-item>

        <el-form-item label="被录取学校名称" label-width="150px">
          <el-input v-model="form.toSchoolName"></el-input>
        </el-form-item>

        <el-form-item label="来自那个院校"  label-width="150px">
          <el-input v-model="form.fromSchoolName"></el-input>
        </el-form-item>
        <el-form-item label="电话"  label-width="150px">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>

        <el-form-item label="备注"  label-width="150px">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>

        <el-form-item label="录取图片"  label-width="150px">
          <el-upload
            action="http://localhost:9999/api/file/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="enrollmentPicUploadSuccess"
            :file-list = "enPicList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRuleForm">取 消</el-button>
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
import notesJs from './js/notes'

const ROLE_MODEL = {
  id:'',
  studentName: '',
  subject: '',
  enrollmentScore:'',
  toSchoolName: '',
  fromSchoolName: '',
  phone: '',
  remark: '',
  enrollmentPicArg: [],
  enrollmentPic:'',
  enrollmentId:[]
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
        roleName: '',
        studentName: '',
        phone: '',
        enrollmentScore: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      enPicList:[]
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


    // 获取 笔记level list
    getData () {
      this.loading = true
      // this.cur_page, 10, this.cond_roleCode, this.cond_roleName
      notesJs.findStudentList(this.page_obj).then(resp => {
        const { list, total } = resp.data.data
        this.tableData = list
        this.total = total
        this.loading = false
      })
    },




    handleEdit (index, row) {
      var that = this
      this.editVisible = true
      if (row) {
        this.title = '编辑学生信息'

        notesJs.getStudentMsg(row.id).then(resp => {
          const bean = resp.data.data
          this.form = bean
          this.enPicList = []
          for(var i=0;i<bean.enrollmentPicArg.length;i++){
            this.enPicList.push({
              'name': bean.enrollmentPicArg[i].fileName,
              'uid': bean.enrollmentPicArg[i].id,
              'url': bean.enrollmentPicArg[i].fileUrl
            })
            //that.form.enrollmentId.push(bean.enrollmentPicArg[i].id)
          }

          this.getData()
          console.log("========",this.enPicList)
        })



      } else {
        this.form.enrollmentPicArg = []
        this.form.enrollmentPic = ''
        this.enPicList = []

        this.form = JSON.parse(JSON.stringify(ROLE_MODEL))
        this.title = '新增学生信息'
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

      var that = this;
      this.$refs['ruleForm'].validate(valid => {

        that.form.enrollmentPic = that.form.enrollmentId.join()
        that.form.enrollmentPicArg = []

        if (valid) {
          let obj = {}
          for (let p in ROLE_MODEL) {
            obj[p] = this.form[p]
          }

          notesJs.createOrEditForStudentMsg(obj).then(resp => {
            if (resp.data.status === 1) {
              this.$message.success('保存 学生信息 成功')
              this.editVisible = false
              this.$nextTick(() => {
                this.$refs.ruleForm.resetFields()
              })
              this.form = JSON.parse(JSON.stringify(ROLE_MODEL))
              this.getData()
            } else {
              this.$message.error(resp.data.msg || '保存 学生信息 失败')
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
          message: '请选择一项学生信息删除',
          type: 'warning'
        })
        return
      }
      if (this.multipleSelection.length > 1) {
        this.$message({
          message: '只能选择一项学生信息删除',
          type: 'warning'
        })
        return
      }
      this.delVisible = true
    },
    // 确定删除
    deleteRow () {
      notesJs.deleteStudent(this.multipleSelection[0].id).then(resp => {
        if (resp.data.status) {
          this.$message.success(resp.data.msg || '已成功该学生信息')
          this.delVisible = false
          this.getData()
        } else {
          this.$message.error(resp.data.msg || '删除该学生信息')
        }
      })
    },
    cancelRuleForm () {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
      this.form = JSON.parse(JSON.stringify(ROLE_MODEL))
      this.editVisible = false
    },
    cancelSearchParms(){
      this.page_obj.studentName=""
      this.page_obj.phone=""
      this.getData()
    },
    searchParms(){
      this.getData()
    },

    handleRemove(file,fileList) {
      var fileId = file.response;
      if(fileId === undefined || fileId === null || fileId === ''){
        fileId = file.uid
      }else{
        fileId = file.response.data.id;
      }

      var picArg = this.form.enrollmentId;
      //删除数组元素
     this.delPic(picArg,fileId)
      console.log("dialogImageUrl========" , this.form.enrollmentId.join())
    },



    delPic(list,id){
      var index = list.indexOf(id)
      list.splice(index,1)
    },


    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      debugger
      console.log(file.data.id);

    },

    enrollmentPicUploadSuccess(res){
      this.form.enrollmentId.push(res.data.id)
      //console.log("dialogImageUrl========" , this.form.enrollmentPicArg.join())

      console.log("fileList========" , res.data)
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
