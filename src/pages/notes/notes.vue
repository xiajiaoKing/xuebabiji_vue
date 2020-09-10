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
          <el-select v-model="page_obj.studentName" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in studentList"
              :key="item.id"
              :label="item.studentName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="笔记名称"   label-width="150px">
          <el-input v-model="page_obj.bookName"></el-input>
        </el-form-item>

        <el-form-item label="等级名称"   label-width="150px">
          <el-select v-model="page_obj.levelName" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.levelName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="等级类型"   label-width="150px">
          <el-select v-model="page_obj.type" clearable placeholder="请选择">
            <el-option label="单本"  :value="1" />
            <el-option label="一套  "  :value="2" />
          </el-select>
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
          <el-table-column prop="noteName" label="笔记名称" width="200"></el-table-column>
          <el-table-column prop="levelName" label="等级名称" width="200"></el-table-column>
          <el-table-column prop="type" label="笔记类型 单/套">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 1">单本</span>
              <span v-if="scope.row.type === 2">套</span>
            </template>
          </el-table-column>

          <el-table-column prop="type" label="下载">
            <template slot-scope="scope">
              <a class='DownButtonNormal' :href="'http://localhost:9999/api/file/download?fileId=' + scope.row.dataZipUrl" download=""  title="下载">zip下载</a>
              <!--<el-button type="primary" @click="downloadZip(scope.row.id)">下载zip</el-button>-->
            </template>
          </el-table-column>

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


        <el-form-item label="笔记名称"   label-width="150px">
          <el-input v-model="form.noteName"></el-input>
        </el-form-item>

        <el-form-item label="学生名称"   label-width="150px">
          <el-select v-model="form.studentId" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in studentList"
              :key="item.id"
              :label="item.studentName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="等级名称"   label-width="150px">
          <el-select v-model="form.levelId" filterable  clearable placeholder="请选择">
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.levelName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="笔记类型" clearable label-width="150px">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="单本"  :value="1" />
            <el-option label="一套  "  :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="录取图片1"  label-width="150px">
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

        <el-form-item label="上传笔记Zip"  label-width="150px">
          <el-upload
            class="upload-demo"
            action="http://localhost:9999/api/book/upload"
            :on-remove="dataZipRemove"
            :on-success="dataZipUploadSuccess"
            multiple
            :limit="1"
            :file-list="dataZipList">
            <el-button size="small" type="primary">上传笔记Zip</el-button>
            <div slot="tip" class="el-upload__tip">只能上传Zip文件</div>
          </el-upload>
          <span v-model="form.dataZipUrl"></span>
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
import server from '@/widgets/hydlAxios.js'

const ROLE_MODEL = {
  id:'',
  noteName: '',
  studentId: '',
  levelId:'',
  type: '',
  enrollmentPicArg: [],
  enrollmentPic:'',
  enrollmentId:[],
  bookUrl:'',
  dataZipUrl:''
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
        levelName: '',
        bookName: '',
        type: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      enPicList:[],
      levelList:[],
      studentList:[],
      dataZipList:[] //数据包
    }
  },
  created () {
    this.getData()
    this.findStudentList()
    this.findLevelList()
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
      notesJs.findNotesBookList(this.page_obj).then(resp => {
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

        notesJs.getNoteBookMsg(row.id).then(resp => {
          const bean = resp.data.data
          this.form = bean
          this.enPicList = []
          this.dataZipList=[]
          this.form.dataZipUrl = ''

          //图片
          for(var i=0;i<bean.enrollmentPicArg.length;i++){
            this.enPicList.push({
              'name': bean.enrollmentPicArg[i].fileName,
              'uid': bean.enrollmentPicArg[i].id,
              'url': bean.enrollmentPicArg[i].fileUrl
            })
          }

          //要所报
          this.dataZipList.push({
            'name': bean.dataZipFile.fileName,
            'url': bean.dataZipFile.fileUrl,
            'uid': bean.dataZipFile.id
          })

          this.getData()
        })



      } else {
        this.form.enrollmentPicArg = []
        this.form.enrollmentPic = ''
        this.enPicList = []
        this.dataZipList=[]
        this.form.dataZipUrl = ''

        this.form = JSON.parse(JSON.stringify(ROLE_MODEL))
        this.title = '新增笔记信息'
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

        that.form.bookUrl = that.form.enrollmentId.join()
        that.form.enrollmentPicArg = []

        if (valid) {
          let obj = {}
          for (let p in ROLE_MODEL) {
            obj[p] = this.form[p]
          }

          notesJs.createOrEditForNoteBookMsg(obj).then(resp => {
            if (resp.data.status === 1) {
              this.$message.success('保存 笔记 成功')
              this.editVisible = false
              this.$nextTick(() => {
                this.$refs.ruleForm.resetFields()
              })
              this.form = JSON.parse(JSON.stringify(ROLE_MODEL))
              this.getData()
            } else {
              this.$message.error(resp.data.msg || '保存 笔记 失败')
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
      notesJs.deleteNotesBook(this.multipleSelection[0].id).then(resp => {
        if (resp.data.status) {
          this.$message.success(resp.data.msg || '已成功该笔记')
          this.delVisible = false
          this.getData()
        } else {
          this.$message.error(resp.data.msg || '删除该笔记')
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
      this.page_obj.bookName=""
      this.page_obj.levelName=""
      this.page_obj.studentName=""
      this.page_obj.type=""
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
      console.log(file.data.id);

    },

    enrollmentPicUploadSuccess(res){
      this.form.enrollmentId.push(res.data.id)

      console.log("fileList========" , res.data)
    },

    dataZipUploadSuccess(res){
      if(res.status === 0){
        this.$message.error(res.msg)
      }
      //this.dataZipList = []
      this.form.dataZipUrl = res.data.id
    },

    findStudentList(){
      notesJs.findStudentAllList().then(resp => {
        if (resp.data.status) {
          this.studentList = resp.data.data
        } else {
          this.$message.error(resp.data.msg)
        }
      })
    },

    findLevelList(){
      notesJs.findLevelAllList().then(resp => {
        if (resp.data.status) {
          this.levelList = resp.data.data
        } else {
          this.$message.error(resp.data.msg)
        }
      })
    },

    dataZipRemove(){
      console.log("dataZipList========",this.dataZipList)
      console.log("dataZipUrl========",this.dataZipUrl)
       this.dataZipList = []
      this.dataZipUrl = ''
    },

    downloadZip(id){
      axios({
        method: 'get',
        url:'xxx相对地址xxx',
        responseType: 'blob'
      }).then(res => this.downloads(res.data, res.headers.filename))
    },

// 创建模板下载链接
    downloads (data, name){
      if(!data){
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display ='none'
      link.href = url
      link.setAttribute('download', `前端拼接后端返回的名字${name}.xlsx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },

  }
}
</script>

<style scoped>
  a {color: #696B83;TEXT-DECORATION: none}

  .DownButtonNormal {
  / / 设计该类的所有格式 height: 18 px;
    line-height: 18px;
    padding: 0 11px;
    background: rgb(173 239 239);
    border: 1px #E5E7EA solid;
    border-radius: 15px;
    display: inline-block;
    font-size: 12px;
    outline: none;
  }

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
