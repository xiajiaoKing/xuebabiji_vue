<template>
  <div class="app-container1">
    <div v-if="showList">
    <div class="add-container mbt20">
      <el-button type="primary"  @click="handleEdit(1)" size="mini">添加</el-button>
      <el-button type="danger" @click="handleDelete" size="mini">删除</el-button>
    </div>
    <div class="search-box mbt1020">
      <span class="inputLable">项目名称</span>
      <el-input placeholder="请输入内容" class="input-searchbox" clearable  v-model="searchForm.searchInput">
      </el-input>
      <el-button type="primary" size='mini' @click="searchList()">查询</el-button>
    </div>

    <el-row class="mlr20" id="rowcontent">
      <el-col :span="24">
         <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            >
          </el-table-column>
          <el-table-column
            label="项目名称"
            prop="projectName"
            >
           
          </el-table-column>
          <el-table-column
            label="项目编号"
            prop="projectNumber"
          >
          </el-table-column>
          <el-table-column
            label="总天数"
            prop="totalDays"
           >
          </el-table-column>
           <el-table-column
            label="操作"
           >
            <template slot-scope="scope">
              <el-button type="success" size="mini">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    </div>
    <div v-else>
      <addCompentent></addCompentent>
    </div>
   
  <!-- 删除提示框 -->

  <el-dialog v-dialogDrag title="提示" :visible.sync="delVisible" width="550px">

    <div class="del-dialog-cnt">是否删除已勾选菜单 </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
    </span>

  </el-dialog>

  
  </div>
</template>

<script>

import cycleService from '@/services/cycle/cycleAssessment.js'
import subFunctionService from '@/services/project/subFunction.js'
import tbFuncionService from '@/services/project/TbFunctionService.js'
import addCompentent from './add'
//import publicFun from '@/util/public.js'
const MENU_MODEL = {
  
  }


