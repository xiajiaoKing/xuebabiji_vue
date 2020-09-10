<template>
  <div :class="tdClass">
    <span class="before-line" v-if="root !== 0 && nodes !== 1" :style="{'left':model.bLeft + 'px'}"></span>
    
		<table>
      <tr>
        <td :colspan="colSpan">
          <table ref="table">
              <tr class="leve" :class="levelClass">
                <td class="td1">
                  <div class="td-title" @dblclick="handlerExpand(model)">
									
                     <span v-if="model.child.length > 0" class="tree-close" :class="{'tree-open':model.isExpand}" @click="handlerExpand(model)"></span>
                    <a class="ellipsis">
												<el-checkbox  v-model="checkList"  :key="model.id" :checked="checked" :label="model.id" @change="handlercheck(model,root)">{{ model.name }}</el-checkbox>
											  <!-- <input class="checkbtn" :label="model.id" @click="checkboxOnclick(model.id)"  type="checkbox" :value="model.id" v-model="checkList" :checked = checked />{{model.name}} -->
                    </a> 
                  </div>
                </td>
                <td class="td2">
                  {{model.url}}
                </td>
                <td class="td3">{{model.sort}}</td>
                <td class="td4">
                  <span :title="model.createTime" class="ellipsis">{{model.createTime}}</span>
                </td>
                <td class="td5">
									<el-select  v-model="model.visible"  id="vShow" @change="handleVisiable(model.visible,model.id)">
										 <el-option v-for="item in visible" :key="item.is_heating" :label="item.name" :value="item.key" :class="model.visible == 1 ? 'colorClass' : 'resoureColor'"/>
									</el-select>

								</td>
                <td class="td6">
				           <el-button type="success" plain  @click="handleEdit(model)">编辑</el-button>
               </td>
              </tr>
          </table>
        </td>
      </tr>
      </table>
		
      <div v-show="model.isExpand" class="other-node" :class="otherNodeClass">
        <tree-item
          v-for="(m, i) in model.child"
          :key="String('child_node'+i)"
          :num='i'
          :root="1"
          @handleEdit="handleEdit"
          @deleteRow="deleteRow"
          @handlerExpand="handlerExpand"
					@handlercheck ="handlercheck"
					@handleVisiable="handleVisiable"
          :nodes.sync='model'
          :trees.sync='trees'
          :model.sync="m">
        </tree-item>

      </div>
			 
    </div>
</template>

<script>
  export default {
    name: 'treeItem',
				props: ['model', 'num', 'nodes', 'root', 'trees','datas'],
				data() {
					return {
						parentNodeModel: null,
						checkList:[],
						answer:[],
						value: '',
						checkId:"",
						checked:false,
						changeColor:true,
						visible: [
						{ name: '是', key: 1 },
						{ name: '否', key: 2 }
					],
					}
				},
				computed: {
					colSpan() {
						return this.root === 0 ? '' : 6
					},
					tdClass() {
						return this.root === 0 ? 'td-border' : 'not-border'
					},
					levelClass() {
						return this.model ? 'leve-' + this.model.level : ''
					},
					childNodeClass() {
						return this.root === 0 ? '' : 'child-node'
					},
					otherNodeClass() {
						return this.model ? 'other-node-' + this.model.level : ''
					}
				},
				watch: {
				
				},
				created(){
				
				},	
			
				methods: {
					 getArray(data, id) {
						if(id !== undefined){
						for (var i in data) {
						
							if (data[i].id == id) {
								break;
							} else {
								
								this.getArray(data[i].child, id);
							}
							}
						}
						
					},
					checkboxOnclick(){
		
						if(!this.checked){
								var self = this
							
							
								if(this.checkList[0]!=undefined){
									
									this.getArray(self.trees, this.checkList[0])
									
								}
							
						}else{

						}
					},
				
					getParentNode(m) {
						// 查找点击的子节点
						var recurFunc = (data, list) => {
							data.forEach((l) => {
								if (l.id === m.id) this.parentNodeModel = list
								if (l.child) {
									recurFunc(l.child, l)
								}
							})
						}
						recurFunc(this.trees, this.trees)
					},
					handlerExpand(m) {
			
            this.$emit('handlerExpand', m)
					},
					handlercheck(m,root) {
					
						this.$emit('handlercheck', m,root)
						
					},
				
					
					deleteRow(row) {
				
						this.$emit('deleteRow', row)
					
					},
					handleEdit(row) {
						this.$emit('handleEdit', row)
				
					},
					handleVisiable(row,id){

							this.$emit('handleVisiable', row,id)
					}
				},
				filters: {
					formatDate: function(date) {
            // 后期自己格式化
						return date //Utility.formatDate(date, 'yyyy/MM/dd')
					}
				}
  }
</script>
