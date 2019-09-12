<template>
  <div>
    <el-dialog :visible.sync="addDialog">
      <span slot="title">{{title}}</span>
      <el-form :model="fromObj" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="fromObj.username" autocomplete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item v-if="passW" label="密码" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="fromObj.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="fromObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <!-- <el-input v-model="fromObj.mobile" autocomplete="off"></el-input> -->
          <el-select v-model="fromObj.mobile" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="postAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["addNmae", "editName", "row"],
  data() {
    return {
      arr: [], //处理过options 的数组
      options: [
        {
          //下拉框的数据
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      editAdd: false,
      disabled: false,
      passW: false,
      obj: {},
      title: "", //标题
      addDialog: false,
      fromObj: {
        //新增对话框 中的数据
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      formLabelWidth: "100px"
    };
  },
  methods: {
    postAdd() {
      //得到 token
      var token = window.localStorage.getItem("token");
      //验证数据是否合法
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          //发送请求将数据提交到服务  器
          // this.fromObj.mobile
          this.arr = this.options.filter(v => {
            return v.value == this.fromObj.mobile;
          });
          console.log(this.arr);
          // this.$nextTick(() => {
          //   this.fromObj.mobile = this.arr[0].label;
          //   console.log(111);
          //   console.log(this.fromObj.mobile);
          //   // this.fromObj = Object.assign(this.row)
          //   // this.fromObj = this.row;
          // });
          // this.fromObj.mobile = this.arr.label

          this.$set(this.fromObj,'mobile',this.arr[0].label)
          let params = {
                username: this.fromObj.username,
                password: this.fromObj.password,
                email: this.fromObj.email,
                // mobile: this.fromObj.mobile,
                // mobile: this.arr[0].label,
                mobile: this.fromObj.mobile
              }
              console.log(params);
          if (this.editAdd) {
            this.$http
              .post("users",params)
              .then(res => {
                // console.log(res.data);
                let { data, meta } = res.data;
                if (meta.status === 201) {
                  this.$message({
                    message: meta.msg,
                    type: "success"
                  });
                  // this.getUserList();
                  //关闭面板
                  this.addDialog = false;
                  //清空数据
                  this.fromObj.username = "";
                  this.fromObj.password = "";
                  this.fromObj.email = "";
                  this.fromObj.mobile = "";
                  // this.$parent.getUserList()
                  this.$emit("getUserList");
                }
              });
          } else {
            this.$http
              .put(`users/${this.fromObj.id}`, this.fromObj, {
                // headers: {
                //   Authorization: window.localStorage.getItem("token")
                // }
              })
              .then(res => {
                let { meta } = res.data;
                if (meta.status === 200) {
                  this.$message({
                    message: meta.msg,
                    type: "success"
                  });
                  this.addDialog = false;
                  this.$emit("getUserList");
                } else {
                  this.$message.error(meta.msg);
                }
              });
          }
        } else {
          this.$message.error("参数不合法");
        }
      });
    },
    //点击显示 新增对话框
    showAdd() {
      //显示新增对话框
      this.fromObj = {
        //新增对话框 中的数据
        username: "",
        password: "",
        email: "",
        mobile: ""
      };
      this.addDialog = true;
      this.passW = true;
      this.disabled = false;
      this.editAdd = true;
      this.title = this.addNmae;
      console.log(this.addNmae);
    },
    // 点击显示 修改对话框
    showEdit() {
      //   this.fromObj = {
      //     //新增对话框 中的数据
      //     username: "",
      //     password: "",
      //     email: "",
      //     mobile: ""
      //   };
      this.addDialog = true;
      this.passW = false;
      this.disabled = true;
      this.editAdd = false;
      this.title = this.editName;
      console.log(this.row);
      this.$nextTick(() => {
        this.fromObj = Object.assign({}, this.row);
        // this.fromObj = Object.assign(this.row)
        // this.fromObj = this.row;
      });
      // this.fromObj = Object.assign({},this.obj,this.row)
      // this.fromObj = this.row
      console.log(this.fromObj);
    }
  }
};
</script>

<style>
</style>