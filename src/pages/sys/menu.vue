<template>
  <div class="app-container1" >

    <div class="add-container mbt1020">
      <p class="label-p">基础操作</p>
      <el-button type="primary" icon="add" @click="handleEdit" size="mini">新增</el-button>
      <el-button type="danger" @click="handleDelete" size="mini">删除</el-button>
    </div>

    <div class="search-box mbt1020">
      <span class="inputLabel">菜单名称</span>
      <el-input placeholder="请输入内容" class="input-searchbox" clearable prefix-icon="el-icon-search" v-model="searchInput">
      </el-input>
      <el-button plain @click="reset">重置</el-button>
      <el-button type="primary" @click="searchList()">查询</el-button>
      <!--<div class="rebtn">-->
        <!--<el-button plain @click="getDeLHistory">删除历史</el-button>-->
      <!--</div>-->
    </div>

    <!-- 使用自定义树级表格 -->
    <el-row style="margin: 0px;line-height:35px" id="elrow">
      <span class="grid-content menu-name">
            <span class="orgManageText" style="padding-left:60px">菜单名称</span>
      </span>
      <span class="grid-content menu-edit">
            <span class="orgManageText">操作</span>
      </span>
      <span class="grid-content menu-visiable">
            <span class="orgManageText">是否可见</span>
      </span>
      <span class="grid-content menu-time">
            <span class="orgManageText" >新增时间</span>
      </span>
      <span class="grid-content menu-sort">
            <span class="orgManageText" >排序</span>
      </span>
      <span class="grid-content menu-url">
            <span class="orgManageText" >链接</span>
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
                  <span v-if="node.data.child">{{ node.label }}</span>
                  <span v-else>{{ node.label }}</span>
                  </span>
                  <span class="treeEdit">
                    <el-button type="success" plain  @click.stop="handleEdit(node.data)" >编辑</el-button>
                  </span>
                  <span class="visiable">
                    <el-select  v-model="node.data.visible"  id="vShow" @change="handleVisiable(node.data.visible,node.data.id)">
                        <el-option v-for="item in visible" :key="item.is_heating" :label="item.name" :value="item.key" :class="node.data.visible == 1 ? 'colorClass' : 'resoureColor'"/>
                    </el-select>
                  </span>
                  <span class="creatTime">{{ node.data.create_time}}</span>
                  <span class="treeSort">{{ node.data.sort}}</span>
                  <span class="treeUrl">{{ node.data.url}} </span>
                </div>
              </span>
            </el-tree>
          </div>
        </div>
  </div>
  </el-col>
  </el-row>
  <!--分页 -->
  <pagination v-show="TotalPages>0"
    :total-pages="TotalPages"
    :page-index.sync="pageIndex"
    :page-size.sync="pageSize"
    @pagination="handleCurrent"
 />

  <!-- 编辑弹出框 -->

  <el-dialog v-dialogDrag :title="title" :visible.sync="editVisible" width="550px" id="mydialog">

    <el-dialog title="重命名提示" :visible.sync="renameVisible" width="30%" append-to-body>
      <div class="del-dialog-cnt">
        <p>目录中有重复菜单名称，请重命名</p>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="renameVisible = false">取 消</el-button>
          <el-button type="primary" @click="renameTypeRow()">确 定</el-button>
       </span>
    </el-dialog>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="上级菜单" prop="parentId">
          <el-cascader placeholder="请选择所属上级菜单"
          v-model="selectList" ref="cascaderAddr"
          :options="menuList"
          :props="{ checkStrictly: true,expandTrigger:'hover' }"
          filterable
          @change="handleChange"
          clearable>
          </el-cascader>
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="url">
        <el-popover
          placement="bottom"
          title="选择图标"
          width="320"
          class="iconbox"
          trigger="click"
          v-model="visible2">
          <div class="fas-icon-list">
            <span v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item.name,visible2)">
                <i :class="item.name"></i>
            </span>
          </div>
          <!-- <el-button slot="reference">click 激活</el-button> -->
          <el-select
          v-model="form.icon"
          slot="reference"
          id="icon_select"
          placeholder="请选择菜单图标">
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <el-input v-model="form.url" placeholder="请输入跳转链接"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="form.sort"
          :disabled="form.parentId != '' ? false : true"
          placeholder="请先选择上级菜单"
          @keyup.native="visiableSort(form.sort,form)">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
     </span>
  </el-dialog>

  <!-- 删除提示框 -->

  <el-dialog v-dialogDrag title="提示" :visible.sync="delVisible" width="550px">

    <div class="del-dialog-cnt">是否删除已勾选菜单 </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
    </span>

  </el-dialog>

  <el-dialog v-dialogDrag title="提示" :visible.sync="delRootVisible" width="550px">

    <div class="del-dialog-cnt">注意！因为该菜单下还存在子菜单，是否先删除所有子菜单？
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="delRootVisible = false">取 消</el-button>
        <el-button type="primary" @click="delChildMenu">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import bus from '@/components/common/bus'
