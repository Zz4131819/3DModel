<template>
    <div class="container" ref="scrollContainer" @scroll="handleScroll">
        <div class="item">
            <TopPage />
            <div class="animated-element" @click="nextContainer">
                <img src="@/assets/images/arrow-down.png" >
            </div>
        </div>
        <div class="item">
            <centerPage />
            <div class="animated-element" @click="nextContainer">
                <img src="@/assets/images/arrow-down.png" >
            </div>
        </div> 
        <div class="item">
            <BottomPage/>
            <div class="animated-element" @click="nextContainer">
                <img src="@/assets/images/arrow-down.png" >
            </div>
        </div>
    </div>
</template>
  
<script setup>
import TopPage from './topPage.vue'
import CenterPage from './centerPage.vue'
import BottomPage from './bottomPage.vue'
import { ref } from 'vue'
const scrollContainer = ref()
const nextContainer = () =>{
    const container = scrollContainer.value
    if (container) {
        const scrollHeight = container.scrollHeight
        const currentScrollTop = container.scrollTop
        const itemHeight = container.clientHeight
        let targetScrollTop = currentScrollTop + itemHeight
        if (targetScrollTop + itemHeight > scrollHeight) {
            targetScrollTop = 0
        }
        container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        })
    }
}
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
