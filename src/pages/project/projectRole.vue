<template>
  <div class="app-container1" >

    <div class="add-container mbt20">
      <el-button type="primary"  @click="handleEdit(1)" size="mini">添加</el-button>
       <el-button type="success" @click="handleEdit(2)" size="mini">编辑</el-button>
      <el-button type="danger" @click="handleDelete" size="mini">删除</el-button>
    </div>

    <el-row class="mlr20" id="rowcontent">
      <el-col :span="24">
         <el-table
          ref="multipleTable"
          :data="tableData"
          border
          size="medium"
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{background:'#edf2fc'}"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="30" class-name="selection-box">

          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="55" class-name="index-box">
          </el-table-column>
          <el-table-column
            label="项目角色"
            prop="projectRole"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            label="单价(元/天)"
             prop="unitPrice"
              align="center"
            width="180">
          </el-table-column>
          <el-table-column
            label="工作职责描述"
            prop="listDec"
            header-align='center'
            align="left"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <p v-for="(item,index) in scope.row.listDec" :key="item.id">
               {{index+1}}、{{item.message}}
              </p>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>


  <!-- 编辑弹出框 -->

  <el-dialog v-dialogDrag :title="title" :visible.sync="editVisible" width="580px" id="pRoleDialog">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="项目角色" prop="projectRole" required>
        <el-input v-model="form.projectRole" placeholder="点击输入"></el-input>
      </el-form-item>
      <el-form-item label="单价(元/天)" prop="unitPrice" required>
        <el-input v-model.number="form.unitPrice" placeholder="点击输入" ></el-input>
      </el-form-item>
      <el-form-item label="工作职责描述" prop="nolistDec"  required id="hiddenIpnut">
           <el-input v-model="form.nolistDec" class="hidden-c" type="hidden"></el-input>
      </el-form-item>
      <el-form-item label="" id="last-input">
      <div class="cf">
      <div class="checkboxC">
        <el-checkbox-group
          v-if="allowInput"
          v-model="checkedContent"
          >
          <el-checkbox v-for="(item,index) in roleCon" :label="form.id==''?index:item" :key="index">
             <el-input v-model="item.message" v-focus @input="changInput"></el-input>
          </el-checkbox>
        </el-checkbox-group>
       
       </div>
        <div class="add-input" @click="addInput">添加</div>
        <div class="add-input" @click="deleteInput(form.id)" style="color:#F56C6C">删除</div>
         </div>
      
      </el-form-item>

    </el-form>
    <span slot="footer"  class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
     </span>
  </el-dialog>

  <!-- 删除提示框 -->

  <el-dialog v-dialogDrag title="提示" :visible.sync="delVisible" width="550px">

    <div class="del-dialog-cnt"><i class="el-icon-warning tip-icon" ></i>此操作将永久删除该项目角色，是否继续？ </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
    </span>

  </el-dialog>


  </div>
</template>

<script>
import bus from '@/components/common/bus'
import ProjectRoleService from '@/services/project/projectRole.js'



