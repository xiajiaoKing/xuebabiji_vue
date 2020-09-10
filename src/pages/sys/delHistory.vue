<template>
  <div class="app-container1">
    <div class="add-container mbt1020">
      <p class="label-p">基础操作</p>
        <el-button type="primary" @click="handleRecover">恢复</el-button>
    </div>
    <div class="search-box mbt1020">
      <span class="inputLabel">菜单名称</span>
      <el-input placeholder="请输入" clearable class="input-searchbox" style="width:160px" prefix-icon="el-icon-search" v-model="searchInput">
      </el-input>

       <el-button plain @click="reset()">重置</el-button>
       <el-button type="primary" @click="searchList()">查询</el-button>
    </div>
    <!-- 使用自定义树级表格 -->
    <div class="content-table">
    <el-table :data="dataList"
    tooltip-effect="dark"
    v-loading="loading"
    ref="multipleTable"
    style="width: 100%"
    size="medium"
    id="delHistoryTable"
      @select="handleSelectionChange">
                <el-table-column type="selection" width="70px" style="text-align:right">
                </el-table-column>
                <el-table-column prop="label" label="菜单名称" width="400px">

                </el-table-column>
                <el-table-column prop="url" label="链接" width="290px">
                </el-table-column>

                <el-table-column prop="create_time" label="删除时间" width="200px">
                </el-table-column>

                <el-table-column prop="parentName" label="上级菜单" show-overflow-tooltip >
                </el-table-column>
            </el-table>

              <pagination
                  v-show="TotalPages>0"
                  :total-pages="TotalPages"
                  :page-index.sync="pageIndex"
                  :page-size.sync="pageSize"
                  @pagination="handleCurrent"

                />
    </div>
    <!-- 删除提示框 -->
    <el-dialog title="选择恢复位置" v-dialogDrag :visible.sync="delVisible" width="550px">
      <div class="del-dialog-cnt">
        <span class="demonstration">上级菜单</span>
         <el-cascader
                placeholder="请选择所属上级菜单"
                v-model="menuVal"
                ref="cascaderAddr"
                id="delCascader"
                :options="menuList"
                :props="{ checkStrictly: true,expandTrigger:'hover' }"
                filterable
                @change="handleChange"
                clearable
                ></el-cascader>

      </div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="RecoverRow">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import sysMenuService from '@/services/sys/menu.js'
import Pagination from '@/components/PaginationText'
import dataJson from '@/pages/sys/data.json'

export default {
  name: 'menuPage',
  components: { Pagination },
  data () {
    return {
      loading: false,
      delVisible: false,
      TotalPages: 0,
      pageIndex: 1,
      pageSize: 10,
      dataList: [],
      menuVal: [],
      checkId: [],
      menuList: [],
      searchInput: '',
      parentId: ''
    }
  },
  created () {
    this.loadData()
    this.getMenuList()
  },
  methods: {
    handleCurrent (val) {
      this.loading = true
      this.pageIndex = val.pageIndex
      this.pageSize = val.pageSize
      sysMenuService
        .removeHistory(this.pageIndex, this.pageSize, this.searchInput)
        .then(resp => {
          if (resp.data.status === 1) {
            this.dataList = resp.data.data.list
            this.TotalPages = resp.data.data.total
            this.loading = false
          }
        })
    },
    searchList () {
      this.handleCurrent({ pageIndex: 0, pageSize: 10 })
    },

    reset () {
      this.searchInput = ''
      this.handleCurrent({ pageIndex: 1, pageSize: 10 })
    },
    loadData () {
      this.loading = true

      sysMenuService
        .removeHistory(this.pageIndex, this.pageSize, this.searchInput)
        .then(resp => {
          if (resp.data.status === 1) {
            this.dataList = resp.data.data.list
            this.TotalPages = resp.data.data.total
            this.loading = false
          }
        })
    },
    // 实现表格单选
    handleSelectionChange (selection, row) {
      if (selection.length > 1) {
        this.$refs.multipleTable.clearSelection()
      }

      // this.value = this.checkList[0].parentName
      if (selection.length === 0) {
        // 判断selection是否有值存在
        this.checkId = ''
        return
      }
      this.$refs.multipleTable.toggleRowSelection(row, true)
      this.checkId = row.id
      sysMenuService.menuInfo(row.id).then(resp => {
        if (resp.data.status === 1) {
          this.menuVal = resp.data.data.parentIds
          this.parentId = resp.data.data.parentId
        }
      })
    },
    handleChange (value) {
      this.menuVal = value
    },
    handleRecover () {
      console.log(!this.checkId)

      if (this.checkId != '') {
        this.delVisible = true
      } else {
        this.$message({
          message: '请勾选需要恢复的菜单',
          type: 'error'
        })
      }
    },
    RecoverRow () {
      sysMenuService.returnRecord(this.menuVal[0], this.parentId).then(resp => {
        if (resp.data.status == 1) {
          this.$message({
            message: '恢复菜单成功',
            type: 'success'
          })
        }

        this.delVisible = false
        this.loadData()
      })
    },

    getMenuList () {
      sysMenuService.menuSelect('ROOT').then(item => {
        var Obj = item.data.data

        this.menuList = [{ value: 'ROOT', label: '一级菜单' }]
        this.menuList = this.menuList.concat(Obj)
      })
    }
  }
}
</script>
<style scope>
#mydialog .el-dialog {
  border-radius: 5px;
}
#mydialog .el-dialog__body {
  padding: 15px 20px;
}
#mydialog .el-input {
  width: 350px;
}
.label-p {
  color: #c0c4cc;
  font-size: 12px;
  margin: 10px 0;
}
#vShow {
  background: #f4f4f5;
  width: 60px;
}
.content-table {
  border-top: 5px solid #f3f3f3;
}
.del-dialog-cnt {
  padding-bottom: 20px;
}

.fas-icon-list span {
  padding: 5px;
  font-size: 18px;
  cursor: pointer;
}
.red {
  color: #ff0000;
}
.green {
  color: #2ecc71;
}
#delCascader {
  width: 60%;
  margin-left: 10px;
}
</style>
<style>
#delHistoryTable th span.el-checkbox__input {
  display: none;
}
#delHistoryTable .el-table-column--selection .cell {
  padding-left: 30px;
}
</style>