const  SEARCH_MODEL = {
  projectName:'',
  pageIndex:1,
  pageSize:10
}
export default {
  name: 'cycleAssessmentPage',
  components:{
    addCompentent
  },
  data () {
    return {
      tableData:[],
      domains: [{
        value: ''
      }],
      pageIndex: 1,
      pageSize: 10,
      TotalPages: 0,
      loading: false,
      title: '添加',
      form: MENU_MODEL,
      searchForm:SEARCH_MODEL,
      showList:true,
      vxeTableData: [],
      isCertainlyRadio:"1",
      isConfirmRadio:"1",
      functionList:[],
      subFunctionList:[],
      validRules: {
        functionModule: [{ required: true, message: "功能模块必须填写" }],
        subfunction: [{ required: true, message: "子功能必须填写" }]
      },
      editVisible: false,
      checkList: [],
      selectList: [],
      fullValues: [],
      childrenLength: false,
      delVisible: false,
      checkedContent:[],
      allowInput:false,
      roleCon:[],
      rules: {
        cycleService: [
          {
            required: true,
            message: '请输入项目角色',
            trigger: 'blur'
          }
        ],
        unitPrice:[
          {
          required: true,
            message: '请输入单价',
            trigger: 'blur'
          } 
        ],
        workMessage:[
          {
             required: true,
            message: '请添加至少一个工作职责',
            trigger: 'blur'
          } 
        ]
      },
      visible: [
        {
          name: '是',
          key: 1
        },
        {
          name: '否',
          key: 2
        }
      ]
    }
  },
  directives:{
  	focus:{
	     inserted: function (el) {
         let els = el.children[0]
        // 聚焦元素
        els.focus()
      }
    }
  },
  created () {
    this.getSubFuncionData()
    this.loadData()
  
  },

  methods: {

    // 查询
    searchList () {
     this.loadData()
    },
    //功能模块列表
    getFunctionData(){
      tbFuncionService.getFunByProject().then(resp=>{

      })

    },
    // 子功能模块列表
    getSubFuncionData () {
      subFunctionService
        .list()
        .then(resp => {
          if (resp.data.status === 1) {
     
            this.subFunctionList = resp.data.data
          }
        })
    },

    // 项目列表
    loadData () {
  
      this.loading = true
      cycleService
        .list(this.searchForm)
        .then(resp => {
          if (resp.data.status === 1) {
           
            var rootNode = resp.data.data.list
            
            this.tableData = rootNode
            this.loading = false
          }
        })
    },
    //在最后一行添加 
    insertEvent(){

    },
    //删除选中
    removeCheckboxRow(){

    },
    //保存新增 而如果是 async =true ; 就表示异步的方式运行，
    // 不用度等到当前语句返回结果就会继续下面问的语句。答这样运行更流畅，不会出现停顿的现象。
    async insertEvent (row) {
         let record = {
              
         }
        let { row: newRow } = await this.$refs.xTable.insertAt(record, row)
         await this.$refs.xTable.setActiveCell(newRow,'contentDesc')
     },
     //保存所有新增
     saveEvent(){

     },
      // 内框-通用行合并函数（将相同多列数据合并为一行）
    // row 每一行的数据, $rowIndex  每一行的索引值, column 每一列数据, data   整个表格的数据
    rowspanMethod({ row, $rowIndex, column, data }) {
      let fields = ["functionModule"];
      let cellValue = row[column.property];

      if (cellValue && fields.includes(column.property)) {
        let prevRow = data[$rowIndex - 1];
        let nextRow = data[$rowIndex + 1];
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          let countRowspan = 1;
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = data[++countRowspan + $rowIndex];
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      }
    },
     // 关闭单元格时，修改其合并单元格的数据

    editClosed(row) {
      row.no_edit = true;
      this.tableData.forEach(item => {
        if (item.functionModule == this.editActivedRow2) {
          item.functionModule = row.row.functionModule;
        }
      });
    },
    //返回
    reback(){
       this.showList = true
    },
    // 选择项目角色
    handleSelectionChange(val){
       this.checkList = val
    },
   // 添加工作职责描述行
    addInput(){

      this.allowInput=true
      this.roleCon.push({'content':''})
      this.checkedContent = []
    },
    //删除工作现职
    deleteInput(){
      let list = this.checkedContent
      if(list.length>0){
           list.forEach(item=>{
             this.roleCon.splice(item,1)
          })
      }else{
        this.$message.warning("请选择需要删除的工作职责")
      }
   
    },
    
    // 点击添加按钮
    handleEdit () {
    
      // 点击打开新标签进行添加
      // bus.$emit('projectRow',this.checkList[0]) 
      // this.$router.push({path:'/newModel?name=addCycle'})
      // publicFun.openNewPage('/newModel?name=addCycle')
      //在本页面进行添加
      this.showList = false
    },

    // 保存编辑
    saveEdit () {
      var self = this
      this.$refs['form'].validate(valid => {
        if (valid) {
            cycleService.creat(self.form).then(resp => {
                  if (resp.data.status === 1) {
                    self.$message({
                      message: '添加成功',
                      type: 'success'
                    })
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
    // 点击删除 显示弹框
    handleDelete () {
      const idsArray = this.$refs.tree.getCheckedNodes()
      if (idsArray.length > 0) {
        this.childrenLength = false
        this.delVisible = true
        for (let i in idsArray) {
          if (idsArray[i].children && idsArray[i].children.length > 0) {
            this.childrenLength = true
          }
        }
      } else {
        this.$message.warning('请选择需要删除的菜单')
      }
    },

    // 删除选中项目角色
    deleteRow () {
      
        let ids = idsArrays.join(',')
        cycleService.remove(ids).then(() => {
          this.$message({
            message: '删除菜单成功',
            type: 'success'
          })

          this.delVisible = false
          setTimeout(() => {
            this.myrefresh()
          }, 1000)
        })
     
    },



    // 递归遍历 获取新增弹框里所选中的菜单ID
    getArrayId (data, id) {
      var str = ''
      for (var i in data) {
        if (data[i].value == id) {
        } else {
          this.getArrayId(data[i].child, id)
        }
      }
    },




 
    // 清空表单
    resetTemp () {
      this.selectList = []
      this.form = {
    
      }
    }
  }
}
</script>
<style scoped>
.inputLable{
  padding-right:10px;
}
.vex-table-add{
  padding:20px;
}
.add-btn {
    border: 1px solid #ddd;
    text-align: center;
    padding: 10px;
    color: #409eff;
    border-top:none!important;
}
.vxe-header{
  background: #EDF2FC;
  padding:0 15px;
  margin-top:5px;

}
hr{
  color:#ddd;
}
.vew-table-title p{
  font-size:16px;
  padding-bottom:10px;
  padding-left:20px;
  border-bottom:1px solid #ddd;
}
.input-searchbox {
  height: 30px;
  line-height: 30px;
  width: 150px;
  margin-right: 15px;
}
.title-checkbox {
  float: left;
  padding-left: 15px;
}
.orgManageText {
  color: #909399;
}
.treeMainDiv {
  overflow: hidden;
}
span.custom-tree-node.treeContainer {
  width: 100%;
  padding-right: 0px;
}
div#elrow {
  border-top: 5px solid #f6f7f9;
}
#elrow span.grid-content {
  padding: 0 10px;
  line-height: 50px;
  height: 50px;
  float: right;
}
#elrow span.grid-content.menu-name,
#rowcontent .treeMainDiv span.TreeName {
  float: left;
}
#elrow span.grid-content.menu-edit,
#rowcontent .treeMainDiv span.treeEdit {
  width: 100px;
  border-left: 1px solid rgb(235, 238, 245);
  text-align: center;
}
#elrow span.grid-content.menu-visiable,
#rowcontent .treeMainDiv span.visiable {
  width: 90px;
}

#elrow span.grid-content.menu-time,
#rowcontent .treeMainDiv span.creatTime {
  width: 150px;
}
#elrow span.grid-content.menu-sort,
#rowcontent .treeMainDiv span.treeSort {
  width: 100px;
}
#elrow span.grid-content.menu-url,
#rowcontent .treeMainDiv span.treeUrl {
  width: 300px;
}
.treeMainDiv span {
  padding: 0 10px;
  float: right;
}
.treeMainDiv span.TreeName {
  padding: 0;
}
.content {
  background: #fff;
}
#pRoleDialog .el-dialog {
  border-radius: 5px;
}
#pRoleDialog .el-dialog__body {
  padding: 15px 20px;
}

