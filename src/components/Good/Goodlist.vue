<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

     <el-form :inline="true">
      <el-form-item label="商店：" prop="filter.store_id">
        <el-select v-model="filter.store_id" placeholder="请选择商店" filterable  @change="getlist" size="small">
          <el-option v-for="item in shoplist" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="mini" @click="newone" v-if="checkper1">新增商品</el-button>
      </el-form-item>

    </el-form>

    <el-table :data="list" border stripe style="width:1350px" size="small">
      <el-table-column prop="id" label="ID" min-width="70" align="center">
      </el-table-column>

      <el-table-column prop="title" label="标题" min-width="140" align="center">
      </el-table-column>

      <el-table-column prop="logo" label="缩略图" min-width="80" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.logo" style="max-width:50px;max-height:50px;" />
        </template>
      </el-table-column>

      <el-table-column prop="fixed" label="规格" min-width="140" align="center">
       <template slot-scope="scope">
        <el-tag type="warning" v-if="scope.row.fixed==1">单规格</el-tag>
        <el-tag type="success" v-if="scope.row.fixed==2">多规格</el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="brokerage" label="佣金" min-width="100" align="center">
    </el-table-column>

    <el-table-column prop="hot" label="推荐" min-width="80" align="center">
     <template slot-scope="scope">
      <el-button type="success" size="mini" @click="handleHot(scope.$index, scope.row)" v-show="scope.row.hot==1">是</el-button>
      <el-button type="info" size="mini" @click="handleHot(scope.$index, scope.row)" v-show="scope.row.hot==0">否</el-button>
    </template>
  </el-table-column>

  <el-table-column prop="state" label="状态" min-width="80" align="center">
   <template slot-scope="scope">
    <el-button type="success" size="mini" @click="handleState(scope.$index, scope.row)" v-show="scope.row.state==1">上架</el-button>
    <el-button type="info" size="mini" @click="handleState(scope.$index, scope.row)" v-show="scope.row.state==2">下架</el-button>
  </template>
</el-table-column>

<el-table-column prop="logo" label="小程序码" min-width="100" align="center">
  <template slot-scope="scope">
    <img :src="hosturl+'page=pages/detail&'+'gid='+scope.row.id" style="max-width:60px;max-height:60px;" />
    <el-button type="primary" size="mini" @click="downs(hosturl+'page=pages/detail&'+'gid='+scope.row.id,scope.row.title)">下载</el-button>
    <el-button type="primary" size="mini" @click="flashQrcode">刷新</el-button>
  </template>
</el-table-column>

<el-table-column prop="created_at" label="创建时间" min-width="140" align="center">
</el-table-column>

<el-table-column label="操作" min-width="280" align="center">
 <template slot-scope="scope">
  <el-button type="success" size="mini" @click="handleKucun(scope.$index, scope.row)" v-if="checkper2">查看库存</el-button>
  <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)" v-if="checkper2">修改</el-button>
  <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)" v-if="checkper3">删除</el-button>
</template>
</el-table-column>

</el-table>

<el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
</el-pagination>

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
  <el-dialog title="编辑库存" :visible.sync="dialogseekcVisible" width="1200px" center>

   <el-form :inline="true" v-if="(product.fixed==2) || (product.fixed==1&&stocks.length==0)">
    <el-form-item>
      <el-button type="primary" size="mini" @click="newkucun">新增库存</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="stocks" border stripe style="width:1200px" size="small">
    <el-table-column prop="price" label="价格" min-width="100" align="center">
    </el-table-column>
    <el-table-column prop="member_price" label="会员价" min-width="100" align="center">
    </el-table-column>
    <el-table-column prop="number" label="库存数量" min-width="100" align="center">
    </el-table-column>

    <el-table-column label="操作" min-width="100" align="center">
     <template slot-scope="scope">
      <el-button type="warning" size="mini" @click="editkucun(scope.$index, scope.row)">编辑</el-button>
      <el-button type="danger" size="mini" @click="delkucun(scope.$index, scope.row)" v-if="scope.row.id">删除</el-button>
    </template>
  </el-table-column>

</el-table>

<div slot="footer" class="dialog-footer">
  <el-button type="primary" @click="postkucun()">提 交</el-button>
  <el-button @click="dialogseekcVisible = false">取 消</el-button>
</div>
</el-dialog>
</el-col>

<el-col>
  <el-dialog title="删除不可恢复，是否确定删除？" :visible.sync="dialogdelkcVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitdelkc()">确 定</el-button>
      <el-button @click="dialogdelkcVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>



