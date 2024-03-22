<template>
    <el-container>
        <el-header class="Header">
            <div class="box">
                <div class="title">
                    3D Model
                </div>
                <div>
                    <a href="https://github.com/Zz4131819/3DModel.git">
                        <img src="../assets/images/github.png" />
                    </a>
                </div>
            </div>
        </el-header>
        <el-main class="main">
            <router-view></router-view>
        </el-main>
        <div class="animated-element">
            <template>
                <el-icon name="arrow-down-bold" />
            </template>
        </div>
    </el-container>
</template>
<script>
export default {
    name: 'MainLayout'
};
</script>
<style scoped lang="scss">
.Header{
    background-color: rgba(246, 246, 246, 1);
    padding: 0;
    border-bottom: 1px solid rgb(236 237 243);
    height: 64px;
    width: 100%;
    position: fixed;
    .box{
        display: flex;
        margin: 8px 16px 8px 8px;
        flex-wrap: nowrap;
        align-items: center;
        height: calc(64px - 16px);
        justify-content: space-between;
        .title{
            text-indent: 2em;
            font-size: 20px;
            font-weight: 600;
        }
        img{
            width: 24px;
            height: 24px;
            margin: auto;
        }
    }
}
.main{
    padding: 0;
    overflow: hidden;
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
  height: 100px;
  position: relative;
  bottom: 100px;
  background-color: #007bff;
  color: white;
  text-align: center;
  line-height: 100px;
  animation: jump-fade 1s ease-in-out infinite;
}


</style>
