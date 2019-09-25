<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">


     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="mini" @click="newone" v-if="checkper1">新增分类</el-button>
      </el-form-item>

      <el-form-item label="分类级别：">
        <el-select v-model="filter.level" placeholder="全部" @change="getlist" size="small">
          <el-option label="侧边栏" value="1"></el-option>
          <el-option label="分目录" value="2"></el-option>
          <el-option label="子目录" value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-table :data="list" border stripe style="width:1001px" size="small">
      <el-table-column prop="id" label="编号" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="icon" label="logo" width="200" align="center" v-if="filter.level==3">
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="max-width:50px;max-height:50px;" />
        </template>
      </el-table-column>

      <el-table-column prop="title" label="名称" min-width="100" align="center">
      </el-table-column>

      <el-table-column label="操作" min-width="200" align="center">
       <template slot-scope="scope">
        <el-button type="success" size="mini" @click="handleSee(scope.$index, scope.row)" v-if="filter.level!=='3'">查看下级</el-button>

        <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)" v-if="checkper2">编辑</el-button>

        <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)" v-if="checkper3">删除</el-button>
      </template>
    </el-table-column>

  </el-table>

  <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
  </el-pagination>

</el-col>




<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newadv" :model="newadv" label-width="120px">


      <el-form-item label="分类名称：">
        <el-input v-model="newadv.title" style="max-width: 300px;" placeholder="请输入分类名称"></el-input>
      </el-form-item>

      <el-form-item label="分类等级：" prop="level">
        <el-select v-model="newadv.level" placeholder="请选择分类等级" @change="changelv">
          <el-option label="侧边栏" value="1" key="1"></el-option>
          <el-option label="分目录" value="2" key="2"></el-option>
          <el-option label="子目录" value="3" key="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="上级分类：" prop="parent_id" v-if="newadv.level==2 || newadv.level==3">
        <el-select v-model="newadv.parent_id" placeholder="请选择上级分类" filterable :loading="loading">
          <el-option v-for="item in levelarr" :label="item.title" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="分类logo：" v-if="newadv.level==3">
        <el-upload class="upload-demo" :action="upurl" :data="uptoken" :before-upload="beforeUpload" :on-success="handleSuccess" :show-file-list="false" accept="image/*">
          <img :src="imgSrc" class="pre-img" style="max-width:100px;max-height:100px;border:2px dashed #ccc;border-radius:0px;display: block" />
          <el-button size="small" type="primary" style="display: block;margin-top: 20px;">选取文件</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item style="margin-left: calc(50% - 200px);">
        <el-button size="small" type="primary" @click="save()">保 存</el-button>
        <el-button size="small" @click="dialogNewVisible = false">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</el-col>






<el-col>
  <el-dialog title="删除不可恢复，是否确定删除？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitdel()">确 定</el-button>
      <el-button @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>





<el-col>
  <el-dialog title="下级分类" :visible.sync="dialogSeeVisible" width="30%" label-position='top'>
    <el-table :data="parentarr" border stripe style="width:1001px" size="small">
      <el-table-column prop="id" label="编号" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="icon" label="logo" width="200" align="center" v-if="filter.level==2">
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="max-width:50px;max-height:50px;" />
        </template>
      </el-table-column>

      <el-table-column prop="title" label="名称" min-width="100" align="center">
      </el-table-column>

    </el-table>
  </el-dialog>
</el-col>



</el-row>
</template>



<script>


  import { typeGet } from '../../api/api';
  import { typePost } from '../../api/api';
  import { typeDel } from '../../api/api';

  import qiniu from '../../api/qiniu';

  import { Message } from 'element-ui';

  export default {
    data() {
      return {
        checkper1:false,
        checkper2:false,
        checkper3:false,

        loading:false,
        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

        currentPage: 1,
        list:[],
        count:0,
        limit:10,
        dialogNewVisible:false,
        dialogDelVisible:false,

        putorup:'up',
        imgSrc:"../static/images/default.png",
        newadv:{
         title:'',
         icon:'',
         level:1,
         parent_id:''
       },

       filter:{
        level:'1'
      },

      filter1:{
        level:'',
      },

      levelarr:[],

      diatitle:'新增分类',

      editId:'',
      delId:'',
      dialogSeeVisible:false,
      parentarr:[]
    };
  },

  methods:{
    handleSee(index,row){
      var allParams = '?page=1&limit=99999&parent_id=' + row.id;
      typeGet(allParams).then((res) => {
        this.parentarr=res.data.data;
        this.dialogSeeVisible=true
      });
    },

    getlist(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+'&level=' + this.filter.level;
      typeGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count
      });
    },

    getlist1(){
      var allParams = '?page=1&limit=99999&level=' + this.filter1.level;
      typeGet(allParams).then((res) => {
        this.levelarr=res.data.data;
      });
    },


    newone(){
     this.putorup='up';
     this.imgSrc="../static/images/default1.png";
     this.diatitle='新增分类',
     this.dialogNewVisible=true,

     this.newadv={
       title:'',
       icon:'',
       parent_id:'',
       level:'1',
     }
   },

   changelv(val){
    if(val==2){
      this.filter1.level=1
      this.getlist1()
    }
    else if(val==3){
      this.filter1.level=2
      this.getlist1()
    }
  },

  beforeUpload(file) {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      this.$message.error('图片大小不能超过 1MB!');
    }
    return isLt1M;
  },

  handleSuccess(res, file) {
    this.newadv.icon =qiniu.showurl+ res.key;
    this.imgSrc =qiniu.showurl+ res.key;
  },


  save(){

    if(this.newadv.logo=='' && this.newadv.level==3){
      this.$message({
        message: '请上传分类logo',
        type: 'error'
      });
    }else if(this.newadv.title==''){
      this.$message({
        message: '请输入分类名称',
        type: 'error'
      });
    }
    else{
      if( this.putorup=='put'){
        var allParams = {
          title:this.newadv.title,
          id:this.editId,
          icon:this.imgSrc,
          level:this.newadv.level,
        };
        if(this.newadv.level!=='1'){
          allParams.parent_id=this.newadv.parent_id
        }
      }else{
        var allParams = {
          title:this.newadv.title,
          icon:this.imgSrc,
          level:this.newadv.level,
        };
        if(this.newadv.level!=='1'){
          allParams.parent_id=this.newadv.parent_id
        }
      }
      typePost(allParams).then((res) => {
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
    }
  },

  handleEdit(index, row){
    this.diatitle='编辑分类';
    this.dialogNewVisible = true;
    this.putorup='put';
    this.editId = row.id;
    this.imgSrc=row.icon;
    this.newadv.icon=row.icon;
    this.newadv.title=row.title;
    this.newadv.parent_id=row.parent_id
    this.newadv.level=row.level+'';

    this.filter1.level=row.level - '1'
    if(row.level!==1){
      this.getlist1()
    }
  },

  handleDelete(index, row) {
    this.dialogDelVisible = true;
    this.delId = row.id;
  },

  submitdel(){
    this.dialogDelVisible = false;
    var allParams='?id='+this.delId
    typeDel(allParams).then((res) => {
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

  checkPer(){
    var per = sessionStorage.getItem('permissions');

    if(per.indexOf('gtypeinsert')>-1){
      this.checkper1=true;
    }

    if(per.indexOf('gtypeupdate')>-1){
      this.checkper2=true;
    }

    if(per.indexOf('gtypedelete')>-1){
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
  .icon{
    width: 20px;
    height: 20px;
    margin: 2px;
  }
</style>
