<template>
  <div class="app-container1">
    <div class="add-container mbt1020" >
      <p class="label-p">基础操作</p>
        <el-button type="primary" @click="addRow('')" >新增</el-button>
        <el-button type="danger" @click="delRow">删除</el-button>
    </div>
    <div class="search-box mbt1020" id="search-box" >


      <!-- 项目名称 -->
       <span class="inputLabel">搜索</span>
       <el-input v-model="keyword" placeholder="输入关键字搜索" style="width:180px;" clearable></el-input>
       <el-button plain @click="reset">重置</el-button>
       <el-button type="primary" @click="getSearch">查询</el-button>
    </div>
    <div id="content-table" class="select-table" >

      <!-- 表格数据 -->

      <el-row style="margin: 0px;border-bottom:1px solid #EBEEF5;line-height:35px;" >

       <el-col :span="1">&nbsp;</el-col>
      <el-col :span="21">

        <div class="grid-content bg-purple">
          <div class="orgManageText" style="color: #909399">变电组别</div>
        </div>
      </el-col>

      <el-col :span="1" style="position:absolute;right:74px;width:50px;">
        <div class="grid-content bg-purple">
          <div class="orgManageText " style="color: #909399;padding-left:17px ;width:80px" >编辑</div>
          </div>
      </el-col>
    </el-row>
    <el-row  :style="contentStyleObj" style="margin: 0px;border-bottom:1px solid #EBEEF5;line-height:35px;overflow-y:scroll">
      <el-col :span="24"><div clas ="grid-content bg-purple"><div class="orgManageText">

        <div class="custom-tree-container">
          <div class="block">
            <el-tree
              :data="data"
              id="treeTable"
              node-key="id"
              ref="tree"
              show-checkbox
              default-expand-all
              :default-checked-keys="[]"
              :expand-on-click-node="true"
              :filter-node-method="filterNode"
              >

      <span class="custom-tree-node treeContainer"   slot-scope="{ node, data }">
        <div class="treeMain">
         <span  class="TreeName">
            <span class="file-name">{{ node.label }}</span>
         </span>

         <span  class="treeEdit" >
            <el-button  type="success" @click.stop="addRow(node.data)" plain size="mini">编辑</el-button>
          </span>

        </div>
        </span>

            </el-tree>
          </div>
        </div>
      </div>
      </div>
      </el-col>
    </el-row>

    </div>

    <el-dialog v-dialogDrag :title="title"
    :visible.sync="dialogFormVisible"
    width="550px"
    id="inportDialog"
    >
  <el-form :model="addForm" ref="addForm" :rules="ruleForm" label-width="80px" >
    <el-form-item label="所属上级" prop="level">
      <el-cascader
      v-model="selectVal"
      :options="options"
      @change="((values)=>getSelect(values,options))"
      placeholder="请选择所属上级"
       :props="{ checkStrictly: true,expandTrigger:'hover',emitPath:true}"
      clearable
      filterable
      show-all-levels
      style="width:350px;"
      >
    </el-cascader>

    </el-form-item>
  <el-form-item label="变量组别" prop="powerName">
    <el-input v-model="addForm.powerName"  style="width:350px;" ></el-input>
  </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm">确 定</el-button>
  </div>
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
import baiseInfoService from "@/services/sys/transformerSubstation";
// import Pagination from "@/components/PaginationText"

