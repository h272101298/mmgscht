<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
<!--      <el-form :inline="true">
      <el-form-item>
        <el-input v-model="filter.name" placeholder="请输入昵称" size="medium" style="min-width: 200px;" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="getlist">搜索</el-button>
        <el-button size="small" @click="clear">清空</el-button>
      </el-form-item>
    </el-form> -->

    <el-table :data="list" border stripe size="small" style="width:1200px;">
      <el-table-column prop="user_id" label="用户编号" min-width="100" align="center">
      </el-table-column>
      <el-table-column prop="user.nickname" label="昵称" min-width="140" align="center">
      </el-table-column>
      <el-table-column prop="user.avatarUrl" label="头像" min-width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.user.avatarUrl" v-if="scope.row.user.avatarUrl" style="width:40px;height:40px;border-radius:50%;margin:5px 0 -5px 0;" />
        </template>
      </el-table-column>

<!--       <el-table-column prop="info.name" label="姓名" min-width="140" align="center">
      </el-table-column>
      <el-table-column prop="info.phone" label="联系电话" min-width="200" align="center">
      </el-table-column>

      <el-table-column prop="level.name" label="会员等级" min-width="200" align="center">
      </el-table-column> -->

      <el-table-column prop="created_at" label="开通时间" min-width="200" align="center">
      </el-table-column>

      <el-table-column prop="end" label="过期时间" min-width="200" align="center">
      </el-table-column>

      <el-table-column label="操作" min-width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="newmember(scope.$index, scope.row)" v-if="checkper1">续费</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
    </el-pagination>
  </el-col>


  <el-col>
    <el-dialog title="会员续费：" :visible.sync="dialogNewVisible" center>
      <el-form label-width="120px" style="width:80%">
        <el-form-item label="选择等级：">
          <el-select placeholder="请选择会员等级" @change="setlevel" v-model="level">
            <el-option v-for="item in levelArr" :label="item.title" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: calc(50% - 120px);">
          <el-button type="primary" @click="memberpost()">保存</el-button>
          <el-button @click="dialogNewVisible  = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-col>

</el-row>
</template>

<script>

  import { memberGet } from '../../api/api';
  import { mconfigGet } from '../../api/api';
  import { usertohy } from '../../api/api';

  export default {
    data() {
      return {
        checkper1:false,
        currentPage: 1,
        list:[],
        count:0,
        limit:10,
        dialogNewVisible:false,
        filter:{
          name:''
        },
        levelArr:[],
        level:''
      };
    },

    methods:{
      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit
        memberGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count;
        });
      },

      getlevel(){
        var that= this;
        var allParams = '';
        mconfigGet(allParams).then((res) => {
          that.levelArr=res.data.data;
        });
      },

      clear(){
        this.filter={
          name:''
        };
        this.getlist();
      },

      handleCurrentChange(val) {
        this.currentPage = val;
        this.getlist();
      },


      handleSizeChange(val){
        this.limit = val;
        this.getlist();
      },

      newmember(index, row){
        this.dialogNewVisible=true
        this.userid=row.user_id
      },

      setlevel(res){
        this.level=res
      },

      memberpost(){
        var allParams={member_id:this.level,user_id:this.userid}
        usertohy(allParams).then((res) => {
          if (res.msg === "ok") {
           this.$message({
            message: '提交成功',
            type: 'success'
          });
           this.dialogNewVisible=false
           this.getlist();
         } else {
           this.$message({
            message: res.msg,
            type: 'error'
          });
         }
       });
      },

      checkPer(){
        var per = sessionStorage.getItem('permissions');

        if(per.indexOf('memberrecharge')>-1){
          this.checkper1=true;
        }

      },

    },

    mounted: function () {
      this.getlist();
      this.getlevel();
      this.checkPer();
    }

  }
</script>


<style>

</style>
