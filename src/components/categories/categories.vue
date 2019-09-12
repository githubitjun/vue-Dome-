<template>
  <el-card>
    <!-- 面包屑导航 -->
    <Breadnav :navone="'商品管理'" :navtow="'商品分类'"></Breadnav>
    <!-- 按钮 添加分类 -->
    <el-row class="myrow">
      <el-col :span="4">
        <el-button type="success">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table border :data="pageList" style="width: 100%">
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
      ></el-table-tree-column>
      <el-table-column label="级别" width="180">
        <template
          slot-scope="scope"
        >{{scope.row.cat_level===0?'一级':(scope.row.cat_level===1?'二级':'三级')}}</template>
      </el-table-column>
      <el-table-column label="是否有效" width="180">
        <template slot-scope="scope">{{scope.row.cat_deleted?'无效':'有效'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <!-- 
        el-pagination 分页组件
        @size-change  事件,当前页容量发生改变时触发
        @current-change 事件,当当前页发生改变时触发
        :current-page :属性 当前所在页
        :page-sizes : 数组,所有可选的页容量
        :page-size 当前选中的页容量
        layout : 分页组件的布局
        total: 总数据条数
     -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="currentpage"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
import Breadnav from "../layout/breadnav/breadnav";
export default {
  data() {
    return {
      cateList: [], //数据源
      pageList: [], //
      total: 0, //数据的总条数
      pagesize: 5, //页容量
      pagesizes: [5, 10, 15], // 所有可选的也容量
      currentpage: 1 //当前页
    };
  },
  components: {
    Breadnav
  },
  methods: {
    //获取所有的分类数据
    async getCateList() {
      let res = await this.$http.get("categories?type=3");
      //解构
      let { meta, data } = res.data;
      //判断
      if (meta.status === 200) {
        //   console.log(data);
        this.cateList = data;
        //得到分页数据的总条数
        this.total = data.length;
        //第一次得到分页数据
        this.getPageList();
      }
    },
    //得到分页的数据源
    getPageList() {
      //计算开始和结束的数据
      let start = (this.currentpage - 1) * this.pagesize;
      let end = this.currentpage * this.pagesize;
      //得到数据源
      this.pageList = this.cateList.slice(start, end);
    },
    //当当前页发生改变时触发
    currentChange(val) {
      this.currentpage = val;
      //重新获取分页数据
      this.getCateList();
    },
    // 当也容量发生变化时
    sizeChange(val){
        this.pagesize = val
        //重新获取请求数据
        this.getCateList()
    }
  },
  mounted() {
    this.getCateList();
  }
};
</script>

<style scoped>
.myrow {
  margin: 20px 0;
}
</style>
