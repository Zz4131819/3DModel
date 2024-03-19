<template>
  <div>
      <RouterView/>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import RouterView from './components/routerView.vue'
export default defineComponent({
  components:{RouterView},
  setup() {
    
  },
})
</script>

<style>
body{
  margin: 0;
  padding: 0;
}
</style>