#pRoleDialog .el-input,
#pRoleDialog .el-cascader.el-cascader--small,#last-input .el-textarea {
  width: 330px !important;
}
.cf{
  overflow: hidden;
}
#last-input .el-textarea,#last-input .add-input{
  float:left;
}
#last-input .add-input{
  margin-left:10px;
  color:#4A9DF2;
}

.label-p {
  color: #c0c4cc;
  font-size: 12px;
  margin: 10px 0;
}
.el-popper[x-placement^="bottom"] {
  margin-top: 0 !important;
}

.fas-icon-list span {
  padding: 5px;
  font-size: 18px;
  cursor: pointer;
}

.green {
  color: #2ecc71;
}
.rebtn {
  float: right;
}
.fas-icon-list {
  height: 200px;
  background: #fff;
  overflow: auto;
}
.checkboxC {
    width: 320px;
    height: 130px;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    float: left;
    overflow-y: auto;
    padding:10px;
}

</style>
<style>

.el-form-item__error{
  padding-top:-25px!important;
}
 #pRoleDialog #last-input .el-input{
  width:260px !important;

}
#last-input .el-checkbox__label .el-input__inner{
  border:none;
  padding:0;
}
#last-input .checkboxC .el-input--small .el-input__inner{
  line-height:20px;
  height:20px;
}
#last-input .el-checkbox{
  display: flex;
  margin-bottom:5px;
}
#treeTableMenu .el-tree-node__content {
  border-top: 1px solid #ebeef5;
  line-height: 50px;
  height: 50px;
}
#treeTableMenu .el-tree-node__content > .el-tree-node__expand-icon {
  padding: 6px 12px;
}

.el-button--small span {
  font-size: 14px;
}
.rebtn .el-button--small {
  background: #f4f4f5;
}
.el-popover.el-popper {
  z-index: 3000 !important;
}
#vShow {
  background: #f4f4f5;
  width: 60px;
}

input#icon_select {
  width: 350px;
}
#last-input .el-textarea .el-textarea__inner{
  white-space: nowrap;
  overflow-x: scroll;
} 
</style>
