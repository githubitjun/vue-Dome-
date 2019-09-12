<template>
  <el-card>
    <!-- 面包屑导航 -->
    <Breadnav :navone="'商品管理'" :navtow="'商品列表'"/>
    <!-- 搜索框 -->
    <el-row class="myrow">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button @click="searchGoods" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        &nbsp;
        <el-button type="success" @click="toAdd" plain>添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table border :data="goodsList" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="400"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="180"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 
         @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
     -->
    <el-pagination
        @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
      :current-page="pagenum"
      :page-sizes="pageSizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
import Breadnav from "../layout/breadnav/breadnav.vue";
export default {
  data() {
    return {
      pagenum: 1, //当前页码
      pagesize: 10, //当前显示的条数
      search: "", //搜索框中的内容
      goodsList: [], //商品列表的数据
      pageSizes:[10,20,30],//控制页容量的数组
      total:0,//数据的总数
    };
  },
  methods: {
    //动态加载数据
    async getGoodsData() {
      let res = await this.$http.get("goods", {
        params: {
          query: this.search,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      let { data, meta } = res.data;
      if (meta.status === 200) {
        this.goodsList = data.goods;
        this.total=data.total 
      } else {
        this.$message.error(meta.msg);
      }
    },
    //当改变当前页时 
    handleCurrentChange(val){
        this.pagenum=val
        this.getGoodsData()
    },
    //当改变页容量时
    handleSizeChange(val){
        this.pagesize = val
        this.getGoodsData()
    },
    //搜索商品
    searchGoods(){
       this.getGoodsData()
    },
    //当点击添加商品时
    toAdd(){
        this.$router.push('/goods/add')
    }
  },
  mounted() {
    this.getGoodsData();
  },
  components: {
    Breadnav
  }
};
</script>

<style scoped>
.myrow {
  margin: 20px 0;
}
</style>
