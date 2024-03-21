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
        <el-main class="main"><router-view></router-view></el-main>
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

</style>
