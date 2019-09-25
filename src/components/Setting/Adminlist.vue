<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="small" @click="newone" v-show="checkper1">新增管理员</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading="loading" border stripe size="small" style="width:1200px">
      <el-table-column prop="name" label="用户名" min-width="200" align="center">
      </el-table-column>
      <el-table-column prop="role.name" label="所属角色" min-width="200" align="center">
      </el-table-column>
      <el-table-column label="操作" min-width="200" align="center">
       <template slot-scope="scope">
        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="checkper2">修改密码</el-button>
        <!-- <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删 除</el-button> -->
      </template>
    </el-table-column>
  </el-table>


</el-col>

<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newadmin" :model="newadmin" label-width="120px" :rules="rules">
      <el-form-item label="用户名:" prop="name" v-if="putorup=='up'">
        <el-input v-model="newadmin.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input v-model="newadmin.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="所属角色:" prop="role_id" v-if="putorup=='up'">
        <el-select v-model="newadmin.role_id" placeholder="请选择角色">
          <el-option v-for="item in rolesArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: calc(50% - 200px);">
        <el-button type="primary" @click="save()" size="small">保 存</el-button>
        <el-button @click="dialogNewVisible = false" size="small">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</el-col>

<el-col>
  <el-dialog title="删除不可恢复，是否确定删除？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogDelVisible  = false">取 消</el-button>
      <el-button type="primary" @click="submitdel()">确 定</el-button>
    </div>
  </el-dialog>
</el-col>
</el-row>
</template>



<script>

  import { roleGet } from '../../api/api';

  import { adminGet } from '../../api/api';
  import { adminPost } from '../../api/api';


  import { adminDel } from '../../api/api';

  export default {
    data() {
      return {
        currentPage: 1,
        list:[],
        loading: false,
        count:0,
        limit:10,
        diatitle:'新增管理员',
        dialogNewVisible:false,
        dialogDelVisible:false,
        newadmin:{
          name:'',
          password:'',
          // phone:'',
          role_id:''
        },
        rules: {
          name: [{required: true, trigger: 'blur',message: '请输入用户名'}],
          password: [{required: true, trigger: 'blur',message: '请输入密码'}],
          role_id: [{required: true, trigger: 'blur',message: '请选择角色'}]
        },
        rolesArr:[],
        putorup:'up',
        editId:'',
        delId:'',

        checkper1:false,
        checkper2:false,
        checkper3:false,



      };
    },

    methods:{
      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
        adminGet(allParams).then((res) => {
          // console.log(res.data)
          this.list=res.data.data;
          this.count=res.data.count
        });
      },

      checkPer(){
        var per = sessionStorage.getItem('permissions');

        if(per.indexOf('logininsert')>-1){
          this.checkper1=true;
        }

        if(per.indexOf('logindelete')>-1){
          this.checkper2=true;
        }

        if(per.indexOf('loginupdate')>-1){
          this.checkper3=true;
        }
      },

      getrole(){
        var allParams = '';
        roleGet(allParams).then((res) => {
          this.rolesArr=res.data
        });
      },

      newone(){       
        this.putorup='up';
        this.diatitle='新增管理员'
        this.dialogNewVisible=true

        console.log(this.rolesArr)
        this.newadmin={
          name:'',
          password:'',
          role_id:''
        }
      },

      save(){
        this.$refs.newadmin.validate((valid) => {
          if (valid) {
            if( this.putorup=='put'){
              this.newadmin.id=this.editId
            }
            adminPost(this.newadmin).then((res) => {
              if (res.msg === "ok") {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.getlist();
                this.dialogNewVisible=false 
              } else {
               this.$message({
                message: res.msg,
                type: 'error'
              });
             }
           });
          }else{
            return false;
          }
        })
      },

      handleEdit(index, row){
        this.editId = row.id;
        this.diatitle='编辑管理员',
        this.dialogNewVisible = true;
        this.putorup='put'
        this.newadmin={
          name:row.name,
          // password:row.password,
          // phone:row.phone,
          role_id:row.role.id
        }
      },

      handleDelete(index, row) {
        this.dialogDelVisible = true;
        this.delId = row.id;
      },

      submitdel(){
        var allParams='?id='+this.delId
        adminDel(allParams).then((res) => {

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
      this.getrole();
      this.checkPer();
    }
  }
</script>


<style>

</style>
