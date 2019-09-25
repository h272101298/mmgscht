<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>轮播图</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-row>

       <el-form :inline="true">

        <el-form-item label="轮播位置：">
          <el-select v-model="filter.type" placeholder="轮播位置" size="mini" @change="getlist">
            <el-option label="首页" value="1">首页</el-option>
            <el-option label="会员" value="2">会员</el-option>
            <el-option label="优惠券" value="3">优惠券</el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="newone">新增轮播</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="list" border stripe size="small" style="width:1001px">
        <el-table-column prop="id" label="轮播编号" min-width="200" align="center">
        </el-table-column>
        <el-table-column prop="href" label="轮播图片" min-width="300" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.href" style="max-width:90px;max-height:90px;" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300" align="center">
         <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
    </el-pagination>

  </el-row>
</el-col>


<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newadv" :model="newadv" label-width="120px">
      <el-form-item label="上传图片：">
        <el-upload class="upload-demo" list-type="picture-card" :action="upurl" :data="uptoken" :on-success="handleSuccess" :on-exceed="handleExceed" :file-list="postarr" :limit="1" :show-file-list="true" accept="image/*">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">可上传JPG/PNG文件，建议图片比例为16:9</div>
        </el-upload>
      </el-form-item>
    </el-table>
  </el-form-item>

  <el-form-item label="轮播位置：">
    <el-select v-model="newadv.type" placeholder="类型" size="mini">
      <el-option label="首页" value="1">首页</el-option>
      <el-option label="会员" value="2">会员</el-option>
      <el-option label="优惠券" value="3">优惠券</el-option>
    </el-select>
  </el-form-item>
 
  <el-form-item label="选择商品："  v-if="newadv.type==1">
    <el-table :data="goodlist"style="width: 100%" border size="mini" stripe>
      <el-table-column prop="id" label="编号" min-width="150" align="center">
      </el-table-column>
      <el-table-column prop="title" label="名称" min-width="150" align="center">
      </el-table-column>
      <el-table-column prop="logo" label="图片" min-width="150" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.logo" style="max-width:60px;max-height:60px;" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" align="center">
       <template slot-scope="scope">
        <el-button type="primary" size="small" @click="handleSelect(scope.$index, scope.row)">选择</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination style="float:left;margin-top:20px;" :current-page="gcurrentPage" :page-sizes="[10, 20, 30, 40]" :page-size="glimit" @current-change="gCurrentChange" @size-change="gSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
  </el-pagination>
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
      <el-button size="small" type="primary" @click="submitdel()">确 定</el-button>
      <el-button size="small" @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>





</el-row>
</template>



<script>

  import { goodGet } from '../../api/api';

  import {advertsGet} from '../../api/api';
  import {advertPost} from '../../api/api';
  import {advertDel} from '../../api/api';


  import qiniu from '../../api/qiniu';


  export default {
    data() {
      return {

        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

        filter:{
          type:'1'
        },

        currentPage: 1,
        list:[],
        count:0,
        limit:10,

        dialogNewVisible:false,
        dialogDelVisible:false,

        putorup:'up',
        imgSrc:"",

        newadv:{
          type:'1'
        },
        diatitle:'新增轮播',
        postarr:[],
        editId:'',
        delId:'',

        goodData:[],

        checkper1:false,
        checkper2:false,

        goodlist:[],
        gcurrentPage: 1,
        gcount:0,
        glimit:10,

      };
    },

    methods:{

      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+ '&type=' + this.filter.type;
        advertsGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count;
        });
      },

      getgood(){
        var allParams  = '?page='+ this.gcurrentPage + '&limit=' + this.glimit;
        goodGet(allParams).then((res) => {
          this.goodlist=res.data.data;
          this.gcount=res.data.count;
        });
      },

      handleSelect(index, row){
        this.good_id = row.id;
        var goodlist=[]
        goodlist.push(row)
        this.goodlist=goodlist
      },

      newone(){
       this.putorup='up';
       this.postarr=[];
       this.diatitle='新增轮播',
       this.dialogNewVisible=true
     },

     handleSuccess(res, file) {
      this.imgSrc =qiniu.showurl+ res.key
    },

    handleExceed(files, fileList) {
      this.$message.warning(`一次只能上传1张图片`);
    },

    save(){
      if(this.imgSrc==''){
        this.$message({
          message: '请选择图片',
          type: 'error'
        });
      }else{
        if( this.putorup=='put'){
          var allParams = {
            href:this.imgSrc,
            id:this.editId,
            type:this.newadv.type,
            param:this.good_id
          };
        }else{
          var allParams = {
            href:this.imgSrc,
            type:this.newadv.type,
            param:this.good_id
          };
        }

        advertPost(allParams).then((res) => {
          if (res.msg === "ok") {
           this.$message({
            message: '提交成功',
            type: 'success'
          });
           this.imgSrc=''
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
      this.diatitle='编辑轮播';
      this.dialogNewVisible = true;
      this.putorup='put';
      this.editId = row.id;
      this.newadv.type=row.type
      this.good_id = row.param;
      this.postarr=[]
      this.imgSrc=row.href
      this.postarr.push(Object.assign({},{"url":row.href}));
    },

    handleDelete(index, row) {
      this.dialogDelVisible = true;
      this.delId = row.id;
    },

    submitdel(){
      this.dialogDelVisible = false;
      var allParams='?id='+this.delId
      advertDel(allParams).then((res) => {
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

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getlist();
    },

    handleSizeChange(val){
      this.limit = val;
      this.getlist();
    },

    gCurrentChange(val) {
      this.gcurrentPage = val;
      this.getgood();
    },

    gSizeChange(val){
      this.glimit = val;
      this.getgood();
    },
  },

  mounted: function () {

    this.getlist();
    this.getgood();
  }
}
</script>


<style scoped>

</style>
