<template>
  <el-menu
    default-active="2"
    class="mymenu el-menu-vertical-demo"
    background-color="#fff"
    text-color="#444"
    :unique-opened="true"
    :router="true"
  >
    <!-- 子选项 -->
    <el-submenu v-for="(item1,index1) in menusList" :key="index1" :index="item1.path">
      <!-- 子选项的标题 -->
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{item1.authName}}</span>
      </template>
      <!-- 子选项中的子选项 : 二级标题 -->
      <el-menu-item v-for="(item2,index2) in item1.children" :key="index2" :index="'/'+item2.path">
        <i class="el-icon-menu"></i>
        <span>{{item2.authName}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      menusList:[],
    };
  },
  methods: {
    async getAsideData() {
      let res = await this.$http.get("menus");
      let {data,meta} = res.data
      if (meta.status===200) {
          this.menusList = data
      }else{
        this.$message.error(meta.msg)
      }
    }
  },
  mounted() {
    this.getAsideData();
  }
};
</script>

<style>
</style>
