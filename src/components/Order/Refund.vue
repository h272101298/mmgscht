<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>退款</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">


      <el-table :data="list" border stripe size="small">
        <el-table-column prop="id" label="ID" min-width="80" align="center">
        </el-table-column>
        <el-table-column prop="number" label="订单号" min-width="200" align="center">
        </el-table-column>
        <el-table-column prop="user.nickname" label="用户" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="store.name" label="商家" min-width="200" align="center">
        </el-table-column>
        <el-table-column prop="price" label="总计" min-width="150" align="center">
        </el-table-column>

        <el-table-column prop="created_at" label="下单时间" min-width="200" align="center">
        </el-table-column>

<!--         <el-table-column label="订单详情" min-width="200" align="center">
         <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">订单详情</el-button>
        </template>
      </el-table-column> -->

      <el-table-column prop="name" label="订单状态" min-width="150" align="center">
       <template slot-scope="scope">
        <el-tag type="" size="small" v-show="scope.row.refund==1">待处理</el-tag>
        <el-tag type="" size="small" v-show="scope.row.refund==2">已处理</el-tag>
        <el-tag type="success" size="small" v-show="scope.row.refund==4">退款成功</el-tag>
        <el-tag type="info" size="small" v-show="scope.row.refund==3">已拒绝</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="操作" min-width="200" align="center">
     <template slot-scope="scope">
      <el-button type="danger" size="mini" v-show="scope.row.refund==1" @click="handleDelete(scope.row)">确认退款</el-button>
      <el-button type="danger" size="mini" v-show="scope.row.refund==1" @click="handlerefuse(scope.row)">拒绝</el-button>
    </template>
  </el-table-column>

</el-table>
<el-pagination style="float:left;margin:20px 0 0 0px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40, 50]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
</el-pagination>
</el-col>

<el-col>
  <el-dialog title="操作不可恢复，是否确定退款？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitdel()">确 定</el-button>
      <el-button @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>


<el-col>
  <el-dialog title="订单详情" :visible.sync="dialogSeeVisible" width="1200px" center>
    <el-form label-position="right" label-width="110px">

      <el-form-item label="订单状态：" class="fw6">
        <span v-show="currow.state=='created'" class="fw4">未付款</span>
        <span v-show="currow.state=='paid'" class="fw4">已支付</span>
        <span v-show="currow.state=='delivery'" class="fw4">已发货</span>
        <span v-show="currow.state=='canceled'" class="fw4">已取消</span>
      </el-form-item>

      <el-form-item label="物流信息：" class="fw6" v-show="currow.state=='delivery'">
        <div class="fw4">快递公司： {{currow.express}}</div>
        <div class="fw4">快递编号： {{currow.express_number}}</div>
      </el-form-item>


      <el-form-item label="用户名称：" class="fw6">
        <span class="fw4">{{currow.user.nickname}}</span>
      </el-form-item>

      <el-form-item label="收货信息：" class="fw6">
        <div class="fw4">地址： {{currow.address[0].address}}</div>
        <div class="fw4">电话： {{currow.address[0].phone}}</div>
        <div class="fw4">邮编： {{currow.address[0].zip_code}}</div>
      </el-form-item>


      <el-form-item label="商铺名称：" class="fw6">
        <template slot-scope="scope">
          <div class="fw4" id="detail">{{currow.store.name}}</div>
        </template>
      </el-form-item>

      <el-form-item label="商铺掌柜：" class="fw6">
        <template slot-scope="scope">
          <div class="fw4" id="detail">{{currow.store.manager}}</div>
        </template>
      </el-form-item>

      <el-form-item label="商品信息：" class="fw6">

        <el-table :data="currow.stocks" border stripe size="small" id="out-table">
          <el-table-column prop="cover" label="商品缩略图" width="100" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.cover" style="max-width:60px;max-height:60px;" />
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品名称" min-width="200" align="center">
          </el-table-column>

          <el-table-column prop="price" label="单价" min-width="100" align="center">
          </el-table-column>

          <el-table-column prop="number" label="数量" min-width="100" align="center">
          </el-table-column>

        </el-table>
      </el-form-item>

      <el-form-item label="总计：" class="fw6">
        <div class="fw4" id="detail">{{currow.price}}</div>
      </el-form-item>

    </el-form>
  </el-dialog>
</el-col>



</el-row>
</template>



<script>

  import { allorderGet } from '../../api/api';
  import { refundPost } from '../../api/api';



  export default {
    data() {
      return {
        list:[],
        currentPage: 1,
        count:0,
        limit:10,

        dialogDelVisible:false,
        dialogSeeVisible:false,
        delId:'',

        currow:{
         id: 0,
         number: "",
         price: "",
         state: "",
         user: {
           nickname: "",
           avatarUrl: "",
         },
         store: {
           name: "",
           manager: "",
         },
         address: [{
           id: 0,
           order_id: 0,
           name: "",
           phone: "",
           address: "",
           zip_code: "",
         }],

         checkper1:false,
       },
     };
   },

   methods:{

    // checkPer(){
    //   var per = sessionStorage.getItem('permissions');

    //   if(per.indexOf('refuseDo')>-1){
    //     this.checkper1=true;
    //   }

    // },


    getlist(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+'&refund=1'
      allorderGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count
      });
    },

    handleEdit(row){
      var allParams = '?id='+row.order_id;
      oneorderGet(allParams).then((res) => {
        this.currow=res.data;
      });

      this.dialogSeeVisible = true;
    },

    handleDelete(row) {
      this.dialogDelVisible = true;
      this.delId = row.id;
    },

    submitdel(){

     const loading = this.$loading({
      lock: true,
      text: '退款中，请稍后',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
     var allParams={
      order_id:this.delId,
      refund:2
    }
    refundPost(allParams).then((res) => {
      if (res.msg === "ok") {
       this.$message({
        message: '退款成功',
        type: 'success'
      });
       loading.close();
       this.getlist();
       this.dialogDelVisible = false;
     } else {
       loading.close();
       this.$message({
        message: res.msg,
        type: 'error'
      });
     }
   }).catah((res)=>{
    console.log(res);
    loading.close();
  });
 },

 handlerefuse(index,row){
   var allParams={
    order_id:this.delId,
    refund:3
  }
  refundPost(allParams).then((res) => {
    if (res.msg === "ok") {
     this.$message({
      message: '拒绝成功',
      type: 'success'
    });
     this.getlist();
   }
 })
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
    // this.checkPer();
  }
}
</script>


<style>

</style>
