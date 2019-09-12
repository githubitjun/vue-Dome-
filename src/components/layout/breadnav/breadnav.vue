<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{navone}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{navtow}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    //将来在 父组件中要传入两个参数
    props:['navone','navtow']
}
</script>

<style>

</style>
