<template>
  <div class="containers" id="dictionaryPage">

      <div class="silderbar">
        <div class="silder-content">
          <div class="add-dic">
            <span><strong>字典类型</strong></span>
            <span class="textRight">
                <span class="el-icon-plus" @click="addTab()">添加</span>
            </span>
          </div>
          <div class="input-groud">
            <input placeholder="请输入内容" class="input-searchboxType" clearable prefix-icon="el-icon-search" v-model="searchDictName"  v-on:keyup="getVal" />
            <i class="el-icon-search search-icon"></i>
          </div>

        </div>
          <div class="tabs-bar">
              <div class="tabs-bar-nav">
                <div class="tabs-tab"  @click="handleClick(0)" :class="tabsActiveaLL  ? 'tabs-active' : ''" >
                  全部

                </div>
                <div class="tabs-tab" v-for="tab in tabsList" :key="tab.id"

                @click="handleClick(tab.id)" :class="editTypeVal == tab.id  ? 'tabs-active' : ''">
                  {{tab.dictName}}
                  <el-popover
                 placement="bottom"
                 trigger="hover"
                 width="40"

                 popper-class="itemprpover"
                  >
                  <div style="min-width:40px;width:40px;text-align:center">
                  <div class="editBox">
                     <p><el-button size="mini" type="text" @click="editDictType(tab)">编辑</el-button> </p>
                      <p><el-button type="text" size="mini" @click="handleDelType(tab,tab.id)">删除</el-button> </p>

                </div>
                </div>
                  <el-button v-show="editTypeVal == tab.id" class="el-icon-more right-cion-bg" slot="reference"></el-button>
                </el-popover>
                </div>
              </div>
            </div>
         </div>

      <div class="container-right">
        <div class="add-container">
          <p class="label-p">基础操作</p>
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button type="danger" @click="handleDelete">删除</el-button>
        </div>
        <div class="handle-box">
          <el-input placeholder="请输入内容" clearable class="input-searchbox" prefix-icon="el-icon-search" v-model="cond_dictName">
          </el-input>
          <el-button plain @click="reset">重置</el-button>
          <el-button type="primary" @click="search" style="margin-left:3px">筛选</el-button>
        </div>

    <div class="tabs-content">
         <el-table ref="multipleTable"
                      :data="tableData"
                      :name="allname"
                      tooltip-effect="dark"
                      v-loading="loading"
                      style="width: 100%"
                      size="medium"
                      id="dictionaryTable"
                      @selection-change="handleSelectionChange"
                    >
                <el-table-column type="selection" width="55">
                </el-table-column>
                  <el-table-column
                  label="序号"
                  width="50">
                  <template slot-scope="scope">
                    <span class="sortColor">{{scope.$index +(pageIndex - 1) * pageSize+1}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="dictName" label="字典名称" width="200">
                </el-table-column>

                <el-table-column prop="dictCode" label="字典代码" width="200">
                </el-table-column>

                <el-table-column prop="dictType" label="字典类型" show-overflow-tooltip width="220">
                </el-table-column>

                <el-table-column prop="remark" label="备注" > </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                     <el-button  type="success" plain   @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                 </template>
                </el-table-column>
            </el-table>
            <div v-if="tabsActiveaLL" >
              <pagination
                  v-show="TotalPages>0"
                  :total-pages="TotalPages"
                  :page-index.sync="pageIndex"
                  :page-size.sync="pageSize"

                  @pagination="handleCurrentChangeAll"
                />
    </div>
    <div v-else>
          <pagination
                  v-show="TotalPages>0"
                  :total-pages="TotalPages"
                  :page-index.sync="pageIndex"
                  :page-size.sync="pageSize"

                  @pagination="handleCurrentChange"
                />
    </div>
    </div>
 </div>

    <!-- 编辑弹出框 -->
    <el-dialog v-dialogDrag  :title="title" :visible.sync="editVisible" width="40%">
      <el-dialog title="重命名提示" :visible.sync="renameVisible2" width="30%" append-to-body>
             <div class="del-dialog-cnt"><p>目录中{{retitel2}}，</p>
               <p>是否重命名为：<span class="">{{rename}}</span></p></div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="renameVisible2 = false">取 消</el-button>
                 <el-button type="primary" @click="renameTypeRow(retitel2)">确 定</el-button>
            </span>

      </el-dialog>
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="字典类型" required="" prop="parentId">
           <el-select v-model="form.parentId"  @change="getSort(form.parentId)" :disabled="form.parentId != '' && title=='编辑' ? true : false" filterable placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in tabsList"
                :key="item.id"
                :label="item.dictName"
                :value="item.id"
                >
                {{ item.dictName }}

              </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="排序">
          <el-input v-model="form.sort" type="number"
          @keyup.native="visiableSort(form.sort)"

           :disabled="form.parentId != '' ? false : true" placeholder="请先选择字典类型"></el-input>
        </el-form-item>
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="字典编码" prop="dictCode">
          <el-input  :disabled="form.dictName != '' ? false : true" v-model="form.dictCode"  placeholder="请先输入字典名称" @focus="getDictCode(form.dictName)"></el-input>

        </el-form-item>
         <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea"  placeholder="请输入" autosize></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="cancelRuleForm">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 新建类型弹出框 -->
    <el-dialog :title="title" v-dialogDrag :before-close="handleClose" :visible.sync="addTypeVisible" width="40%">
       <el-dialog title="重命名提示" :visible.sync="renameVisible" width="30%" append-to-body>
             <div class="del-dialog-cnt"><p>目录中{{retitel}}，</p>
               <p>是否重命名为：<span class="">{{rename}}</span></p></div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="renameVisible = false">取 消</el-button>
                 <el-button type="primary" @click="renameTypeRow(retitel)">确 定</el-button>
            </span>

     </el-dialog>

      <el-form ref="ruleFormType" :model="typeForm" :rules="tylerules" label-width="100px">
        <el-form-item label="类型名称"  prop="dictName" >

          <el-input v-model="typeForm.dictName"  placeholder="请先输入类型名称"  ></el-input>
        </el-form-item>

        <el-form-item label="字典代码"  prop="dictCode">
          <el-input v-model="typeForm.dictCode"  placeholder="请先输入字典代码" @focus="getDictCode(typeForm.dictName)"></el-input>
        </el-form-item>
        <el-form-item label="备注" >
          <el-input v-model="typeForm.remark" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="addTypeVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveType">确 定</el-button>
            </span>

    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="警告" v-dialogDrag :visible.sync="delVisible" width="550px" >
      <div class="del-dialog-cnt2"><spaN v-if="delTypeVisible">是否删除此字典类型</span><span v-else>是否删除已勾选字典
</span></div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                 <el-button type="primary" v-if="delTypeVisible" @click="deleteTypeRow">确 定</el-button>
                <el-button type="primary" v-else @click="delDict">确 定</el-button>
            </span>
    </el-dialog>
     <!-- 类包含提示框 -->
    <el-dialog title="提示" v-dialogDrag   :visible.sync="delTypeItemVisible" width="550px" >
      <div class="del-dialog-cnt">删除失败！该字典类型还有字典字段存在，请确认后再执行此操作
</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delTypeItemVisible = false">取 消</el-button>
                <el-button type="primary"  @click="delTypeItemVisible = false">确 定</el-button>
            </span>
    </el-dialog>

  </div>

</template>

<script>
import sysDictionaryService from '@/services/sys/dictionary'
import Pagination from '@/components/PaginationText'

const DICT_MODEL = {
  id: '',
  dictCode: '',
  dictName: '',
  parentId: '',
  sort: '',
  remark: ''
}
const DICT_TYPE = {
  dictName: '',
  dictCode: '',
  remark: '',
  sort: 1,
  parentId: 'ROOT'
}

export default {
  name: 'basetable',
  components: { Pagination },
  data () {
    return {
      url: '@/mock/vuetable.json',
      TotalPages: 0,
      tableData: [],
      searchDictName: '',
      allname: '1',
      activeName: '0',
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      parentId: '',
      multipleSelection: [],
      codeName: '',
      cond_dictName: '',
      title: '新建',
      cond_dictCode: '',
      retitel: '',
      retitel2: '',
      retitel3: '',
      rename: '',
      changeSort: 0,
      del_list: [],
      leftTabsList: [],
      tabsList: [],
      tabPosition: 'left',
      is_search: false,
      editVisible: false,
      delTypeVisible: false,
      addTypeVisible: false,
      delTypeItemVisible: false,
      renameVisible: false,
      renameVisible2: false,
      renameVisible3: false,
      recodeVisible: false,
      tabsActiveaLL: true,
      tabsActive: false,
      visible2: false,
      getAll: false,
      editTypeVal: '',
      delVisible: false,
      visible: false,
      form: JSON.parse(JSON.stringify(DICT_MODEL)),
      typeForm: {
        dictName: '',
        dictCode: '',
        remark: '',
        sort: 1,
        parentId: 'ROOT'
      },
      renameCode: false,
      idx: -1,
      tylerules: {
        dictCode: [
          {
            required: true,
            message: '请输入类型代码',
            trigger: 'blur'
          }
        ],
        dictName: [
          {
            required: true,
            message: '请输入类型名称',
            trigger: 'blur'
          }
        ],
        remark: [
          {
            required: true,
            message: '请输入备注',
            trigger: 'blur'
          }
        ]
      },
      rules: {
        parentId: [
          {
            required: true,
            message: '请选择字段类型'
          }
        ],
        dictCode: [
          {
            required: true,
            message: '请输入字典代码',
            trigger: 'blur'
          }
        ],
        dictName: [
          {
            required: true,
            message: '请输入字典名称',
            trigger: 'blur'
          }
        ],
        dictValue: [
          {
            required: true,
            message: '请输入字典值',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  created () {
    //  this.getData()
    this.getDataType()
    this.getAllData()
  },
  watch: {},
  mounted () {},
  methods: {
    handleClose (done) {
      done()
      this.cancelRuleForm()
    },
    // 获取所有类型的字典项
    getDataType () {
      this.loading = false
      sysDictionaryService.findType(this.searchDictName).then(resp => {
        if (resp.data.status === 1) {
          const tList = resp.data.data
          this.tabsList = tList
          this.leftTabsList = tList
          this.loading = false
        } else {
          this.$message.error(resp.data.msg || '获取数据失败')
        }
      })
    },

    // 获取所有字典
    getAllData () {
      this.loading = true
      sysDictionaryService
        .dictAll(this.pageIndex, this.pageSize, this.codeName)
        .then(resp => {
          if (resp.data.status === 1) {
            const { list, total } = resp.data.data
            this.tableData = list
            this.TotalPages = total
            setTimeout(() => {
              this.loading = false
            }, 1 * 1000)
          } else {
            this.$message.error(resp.data.msg || '获取数据失败')
          }
        })
    },
    // 获取字体类型对应字典列表
    getData () {
      this.loading = true
      sysDictionaryService
        .page(this.pageIndex, this.pageSize, this.parentId, this.dictName)
        .then(resp => {
          if (resp.data.status === 1) {
            const { list, total } = resp.data.data

            this.tableData = list
            this.TotalPages = total
            setTimeout(() => {
              this.loading = false
            }, 1 * 1000)
          }
        })
    },
    // 字体类型搜索keyup觖发件事
    getVal () {
      var newLIST = []
      var search = this.searchDictName
      if (search !== '') {
        this.tabsList.forEach(item => {
          if (item.dictName.indexOf(search) >= 0) {
            newLIST.push(item)
          }
        })
        this.tabsList = newLIST
      } else {
        this.tabsList = this.leftTabsList
      }
    },

    /* 点击字典类型获取字典 */
    handleClick (tab) {
      var pageInfo = { pageIndex: 1, pageSize: 10 }
      if (tab == 0) {
        this.editTypeVal = tab

        this.handleCurrentChangeAll(pageInfo)
        this.tabsActiveaLL = true
        this.tabsActive = false
      } else {
        this.editTypeVal = tab
        this.parentId = tab
        this.tabsActiveaLL = false
        this.tabsActive = true
        this.handleCurrentChange(pageInfo)
      }
    },

    // 字典类型对应分页导航
    handleCurrentChange (val) {
      this.loading = true
      this.pageIndex = val.pageIndex
      this.pageSize = val.pageSize
      sysDictionaryService
        .page(this.pageIndex, this.pageSize, this.parentId, this.cond_dictName)
        .then(resp => {
          if (resp.data.status === 1) {
            const { list, total } = resp.data.data
            this.tableData = list
            this.TotalPages = total
            setTimeout(() => {
              this.loading = false
            }, 1 * 1000)
          }
        })
    },
    // 全部类型对应分页导航
    handleCurrentChangeAll (val) {
      this.loading = true
      this.pageIndex = val.pageIndex
      this.pageSize = val.pageSize
      sysDictionaryService
        .dictAll(this.pageIndex, this.pageSize, this.cond_dictName)
        .then(resp => {
          if (resp.data.status === 1) {
            const { list, total } = resp.data.data
            this.tableData = list
            this.TotalPages = total
            setTimeout(() => {
              this.loading = false
            }, 1 * 1000)
          }
        })
    },

    // 点击编辑类型
    showEditBox (id) {
      this.editTypeVal = id
    },

    // 获取字典代码
    getDictCode (code) {
      sysDictionaryService.getCode(code).then(resp => {
        if (resp.data.status === 1) {
          if (this.typeForm.dictName != '') {
            this.typeForm.dictCode = resp.data.data
          }
          if (this.form.dictName != '') {
            this.form.dictCode = resp.data.data
          }
        }
      })
    },

    /** 添加字典类型 */
    addTab () {
      this.addTypeVisible = true
      var obj = Object.assign({}, DICT_TYPE)
      this.typeForm = obj
      this.title = '添加字典类型'
      this.$nextTick(() => {
        this.resetTypeTemp()
        this.$refs['ruleFormType'].resetFields()
      })
    },
    /** 编辑字典类型 */
    editDictType (row) {
      if (row) {
        this.title = '编辑字典类型'
        this.addTypeVisible = true
        this.editTypeVal = 0
        // this.resetTypeTemp()
        this.$nextTick(() => {
          this.$refs['ruleFormType'].resetFields()
          this.typeForm.dictName = row.dictName
          this.typeForm.dictCode = row.dictCode
          this.typeForm.remark = row.remark
          this.typeForm.id = row.id
          console.log(this.typeForm)
        })
      }
    },
    // 搜索字典
    search () {
      var pageInfo = { pageIndex: 1, pageSize: 10 }
      if (this.parentId != '') {
        this.handleCurrentChange(pageInfo)
      } else {
        this.handleCurrentChangeAll(pageInfo)
      }
    },
    // 新建弹框
    handleAdd () {
      this.title = '新建'

      var obj = Object.assign({}, DICT_MODEL)
      this.form = obj
      this.editVisible = true
      this.$nextTick(() => {
        this.resetTemp()
        this.$refs['ruleForm'].resetFields()

        if (this.parentId !== '') {
          this.form.parentId = this.parentId
          this.getSort(this.parentId)
        }
      })
    },
    // 编辑弹框
    handleEdit (index, row) {
      // 没有查询数据库获得值而直接清空数据 出现bug
      this.title = '编辑'
      this.editVisible = true
      this.$nextTick(() => {
        // this.resetTemp()
        // this.$refs['ruleForm'].resetFields()
        this.form = JSON.parse(JSON.stringify(row))
      })
    },

    // 删除字典类型
    handleDelType (val, id) {
      this.parentId = id
      console.log(id)
      if (this.tableData.length > 0) {
        this.delTypeItemVisible = true
      } else {
        this.delVisible = true
        this.delTypeVisible = true
      }
    },
    // 删除字典项弹框
    handleDelete () {
      if (this.multipleSelection.length > 0) {
        this.delVisible = true
        this.delTypeVisible = false
      } else {
        this.$message.warning('请选择需要删除的字典')
      }
    },

    // 删除字典项
    delDict () {
      const multipleSelection = this.multipleSelection
      let str = ''
      let arr = []
      multipleSelection.forEach(item => {
        arr.push(item.id)
      })
      str = arr.join(',')
      sysDictionaryService.remove(str).then(resp => {
        if (resp.data.status === 1) {
          this.$message.success('已成功删除已选字典')
          this.delVisible = false
          if (this.parentId !== '') {
            this.handleClick(this.parentId)
          } else {
            this.getAllData()
          }
        } else {
          this.$message.error(resp.data.msg || '删除字典失败')
        }
      })
    },

    // 获取选中字典项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 保存添加字典字典
    saveType () {
      this.$refs['ruleFormType'].validate(valid => {
        if (valid) {
          this.typeForm.parentId = 'ROOT'
          console.log(this.typeForm, '111')
          sysDictionaryService.save(this.typeForm).then(resp => {
            if (resp.data.status === 1) {
              this.$message.success('保存字典类型成功')
              this.addTypeVisible = false
              this.getDataType()
            } else {
              if (resp.data.msg == '字典名称重复') {
                this.retitel = '类型名称重复'
                this.renameVisible = true
                this.rename = resp.data.data.dictName
              } else {
                this.retitel = '类型代码重复'
                this.renameVisible = true
                this.rename = resp.data.data.dictCode
              }
            }
          })
          return true
        } else {
          return false
        }
      })
    },

    // 保存新增字典项
    save () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          var obj = {}
          for (var p in DICT_MODEL) {
            obj[p] = this.form[p]
          }

          sysDictionaryService.save(obj).then(resp => {
            if (resp.data.status === 1) {
              this.$message.success('保存字典信息成功')
              this.editVisible = false
              this.handleClick(this.form.parentId)
            } else {
              if (resp.data.msg == '字典名称重复') {
                this.renameVisible2 = true
                this.retitel2 = '字典名称重复'
                this.rename = resp.data.data.dictName
              } else {
                this.retitel2 = '字典代码重复'
                this.renameVisible2 = true
                this.rename = resp.data.data.dictCode
              }
            }
          })
          return true
        } else {
          return false
        }
      })
    },

    // 确定删除类型
    deleteTypeRow () {
      sysDictionaryService.removeType(this.parentId).then(resp => {
        if (resp.data.status === 1) {
          this.$message.success('已成功删除该字典')
          this.delVisible = false
          this.getDataType()
          this.getAllData()
          this.activeName = '全部'
          setTimeout(() => {
            this.loading = false
          }, 1 * 1000)
        } else {
          this.$message.error(resp.data.msg || '删除字典失败')
        }
      })
    },

    // 确定删除字典项
    deleteRow () {
      sysDictionaryService.remove(this.tableData[this.idx].id).then(resp => {
        if (resp.data.status === 1) {
          this.$message.success('已成功删除该字典')
          this.delVisible = false
          this.getData()
        } else {
          this.$message.error(resp.data.msg || '删除字典失败')
        }
      })
    },

    /** 展开明细时异步加载数据 */
    toggleRowExpansion (row, expandedRows) {
      if (!row.children) {
        sysDictionaryService.findByParent(row.id).then(resp => {
          if (resp.data.status === 1) {
            row.children = resp.data.data
          }
        })
      }
    },

    // 判断类型或字典项重复
    renameTypeRow (code) {
      if (code == '类型名称重复') {
        this.typeForm.dictName = this.rename
        this.typeForm.dictCode = ''
        this.renameVisible = false
      } else if (code == '类型代码重复') {
        this.typeForm.dictCode = this.rename
        this.renameVisible = false
      } else if (code == '字典名称重复') {
        this.form.dictName = this.rename
        this.form.dictCode = ''
        this.renameVisible2 = false
      } else {
        this.form.dictCode = this.rename
        this.renameVisible2 = false
      }
    },
    // 新增字典项时的获取自动排序
    getSort (id) {
      this.form.parentId = id
      sysDictionaryService.getSort(id).then(item => {
        if (item.data.status == 1) {
          this.form.sort = item.data.data
          this.changeSort = item.data.data
        }
      })
    },

    // 判断排序是否大于已有最大排序
    visiableSort (sort) {
      if (sort > this.changeSort) {
        this.$message({
          message: '排序不能大于' + this.changeSort,
          type: 'error'
        })
        this.form.sort = sort
      }
    },

    // 重置输入框

    reset () {
      this.cond_dictName = ''
      // this.handleCurrentChange({ pageIndex: 1, pageSize: 10 })
      this.handleClick(0)
    },
    resetTemp () {
      this.form = {
        dictName: '',
        dictCode: '',
        remark: '',
        sort: '',
        parentId: ''
      }
    },

    resetTypeTemp () {
      this.typeForm = {
        dictName: '',
        dictCode: '',
        remark: '',
        sort: 1,
        parentId: ''
      }
    },
    cancelRuleForm () {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
      this.form = JSON.parse(JSON.stringify(DICT_MODEL))
      this.editVisible = false
    }
  }
}
</script>
<style scoped>
.containers {
  position: relative;
  height: 100%;
  background: #f5f5f5;
  overflow: hidden;
  padding-top: 5px;
}

.label-p {
  color: #c0c4cc;
  font-size: 12px;
  margin: 10px 0;
}
.containers-top {
  position: relative;
  height: 140px;
}
.container-right {
  padding-left: 220px;
  background: #fff;
  z-index: 99;
  height: 100%;
  overflow-y: auto;
}
.silderbar {
  width: 200px;
  display: block;
  position: absolute;
  background: #f5f5f5;
  left: 0;
  top: 0;
  bottom: 0;
}
#rightTable {
  position: relative;
  height: calc(100% - 138px);
}
.Tags-list {
  height: 100%;
}
.silder-content {
  position: relative;
  background: #f5f5f5;
  z-index: 1;
}
.add-container {
  margin: 15px 0;
}
.add-dic {
  padding: 10px;
}
.add-dic strong {
  padding-left: 5px;
}
.add-dic .textRight {
  color: #409eff;
  cursor: pointer;
}

.input-searchboxType {
  width: 180px;
  margin-left: 10px;
  margin-top: 10px;
}
.all-type {
  height: 40px;
  background: #fff;
  width: 180px;
  text-align: left;
  line-height: 40px;
  margin-top: 15px;
  padding-left: 20px;
  font-size: 14px;
}
.handle-box {
  margin-bottom: 20px;
}
.handle-select {
  width: 120px;
}
.eltablelist {
  padding: 0 15px;
  background: #fff;
}
.handle-input {
  width: 180px;
  display: inline-block;
}
.input-searchbox {
  width: 180px;
}
.del-dialog-cnt {
  font-size: 16px;
}
.table {
  font-size: 14px;
}

.green {
  color: #2ecc71;
}
.mr10 {
  margin-right: 10px;
}
.containers .el-table--fit {
  border-right: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
}
span.el-tabself-span {
  display: block;
  position: relative;
  width: 100%;
}
input.input-searchboxType {
  width: 155px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  line-height: 30px;

  padding-left: 25px;
}
.input-searchboxType::-webkit-input-placeholder {
  color: #c3c3c3;
  font-size: 13px;
}
.input-groud {
  position: relative;
}

i.el-icon-search.search-icon {
  position: absolute;
  left: 16px;
  top: 19px;
  color: #c3c3c3;
  font-size: 13px;
}
.input-searchboxType.is-active,
.input-searchboxType:focus {
  border-color: #409eff;
  outline: 0;
  border-radius: 4px;
}

/* .editBox {
    position: absolute;
    right: -5px;
    top: 40px;
    background: #fff;
    border: 1px solid #ddd;
    width: 60px;
    text-align: center;
    z-index: 999;
} */
.my-tabs {
  font-size: 14px;
  color: #444;
}
.tabs-bar {
  border-bottom: 1px solid #eee;
  position: relative;
  padding: 5px 0;
  width: 200px;
  height: 100%;
  float: left;
  position: absolute;
  bottom: 0;
  left: 0;
  top: 95px;
  overflow-y: auto;
}
.tabs-bar-nav {
  width: 200px;
  position: relative;
}
.tabs-tab {
  min-width: 110px;
  padding: 10px 20px;
  width: 160px;
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.tabs-active {
  background: #fff;
}
.tabs-content {
  float: left;
  width: calc(100% - 20px);
}
</style>
<style>
#dictionaryTable th .cell {
  color: rgb(64, 158, 255);
}
/* .Tags-list .el-tabs--left .el-tabs__nav-scroll{
     height: inherit;
   } */
.tabs-tab button.el-icon-more.right-cion-bg {
  position: absolute;
  right: 20px;
  top: 10px;
  color: #fff;
  background: #ddd;
  padding: 4px;
  border-radius: 50%;
  cursor: pointer;
}

.tabs-tab button.el-icon-more.right-cion-bg:hover {
  background: #409eff;
}

.el-popover.el-popper.itemprpover {
  width: 40px;
  min-width: 40px !important;
}
.editBox .el-button--text:active {
  color: #66b1ff;
}
.editBox .el-button--text:hover {
  color: #66b1ff;
}
.editBox .el-button--text {
  color: #999999;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}

</style>