const EXCLUDE_FIELDS = {
  child: 1,
  parent: 1,
  createTime: 1,
  updateTime: 1
}
export default {
  name: 'menuPage',
  data () {
    return {
      tableData:[],
      domains: [{
        value: ''
      }],
      dataDetail:{},
      TotalPages: 0,
      loading: false,
      title: '添加',
      form: {
          id:"",
          projectRole:'',
          unitPrice:null,
          delIds:'',
          nolistDec:'',
          listDec:[]
        },
      editVisible: false,
      checkList: null,
      selectList: [],
      fullValues: [],
      childrenLength: false,
      delVisible: false,
      checkedContent:[],
      allowInput:false,
      addModel:true,
      roleCon:[],
      fillList:[],
      rules: {
        projectRole: [
          {
            required: true,
            message: '请输入项目角色',
          }
        ],
        unitPrice:[
          {
            required: true,
            message: '请输入单价',
          },
          { pattern: /^\d+(\.\d*)?$/, message: '必须为数字值' },
          { pattern: /^\d+(\.\d{0,2})?$/, message: '最多精确到两位小数' }

        ],
        nolistDec:[
          {
            required: true,
            message: '请添加至少一个工作职责',
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
    this.loadData()

  },

  methods: {

    // 查询
    searchList () {
     this.loadData()
    },

    // 项目角色管理列表
    loadData () {

      this.loading = true
      ProjectRoleService
        .list()
        .then(resp => {
          if (resp.data.status === 1) {
            var rootNode = resp.data.data
            this.tableData = rootNode

            this.loading = false
          }
        })
    },
    // 选择项目角色
    handleSelectionChange(val){
       this.checkList = val
    },
   // 添加工作职责描述行
    addInput(){

      this.allowInput=true
      this.roleCon.push({'id':'','message':''})
      this.checkedContent = []
    },
    // 获取选中工作职责
    getCheckWork(){
     
    },


    //删除工作现职
    deleteInput(id){
      let list = this.checkedContent  //获取选中列
      let delIds = [] // 保存编辑状态下删除工作职责描述的id

      if(list.length>0){
        //编辑状态
        if(id!==''){
          for(let i of list){
            delIds.push(list[i].id)
            for(let j of this.roleCon){
               if(this.roleCon[j].id == list[i].id){
                 this.roleCon.splice(j,1)
               }
            }
          }
        this.form.delIds = delIds.join(",")
        }else{
          // 添加状态
          for(var i = this.roleCon.length-1; i >= 0; i--){
           for(var j=0;j<list.length;j++){
                if(i==list[j]){
                this.roleCon.splice(i,1);
                 }
               }
          }
        }
        
        
        this.checkedContent = []
         this.form.nolistDec = "true"  
      
        }else{
          this.$message.warning("请选择需要删除的工作职责")
        }
    
     
   
    },
    // 选中数据详情
    getDetail(id){
     
   
      ProjectRoleService.getDetail(id).then(resp=>{
        if(resp.data.status === 1){
          let that  = this
           this.$nextTick(() => {
            this.$refs['form'].resetFields()
            that.dataDetail = resp.data.data
            var listDec = that.dataDetail.listDec
            listDec.forEach(item=>{
           
                that.roleCon.push({id:item.id,message:item.message})
            })
            console.log(that.roleCon,"1111111")
             that.form.id = that.dataDetail.id
             that.form.projectRole = that.dataDetail.projectRole
             that.form.unitPrice = that.dataDetail.unitPrice
          
            })  
          
          
        }else{
          this.$message.error(resp.data.msg)
        }
      })

    },

    // 点击添加按钮
    handleEdit (num) {
      this.roleCon = []
      if(num===1){
        this.title = '添加'
        this.editVisible = true
        this.$nextTick(() => {
        this.resetTemp()
        this.$refs['form'].resetFields()
        })
      }else{
        
        if(this.checkList==null || this.checkList.length===0){
          this.$message.warning("请选择一条数据进行编辑")
          return false
        }
        if(this.checkList.length>1){
           this.$message.warning("只能选择一条数据进行编辑")
            return false
        }

        this.title = '编辑'
        this.editVisible = true
        this.allowInput = true
        this.addModel = false
        this.getDetail(this.checkList[0].id)
   
        
       
      }

    },

    // 验证工作职责描述 是否有添加
    changInput(val){
      let mesg = JSON.stringify(this.roleCon[0].message)
      if(mesg!==''){
          this.form.nolistDec = "true"
      }
  
    },

  
    // 保存编辑
    saveEdit () {
      let list =  this.roleCon
      
      let pass = true  //根据pass 是否存在空白行
      if(list.length>0){
        list.forEach(item=>{
        if(item.message==""){
          pass = false
         
        }
      })
      }else{
        this.form.nolistDec = ''
      }
      
      if(!pass){
        this.$message.warning('请完成工作职责描述填写或删除空白行');
         return false
      }
      this.form.listDec = this.roleCon
    
      this.$refs['form'].validate(valid => {
        if (valid) {
            ProjectRoleService.creat(this.form).then(resp => {
                  if (resp.data.status === 1) {
                    this.$message({
                      message: '添加成功',
                      type: 'success'
                    })
                    
                    this.editVisible = false
                    this.loadData()
                    this.resetTemp()
                    this.roleCon = []
   
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
      const idsArray = this.checkList
      if (idsArray.length > 0) {
        this.delVisible = true
      } else {
        this.$message.warning('请选择需要删除的菜单')
      }
    },

    // 删除选中项目角色
    deleteRow () {
      let list = []
       this.checkList.forEach(item=>{
          list.push(item.id)
       })
        let ids = list.join(',')
        console.log(ids)
        ProjectRoleService.delete(ids).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.loadData()
          this.delVisible = false
         
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
        id:"",
        projectRole:'',
        delIds:'',
        unitPrice:null,
        nolistDec:'',
        listDec:[]
       
      }
    }
  }
}
</script>
<style scoped>
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
#last-input .add-input{
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
.checkboxC .el-checkbox__input{
  padding-top:3px;
}
#last-input .el-form-item__content {
    margin-top: -45px;
}
#hiddenIpnut .el-form-item__error{
  padding-top:130px!important;
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
.el-table--border td.selection-box,
.el-table--border th.selection-box{
  border-right:none
}

.el-table--border th.index-box .cell{
  padding-left:0
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
