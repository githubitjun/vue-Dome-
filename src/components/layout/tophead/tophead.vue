<template>
  <el-row>
    <el-col :span="4" class="mycol">
      <div class="grid-content bg-purple">
        <img src="../../../assets/logo.png" alt>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple-light">
        <h1>电商后台管理系统</h1>
      </div>
    </el-col>
    <el-col class="mycol logout" :span="4">
      <div class="grid-content bg-purple">
        <a href="#" @click.prevent="logout">退出</a>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    //退出登录
    logout() {
      this.$confirm("你确定要退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => { //点击确定时执行
        this.$message({
          type: "success",
          message: "退出成功!"
        });
        //清除 token 
        window.localStorage.removeItem('token')
        this.$router.push('/login')
      });
    }
  }
};
</script>

<style scoped>
.mycol {
  height: 60px;
}

.mycol img {
  height: 60px;
}
.logout {
  text-align: right;
}
.logout a {
  text-decoration: none;
  color: green;
}
</style>
