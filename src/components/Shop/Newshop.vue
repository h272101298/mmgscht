<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商家管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增店铺</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col>
      <el-form ref="newshop" :model="newshop" label-width="120px" :rules="rules" style="width: 1000px;" status-icon>



        <el-form-item label="名称:" prop="name">
          <el-input v-model="newshop.name" placeholder="请输入店铺名称"></el-input>
        </el-form-item>

        <el-form-item label="简介:" prop="detail">
          <el-input v-model="newshop.detail" placeholder="请输入店铺简介"></el-input>
        </el-form-item>

        <el-form-item label="地址:" prop="address">
          <el-input v-model="newshop.address" placeholder="请输入地址"></el-input>
        </el-form-item>

        <el-form-item label="运费:" prop="express_price">
          <el-input v-model="newshop.express_price" placeholder="请输入运费（0为免运费）"><template slot="append">元</template></el-input>
        </el-form-item>

        <el-form-item label="logo：" prop="logo">
          <el-upload class="upload-demo" :action="upurl" :data="uptoken" :on-success="handleSuccess" :show-file-list="false" accept="image/*">
            <img :src="newshop.logo" class="pre-img" style="width:146px;height:146px;border:1px dashed #ccc;border-radius:6px;display: block;margin-top: 1px;">
            <div slot="tip" class="upload__tip">可上传JPG/PNG文件，建议图片长宽比为1:1</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="轮播图：" prop="images">
          <el-upload :action="upurl" :data="uptoken" list-type="picture-card" :on-remove="handleRemove" :on-success="handlelistSuccess" :file-list="newshop.images" :multiple="true" accept="image/*">
            <img src="../../../static/images/default1.png" class="pre-img" style="width:145px;height:144px;margin-top: 1px;display: block" >
            <div slot="tip" class="upload__tip">可上传JPG/PNG文件，建议图片长宽比为16:9</div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="save()">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-col>


  </el-row>
</template>


<script>
  import qiniu from '../../api/qiniu';

  import { shopPost } from '../../api/api';
  import { shoponeGet } from '../../api/api';
  import { shopaddGet } from '../../api/api';

  export default {
    data() {
      return {
        newshop:{
          logo:'../static/images/default1.png',
          name:'',
          address:'',
          images:[],
          detail:'',
          express_price:'',
        },

        cityone:'',

        zuobiao:'',

        levelarr1:[],
        levelarr2:[],

        rules: {
          name: [{required: true, trigger: 'blur',message: '请输入店铺名称'}],
          detail: [{required: true, trigger: 'blur',message: '请输入店铺简介'}],
          address: [{required: true, trigger: 'blur',message: '请输入地址'}],
          express_price: [{required: true, trigger: 'blur',message: '请输入运费'}],
        },

        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

      };
    },


    methods:{

      checkid(){
        var shopid=sessionStorage.getItem('shopeditid');
        this.shopid=shopid

        if(shopid){

          var allParams = '?id='+ shopid;
          shoponeGet(allParams).then((res) => {
            this.newshop.name=res.data.name;
            this.newshop.address=res.data.address;
            this.newshop.detail=res.data.detail;
            this.newshop.logo=res.data.logo;
            this.newshop.express_price=res.data.express_price;

            var images=[];
            for(var i=0;i<res.data.images.length;i++){
              images.push({
                uid:i,
                url:res.data.images[i].href,
                response:{
                  key:1
                }
              })
            }
            this.newshop.images=images
          });
        }
      },

      handleSuccess(res, file) {
        this.newshop.logo = qiniu.showurl+ res.key
      },

      handlelistSuccess(res, file,fileList){
        console.log(fileList)
        this.newshop.images=[]
        for(var i=0;i<fileList.length;i++){
          if(fileList[i].response){
            if(fileList[i].response.key !== 1){
              this.newshop.images.push(qiniu.showurl+ fileList[i].response.key)  
            }else {
              this.newshop.images.push(fileList[i].url)
            }
          }
        }
      },

      handleRemove(file, fileList) {
        this.newshop.images=[]
        for(var i=0;i<fileList.length;i++){
          if(fileList[i].response.key !== 1){
            this.newshop.images.push(qiniu.showurl+ fileList[i].response.key)
          }else {
            this.newshop.images.push(fileList[i].url)
          }
        }
      },

      save(){
        this.$refs.newshop.validate((valid) => {
          if (valid) {
            console.log(this.newshop)

            if(this.shopid){
              this.newshop.id=this.shopid
            }

            var aaa =this.newshop.images
            this.newshop.images=[]
            for(var i=0; i<aaa.length; i++){
              if(typeof aaa[i] == 'object'){
                this.newshop.images.push(aaa[i].url)
              }else {
                this.newshop.images.push(aaa[i])
              }
            }

            shopPost(this.newshop).then((res) => {
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });
               this.$router.push({ path: '/Shop/Shoplist' });
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

      }

    },

    mounted: function () {
      this.checkid()
    }
  }
</script>


<style scope>
  .upload__tip{
    font-size: 12px;
    color: #606266;
  }

  .editer{
    height: 350px;
    margin-bottom: 90px;
  }
</style>
