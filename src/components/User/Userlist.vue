<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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

    <el-table :data="list" border stripe size="small" style="width:1200px%;">
      <el-table-column prop="id" label="用户编号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" min-width="140" align="center">
      </el-table-column>

      <el-table-column prop="avatarUrl" label="头像" min-width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" style="width:40px;height:40px;border-radius:50%;margin:5px 0 -5px 0;" />
        </template>
      </el-table-column>

      <el-table-column prop="created_at" label="注册日期" width="200" align="center">
      </el-table-column>

      <el-table-column prop="store_id" label="绑定店铺id" width="200" align="center">
        <template slot-scope="scope">
         <p v-if="scope.row.store_id">{{scope.row.store_id}}</p>
       </template>
     </el-table-column>

     <el-table-column label="操作" min-width="200" align="center">
       <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="newmember(scope.$index, scope.row)" v-if="checkper2">开通会员</el-button>
        <el-button type="warning" size="mini" @click="bindshop(scope.$index, scope.row)" v-if="scope.row.store_id==0 && checkper1">成为核销</el-button>
        <el-button type="danger" size="mini" @click="unbindshop(scope.$index, scope.row)" v-if="scope.row.store_id==1 && checkper1">取消核销</el-button>

      </template>
    </el-table-column>

  </el-table>

  <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
  </el-pagination>
</el-col>



<el-col>
  <el-dialog title="开通会员" :visible.sync="dialogNewVisible" center>
    <el-form label-width="120px" style="width:80%">
      <el-form-item label="选择等级：">
        <el-select placeholder="请选择会员等级" @change="setlevel" v-model="level">
          <el-option v-for="item in levelArr" :label="item.title" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: calc(50% - 100px);">
        <el-button type="primary" @click="memberpost()">保存</el-button>
        <el-button @click="dialogNewVisible  = false">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</el-col>



<el-col>
  <el-dialog title="绑定核销：" :visible.sync="dialogBindVisible" center>
    <el-form label-width="120px" style="width:80%">
      <el-form-item label="选择店铺：">
        <el-select placeholder="请选择店铺" v-model="shop" filterable>
          <el-option v-for="item in shoparr" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: calc(50% - 120px);">
        <el-button type="primary" @click="shobind()">保存</el-button>
        <el-button @click="dialogBindVisible  = false">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</el-col>


<el-col>
  <el-dialog title="是否确定解绑？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitdel()">确 定</el-button>
      <el-button @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>


</el-row>
</template>

<script>

  import { usertohy } from '../../api/api';
  import { mconfigGet } from '../../api/api';
  import { userGet } from '../../api/api';
  import { userPost } from '../../api/api';

  import { shopGet } from '../../api/api';
  import { bindshop } from '../../api/api';


  export default {
    data() {
      return {    
        checkper1:false,
        checkper2:false,
        currentPage: 1,
        list:[{}],
        count:0,
        limit:10,
        levelArr:[],
        level:'',
        dialogNewVisible:false,


        dialogBindVisible:false,
        dialogDelVisible:false,
        shoparr:[],
        shop:'',
      };
    },

    methods:{

      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
        userGet(allParams).then((res) => {
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
        this.userid=row.id
      },

      setlevel(res){
        console.log(res)
        this.level=res
      },

      memberpost(){
        if(this.level==''){
         this.$message({
          message: '请选择会员等级',
          type: 'error'
        });
         return
       }
       var allParams={member_id:this.level,user_id:this.userid}
       console.log(allParams)
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



     getshop(){
      var that= this;
      var allParams = '';
      shopGet(allParams).then((res) => {
        that.shoparr=res.data.data;
      });
    },

    unbindshop(index, row){
      this.dialogDelVisible=true
      this.userid=row.id
    },

    submitdel(){
     var allParams={
      store_id:0,
      user_id:this.userid
    }
    console.log(allParams)
    bindshop(allParams).then((res) => {
      if (res.msg === "ok") {
       this.$message({
        message: '解绑成功',
        type: 'success'
      });
       this.dialogDelVisible=false
       this.getlist();
     } else {
       this.$message({
        message: res.msg,
        type: 'error'
      });
     }
   });
  },

  bindshop(index, row){
    this.dialogBindVisible=true
    this.userid=row.id
  },

  shobind(){
    if(this.shop==''){
     this.$message({
      message: '请选择店铺',
      type: 'error'
    });
     return
   }

   var allParams={
    store_id:this.shop,
    user_id:this.userid
  }
  console.log(allParams)
  bindshop(allParams).then((res) => {
    if (res.msg === "ok") {
     this.$message({
      message: '提交成功',
      type: 'success'
    });
     this.dialogBindVisible=false
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

  if(per.indexOf('userbind')>-1){
    this.checkper1=true;
  }

  if(per.indexOf('memberrecharge')>-1){
    this.checkper2=true;
  }


},

},

mounted: function () {
  this.getlist();
  this.getshop();
  this.getlevel();
  this.checkPer();
}

}
</script>


<style>

</style>
