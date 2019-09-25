<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>购物订单</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

      <el-form :inline="true">

        <el-form-item>
          <div class="block">
            <span class="demonstration">下单时间：</span>
            <el-date-picker size="small" v-model="filter1.date" type="daterange" range-separator="/" @change="getSTime" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="订单状态：">
          <el-select v-model="filter.state" placeholder="订单状态" size="small" @change="getlist">
            <el-option label="待支付" value="1"></el-option>
            <el-option label="待发货" value="2"></el-option>
            <el-option label="待收货" value="3"></el-option>
            <el-option label="已完成" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商店：" prop="filter.store_id">
          <el-select v-model="filter.store_id" placeholder="请选择商店" filterable  @change="getlist" size="small">
            <el-option v-for="item in shoplist" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
         <el-button type="primary" style="margin-left:50px;" size="small"><a style="color:#fff;" :href="orderexcel" download="" mce_href="#" v-if="checkper2">导出Excel表</a></el-button>
       </el-form-item>
     </el-form>

     <el-table :data="list" border stripe size="small" id="out-table" style="width:1600px" :summary-method="getSummaries" show-summary>
      <el-table-column prop="id" label="ID" width="100" align="center">
      </el-table-column>
      <el-table-column prop="number" label="订单号" min-width="120" align="center">
      </el-table-column>

      <el-table-column prop="user" label="头像" min-width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.user.avatarUrl" v-if="scope.row.user" style="width:40px;height:40px;border-radius:50%;margin:5px 0 -5px 0;" />
        </template>
      </el-table-column>

      <el-table-column prop="user.nickname" label="用户" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="price" label="金额" min-width="150" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.price}}</p>
        </template>
      </el-table-column>

      <el-table-column prop="delivery" label="收货方式" min-width="200" align="center">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.delivery==1">快递</el-tag>
          <el-tag type="success" v-if="scope.row.delivery==2">自提</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="state" label="订单状态" min-width="200" align="center">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.state==1">待支付</el-tag>
          <el-tag type="success" v-if="scope.row.state==2">待发货</el-tag>
          <el-tag type="primary" v-if="scope.row.state==3">待收货</el-tag>
          <el-tag type="warning" v-if="scope.row.state==4">已完成</el-tag>
          <el-tag type="danger" v-if="scope.row.state==6">已取消</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="created_at" label="下单时间" min-width="120" align="center">
      </el-table-column>

<!--         <el-table-column prop="seller" label="核销人" min-width="100" align="center" >
          <template slot-scope="scope">
            <p v-if="scope.row.state=='4' && scope.row.seller">{{scope.row.seller.nickname}}</p>
          </template>
        </el-table-column> -->

        <el-table-column label="操作" min-width="200" align="center">
         <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleSee(scope.row)">订单详情</el-button>

          <el-button type="success" size="mini" @click="handleSend(scope.row)" v-if="scope.row.state==2 && scope.row.delivery==1 && checkper1">发货</el-button>

          <el-button type="warning" size="mini" @click="handleJie(scope.row)" v-if="scope.row.state==2 && scope.row.delivery==2 && checkper1">接单</el-button>

          <!-- <el-button type="danger" size="mini" @click="handleTui(scope.row)" v-if="scope.row.state!=1 &&scope.row.state!=3 && scope.row.state!=4">退款</el-button> -->

        </template>
      </el-table-column>

    </el-table>

    <el-pagination style="float:left;margin:20px 0 200px 0px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40, 50,100,200,500,1000]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
    </el-pagination>


  </el-col>



  <el-col>
    <el-dialog title="是否确定退款？" :visible.sync="dialogunTuiVisible" width="30%">
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmTuid()">确 定</el-button>
        <el-button @click="dialogunTuiVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-col>




  <el-col>
    <el-dialog title="商品详情" :visible.sync="dialogSeeVisible" width="1200px" center>
      <el-form label-position="right" label-width="120px" size="mini">


        <el-form-item label="收货信息：" v-if="orderdetail.address">
          <div class="fw4">姓名： {{orderdetail.address.name}}</div>
          <div class="fw4">地址： {{orderdetail.address.province}}{{orderdetail.address.city}}{{orderdetail.address.area}}{{orderdetail.address.detail}}</div>
          <div class="fw4">电话： {{orderdetail.address.phone}}</div>
        </el-form-item>

        <el-form-item label="快递信息：" v-if="orderdetail.express_id!='0'">
          <div class="fw4">快递公司编号： {{orderdetail.express_id}}</div>
          <div class="fw4">物流单号： {{orderdetail.express_number}}</div>
        </el-form-item>


        <el-form-item label="商品信息：">

          <el-table :data="orderdetail.snapshots" border stripe size="mini" id="out-table">


            <el-table-column prop="product_logo" label="商品缩略图" min-width="100" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.product_logo" style="max-width:80px;max-height:64px;" />
              </template>
            </el-table-column>

            <el-table-column prop="product_title" label="商品名称" min-width="100" align="center">
            </el-table-column>

            <el-table-column prop="number" label="数量" min-width="100" align="center">
            </el-table-column>

            <el-table-column prop="detail" label="规格" min-width="100" align="center">
            </el-table-column>

            <el-table-column prop="product_price" label="价格" min-width="100" align="center">
             <template slot-scope="scope">
              <p class="fw4">￥{{scope.row.product_price}}</p>
            </template>
          </el-table-column>
        </el-table>

      </el-form-item>


    </el-form>
  </el-dialog>
