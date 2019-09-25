<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商家管理</el-breadcrumb-item>
        <el-breadcrumb-item>优惠券</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="small" @click="newone" v-if="checkper1">新增券</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border stripe size="small" style="width:1200px">
      <el-table-column prop="store_id" label="店铺id" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="store.name" label="店铺名" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="title" label="标题" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="start" label="使用开始时间" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="end" label="使用结束时间" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="limit_price" label="使用门槛" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="price" label="优惠金额" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="type" label="类型" min-width="100" align="center">
       <template slot-scope="scope">
        <el-button type="success" size="mini" v-show="scope.row.type==1">现金券</el-button>
        <el-button type="primary" size="mini" v-show="scope.row.type==2">满减券</el-button>
      </template>
    </el-table-column>

    <el-table-column label="操作" min-width="200" align="center">
     <template slot-scope="scope">
      <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" v-if="checkper2">编辑</el-button>
      <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" v-if="checkper1">删除</el-button>
    </template>
  </el-table-column>

</el-table>

<el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
</el-pagination>
</el-col>

<el-col>
  <el-dialog :title="diatitle" title="新增优惠券" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newcoupon" :model="newcoupon" label-width="120px" :rules="rules">

      <el-form-item label="商店：" prop="store_id">
        <el-select v-model="newcoupon.store_id" placeholder="请选择商店" filterable>
          <el-option v-for="item in shoplist" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="标题:" prop="title">
        <el-input v-model="newcoupon.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="使用开始时间:">
        <el-date-picker v-model="newcoupon.start" type="date" value-format="yyyy-MM-dd" style="width:500px;" :editable=false placeholder="请选择使用开始时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="使用结束时间:">
        <el-date-picker v-model="newcoupon.end" type="date" value-format="yyyy-MM-dd" style="width:500px;" :editable=false placeholder="请选择使用结束时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="使用条件:" prop="limit_price">
        <el-input v-model="newcoupon.limit_price" placeholder="请输入使用条件"></el-input>
      </el-form-item>

      <el-form-item label="优惠金额:" prop="price">
        <el-input v-model="newcoupon.price" placeholder="请输入优惠金额"></el-input>
      </el-form-item>


      <el-form-item label="类型:" prop="type">
        <el-radio-group v-model="newcoupon.type" size="small">
          <el-radio-button label="1">现金券</el-radio-button>
          <el-radio-button label="2">满减券</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item style="margin-left: calc(50% - 200px);">
        <el-button type="primary" @click="save()">保 存</el-button>
        <el-button @click="dialogNewVisible = false">取 消</el-button>
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


</el-row>
</template>



<script>
  import { shopGet } from '../../api/api';

  import { couponPost } from '../../api/api';
  import { couponGet } from '../../api/api';
  import { couponDel } from '../../api/api';
  // import { couponstate } from '../../api/api';

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

      return {
        checkper1:false,
        checkper2:false,
        checkper3:false,
        
        diatitle:'新增优惠券',
        putorup:'new',
        editId:'',
        delId:'',

        currentPage: 1,
        list:[],
        count:0,
        limit:10,
        dialogNewVisible:false,
        dialogDelVisible:false,
        newcoupon:{},
        date:'',
        rules: {
          title: [{required: true, trigger: 'blur',message: '请输入标题'}],
          limit_price: [{required: true, validator: checkvalue, trigger: 'blur'}],
          price: [{required: true, validator: checkvalue, trigger: 'blur'}],
        },


        shoplist:[]


      };
    },

    methods:{
      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit
        couponGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count;
        });
      },

      newone(){
        this.dialogNewVisible=true
        this.newcoupon={
          store_id:'',
          title:'',
          limit_price:0,
          price:'',
          end:'',
          start:'',
          type:1
        };
      },

      save(){
        if(this.newcoupon.end==''){
          this.$message.error(`请选择有效时间`);
          return
        }

        this.$refs.newcoupon.validate((valid) => {
          if (valid) {
            console.log(this.newcoupon)
            var allParams={
              store_id:this.newcoupon.store_id,
              end:this.newcoupon.end,
              start:this.newcoupon.start,
              title:this.newcoupon.title,
              price:this.newcoupon.price,
              limit_price:this.newcoupon.limit_price,
              type:this.newcoupon.type,
            }

            if(this.editId!==0){
              allParams.id=this.editId
            }

            couponPost(allParams).then((res) => {
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });
               this.getlist();
               this.newcoupon={
                title:'',
                limit_price:'',
                price:'',
                end:'',
                start:'',
                type:1
              };
              this.editId=0

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
        // console.log(row.end.split(' ')[0])
        this.diatitle='编辑优惠券';
        this.putorup='put';
        this.dialogNewVisible=true
        this.editId = row.id;
        this.newcoupon={
          store_id:row.store_id,
          type:row.type,
          title:row.title,
          limit_price:row.limit_price,
          price:row.price,
          end:row.end,
          start:row.start,
          id:row.id
        }
      },

      handleDelete(index, row) {
        this.dialogDelVisible = true;
        this.delId = row.id;
      },

      submitdel(){
        this.dialogDelVisible = false;
        var allParams='?id='+this.delId
        couponDel(allParams).then((res) => {
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


      changestate(index,row){
        var allParams = '?id='+ row.id;
        couponstate(allParams).then((res) => {
         console.log(res)
         this.getlist();
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

        if(per.indexOf('couponinsert')>-1){
          this.checkper1=true;
        }
        if(per.indexOf('couponupdate')>-1){
          this.checkper2=true;
        }
        // if(per.indexOf('quanDel')>-1){
        //   this.checkper3=true;
        // }
      },

      getshop(){
        var allParams = '?page=1&limit=9999'
        shopGet(allParams).then((res) => {
          this.shoplist=res.data.data;
        });
      },
    },

    mounted: function () {
      this.getshop();
      this.getlist();
      this.checkPer();
    }
  }
</script>


<style>

</style>
