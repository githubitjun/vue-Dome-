<template>
  <el-card>
    <!-- 添加一个面包屑导航 -->
      <BreadNav :navone="'用户管理'" :navtow="'用户列表'"></BreadNav>
      
    <!-- 添加一个搜索框 -->
    <el-row class="myrow">
      <el-col :span="8">
        <el-input placeholder="请输入内容" @keyup.enter.native='getSearch' v-model="search" class="input-with-select">
          <el-button @click="getSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        &nbsp;
        <el-button type="success" @click="showAdd" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 添加一个表格 -->
    <el-table :border="true" :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="stateUsers(scope.row.id, scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="editUsers(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="DeleteUsers(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="checkUsers(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增组件 -->
    <XingZen :addNmae="'添加用户'"   ref='shouXin' :editName="'修改用户'" :row="row" @getUserList='getUserList'></XingZen>

    <!-- 新增对话框 -->
    <!-- <el-dialog title="添加用户" :visible.sync="addDialog">
      <el-form :model="fromObj" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="fromObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="fromObj.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="fromObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="fromObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="postAdd">确 定</el-button>
      </div>
    </el-dialog> -->

    <!-- 修改面板 -->
    <!-- <el-dialog title="修改用户" :visible.sync="editDialog">
      <el-form :model="fromObj" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input :disabled="true" v-model="fromObj.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="fromObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="fromObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="postEdit">确 定</el-button>
      </div>
    </el-dialog> -->
    <!--  -->
    <!-- 设置角色的面板 -->
    <el-dialog title="分配角色" :visible.sync="checkDialog">
      <el-form :model="fromObj">
        <el-form-item label="用户名" :label-width="formLabelWidth">
              {{fromObj.username}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
               <!-- {{fromObj.rid}} -->
          <el-select v-model="fromObj.rid" placeholder="请选择">
            <el-option :value="-1" label="请选择"></el-option>
            <el-option v-for="item in options" :key='item.id' :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialog = false">取 消</el-button>
        <el-button type="primary" @click="postCheck">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
//引入 面包屑导航组件
import BreadNav from '../layout/breadnav/breadnav.vue'
// 引入 新增组件
import XingZen from '../users/xingzeng.vue'
export default {
  data() {
    return {
      row:{},//整行的数据
      searchList:[],
      pagenum: 1, //当前页
      pagesize: 30, //页容量
      search: "", //搜索框中的内容
      tableData: [],
      addDialog: false, // 控制新增对话框的显示和隐藏
      editDialog: false, // 控制修改面板的显示和隐藏
      checkDialog:false,// 设置角色的面板的显示和隐藏
      formLabelWidth: "100px",
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
      options:[],//下拉框中 的数据源
    };
  },
  methods: {
    //获取所有的用户数据
    getUserList() {
      this.searchList = []
      //得到 token
      var token = window.localStorage.getItem("token");
      //发送请求时需要带在请求头中
      this.$http
        .get("users", {
          // headers: {
          //   //添加 token
          //   Authorization: token
          // },
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
            // query: this.search
          }
        })
        .then(res => {
            console.log(res.data.data.users);
          let { data, meta } = res.data;
          if (meta.status === 200) {
            // this.tableData = data.users;

            if (this.search) {
              data.users.forEach(item=>{
                  if (item.mobile.includes(this.search) == true) {
                      this.searchList.push(item)
                  }
              })
              // for(var i = 0;i < data.users.length-1;i++){
              //     if (data.users[i].mobile.includes(this.search) == true) {
              //         this.searchList.push(data.users[i])
              //     }
                  
              // console.log(this.searchList);
              // }
              // console.log(this.search);
              console.log(this.searchList);
              this.tableData = this.searchList
            }else { 
            this.tableData = data.users;

            }
          }
        });
    },
    //点击显示 新增对话框
    // showAdd() {
    //   //显示新增对话框
    //   this.addDialog = true;
    // },

    showAdd(){
      this.$refs.shouXin.showAdd()
    },
    //提交新增数据数据
    postAdd() {
      //得到 token
      var token = window.localStorage.getItem("token");
      //验证数据是否合法
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          //发送请求将数据提交到服务  器
          this.$http
            .post(
              "users",
              {
                username: this.fromObj.username,
                password: this.fromObj.password,
                email: this.fromObj.email,
                mobile: this.fromObj.mobile
              }
              // {
              //   // token
              //   headers: {
              //     Authorization: token
              //   }
              // }
            )
            .then(res => {
              // console.log(res.data);
              let { data, meta } = res.data;
              if (meta.status === 201) {
                this.$message({
                  message: meta.msg,
                  type: "success"
                });
                this.getUserList();
                //关闭面板
                this.addDialog = false;
                //清空数据
                this.fromObj.username = "";
                this.fromObj.password = "";
                this.fromObj.email = "";
                this.fromObj.mobile = "";
              }
            });
        } else {
          this.$message.error("参数不合法");
        }
      });
    },
    //点击搜索按钮
    getSearch() {
      this.getUserList();
    },
    //点击修改按钮
    // editUsers(id) {
    //   //显示修改对话框
    //   this.editDialog = true;
    //   //发送请求获取数据渲染到修改面板上
    //   this.$http
    //     .get(`users/${id}`, {
    //       // headers: {
    //       //   Authorization: window.localStorage.getItem("token")
    //       // }
    //     })
    //     .then(res => {
    //       console.log(res.data);
    //       let { data } = res.data;
    //       this.fromObj = data;
    //     });
    // },

    editUsers(row){
        this.$refs.shouXin.showEdit()
        this.row=row
        // console.log(1,this.row);
    },


    //点击 修改面板的提交按钮 提交修改数据
    postEdit() {
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
            this.editDialog = false;
            this.getUserList();
          } else {
            this.$message.error(meta.msg);
          }
        });
    },
    //当点击删除按钮时
    DeleteUsers(id) {
      this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //发送请求
          this.$http
            .delete(`users/${id}`, {
              // headers: {
              //   Authorization: window.localStorage.getItem("token")
              // }
            })
            .then(res => {
              let { meta } = res.data;
              if (meta.status === 200) {
                //重新渲染页面
                this.getUserList();
                this.$message({
                  type: "success",
                  message: meta.msg
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //修改用户的状态
    async stateUsers(id, state) {
      let res = await this.$http.put(
        `users/${id}/state/${state}`,
        {},
        {
          // headers: {
          //   Authorization: window.localStorage.getItem("token")
          // }
        }
      );
      let { data, meta } = res.data;
      if (meta.status === 200) {
        this.$message({
          type: "success",
          message: meta.msg
        });
      }
    },
    //得到下拉框中的数据
    getOpetions(){
      this.$http.get('roles')
          .then(res=>{
            // console.log(res.data.data);
              this.options= res.data.data
          })
    },
    //给用户设置角色
    async checkUsers(id) {
      this.checkDialog= true
      //根据 id 获取用户数据
      let res = await this.$http.get(`users/${id}`)
      let {data,meta} =res.data
      if (meta.status===200) {
        this.fromObj= data
      }else{
        this.$message.error(meta.msg)
      }
    },
    //提交用户设置角色的数据
    async postCheck(){
     let res = await this.$http.put(`users/${this.fromObj.id}/role`,{
       rid:this.fromObj.rid
     })
      let {meta} = res.data
      if (meta.status===200) {
        this.$message({
          message:meta.msg,
          type: 'success'
        });
        //隐藏 设置角色面板
        this.checkDialog= false
      }else{
        this.$message.error(meta.msg)
      }
    }
  },
  mounted() {
    //页面一加载渲染数据
    this.getUserList();
    //页面一加载 得到下拉框数据
    this.getOpetions()
  },
  components:{
    BreadNav,
    XingZen
  }
};
</script>

<style scoped>
.myrow {
  margin-top: 20px;
}
</style>
