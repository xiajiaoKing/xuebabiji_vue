<template>
  <div class="app-container1" >

    <div class="add-container mbt1020">
      <el-button type="primary" icon="add" @click="handleEdit('add')" size="mini">添加</el-button>
      <el-button type="danger" @click="handleDelete" size="mini">删除</el-button>
    </div>

    <div class="search-box mbt1020">
      <span class="inputLable">子功能</span>
      <el-input placeholder="请输入内容" class="input-searchbox" clearable  v-model="searchInput">
      </el-input>
      <el-button type="primary" size='mini' @click="searchList()">查询</el-button>
      <!--<div class="rebtn">-->
        <!--<el-button plain @click="getDeLHistory">删除历史</el-button>-->
      <!--</div>-->
    </div>

    <!-- 使用自定义树级表格 -->
    <el-row style="margin: 0px;line-height:35px" id="elrow">
      <span class="grid-content menu-name">
            <span class="orgManageText" style="padding-left:60px">子功能</span>
      </span>
      <span class="grid-content menu-edits">
            <span class="orgManageText">操作</span>
      </span>
   
    </el-row>

    <el-row style="margin: 0px;border-bottom:1px solid #EBEEF5;line-height:35px" id="rowcontent">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <div class="custom-tree-container">
            <div class="block">
              <el-tree :data="treeDataSource" id="treeTableMenu" node-key="id" ref="tree" show-checkbox default-expand-all check-strictly :expand-on-click-node="true">
                <span class="custom-tree-node treeContainer" slot-scope="{ node, data }">
                <div class="treeMainDiv" style="width:100%">
                  <span  class="TreeName">
                  <span v-if="node.data.children">{{ node.label }}</span>
                  <span v-else>{{ node.label }}</span>
                  </span>
                  <span class="treeEdits">
                    <div class="" v-if="node.data.children">
                       <el-button type="primary" plain  @click.stop="handleAddSub(node.data)" >添加内容</el-button>
                       <el-button type="success" plain  @click.stop="handleEdit(node.data)" >编辑</el-button>
                    </div>
                    <el-button type="success" plain v-else  @click.stop="handleEditSub(node.data)" >编辑</el-button>
                  </span>
                </div>
              </span>
            </el-tree>
          </div>
        </div>
  </div>
  </el-col>
  </el-row>


  <!-- 新增编辑子功能弹出框 -->

  <el-dialog v-dialogDrag :title="title" :visible.sync="editVisible" width="550px" id="submydialog">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="子功能" prop="name">
        <el-input v-model="form.name" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
     </span>
  </el-dialog>
  
  <!-- 新增编辑内容弹出框 -->

  <el-dialog v-dialogDrag :title="title" :visible.sync="contentVisible" width="550px" id="submydialog" class="submydialog">
    <el-form ref="form" :model="form" :rules="contentRules" label-width="100px">
      <el-form-item label="内容" prop="name">
        <el-input type="textarea" rows="5" v-model="form.name" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="contentVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
     </span>
  </el-dialog>


  <!-- 删除提示框 -->

  <el-dialog v-dialogDrag title="删除" :visible.sync="delVisible" width="550px" id="deletedialog">

    <div class="del-dialog-cnt"><i class="el-icon-warning tip-icon"></i>{{deleteInfo}} </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
    </span>

  </el-dialog>

  </div>
</template>

<script>
import bus from '@/components/common/bus'
import treeTable from '@/components/TreeTable/tree-table'
import subfunctionService from '@/services/project/subFunction.js'

import dataJson from '@/pages/sys/data.json'

const MENU_MODEL = {
  id:"",
  name:'',
  grade:1,
  parentId:"ROOT"
}

