<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="mini" @click="newone" v-if="checkper1">新增角色</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading="loading" border stripe size="small" style="width:1000px">
      <el-table-column prop="id" label="编号" width="130" align="center">
      </el-table-column>
      <el-table-column prop="name" label="角色名称" min-width="200" align="center">
      </el-table-column>

      <el-table-column label="操作" min-width="200" align="center">
       <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleEdit(scope.$index,scope.row)" v-if="checkper2">编辑角色</el-button>
        <el-button type="primary" size="mini" @click="handleEditper(scope.$index,scope.row)" v-if="checkper2">编辑权限</el-button>
        <el-button type="danger" size="mini" @click="handleDelete(scope.$index,scope.row)" v-if="checkper3">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

</el-col>

<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newrole" :model="newrole" label-width="120px" :rules="rules">
      <el-form-item label="角色名:" prop="name">
        <el-input v-model="newrole.name" placeholder="请输入角色名"></el-input>
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
      <el-button type="danger" @click="submitdel()">确 定</el-button>
      <el-button @click="dialogDelVisible  = false" type="primary">取 消</el-button>
    </div>
  </el-dialog>
</el-col>


<el-col>
  <el-dialog title="编辑权限" :visible.sync="dialogPerVisible" width="600" center>
    <div class="tablebox">
      <table border="1" cellspacing="0" class="talbe">
        <div v-for="(item,index) in perarr" :key="index">
          <tr>
            <th>{{item.name}}</th>
          </tr>
          <tr>
            <td class="rtd">
             <div v-for="(items,index) in item.list" :key="index" style="display: inline-block;">
              <el-checkbox-group size="small" v-model="perlist">
                <el-checkbox :label="items.name">{{items.cname}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </td>
        </tr>
      </div>
    </table>

  </div>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" type="danger" @click="submitper()">确 定</el-button>
    <el-button size="small" @click="closeper" type="primary">取 消</el-button>
  </div>
</el-dialog>
</el-col>


</el-row>
</template>

<script>

  import { roleGet } from '../../api/api';
  import { rolePost } from '../../api/api';
  // import { rolePut } from '../../api/api';
  import { roleDel } from '../../api/api';

  // import { parmissonGet } from '../../api/api';
  // import { parmissonPost } from '../../api/api';
  // import { parmissonPut } from '../../api/api';

  export default {
    data() {
      return {
        checkper1:false,
        checkper2:false,
        checkper3:false,
        checkper4:false,

        currentPage: 1,
        list:[],
        loading: false,
        count:0,
        limit:10,
        diatitle:'新增角色',

        dialogDelVisible:false,

        dialogNewVisible:false,

        dialogPerVisible:false,

        newrole:{
          name:'',
        },

        rules: {
          username: [{required: true,trigger: 'blur',message: '请输入角色名'}]
        },

        perarr: [
        {
          name: '角色管理',
          list: [
          {name: 'roleselect',cname: '角色列表'},
          {name: 'roleinsert',cname: '添加角色'},
          {name: 'roleupdate',cname: '修改角色'},
          {name: 'roledelete',cname: '删除角色'}
          ]
        },
        // {
        //   name: '角色权限',
        //   list: [
        //   {name: 'permissionselect',cname: '角色权限管理'},
        //   {name: 'permissioninsert',cname: '添加权限'},
        //   {name: 'permissionupdate',cname: '修改权限'},
        //   {name: 'permissiondelete',cname: '删除权限'}
        //   ]
        // },
        {
          name: '后台账号',
          list: [
          {name: 'loginselect',cname: '后台账号列表'},
          {name: 'logininsert',cname: '添加账号'},
          {name: 'logindelete',cname: '删除账号'},
          {name: 'loginupdate',cname: '修改密码'}
          ]
        },
        {
          name: '系统设置',
          list: [
          {name: 'expressset',cname: '快递设置'},
          {name: 'bannerset',cname: '轮播图设置'},
          {name: 'paramset',cname: '参数设置'},
          ]
        },

        {
          name: '用户',
          list: [
          {name: 'userlist',cname: '用户列表'},
          {name: 'userbind',cname: '绑定核销'},
          ]
        },

        {
          name: '会员',
          list: [
          {name: 'memberlist',cname: '会员列表'},
          {name: 'memberrecharge',cname: '会员续费'},
          {name: 'memberset',cname: '等级设置'},
          {name: 'memberput',cname: '等级修改'},
          {name: 'memberdel',cname: '等级删除'},
          {name: 'memberrecord',cname: '充值记录'},
          ]
        },

        {
          name: '代理',
          list: [
          {name: 'agentlist',cname: '代理列表'},
          {name: 'agentrecheck',cname: '代理申请审核'},
          {name: 'comrecord',cname: '佣金记录'},
          {name: 'withdrawapply',cname: '提现申请'},
          {name: 'withdrawcheck',cname: '提现审核'},
          ]
        },


        {
          name: '店铺',
          list: [
          {name: 'shopselect',cname: '店铺列表'},
          {name: 'shopinsert',cname: '添加店铺'},
          {name: 'shopupdate',cname: '修改店铺'},
          {name: 'shopdelete',cname: '删除店铺'},

          {name: 'couponselect',cname: '优惠券列表'},
          {name: 'couponinsert',cname: '添加优惠券'},
          {name: 'couponupdate',cname: '修改优惠券'},

          ]
        },

        {
          name: '商品分类',
          list: [
          {name: 'gtypeselect',cname: '分类列表'},
          {name: 'gtypeinsert',cname: '添加分类'},
          {name: 'gtypeupdate',cname: '修改分类'},
          {name: 'gtypedelete',cname: '删除分类'}
          ]
        },
        {
          name: '商品',
          list: [
          {name: 'goodselect',cname: '商品列表'},
          {name: 'goodinsert',cname: '添加商品'},
          {name: 'goodupdate',cname: '修改商品'},
          {name: 'gooddelete',cname: '删除商品'}
          ]
        },
        {
          name: '订单',
          list: [
          {name: 'orderlist',cname: '订单列表'},
          {name: 'orderchange',cname: '修改订单'},
          {name: 'orderexport',cname: '导出订单'},
          ]
        },
        ],

        perlist:[],
      };
    },

    methods:{
      getlist(){
        var allParams = '';
        roleGet(allParams).then((res) => {
          this.list=res.data;
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

      newone(){
        this.putorup='up'
        this.diatitle='添加角色'
        this.dialogNewVisible=true
      },


      handleEdit(index,row){
        this.putorup='put'
        this.diatitle='修改角色'
        this.editId = row.id;
        this.dialogNewVisible=true
        this.newrole={
          name:row.name
        }
      },

      save(){
        this.$refs.newrole.validate((valid) => {
          if (valid) {
            if(this.putorup=='put'){
              var allParams = {
                name:this.newrole.name,
                id:this.editId
              }
              rolePost(allParams).then((res) => {
                if (res.msg=='ok') {
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
              var allParams = {
                name:this.newrole.name,
              }
              rolePost(allParams).then((res) => {
                if (res.msg=='ok') {
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
          }else{
            return false;
          }
        })
      },

      handleDelete(index,row) {
        this.dialogDelVisible = true;
        this.delId = row.id;
      },

      submitdel(){
        this.dialogDelVisible = false;
        var allParams=this.delId
        roleDel(allParams).then((res) => {

          if (res.msg=='ok') {
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


      handleEditper(index,row){
        console.log(row)
        this.roleId=row.id
        this.rolename=row.name
        this.perlist=row.permissions
        this.dialogPerVisible=true

       //  var allParams='?roleId='+this.roleId
       //  parmissonGet(allParams).then((res) => {
       //    if (res.msg=='ok') {
       //      let data = res.data.permission.split(',')
       //      if(data.length==0){
       //        this.zeroper=true
       //        this.perlist=[]
       //      }else{
       //        this.perlist=data
       //      }
       //      console.log(this.perlist)
       //      this.dialogPerVisible=true
       //    } else {
       //     this.$message({
       //      message: res.msg,
       //      type: 'error'
       //    });
       //   }
       // })
     },

     closeper(){
      this.perlist=[]
      this.dialogPerVisible=false
    },

    submitper(){
      var allParams ={
        id:this.roleId,
        name:this.rolename,
        permissions:this.perlist
      }
      console.log(allParams)

      rolePost(allParams).then((res) => {
        if (res.msg=='ok') {
         this.$message({
          message: '提交成功',
          type: 'success'
        });
         this.getlist()
         this.dialogPerVisible=false
       } else {
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     })

    },

    checkPer(){
      var per = sessionStorage.getItem('permissions');

      if(per.indexOf('roleinsert')>-1){
        this.checkper1=true;
      }

      if(per.indexOf('roleupdate')>-1){
        this.checkper2=true;
      }

      if(per.indexOf('roledelete')>-1){
        this.checkper3=true;
      }

    },

  },

  mounted: function () {
    this.getlist();
    this.checkPer()
  }
}
</script>


<style scoped>
  .el-checkbox{
    margin: 5px 30px 5px 10px!important;
  }
  .tablebox{
    margin:20px 0 0 80px;
  }
  .tablebox table{
    border-collapse:collapse;
    border:#ddd;
  }
  .tablebox table th{
    background-color: #eef1f6;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    font-size: 14px;
    text-align:center; 
  }
  .tablebox table td{
    height: 30px;
    padding-left: 10px;
    line-height: 30px;
  }
  .ltd{
    text-align:center; 
    width: 150px;
    font-size: 14px;
  }
  .rtd{
    width: 700px;
  }
</style>