</el-col>



<el-col>
  <el-dialog title="快递信息" :visible.sync="dialogSendVisible" width="800px" center>
    <el-form :model="kuaidi" ref="kuaidi" label-width="120px" :rules="sendrule">
      <el-form-item label="快递名称：" label-width="120px" prop="express_id">
        <el-select v-model="kuaidi.express_id" placeholder="全部">
          <el-option v-for="item in expressarr" :label="item.title" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="快递单号：" label-width="120px" prop="express_number">
       <el-input v-model="kuaidi.express_number" placeholder="请输入快递单号"></el-input>
     </el-form-item>
     <el-button type="primary" size="small" @click="submitsend" style="margin-left: calc(50% - 28px);">提交</el-button>
   </el-form>
 </el-dialog>
</el-col>



<el-col>
  <el-dialog title="是否确定接单？" :visible.sync="dialogJieVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitJie()">确 定</el-button>
      <el-button @click="dialogJieVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>




</el-row>
</template>

<script>
  import { shopGet } from '../../api/api';

  import { allorderGet } from '../../api/api';
  // import { allorderTui } from '../../api/api';
  import { deliveryGet } from '../../api/api';
  import { shipgoods } from '../../api/api';

  import hosturl from '../../api/api';

  import { Message } from 'element-ui';


  export default {
    data() {
      return {
       orderexcel:'',
       checkper1:false,
       checkper2:false,

       list:[],
       currentPage: 1,
       count:0,
       limit:100,

       filter:{
        start:'',
        end:'',
        state:'2',
        store_id:''
      },

      filter1:{
        date:''
      },

      shoplist:[],

      kuaidi:{
        express_id:'',
        express_number:''
      },

      jieid:'',
      expressarr:[],
      sendrule:{
        express_number: [
        {required: true, message: '请输入快递单号', trigger: 'blur'},
        ],
      },
      dialogSendVisible:false,

      orderdetail:[],
      dialogSeeVisible:false,
      dialogunTuiVisible:false,
      dialogJieVisible:false
    };
  },

  methods:{


    handleSee(row){
      this.orderdetail = row;
      this.dialogSeeVisible = true;
    },

    getlist(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit +'&state='+this.filter.state + '&type=origin'+'&store_id='+this.filter.store_id+'&start='+this.filter.start +'&end='+this.filter.end
      allorderGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count

        this.orderexcel=hosturl+'/export/orders'+'?page='+ this.currentPage + '&limit=' + this.limit +'&state='+this.filter.state + '&type=origin'+'&store_id='+this.filter.store_id+'&start='+this.filter.start +'&end='+this.filter.end

        this.getSummaries()
      });
    },

    getSummaries(param){
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        if(index === 4){
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = 'N/A';
          }
        }
      });
      return sums;
    },

    getSTime(val){
      this.filter.start=val[0];
      this.filter.end=val[1];

      this.getlist()
    },

    clear(){
      this.city_id='';
      this.cityone='';
      this.filter={
        start:'',
        end:'',
      }
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

    handleTui(row){
      this.tuiid=row.id
      this.dialogunTuiVisible=true
    },

    confirmTuid(){
      var allParams='?order_id='+this.tuiid
      allorderTui(allParams).then((res) => {
        if (res.msg === "ok") {
         this.$message({
          message: '退款成功',
          type: 'success'
        });
         this.dialogunTuiVisible=false
       } else {
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     });
    },


    getexpress(){
      var allParams = '?page=1&limit=99999';
      deliveryGet(allParams).then((res) => {
        this.expressarr=res.data.data;
      });
    },


    handleSend(row){
      this.kuaidi={
        id:row.id,
        express_id:'',
        express_number:''
      }
      this.dialogSendVisible = true;
    },


    submitsend(){
      var that =this;
      that.$refs.kuaidi.validate((valid) => {
        if (valid) {
          var allParams = that.kuaidi;
          shipgoods(allParams).then((res) => {
            this.getlist();
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            this.dialogSendVisible = false;
          });
        }else{
          return false;
        }
      })
    },

    handleJie(row){
      this.jieid=row.id
      this.dialogJieVisible = true;
    },


    submitJie(){
      var that =this;

      var allParams = {
        id:that.jieid
      };
      shipgoods(allParams).then((res) => {
        this.getlist();
        this.$message({
          message: '提交成功',
          type: 'success'
        });
        this.dialogJieVisible = false;
      });

    },


    getshop(){
      var allParams = '?page=1&limit=9999'
      shopGet(allParams).then((res) => {
        this.shoplist=res.data.data;
      });
    },

    checkPer(){
      var per = sessionStorage.getItem('permissions');

      if(per.indexOf('orderchange')>-1){
        this.checkper1=true;
      }

      if(per.indexOf('orderexport')>-1){
        this.checkper2=true;
      }

    },
  },

  mounted: function () {
    this.getshop();
    this.getlist();
    this.getexpress();
    this.checkPer();
  }
}
</script>

<style>

</style>