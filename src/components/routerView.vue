<template>
    <el-container>
        <el-header class="Header">Header</el-header>
        <el-main class="main"><router-view></router-view></el-main>
    </el-container>
</template>
<script>
    export default {
        name: 'MainLayout'
    };
</script>
<style scoped>
.Header{
    background-color: rgba(246, 246, 246, 1);
    padding: 0 !important;
}
.main{
    padding: 0;
}
</style>
