<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员充值</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">


      <el-table :data="list" border stripe size="small" style="width:1200px">
        <el-table-column prop="id" label="ID" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="number" label="订单号" min-width="200" align="center">
        </el-table-column>
        <el-table-column prop="user.nickname" label="用户" min-width="180" align="center">
        </el-table-column>
        <el-table-column prop="snapshots[0].product_title" label="等级名称" min-width="180" align="center">
        </el-table-column>
        <el-table-column prop="price" label="金额" min-width="150" align="center">
        </el-table-column>
        <el-table-column prop="name" label="订单状态" min-width="150" align="center">
          <template slot-scope="scope">
            <el-tag type="info" v-show="scope.row.state==1">待付款</el-tag>
            <el-tag type="success" v-show="scope.row.state==4">已支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间" min-width="200" align="center">
        </el-table-column>

      </el-table>
      <el-pagination style="float:left;margin:20px 0 0 0px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
      </el-pagination>
    </el-col>

  </el-row>
</template>

<script>


  import { allorderGet } from '../../api/api';

  export default {
    data() {
      return {
        list:[],
        currentPage: 1,
        count:0,
        limit:10,
      };
    },

    methods:{

      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+ '&type=member';
        allorderGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count
        });
      },



      handleCurrentChange(val) {
        this.currentPage = val;
        this.getlist();
      },


      handleSizeChange(val){
        this.limit = val;
        this.getlist();
      },
    },

    mounted: function () {
      this.getlist();
    }
  }
</script>


<style>

</style>
