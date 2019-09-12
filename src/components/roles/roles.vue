<template>
  <el-card>
    <!-- 面包屑导航 -->
    <BreadNav :navone="'权限管理'" :navtow="'角色列表'"></BreadNav> 
    <!-- 按钮 -->
    <el-row class="myrow">
      <el-col :span="8">
        <el-button plain>添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table border :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item1,index1) in scope.row.children" :key="index1">
            <el-col :span="4">
              <el-tag @close="myclose(scope.row.id,item1.id,scope)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,index2) in item1.children" :key="index2">
                <el-col :span="5">
                  <el-tag
                    @close="myclose(scope.row.id,item2.id,scope)"
                    closable
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-tag
                    @close="myclose(scope.row.id,item3.id,scope)"
                    class="mytag3"
                    closable
                    type="warning"
                    v-for="(item3,index3) in item2.children"
                    :key="index3"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope='scope'>
        <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        <el-button @click="openroleDialog(scope)" type="success" icon="el-icon-check" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 权限对话框 -->
    <el-dialog title="权限分配" :visible.sync="roleDialog">

        <el-tree ref="tree" :data="rightsList" :props="props" node-key="id" :default-checked-keys="defaultcheck" show-checkbox default-expand-all></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click='setRight'>确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import BreadNav from "../layout/breadnav/breadnav.vue";
export default {
  data() {
    return {
      tableData: [],
      roleDialog:false,//权限 对话框的显示和隐藏
      rightsList:[],//所有权限数据
      defaultcheck:[],//默认选中的数组
      props:{
          label:'authName',
          children:'children'
      },
      rid:'',//保存分配权限的角色 id 
    };
  },
  methods: {
    //动态加载所有的数据
    getAllRoles() {
      this.$http.get("roles").then(res => {
        // console.log(res.data);
        let { data, meta } = res.data;
        if (meta.status == 200) {
          this.tableData = data;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    // 删除角色权限
    async myclose(roleId, rightId, scope) {
      //发送请求到服务器去删除角色的对应权限
      let res = await this.$http.delete(`roles/${roleId}/rights/${rightId}`);
      //解构
      let { data, meta } = res.data;
      if (meta.status === 200) {
        //更新权限 (更新当前行的数据源)
        scope.row.children = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    //打开权限对话框
    //scope : 当前行对应的数据源
    async openroleDialog(scope){
      //打开对话框时,要将角色的 id 保存起来
      this.rid = scope.row.id
      //每次打开分配权限对话框都要清空默认选中
      this.defaultcheck=[]
      this.roleDialog = true
      //以树形结构获取权限数据
      let res = await this.$http.get('rights/tree')
      //结构
      let {meta,data} = res.data
      //判断
      if (meta.status===200) {
          this.rightsList = data
          //设置默认选中的权限
          //得到所有的三级权限
          // 第一级权限
          scope.row.children.forEach(item1=>{
            //第二级权限
            item1.children.forEach(item2=>{
              // 第三级权限
              item2.children.forEach(item3=>{
                //得到所有的三级权限的 id
                this.defaultcheck.push(item3.id)
              })
            })
          })
      }
    },
    //设置权限
    async setRight(){
      let allcheck = this.$refs.tree.getCheckedKeys()
      let half  = this.$refs.tree.getHalfCheckedKeys()
      //合并
      let arr = [...allcheck,...half]
      //转为字符串
      let rids = arr.join(',')
      //发送请求
      let res = await this.$http.post(`roles/${this.rid}/rights`,{
        rids:rids
      })
      //结构
      let {meta} = res.data
      if (meta.status===200) {
        this.$message({
          type:'success',
          message:meta.msg
        })
      //重新渲染数据
      this.getAllRoles()
      }else{
        this.$message.error(meta.msg)
      }
      //关闭分配权限面板
      this.roleDialog= false
    }
  },
  mounted() {
    this.getAllRoles();
  },
  components: {
    BreadNav
  }
};
</script>

<style>
.myrow {
  margin: 20px 0;
}
.mytag3 {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
