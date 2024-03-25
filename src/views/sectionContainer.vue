<template>
    <div class="container" ref="scrollContainer" @scroll="handleScroll">
        <div class="item">
            <TopPage />
            <div class="animated-element">
                <img src="@/assets/images/arrow-down.png" >
            </div>
        </div>
        <div class="item">
            <centerPage />
            <div class="animated-element">
                <img src="@/assets/images/arrow-down.png" >
            </div>
        </div> 
        <div class="item">
        </div>
    </div>
</template>
  
<script setup>
import TopPage from './topPage.vue'
import centerPage from './centerPage.vue'

</script>
  
<style lang="scss" scoped>
.container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100%;
}

.item {
    scroll-snap-align: center;
    height: 100%;
 
}
  
  
@keyframes jump-fade {
  0%, 100% {
    transform: translateY(0);
    opacity: 0;
  }
  50% {
    transform: translateY(-20px);
    opacity: 1;
  }
}

.animated-element {
  width: 100vw;
  height: 80px;
  position: fixed;
  bottom: 0px;
  text-align: center;
  line-height: 100px;
  animation: jump-fade 1.5s ease-in-out infinite;
  img{
    width: 20px;
    height: 20px;
  }
}

</style>
