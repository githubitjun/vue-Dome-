<template>
  <el-card>
    <!-- 设置面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table border :data="tableData" style="width: 100%">
        <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label=层级>
          <template slot-scope="scope">
                {{scope.row.level==="0"?"一级" :( scope.row.level==="1"?"二级":'三级')}}
          </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
    data() {
        return {
            tableData:[]
        }
    },
    methods:{
        getAllRights(){
            this.$http.get('rights/list')
                .then(res=>{
                    this.tableData=res.data.data
                })
        }
    },
    mounted(){
        this.getAllRights()
    }
};
</script>

<style>
</style>
