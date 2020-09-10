<template>
   <div class="tagbom">
    <div class="tags" v-if="showTags">

      <el-tabs v-model="editableTabsValue" type="card" 
      closable
      @tab-click="goPath"
      @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="(item, index) in loadData"
          :key="index"
          :label="item.title"
          :name="item.path"

        >
      
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import publicFun from '../../util/public.js'
import bus from "./bus";

export default {
  data() {
    return {
      loadData: [],
      editableTabsValue: ""
    };
  },
  methods: {
    //点击标签
    goPath(tab, enent) {
      this.$router.push(tab.name);
    },

    //关闭标签
    removeTab(targetName) {
      let tabs = this.loadData;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.path === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              this.$router.push(nextTab.path);
              activeName = nextTab.path;
            }
          }
        });

        if (tabs.length == 1) {
          this.$router.push("/dashboard");
        }
        this.editableTabsValue = activeName;
      }

      this.loadData = tabs.filter(tab => tab.path !== targetName);
    },

    // 关闭其他标签
    closeOther() {
      const curItem = this.loadData.filter(item => {
        return item.path === this.$route.fullPath;
      });
      this.loadData = curItem;
    },

    // 设置标签
    setTags(route) {
    
      if (route.fullPath != "/dashboard") {
        const isExist = this.loadData.some(item => {
          return item.path === route.fullPath;
        });

        if (!isExist) {
          this.loadData.push({
            title: route.meta.title,
            path: route.fullPath,
            name: route.matched[1].components.default.name
          });
          
          if(publicFun.getNewPage()){
            
            this.editableTabsValue = publicFun.getNewPage()
          }  
        }
        this.getData();
      }
    },
    handleTags(command) {
      command === "other" ? this.closeOther() : this.closeAll();
    },
    //当只一个Tabs时，要被选中
    getOneTabActive() {
      let tabs = this.loadData;
      if (tabs.length == 1) {
        this.editableTabsValue = tabs[0].path;
      }
    },
    getData() {
      bus.$emit("tags", this.loadData);
    }
  },

  computed: {
    showTags() {
      return this.loadData.length > 0;
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.setTags(newValue);
    }
  },
  mounted() {
    this.getOneTabActive();
  },

  created() {
    this.setTags(this.$route);

    bus.$on("selectMenu", item => {
      this.editableTabsValue = item;
    });

   
  }
};
</script>

<style>
.tagbom {
  background: #fff;
}
.tagbom .el-tabs__header {
  margin: 0 !important;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  border-right: 1px solid #ddd;
  border-top: 1px solid #ddd;
  font-size: 14px;
  overflow: hidden;
  cursor: pointer;
  height: 38px;
  line-height: 38px;
  background: #fff;
  padding: 0 10px 0 25px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}
li.tags-li:focus {
  outline: none;
}
span.tags-li-icon {
  padding-left: 10px;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #409eff;
  border-bottom: none;
  height: 40px;
  line-height: 40px;
  border-left: none;
  background: #fff;
  border-color: #ddd;
}

.tags-li-title {
  float: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #409eff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
</style>
