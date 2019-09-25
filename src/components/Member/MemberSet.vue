<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>等级设置</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="small" @click="newlevel" v-if="checkper1">新增等级</el-button>
      </el-form-item>
    </el-form>


    <el-table :data="list" border stripe style="width:1200px" size="small">
      <el-table-column prop="title" label="名称" min-width="150" align="center">
      </el-table-column>

      <el-table-column prop="price" label="价格" min-width="150" align="center">
      </el-table-column>

      <el-table-column prop="time" label="时长(天)" min-width="150" align="center">
      </el-table-column>

      <el-table-column label="操作" min-width="150" align="center">
       <template slot-scope="scope">
        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" v-if="checkper2">编辑</el-button>
        <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" v-if="checkper3">删除</el-button>
      </template>
    </el-table-column>

  </el-table>

  <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
  </el-pagination>



  <el-col>
    <el-dialog title="编辑等级" :visible.sync="dialogNewVisible">
      <el-form label-width="130px" width="900px" center style="max-width: 800px" :rules="rules" ref="levelform" :model="levelform">

        <el-form-item label="名称：" prop="title">
          <el-input v-model="levelform.title" placeholder="请输入名称" size="medium" style="min-width: 200px;" ></el-input>
        </el-form-item>

        <el-form-item label="价格：" prop="price">
          <el-input v-model="levelform.price" placeholder="请输入价格" type="number" min="0" size="medium" style="min-width: 200px;" ></el-input>
        </el-form-item>

        <el-form-item label="时长：" prop="time">
          <el-input v-model="levelform.time" placeholder="请输入时长(如：30)" type="number" min="0" size="medium" style="min-width: 200px;" ><template slot="append">天</template></el-input>
        </el-form-item>

        <el-form-item style="margin-top: 20px;">
          <el-button type="primary" @click="save()" size="medium">提交</el-button>
          <el-button @click="cancel" size="medium">取 消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </el-col>
</el-col>

<el-col>
  <el-dialog title="删除不可恢复，是否确定删除？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitdel()">确 定</el-button>
      <el-button @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>

</el-row>
</template>


<script>

  import { mconfigPost } from '../../api/api';
  import { mconfigGet } from '../../api/api';
  import { mconfigDel } from '../../api/api';


  import { Message } from 'element-ui';

  export default {
    data() {

      var checkvalue = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('此项不能为空'));
        }
        setTimeout(() => {
          if (Math.sign(value) == 1) {
            if(value%1 === 0){
             callback();
           }else{
            callback();
          }
        } else if(Math.sign(value) == 0) {
          callback(new Error('不能为0'));
        } else if(Math.sign(value) == -1) {
          callback(new Error('请输入正数'));
        }else{
          callback(new Error('请输入数字'));
        }
      }, 100);
      };


      var checkvalue1 = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('此项不能为空'));
        }
        setTimeout(() => {
          if (Math.sign(value) == 1) {
            if(value%1 === 0){
             callback();
           }else{
            callback();
          }
        } else if(Math.sign(value) == 0) {
         callback();
       } else if(Math.sign(value) == -1) {
        callback(new Error('请输入正数'));
      }else{
        callback(new Error('请输入数字'));
      }
    }, 100);
      };

      return {
 checkper1:false,
        checkper2:false,
        checkper3:false,
        list:[],
        currentPage: 1,
        count:0,
        limit:10,

        dialogDelVisible:false,
        dialogNewVisible:false,

        editId:'',
        delId:'',


        levelform:{
          title:'',
          price:'',
          time:'',
        },

        rules:{
          title: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          price: [
          {required: true, validator: checkvalue1, trigger: 'blur'},
          ],
          time: [
          {required: true, validator: checkvalue, trigger: 'blur'},
          ],
        },

      };
    },

    methods:{



      getconfig(){
        var that= this;
        var allParams = '';
        mconfigGet(allParams).then((res) => {
          that.list=res.data.data;
          that.count=res.data.count;
        });
      },

      newlevel(){
        this.levelform={
          title:'',
          price:'',
          time:''
        }
        this.dialogNewVisible=true
      },

      handleEdit(index, row){
        console.log(row.detail)
        this.levelform=row
        this.editId=row.id
        this.dialogNewVisible=true
      },

      save(){
        console.log(this.levelform)
        this.$refs.levelform.validate((valid) => {
          if (valid) {
           var allParams =this.levelform
           console.log(this.editId)
           if(this.editId){
            allParams.id=this.editId
            this.editId=''
          }

          mconfigPost(allParams).then((res) => {
            if (res.msg === "ok") {
             this.$message({
              message: '提交成功',
              type: 'success'
            });
             this.dialogNewVisible=false 
             this.getconfig()
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

      cancel(){
        this.dialogNewVisible=false
      },

      handleDelete(index, row) {
        this.dialogDelVisible = true;
        this.delId = row.id;
      },

      submitdel(){
        var allParams='?id='+this.delId
        mconfigDel(allParams).then((res) => {
          if (res.msg === "ok") {
           this.$message({
            message: '删除成功',
            type: 'success'
          });
           this.dialogDelVisible = false;
           this.getconfig()
         } else {
           this.$message({
            message: res.msg,
            type: 'error'
          });
         }
       }).catch((res)=>{
         this.dialogDelVisible=false 
       });
     },

     handleCurrentChange(val) {
      this.currentPage = val;
      this.getconfig();
    },


    handleSizeChange(val){
      this.limit = val;
      this.getconfig();
    },


    checkPer(){
      var per = sessionStorage.getItem('permissions');

      if(per.indexOf('memberset')>-1){
        this.checkper1=true;
      }

      if(per.indexOf('memberput')>-1){
        this.checkper2=true;
      }

      if(per.indexOf('memberdel')>-1){
        this.checkper3=true;
      }
    },


  },

  mounted: function () {
    this.getconfig();
    this.checkPer();
  }
}
</script>


<style scoped>


</style>
