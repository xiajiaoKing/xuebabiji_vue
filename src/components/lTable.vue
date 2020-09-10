<template>
  <div>
    <el-table :data="data"
              :height="height"
              v-loading="loading"
              style="width: 100%">
      <el-table-column type="index" :label="indexName" v-if="showIndex"></el-table-column>
      <el-table-column
        :width="item.width || 'auto'"
        v-for="(item,index) in label"
        :prop="item.prop" :label="item.label" :key="index">
        <template>
          <slot name="name"></slot>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="paging" class="is_pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="page_sizes"
        :page-size="page_sizes[0]"
        :current-page="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'lTable',
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      label: {
        type: Array,
        default: function () {
          return []
        }
      },
      total: {
        type: Number,
        default: function () {
          if (this.paging){
            return Number
          } else {
            return  1
          }
        }
      },
      page_sizes: {
        type: Array,
        default: function () {
          return []
        }
      },
      loading:Boolean,
      currentPage:Number,
      paging:{
        type:Boolean,
        default:function () {
          return true
        }
      },
      showIndex:{
        type:Boolean,
        default: function () {
          return true
        }
      },
      indexName:{
        type:String,
        default: function () {
          return '序号'
        }
      },
      height:{
        type:String,
        default:function () {
          return '550px'
        }
      }
    },
    data () {
      return {
        //indexName:'序号',
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.$emit('handleCurrentChange', val)
      },
      handleSizeChange (val) {
        this.$emit('handleSizeChange', val)
      },
      // is(val){
      //   return val === 0;
      // }
    }
  }
</script>

<style scoped>
  /*分页*/
  .is_pagination {
    text-align: right;
    margin-right: 100px;
    padding: 12px 0;
    background: #fff
  }
</style>
