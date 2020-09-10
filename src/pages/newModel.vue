<template>
  <div class="add-page">
     <div v-if="this.param=='addCycle'">
       <addCycle></addCycle>
     </div>
  
  </div>
</template>

<script>
import addCycle from '@/pages/cycle/add'

export default {
  name: 'newModel',
  components:{
    addCycle
  },
  data () {
    return {
      param:''
    }
  },

  created () {
   this.getParam()
  },

  methods: {
    getParam(){
       this.param = this.$route.query.name;
    }
  }
}
</script>
<style scoped>

</style>
