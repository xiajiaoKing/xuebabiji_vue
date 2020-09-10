<template>
  <div>
    <el-input v-model="fun.name" class="fun__input"></el-input>
    <el-button type="text" class="item__addBtn" @click="addFun">添加功能</el-button>
    <el-button v-show="fun.visible && checked && checked.length > 0" type="text" class="item__delBtn" @click="delFun">删除</el-button>
    <span @click="arrowClick" style="cursor: pointer"><i v-show="!fun.visible" class="el-icon-arrow-right"></i>  <i v-show="fun.visible" class="el-icon-arrow-down"></i></span>
    <el-checkbox-group v-show="fun.visible" class="item-list" v-model="checked">
      <el-checkbox class="item" v-if="fun.children" v-for="(sub, index) in fun.children" :value="index" :label="index" :key="index">
        <el-input class="item__input" v-model="sub.name" placeholder="请输入功能"></el-input>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'FunctionItem',
  props: {
    fun: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },

    onDelete: {
      type: Function,
      default: (item) => {}
    }
  },
  data () {
    return {
      checked: []
    }
  },
  methods: {
    addFun () {
      let fun = {id: '', name: '', parentId: this.fun.id, projectId: this.fun.projectId}
      this.fun.children.push(fun)
      this.fun.visible = true
    },

    delFun () {
      this.checked.sort()
      for (let i = this.checked.length - 1; i >= 0; i--) {
        let index = this.checked[i]
        let items = this.fun.children.splice(index, 1)
        if (this.onDelete) {
          this.onDelete(items[0])
        }
      }
      this.checked = []
    },

    arrowClick () {
      this.fun.visible = !this.fun.visible
    }
  }
}
</script>

<style scoped>
  .fun__input {
    width: 240px
  }

  .item__input >>> .el-input__inner {
    border:none;
    padding:0;
    line-height: 32px;
    height: 32px;
  }

  .item-list {
    line-height: 20px;
    margin-top: 6px;
    border: 1px solid #E5E5E5;
    padding-left: 11px;
    max-height: 300px;
    overflow: auto;
    width: 227px;
    min-height: 70px;
  }

  .item__delBtn {
    color: #F56C6C;
    margin: 0 7px;
  }

  .item__addBtn {
    color: #4A9DF2;
    margin-left: 7px;
  }
</style>
