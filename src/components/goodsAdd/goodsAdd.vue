<template>
  <el-card>
    <!-- 面包屑导航 -->
    <Breadnav :navone="'商品管理'" :navtow="'商品列表'"/>
    <!-- 提示栏 添加商品信息 -->
    <el-alert class="myalert" title="添加商品信息" type="info" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps class="mysteps" :active="active" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab 标签页切换 -->
    <el-tabs @tab-click="handleClick" tab-position="left">
      <el-tab-pane label="基本信息" name="first">
        <!-- 基本信息 -->
        <el-form :rules="rules" :label-position="'top'" label-width="80px" :model="formobj">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="formobj.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="formobj.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="formobj.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="formobj.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 联级选择器 -->
            <el-cascader
              v-model="cateSelect"
              :options="catesList"
              :props="cateObj"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="second">
        <div class="mydiv" v-for="(item,index) in checkboxData" :key="index">
          <h4>{{item.attr_name}}</h4>
          <div class="myitem">
            <el-checkbox
              v-model="checked1"
              v-for="(val,index2) in item.attr_vals.split(',')"
              :key="index2"
              border
            >{{val}}</el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="third">
        <!-- 商品属性 -->
        <div class="mydiv" v-for="(item,index) in checkboxData" :key="index">
          <h4>{{item.attr_name}}</h4>
          <el-input v-model="item.attr_vals"></el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="fourth">
        <!-- 商品图片 -->
        <el-upload
          class="upload-demo"
          :headers="uploadHead"
          action="http://localhost:8888/api/private/v1/upload"
          :file-list="fileList"
          :on-success="uploadsuccess"
          :on-remove="remove"
          :on-preview="preview"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        {{fileList}}
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="fifth">
        <!-- 商品内容 -->
        <el-button @click="postAddgoods">添加商品</el-button>
        <quill-editor v-model="content"></quill-editor>
      </el-tab-pane>
    </el-tabs>
    <!-- 点击图片预览时的对话框 -->
    <el-dialog title="图片预览" :visible.sync="dialogImg">
      <img ref="myimg">
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogImg = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Breadnav from "../layout/breadnav/breadnav.vue";
export default {
  data() {
    return {
      active: 0,
      formobj: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: ""
      },
      rules: {
        //表单的验证
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ]
      },
      catesList: [], //联级选择器数据
      cateObj: {
        //控制联级选择器显示的文本
        value: "cat_id", //当前选项对应的值
        label: "cat_name", //当前选项对应的文本
        expandTrigger: "hover" // 触发下一层选项的方式
      },
      cateSelect: [], //当前联级框选中的数据
      checked1: true,
      checkboxData: [], //商品参数的数据
      fileList: [], //文件上传的集合
      uploadHead: {
        Authorization: localStorage.getItem("token")
      }, // 上传的请求头
      dialogImg: false, //控制图片预览的对话框的显示和隐藏
      content: "我是富文本中的默认值"
    };
  },
  methods: {
    //tab栏得事件
    handleClick(tab, event) {
      this.active = +tab.index;
      if (this.active == 1 || this.active == 2) {
        if (this.cateSelect.length == 0) {
          this.$message.error("请选择器商品分类");
          return;
        }
        // 获取分类的参数
        this.getCateParams(tab.index);
      }
    },
    //得到所有的分类数据
    async getCatesList() {
      let res = await this.$http.get("categories?type=3");
      let { data, meta } = res.data;
      if (meta.status === 200) {
        this.catesList = data;
      }
    },
    //商品参数的请求 封装一个函数
    async getCateParams(index) {
      //得到分类的 id
      let id = this.cateSelect[this.cateSelect.length - 1];
      //设置一个参数用来判断当前点击的是商品属性还是商品参数
      let sel = index === "1" ? "many" : "only";
      //发送请求
      let res = await this.$http.get(`categories/${id}/attributes?sel=${sel}`);
      let { data, meta } = res.data;
      if (meta.status === 200) {
        this.checkboxData = data;
        console.log(data);
      } else {
        this.$message.error(meta.msg);
      }
    },
    //图片上传成功时执行的函数
    uploadsuccess(res, file, fileList) {
      //将上传成功的图片 保存到 fileList
      //res 服务器响应回来的数据
      //tmp_path : 生成的图片的名称
      //url: 上传后的图片所在的服务器的路径
      // file: 本次上传文件信息(包含了 file)
      //fileList: 上传的所有的文件信息 (包含了 file)
      this.fileList.push({
        name: res.data.tmp_path,
        url: res.data.url
      });
    },
    //删除图片时触发
    remove(file, fileList) {
      //通过 file 中的属性去删除 fileList 中的数据
      for (var i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].name === file.name) {
          this.fileList.splice(i, 1);
        }
      }
    },
    //图片预览的方法
    preview(file) {
      this.dialogImg = true;
      this.$nextTick(function() {
        this.$refs.myimg.src = file.url;
      });
    },
    //点击新增商品 提交数据
    async postAddgoods() {
      var addobj = {
        goods_name: this.formobj.goods_name,
        goods_price: this.formobj.goods_price,
        goods_number: this.formobj.goods_number,
        goods_weight: this.formobj.goods_weight,
        goods_introduce: this.content,
        goods_cat: this.cateSelect.join(",")
      };
      //发送请求
      let res = await this.$http.post("goods", addobj);
      let { data, meta } = res.data;
      
      if (meta.status === 201) {
        this.$message({
          message: meta.msg,
          type:"success"
        });
        //跳转到商品列表
        this.$router.push("/goods");
      } else {
        this.$message.error(meta.msg);
      }
    },
    handleChange(value) {
      this.cateSelect = value;
    }
  },
  mounted() {
    //分类数据
    this.getCatesList();
  },
  components: {
    Breadnav
  }
};
</script>

<style>
.myalert {
  margin: 20px 0;
}
.mysteps {
  margin-bottom: 20px;
}
.el-step__title {
  font-size: 12px !important;
}
.mydiv h4 {
  font-weight: 400;
  font-size: 14px;
}

.ql-editor {
  height: 300px;
}
</style>
