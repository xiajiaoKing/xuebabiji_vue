<template>
  <div
    :class="{'hidden':hidden}"
    class="pagination-container"
  >
    <el-pagination
    
      :current-page.sync="currentPage"
      :page-size.sync="pageSizeSync"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="TotalPages"
      page-sizes.sync="pageSizesSync"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from "@/util/scrollTo";

export default {
  name: "Pagination",
  props: {
    TotalPages: {
      required: true,
      type: Number
    },
    pageIndex: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 50, 100, 200, 500];
      }
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.pageIndex;
      },
      set(val) {
        this.$emit("update:pageIndex", val);
      }
    },
    pageSizeSync: {
      get() {
        return this.pageSize;
      },
      set(val) {
        this.$emit("update:pageSize", val);
      }
    },
    pageSizesSync: {
      get() {
        return this.pageSizes;
      },
      set(val) {
        this.$emit("update:pageSizes", val);
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("pagination", { pageIndex: this.currentPage, pageSize: val });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { pageIndex: val, pageSize: this.pageSizeSync });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    }
  }
}; //
</script>

<style scoped>
</style>
<style>
.pagination-container.hidden {
  display: none;
}
.pagination-container{
    background: #fff;
    margin-top: 0px;
    padding:20px 0 30px 0!important;
    text-align: right!important;
}
</style>