<el-col>
  <el-dialog title="编辑库存" :visible.sync="dialogeditkcVisible" width="800px">

    <div style="border-bottom: 1px solid #eee;">
      <el-input size="small" v-model="astock.price" style="width: 200px;margin:5px 5px 5px 0;"><template slot="prepend">价格</template><template slot="append">元</template></el-input>
      <el-input size="small" v-model="astock.member_price" style="width: 200px;margin:5px 5px 5px 0;"><template slot="prepend">会员价</template><template slot="append">元</template></el-input>
      <el-input size="small" v-model="astock.number" min='1' style="width: 200px;margin:5px 5px 5px 0;"><template slot="prepend">库存数量</template></el-input>
    </div>

    <div v-for="(guige, idx) in categories" :key="idx" style="margin-bottom: 20px">
      <div type="warning" size="small" style="display:block;width: 200px;margin:5px 5px 5px 0;">{{guige.title}}</div>
      <div v-for="(item,index) in guige.details" style="display: inline-block;">
        <el-checkbox-group size="small" v-model="astock.details[idx]" fill="#67c23a" :max='1'>
          <el-checkbox-button :key="item.id" :label="item.id">{{item.title}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitkucun()">确 定</el-button>
      <el-button @click="dialogeditkcVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>



</el-row>
</template>



<script>
  import { shopGet } from '../../api/api';
  import { goodGet } from '../../api/api';
  import { goodoneGet } from '../../api/api';
  import { goodhot } from '../../api/api';
  import { goodstate } from '../../api/api';

  import { stocksPost } from '../../api/api';

  import { gooddel } from '../../api/api';
  import { goodkcdel } from '../../api/api';
  import { flashqrcode } from '../../api/api';

  import { Message } from 'element-ui';

  import hosturl from '../../api/api';
  import axios from 'axios'


  export default {
    data() {
      return {
        checkper1:false,
        checkper2:false,
        checkper3:false,

        hosturl:hosturl +'api/qrcode?',

        currentPage: 1,
        list:[],
        count:0,
        limit:10,

        dialogDelVisible:false,

        dialogseekcVisible:false,
        dialogeditkcVisible:false,
        dialogdelkcVisible:false,

        product:{},
        editId:'',
        delId:'',
        delkcId:'',
        categories:[],
        stocks:[],

        filter:{
          store_id:''
        },
        shoplist:[],

        astock:{
          price:'',
          member_price:'',
          number:'',
          details:[]
        },
        editkcindex:'',


      };
    },

    methods:{
      downloadIamge(imgsrc, name) {
        var image = new Image();
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function() {
          var canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          var context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          var url = canvas.toDataURL("image/png"); 

          var a = document.createElement("a"); 
          var event = new MouseEvent("click"); 
          a.download = name || "photo"; 
          a.href = url; 
          a.dispatchEvent(event);
        };
        image.src = imgsrc;
      },

      downs(a,b){
        // window.print()
        this.downloadIamge(a, b+'.jpg')
      },
      flashQrcode(){
        console.log('flash');
        axios.defaults.timeout = 1500000
axios.defaults.withCredentials = true
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
         axios.get(`${hosturl}/access/token`).then((res)=>{
        
         });
      this.$router.go(0)

      },


      handleKucun(index,row){
        var allParams = '?id='+ row.id;
        this.editId=row.id
        goodoneGet(allParams).then((res) => {
          this.categories=res.data.categories;
          this.product=res.data
          if(res.data.stocks.length!==0){
            this.stocks=res.data.stocks;
          }else{
            this.stocks=[]
          }
          this.dialogseekcVisible=true;
        });
      },

      newkucun(){
        this.editkcindex=''
        var categories=this.categories
        var astock=this.astock
        astock.details=[]
        for(var i=0;i<categories.length;i++){
          astock.details.push([])
        }
        this.astock=astock
        this.dialogeditkcVisible=true;
      },

      editkucun(index,row){
        this.editkcindex=index
        this.astock=row
        this.dialogeditkcVisible=true;
      },

      delkucun(index,row){
       this.dialogdelkcVisible = true;
       this.delkcId = row.id;
     },

     submitdelkc(){
      var allParams='?id='+this.delkcId
      goodkcdel(allParams).then((res) => {
        if (res.msg === "ok") {
         this.$message({
          message: '删除成功',
          type: 'success'
        });

         this.dialogdelkcVisible = false;

         var allParams = '?id='+ this.editId;
         goodoneGet(allParams).then((res) => {
          this.categories=res.data.categories;
          this.product=res.data
          if(res.data.stocks.length!==0){
            this.stocks=res.data.stocks;
          }else{
            this.stocks=[]
          }
        });


       } else {
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     });
    },


    submitkucun(){

     if(this.astock.price==''){
       this.$message({
        message: '请输入价格',
        type: 'error'
      });
       return
     }
     if(this.astock.member_price==''){
       this.$message({
        message: '请输入会员价',
        type: 'error'
      });
       return
     }
     if(this.astock.number==''){
       this.$message({
        message: '请输入库存数量',
        type: 'error'
      });
       return
     }
     if(this.product.fixed=='2'){
      var details=this.astock.details
      var arr=[]
      for(var i=0;i<details.length;i++){
        if(details[i].length){
          arr.push(details[i][0])
        }
      }

      if(arr.length==0){
        this.$message({
          message: '请选择规格',
          type: 'error'
        });
        return
      }
    }
    if(this.editkcindex!==''){
      this.stocks[this.editkcindex]=this.astock
    }else{
      this.stocks.push(this.astock)
    }
    this.dialogeditkcVisible=false

  },


  postkucun(){
    var stocks=this.stocks
    for(var i=0;i<stocks.length;i++){
      var arr=[]
      for(var j=0;j<stocks[i].details.length;j++){
        arr.push(stocks[i].details[j][0])
      }
      stocks[i].details=arr
    }

    var allParams={
      product_id:this.editId,
      stocks:stocks
    }
    stocksPost(allParams).then((res) => {
     this.$message({
      message: '提交成功',
      type: 'success'
    });
     this.dialogseekcVisible=false;
   });
  },


  newone(){
    sessionStorage.removeItem('goodeditid');
    this.$router.push({ path: '/Good/Goodnew' });
  },

  getlist(){
    var allParams = '?page='+ this.currentPage + '&limit=' + this.limit + '&store_id=' + this.filter.store_id;
    goodGet(allParams).then((res) => {
      this.list=res.data.data;
      this.count=res.data.count
    });
  },



    //   changesort(row){
    //     if(row.sort==''){
    //      this.$message({
    //       message: '请先输入排序值',
    //       type: 'success'
    //     });
    //      return
    //    }
    //    var allParams="?id="+row.id+'&sort='+row.sort
    //    groupSet(allParams).then((res) => {
    //     if (res.msg == "ok") {
    //      this.$message({
    //       message: '修改成功',
    //       type: 'success'
    //     });
    //      this.getlist();
    //    } else {
    //      this.$message({
    //       message: res.msg,
    //       type: 'error'
    //     });
    //    }
    //  });
    //  },


    handleHot(index,row){
      var allParams={product_id:row.id}
      goodhot(allParams).then((res) => {
        if (res.msg == "ok") {
         this.$message({
          message: '修改成功',
          type: 'success'
        });
         this.getlist();
       } else {
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     });
    },

    handleState(index,row){
      var allParams="?id="+row.id
      goodstate(allParams).then((res) => {
        if (res.msg == "ok") {
         this.$message({
          message: '修改成功',
          type: 'success'
        });
         this.getlist();
       } else {
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     });
    },


    handleEdit(index,row){
      sessionStorage.setItem('goodeditid',row.id);
      this.$router.push({ path: '/Good/Goodnew' });
    },




    handleDelete(index, row) {
      this.dialogDelVisible = true;
      this.delId = row.id;
    },

    submitdel(){
      this.dialogDelVisible = false;
      var allParams='?id='+this.delId
      gooddel(allParams).then((res) => {
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

    getshop(){
      var allParams = '?page=1&limit=9999'
      shopGet(allParams).then((res) => {
        this.shoplist=res.data.data;
      });
    },

    checkPer(){
      var per = sessionStorage.getItem('permissions');

      if(per.indexOf('goodselect')>-1){
        this.checkper1=true;
      }

      if(per.indexOf('goodinsert')>-1){
        this.checkper2=true;
      }

      if(per.indexOf('goodupdate')>-1){
        this.checkper3=true;
      }
    },

  },

  mounted: function () {
    this.getshop();
    this.getlist();
    this.checkPer();
  }
}
</script>


<style scope>
  .icon{
    width: 20px;
    height: 20px;
    margin: 2px;
  }

  .el-button+.el-button {
    margin-left: 0px!important;
  }



  .el-input-group__append{
    background-color: deepskyblue!important;
    color:#fff!important;
  }
  .el-input-group__prepend{
    background-color: #409EFF!important;
    color:#fff!important;
  }
</style>