import treeTable from '@/components/TreeTable/tree-table'
import sysMenuService from '@/services/sys/menu.js'
import Pagination from '@/components/PaginationText'
import dataJson from '@/pages/sys/data.json'

const MENU_MODEL = {
  id: '',
  parentId: '',
  name: '',
  type: null,
  url: '',
  visible: 1,
  icon: '',
  sort: 1,
  remark: ''
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
    Pagination
  },
  data () {
    return {
      treeDataSource: [],
      datas: [],
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
      title: '新建菜单',
      form: MENU_MODEL,
      editVisible: false,
      renameVisible: false,
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
      rules: {
        parentId: [
          {
            required: true,
            message: '请选择上级菜单'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入菜单名称',
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
    this.getMenuList()
  },

  methods: {
    // 分页操作
    handleCurrent (val) {
      this.loading = true
      this.pageIndex = val.pageIndex
      this.pageSize = val.pageSize
      let self = this
      sysMenuService
        .page(this.pageIndex, this.pageSize, this.searchInput)
        .then(resp => {
          if (resp.data.status === 1) {
            let rootNode = Object.assign({}, MENU_MODEL)
            rootNode = resp.data.data.list
            self.treeDataSource = rootNode
            self.TotalPages = resp.data.data.total
            this.loading = false
          }
        })
    },
    // 查询，并重置分页
    searchList () {
      this.handleCurrent({
        pageIndex: 0,
        pageSize: 10
      })
    },
    // 选择图标
    selectedIcon (name) {
      this.form.icon = name
      this.visible2 = false
    },
    // 菜单列表
    loadData () {
      var self = this
      this.loading = true
      sysMenuService
        .page(this.pageIndex, this.pageSize, this.searchInput)
        .then(resp => {
          if (resp.data.status === 1) {
            var rootNode = Object.assign({}, MENU_MODEL)
            rootNode = resp.data.data.list
            self.treeDataSource = rootNode
            console.log(rootNode, 111)
            self.TotalPages = resp.data.data.total
            this.loading = false
          }
        })
    },
 

    // 保存编辑
    saveEdit () {
      var self = this
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (self.form.id !== '') {
            if (self.handelChanges) {
              self.form.parentId = self.menuId
            }
          } else {
          }
          // 判断是否重名
          sysMenuService
            .isSameName(self.form.parentId, self.form.name, self.form.id)
            .then(resp => {
              if (resp.data.msg == '1') {
                this.renameVisible = true
              } else {
                sysMenuService.save(self.form).then(resp => {
                  if (resp.data.status === 1) {
                    self.$message({
                      message: '保存菜单成功',
                      type: 'success'
                    })
                    this.editVisible = false
                    this.loadData()
                    this.getMenuList()

                    setTimeout(function () {
                      this.myrefresh()
                    }, 3000)
                  }
                })
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

    // 删除选中菜单
    deleteRow () {
      if (this.childrenLength) {
        this.delRootVisible = true
        this.delVisible = false
      } else {
        const idsArrays = this.$refs.tree.getCheckedKeys(true)
        let ids = idsArrays.join(',')
        sysMenuService.remove(ids).then(() => {
          this.$message({
            message: '删除菜单成功',
            type: 'success'
          })

          this.delVisible = false
          setTimeout(() => {
            this.myrefresh()
          }, 1000)
        })
      }
    },

    // 父菜单里包含子菜单 ，先删除所有子菜单
    delChildMenu () {
      const idsArrays = this.$refs.tree.getCheckedKeys(true)
      let ids = idsArrays.join(',')
      sysMenuService.remove(ids).then(() => {
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

    // 获取菜单选择列表
    getMenuList () {
      sysMenuService.menuSelect('ROOT').then(item => {
        var Obj = item.data.data
        this.menuList = [
          {
            value: 'ROOT',
            label: '创建一级菜单'
          }
        ]
        this.menuList = this.menuList.concat(Obj)
      })
    },

    // 点击删除历史按钮
    getDeLHistory () {
      var path = '/sys/delHistory/index'
      bus.$emit('delHistoryPage', path)
      this.$router.push('/sys/delHistory/index')
    },

    // 点击新增菜单按钮
    handleAdd (index, row) {
      this.editVisible = true
      this.title = '新增菜单'
      this.form = MENU_MODEL
      this.$nextTick(() => {
        this.resetTemp()
        this.$refs['form'].resetFields()
      })
    },
    // 点击编辑菜单按钮
    handleEdit (row) {
      this.title = '编辑菜单'
      const id = row.id
      this.editVisible = true
      this.handelChanges = false
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        sysMenuService.menuInfo(id).then(resp => {
          if (resp.data.status == 1) {
            var da = resp.data.data
            this.form.name = da.name
            this.form.url = da.url
            this.form.icon = da.icon
            this.form.remark = da.remark
            this.form.sort = da.sort
            this.form.parentIds = da.parentIds
            this.selectList = this.form.parentIds
            this.form.id = da.id
            if (this.form.parentIds.length > 1) {
              this.form.parentId = this.form.parentIds[
                this.form.parentIds.length - 1
              ]
            } else {
              this.form.parentId = this.form.parentIds[0]
            }
          }
        })
      })
    },

    // 递归遍历 获取新增弹框里所选中的菜单
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

    // 重置搜索框
    reset () {
      this.searchInput = ''
      this.handleCurrent({
        pageIndex: 1,
        pageSize: 10
      })
    },

    // 设置菜单是否显示
    handleVisiable (row, id) {
      sysMenuService.visiable(id, row).then(resp => {
        if (resp.data.status == 1) {
          this.$message({
            message: '菜单显示状态改变成功',
            type: 'success'
          })
        }
        setTimeout(() => {
          this.myrefresh()
        }, 1000)
      })
    },

    // 新增菜单 ，菜单选择
    handleChange (value) {
      if (value !== 'ROOT' && value.length > 0) {
        value = value[value.length - 1]
        this.form.parentId = value
        this.handelChanges = true
        this.menuId = value
      }

      sysMenuService.getSort(value).then(item => {
        if (item.data.status == 1) {
          this.form.sort = item.data.data
          this.changeSort = item.data.data
        }
      })
    },
    // 新增菜单--输入排序触发接口，判断最大值
    visiableSort (sort, row) {
      Number(sort)
      let pid = ''
      if (row.parentIds.length > 1) {
        pid = row.parentIds[row.parentIds.length - 1]
      } else {
        pid = row.parentIds[0]
      }

      if (row.parentIds != '') {
        sysMenuService.getSort(pid).then(item => {
          if (item.data.status == 1) {
            if (sort > item.data.data) {
              this.$message({
                message: '排序不能大于' + item.data.data,
                type: 'error'
              })
              this.form.sort = item.data.data
              return false
            } else if (sort == 0) {
              this.$message({
                message: '排序不能等于0',
                type: 'error'
              })
              return false
            }
          }
        })
      }
    },

    // 重命名菜单名称
    renameTypeRow () {
      this.form.name = ''
      this.renameVisible = false
    },
    // 刷新页面
    myrefresh () {
      window.location.reload()
    },
    // 清空表单
    resetTemp () {
      this.selectList = []
      this.form = {
        id: '',
        createTime: '',
        createUserId: '',
        updateTime: '',
        updateUserId: null,
        parentId: '',
        name: '',
        type: null,
        url: '',
        visible: 1,
        icon: '',
        sort: '',
        remark: '',
        child: []
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
#mydialog .el-dialog {
  border-radius: 5px;
}
#mydialog .el-dialog__body {
  padding: 15px 20px;
}

#mydialog .el-input,
#mydialog .el-cascader.el-cascader--small {
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
</style>