const EXCLUDE_FIELDS = {
  child: 1,
  parent: 1,
  createTime: 1,
  updateTime: 1
}
export default {
  name: 'menuPage',
  components: {
    treeTable,
  },
  data () {
    return {
      treeDataSource: [],
      datas: [],
      deleteInfo:'此操作将永久删除已勾选的功能，是否继续？',
      pageIndex: 1,
      pageSize: 10,
      TotalPages: 0,
      iconList: dataJson,
      visible2: false,
      delRootVisible: false,
      handelChanges: false,
      searchInput: '',
      menuId: '',
      option: [],
      loading: false,
      title: '添加',
      form: MENU_MODEL,
      editVisible: false,
      contentVisible: false,
      menuList: [],
      root: '',
      changeSort: 0,
      removeList: [],
      checkid: '',
      checkList: [],
      selectList: [],
      fullValues: [],
      childrenLength: false,
      delVisible: false,
      contentRules:{
        name: [
          {
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }
        ]
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入子功能名称',
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

  created () {
    this.loadData()

  },

  methods: {

    // 查询
    searchList () {
     this.loadData()
    },

    // 子功能列表
    loadData () {
      var self = this
      this.loading = true
      subfunctionService
        .list(self.searchInput)
        .then(resp => {
          if (resp.data.status === 1) {
            var rootNode = Object.assign({}, MENU_MODEL)
            rootNode = resp.data.data
            this.getArrayData(rootNode)
            self.treeDataSource = rootNode
              console.log(self.treeDataSource)
            this.loading = false
          }
        })
    },
       //递归遍历
    getArrayData(data) {
        for (var i in data) {
          data[i].label = data[i].name
           if(data[i].children){
                this.getArrayData(data[i].children);
            }
        }
    },

    // 保存编辑
    saveEdit () {
      var self = this
      this.$refs['form'].validate(valid => {
        if (valid) {
         
            subfunctionService.creat(self.form).then(resp => {
                  if (resp.data.status === 1) {
                    self.$message({
                      message: '添加成功',
                      type: 'success'
                    })
                    this.editVisible = false
                    this.contentVisible = false
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
   
         this.delVisible = true
        this.deleteInfo = "此操作删除将永久删除已勾选的功能，是否继续？" 
        console.log(idsArray)
        for (let i in idsArray) {
          if (idsArray[i].children && idsArray[i].children.length > 0) {
            this.deleteInfo = "所选子功能包含内容，此操作删除将永久删除已勾选的功能，是否继续？"
          }
        }
         
      } else {
        this.$message.warning('请选择需要删除的菜单')
      }
    },
  // 删除选中菜单
    deleteRow () {
     
        const idsArrays = this.$refs.tree.getCheckedKeys(true)
        let ids = idsArrays.join(',')
        subfunctionService.delete(ids).then(() => {
          this.$message({
            message: '删除菜单成功',
            type: 'success'
          })
          this.loadData()
          this.delVisible = false
    
        })
     
    },

  
  

    // 点击添加或编辑
    handleEdit (row) {
      if(row=='add'){
        this.title = '添加'
        this.editVisible = true
        this.form = MENU_MODEL
        this.$nextTick(() => {
          this.resetTemp()
          this.$refs['form'].resetFields()
        })
      }else{
        this.editVisible = true
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
          this.title = '编辑'
          var da = row
          this.form.name = da.name
          this.form.id = da.id
          this.form.grade = da.grade
          this.form.parentId = da.parentId
        })
        
        
      
      }
      
    },
    //新增子功能的下级
    handleAddSub(row){
      this.contentVisible = true
      this.$nextTick(() => {
          this.$refs['form'].resetFields()
          this.form.name=''
          this.form.parentId = row.id
          this.form.grade = 2
          this.title = '添加'
      })

    },

    //编辑子功能的下级
    handleEditSub(row){
      this.contentVisible = true
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
          this.form.name=row.name
          this.form.id = row.id
          this.form.parentId = row.parentId
          this.form.grade = 2
          this.title = '编辑'
        })
    },
    // 递归遍历 获取新增弹框里所选中的子功能
    getArray (data, bluoon) {
      var str = ''
      for (var i in data) {
        if (data[i].checked == bluoon) {
          if (data[i].child.length > 0) {
            this.checkList = 0
          } else {
            this.checkList.push(data[i].id)
          }
        } else {
          this.getArray(data[i].child, bluoon)
        }
      }
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


    // 新增菜单 ，菜单选择
    handleChange (value) {
      if (value !== 'ROOT' && value.length > 0) {
        value = value[value.length - 1]
        this.form.parentId = value
        this.handelChanges = true
        this.menuId = value
      }

      subfunctionService.getSort(value).then(item => {
        if (item.data.status == 1) {
          this.form.sort = item.data.data
          this.changeSort = item.data.data
        }
      })
    },

    // 清空表单
    resetTemp () {
      this.selectList = []
      this.form = {
        id:"",
        name:'',
        grade:1,
        parentId:"ROOT"
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
#elrow span.grid-content.menu-edits,
#rowcontent .treeMainDiv span.treeEdits {
  width:500px;
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
#submydialog .el-dialog {
  border-radius: 5px;
}
#submydialog .el-dialog__body {
  padding: 15px 20px;
}

#submydialog .el-input,#submydialog .el-textarea,
#submydialog .el-cascader.el-cascader--small {
  width: 350px !important;
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
.inputLable{
  padding-right:10px;
}
.search-box .el-input{
  width:160px;
}

</style>
<style>
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
#submydialog .el-dialog{
  top:50%!important;
  margin-top:-114px!important;
}
#submydialog.submydialog .el-dialog{
  top:50%!important;
  margin-top:-151px!important;
}
</style>
