<template>
  <div class="loginbox">
    <el-form
      :model="ruleForm"
      label-position="top"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <h3>登录验证</h3>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="mybtn" type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      }
    };
  },
  methods: {
    login() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          //发送请求
          this.$http.post("login", this.ruleForm).then(res => {
            let { data, meta } = res.data;
            if (meta.status === 200) {
              this.$message({
                message: meta.msg,
                type: "success"
              });
              //先将登录的   token   保存到浏览器中的 localstorage 中
                window.localStorage.setItem('token',data.token)
              //跳转到首页 
                this.$router.push('/home')
                
            }else{
                this.$message.error(meta.msg);
            }
          });
        } else {
          this.$message.error('请输入正确的用户名和密码');
        }
      });
    }
  }
};
</script>

<style scoped>
.loginbox {
  width: 500px;

  background-color: #ffffff;
  padding: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.mybtn {
  width: 100%;
}
</style>
