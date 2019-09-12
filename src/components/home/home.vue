<template>
  <div class="mycon">
    <el-container>
      <!-- 头部 -->
      <el-header>
          <TopHead></TopHead>
      </el-header>
      <el-container>
        <!-- 侧边栏区域 -->
        <el-aside width="200px">

            <Aside></Aside>
        </el-aside>
        <!-- 内容区域 -->
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import TopHead from '../layout/tophead/tophead.vue'
import Aside from '../layout/aside/aside.vue'

export default {
    components:{
        TopHead,
        Aside,
    },
    mounted() {
     var  token =  window.localStorage.getItem('token')
     if (!token) {
         this.$router.push('/login')
     }
    },
};
</script>

<style scoped>
.mycon {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;

  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;

}

.el-container {
  height: 100%;
}


.mymenu {
  height: 100%;
}
</style>
