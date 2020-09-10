<template>
    <div class="sidebar" >
      <!-- 折叠按钮 -->

        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :default-openeds="openMenus"  :collapse="collapse"   @select="selectMenu" id="sidebar" background-color="#409EFF"
            text-color="#ffffff" active-text-color="#ffffff" :unique-opened="false" router  >
          <div class="place-holder">&nbsp;</div>
            <template v-for="item in items">
                <template v-if="item.children && item.children.length>0">
                    <el-submenu :index="item.url" :key="item.id" :class="urlIndex == item.url ? 'hoverBg' : 'normalBg'">
                        <template slot="title" >
                            <i :class="item.icon" class="white"></i><span slot="title">{{ item.name }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu v-if="subItem.children && subItem.children.length>0" :index="subItem.url" :key="subItem.id">
                                <template slot="title">{{ subItem.name }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.url">
                                    {{ threeItem.name }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else  :index="subItem.url" :key="subItem.id">
                              <span v-if="urlIndex == subItem.url && showActive" style="color:#2E83DB">{{ subItem.name }}</span>
                                <span v-else  style="color:#909399">{{ subItem.name }}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.url" :key="item.id" :class="urlIndex == item.url ? 'hoverBg' : 'normalBg'" >
                        <i :class="item.icon"  class="white"></i><span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </template>
          <div class="place-holder">&nbsp;</div>

          <div class="collapse-btn flex-center el-menu-top " @click="collapseChage" :class="[showLogo?'uncollapse':'collapsed']" >

            <img :src="logo" class="logo"/>
            <div v-show="showLogo" class="flex-column-center logo-wrapper" >
              <span  class="logo-tips">XXXX管理系统</span>
          </div>
          </div>
          <!--<div :class="[showLogo?'search-menu':'search-hide']">-->
            <!--<el-autocomplete-->
              <!--v-model="state"-->
              <!--clearable-->
              <!--:fetch-suggestions="querySearchAsync"-->
              <!--placeholder="请输入内容"-->
              <!--@select="handleSelect"-->
            <!--&gt;</el-autocomplete>-->
          <!--</div>-->

          <div :class="[showLogo?'uncollapse':'collapsed']" class="collapse-btn el-menu-bottom flex-center" @click="collapseChage">
            <i class="el-icon-menu"></i>
          </div>
        </el-menu>
    </div>
</template>

<script>
import bus from "../common/bus";
import logo from "@/assets/images/hydl_logo.png";
export default {
  data() {
    return {
      logo: logo,
      collapse: false,
      showActive: false,
      getOpenActive: false,
      childrenList: [],
      parentUrl: "",
      urlIndex: "",
      parentId: "",
      items: [],
      state: "",
      openMenus: [],
      searchList: [],
      restaurants: [],
      loadData: [],
      timeout: null,
      items1: [
        {
          icon: "el-icon-lx-home",
          id: "dashboard",
          value: "系统首页"
        }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
    showLogo() {
      return !this.collapse;
    }
  },

  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
    bus.$on("tags", item => {
      this.loadData = item;
    });
    this.getMenu();
  },

  methods: {
    getMenu() {
      bus.$on("CHANGE_SUB_MENU", items => {
        const levelThree = [];
        for (var key in items) {
          const it = items[key];
          // 默认展开第一个菜单
          // if (key == 0) {
          //   this.openMenus.push(items[0].url);
          // }

          if (it.children.length > 0) {
            const child = it.children;
            this.childrenList = it.children;
            child.forEach(resitem => {
              levelThree.push(resitem);
            });
          }
        }
        this.items = items;
        levelThree.forEach(item => {
          item.value = item.name;
        });
        this.restaurants = levelThree;
      });
    },

    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    selectMenu(index, indexPath) {
      bus.$emit("selectMenu", index);
      this.urlIndex = index;
      this.showActive = true;
      if (!this.getOpenActive) {
        this.state = "";
      }
    },

    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      console.log(this.restaurants, "11111111111111111");
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },

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
        }
      }
    },
    handleSelect(item) {
      this.$router.push(item.url);
      this.parentId = item.parentId;
      this.setTags(this.$route);

      this.getParentUrl(item.url);

      this.selectMenu(item.url);

      this.getOpenActive = true;
      this.showActive = true;
    },

    getParentUrl(path) {
      const list = this.restaurants;
      var self = this;
      var pId = "";

      list.forEach(item => {
        if (item.url == path) {
          self.parentUrl = item.url;
          pId = item.parentId;
        }
      });
      var item = self.items;
      item.forEach(its => {
        if (its.id == pId) {
          self.openMenus.push(its.url);
        }
      });
    }
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  }
};
</script>

<style scoped>
.logo {
  width: 40px;
  height: 40px;
}

.logo-wrapper {
  margin-left: 10px;
  height: 70px;
}
.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #d7e6fe;
}
.logo-tips {
  font-size: 16px;
  color: #d7e6fe;
}
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 220px;
}
.uncollapse {
  width: 220px !important;
}
.collapsed {
  width: 63px !important;
}
.sidebar > ul {
  height: 100%;
}
.collapse-btn {
  width: 30px;
  cursor: pointer;
  height: 70px;
  color: #ffffff;
  width: 100%;
  -webkit-transition: left 0.3s ease-in-out;
  transition: left 0.3s ease-in-out;
}
.el-menu-top {
  position: fixed;
  top: 0;
  left: 0;
}
.el-menu-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 30px;
  background-color: rgb(51, 126, 204);
}
.white {
  color: #ffffff;
  margin-right: 20px;
}
.place-holder {
  height: 70px;
  width: 100%;
  background-color: #409eff;
}
.search-hide {
  display: none;
}
</style>
<style>
li.el-submenu.is-opened.hoverBg .el-submenu__title,
li.el-submenu.is-opened.normalBg .el-submenu__title {
  background-color: #2e83db !important;
}

.sidebar .el-submenu .el-menu-item,
ul.el-menu.el-menu--popup.el-menu--popup-right-start span,
ul.el-menu.el-menu--popup.el-menu--popup-right-start li {
  background-color: #f1f5f8 !important;
  color: #909399 !important;
}
.sidebar .el-submenu .el-menu-item:hover {
  color: #2e83db !important;
}
li.el-menu-item.hoverBg {
  background-color: #2e83db !important;
}
ul.el-menu.el-menu--popup.el-menu--popup-right-start span:hover {
  color: #2e83db !important;
}
.search-menu {
  position: fixed;
  top: 70px;
  left: 10px;
}
.search-menu .el-input--small .el-input__inner {
  border-radius: 50px;
}
.search-menu .el-input {
  width: 90%;
}
</style>
