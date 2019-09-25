<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商家管理</el-breadcrumb-item>
        <el-breadcrumb-item>商家列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

     <el-form :inline="true">
      <el-form-item>
       <el-button type="primary" size="mini" @click="newone" v-if="checkper1">新增店铺</el-button>
     </el-form-item>
   </el-form>

   <el-table :data="list" border stripe size="small" style="width: 1101px;margin-top: 10px;">
    <el-table-column prop="id" label="编号" width="75" align="center">
    </el-table-column>

    <el-table-column prop="name" label="店铺名称" width="150" align="center">
    </el-table-column>

    <el-table-column prop="poster" label="logo" min-width="130" align="center">
      <template slot-scope="scope">
        <img :src="scope.row.logo" style="max-width:112px;max-height:63px;" />
      </template>
    </el-table-column>

    <el-table-column prop="address" label="地址" min-width="150" align="center">
    </el-table-column>

    <el-table-column prop="detail" label="简介" min-width="200" align="center">
    </el-table-column>

    <el-table-column prop="express_price" label="运费" min-width="150" align="center">
    </el-table-column>

    <el-table-column label="操作" min-width="100" align="center">
     <template slot-scope="scope">

      <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)" v-if="checkper2">编辑</el-button>
      <!-- <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)" v-if="checkper3">删除</el-button> -->

    </template>
  </el-table-column>

</el-table>

<el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
</el-pagination>
</el-col>



<el-col>
  <el-dialog title="确认删除该商店么？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="submitdel()">确 定</el-button>
      <el-button type="primary" @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>




</el-row>
</template>



<script>
  import { shopGet } from '../../api/api';

  import { storeDel } from '../../api/api';

  import hosturl from '../../api/api';


  export default {
    data() {
      return {
        checkper1:false,
        checkper2:false,
        checkper3:false,
        list:[],
        currentPage: 1,
        count:0,
        limit:10,

        dialogDelVisible:false,

      };
    },

    methods:{
      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit
        shopGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count;
        });
      },

      newone(){
        sessionStorage.removeItem('shopeditid');
        this.$router.push({ path: '/Shop/Newshop' });
      },

      handleCurrentChange(val) {
        this.currentPage = val;
        this.getlist();
      },

      handleSizeChange(val){
        this.limit = val;
        this.getlist();
      },

      handleDelete(index,row){
        this.dialogDelVisible=true
        this.delId = row.id;
      },

      submitdel(){
        var allParams='?id='+this.delId
        storeDel(allParams).then((res) => {
          console.log(res)
          if (res.msg === "ok") {
           this.$message({
            message: '删除成功',
            type: 'success'
          });
           this.getlist();
           this.dialogDelVisible = false;
         } else {
           this.$message({
            message: res.msg,
            type: 'error'
          });
         }
       });
      },

      handleEdit(index,row){
        sessionStorage.setItem('shopeditid',row.id);
        this.$router.push({ path: '/Shop/Newshop' });
      },

      checkPer(){
        var per = sessionStorage.getItem('permissions');

        if(per.indexOf('shopinsert')>-1){
          this.checkper1=true;
        }

        if(per.indexOf('shopupdate')>-1){
          this.checkper2=true;
        }

        if(per.indexOf('shopdelete')>-1){
          this.checkper3=true;
        }
      },
    },

    mounted: function () {
      this.getlist();
      this.checkPer();
    }
  }
</script>


<style>
  .logo{
    max-width: 300px;
    margin-left: 20px;
  }
</style>