export default {
  name: "",
  // components: { Pagination },
  data() {
    return {
      dialogFormVisible: false,
      childrenLength: false,
      delRootVisible: false,
      setChecked: [],
      data: [],
      options: [],
      selectVal: [],
      ids: "",
      projectName: "",
      title: "新增",
      keyword: "",
      selectArr: [],
      addForm: {
        parentId: "",
        powerName: "",
        id: "",
        level: ""
      },
      ruleForm: {
        powerName: [
          {
            required: true,
            message: "请输入变电组别"
          }
        ],
        level: [
          {
            required: true,
            message: "请选择所属上级",
            trigger: "blur"
          }
        ]
      },
      contentStyleObj: {
        height: ""
      }
    };
  },
  created() {
    this.getList();
    this.getSelectList();
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    handleCurrentChange(val) {},
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 290 + "px";
    },

    //获取列表
    getList() {
      this.loading = true;
      baiseInfoService.getList({ powerName: this.keyword }).then(resp => {
        if (resp.data.status === 1) {
          this.data = resp.data.data;
          //   this.TotalPages = resp.data.data.total
          this.loading = false;
        }
      });
    },

    getSearch() {
      this.$refs.tree.getCheckedKeys();
      this.$refs.tree.filter(this.keyword);
      var checkedArr = this.getArrayId(this.data, this.keyword);
      this.$refs.tree.setCheckedKeys(checkedArr);

      console.log(this.setChecked);
      //  var abc = ['0a90d5fd-7040-4dbc-be12-b35d1454ab53']
      //  this.setChecked = abc
      // console.log(abc)
      // console.log(this.setChecked)
    },

    filterNode(value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) return true;
      // 如果传入的value和data中的label相同说明是匹配到了
      if (data.label.indexOf(value) !== -1) {
        return true;
      }

      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node);
    },

    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode(value, data, node) {
      const level = node.level;
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false;
      }
      // 先取当前节点的父节点
      let parentData = node.parent;
      // 遍历当前节点的父节点
      let index = 0;
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.label.indexOf(value) !== -1) {
          return true;
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent;
        index++;
      }
      // 没匹配到返回false
      return false;
    },

    // 递归遍历
    getArrayId(data, val) {
      var arr = [];
      var str = "";
      for (var i in data) {
        if (data[i].label.indexOf(val) !== -1) {
          arr.push(data[i].id);
        } else {
          var childArr = this.getArrayId(data[i].children, val);
          arr = arr.concat(childArr);
        }
      }

      return arr;
    },

    //变电管理级列表
    getSelectList() {
      baiseInfoService.getSelectList().then(resp => {
        if (resp.data.status === 1) {
          var obj = resp.data.data;
          this.options = [{ value: "ROOT", label: "创建变电管理所", level: 1 }];
          this.options = this.options.concat(obj);
        }
      });
    },

    addRow(row) {
      this.dialogFormVisible = true;
      if (row) {
        this.title = "编辑";

        this.$nextTick(() => {
          this.$refs["addForm"].resetFields();
          this.selectVal = row.parentId;
          this.addForm.id = row.id;
          this.addForm.level = row.level;
          this.addForm.parentId = row.parentId;
          this.addForm.powerName = row.label;
        });
      } else {
        this.title = "新增";
        this.$nextTick(() => {
          this.resetTemp();
          this.$refs["addForm"].resetFields();
        });
      }
    },
    getSelect(value) {
      let lastItem = this.options;
      const fullValues = value.map((val, index) => {
        const curItem = lastItem.find(item => item.value === val);
        lastItem = curItem ? curItem.children : [];
        return curItem;
      });
      this.selectArr = fullValues[fullValues.length - 1];
      let val = this.selectVal[this.selectVal.length - 1];
      this.addForm.parentId = val;
      if (this.selectArr.id != undefined) {
        this.addForm.level = this.selectArr.level;
      } else {
        if (val == "ROOT") {
          this.addForm.level = 1;
        } else {
          this.addForm.level = this.selectArr.level + 1;
        }
      }
    },
    //提交新增
    submitForm() {
      console.log(this.addForm.parentId);
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          baiseInfoService.editForm(this.addForm).then(resp => {
            if (resp.data.status === 1) {
              this.$message.success("新增成功");
              this.dialogFormVisible = false;
              this.getList();
              this.getSelectList();
            } else {
              this.$message.success(resp.data.msg || "新增失败");
            }
          });
        }
      });
    },
    delRow() {
      const idsArray = this.$refs.tree.getCheckedNodes();
      this.childrenLength = false;
      if (idsArray.length > 0) {
        for (let i in idsArray) {
          if (idsArray[i].children && idsArray[i].children.length > 0) {
            this.childrenLength = true;
            this.delRootVisible = true;
          }
        }
        if (!this.childrenLength) {
          this.delChildMenu();
        }
      } else {
        this.$message.warning("请选择需要删除的菜单");
      }
    },
    delChildMenu() {
      this.ids = this.$refs.tree.getCheckedKeys(true);
      const id = this.ids.join(",");
      baiseInfoService.delRow({ id: id }).then(resp => {
        if (resp.data.status === 1) {
          this.$message.success("删除成功");
          this.delRootVisible = false;
          this.getList();
        } else {
          this.$message.error(resp.data.msg || "删除成功");
        }
      });
    },
    reset() {
      this.keyword = "";
    },
    resetTemp() {
      this.selectVal = [];
      this.addForm = {
        parentId: "",
        powerName: "",
        id: "",
        level: ""
      };
    }
  }
};
</script>
<style scope>
.content {
  background: #fff;
}
label.el-checkbox.title-checkbox {
  float: left;
  padding-left: 35px;
}

.label-p {
  color: #c0c4cc;
  font-size: 12px;
  margin: 10px 0;
}
.file-name {
  padding-right: 5px;
}
i.el-icon-folder-opened.file-name {
  color: #f8af09;
}
span.custom-tree-node.treeContainer {
  width: 100%;
}

.treeMain span.TreeName {
  float: left;
  padding-left: 10px;
}
.treeMain span.treeEdit {
  width: 80px;
  position: absolute;
  right: 0;
}

.treeMain {
  line-height: 35px;
  width: 100%;
  position: relative;
}
#treeTable .el-tree-node__content {
  border-bottom: 1px solid #ebeef5;
  padding: 10px;
}
</style>
<style>
.el-upload__tip {
  position: absolute;
  left: 110px;
  margin-top: 0;
}

.upload-demo1 ul.el-upload-list.el-upload-list--text {
  width: 321px;
  display: block;
  height: 30px;
  margin-left: 100px;
  line-height: 30px;
  border: 1px solid #ddd;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.upload-demo1 .el-upload-list__item:first-child {
  margin-top: 5px;
}
#inportDialog .el-dialog__body {
  padding: 10px 20px 0 20px;
}
.upload-demo1 button {
  border: 1px solid #ddd;
  background: #fff;
  color: #409eff;
  padding: 8px 15px;
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.upload-demo1 .el-upload.el-upload--text {
  float: right;
  border: none;
  border-radius: 0;
}
.el-button--small span {
  font-size: 14px;
}
#inportDialog label.el-form-item__label {
  width: 96px;
}
#search-box .el-date-editor.el-input {
  width: 120px;
  margin-right: 8px;
}
#search-box .el-select {
  width: 120px;
  margin-right: 15px;
}
#content-table {
  border-top: 5px solid #f6f7f9;
  padding: 10px 0;
}
</style>
