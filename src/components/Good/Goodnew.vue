<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增商品</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

      <el-form label-width="130px" width="900px" center style="width: 1000px" :rules="rules" ref="newone" :model="newone">

        <el-form-item label="商店：" prop="store_id">
          <el-select v-model="newone.store_id" placeholder="请选择商店" filterable>
            <el-option v-for="item in shoplist" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="商品分类：" prop="type_id">
          <el-select v-model="type1" placeholder="请选择侧边栏" filterable @change="gettype2">
            <el-option v-for="item in typeArr1" :label="item.title" :value="item.id" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="type2" placeholder="请选择分目录" filterable v-show="type1" @change="gettype3">
            <el-option v-for="item in typeArr2" :label="item.title" :value="item.id" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="newone.type_id" placeholder="请选择子目录" filterable v-show="type2">
            <el-option v-for="item in typeArr3" :label="item.title" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标题：" prop="title">
          <el-input v-model="newone.title" placeholder="请输入活动标题" style="width:500px;"></el-input>
        </el-form-item>

        <el-form-item label="佣金：" prop="brokerage">
          <el-input v-model="newone.brokerage" placeholder="请输入佣金" style="width:500px;"><template slot="append">元</template></el-input>
        </el-form-item>

        <el-form-item label="规格：" prop="fixed" v-if="!goodid">
         <el-switch v-model="newone.fixed" active-value="2" inactive-value="1" active-text="多规格" inactive-text="单规格"></el-switch>
       </el-form-item>

       <el-form-item v-if="newone.fixed==2 && !goodid">
        <div v-for="(guige, index) in categories">
          <el-input size="mini" v-model="guige.title" style="display:block;width: 200px;margin:5px 5px 5px 0;" placeholder="规格名"></el-input>
          <div v-for="(item,index) in guige.details" style="display:inline-block;">
            <el-input size="mini" v-model="item.title" style="width: 130px;margin:5px 5px 5px 0;" placeholder="详细内容"></el-input>
          </div>
          <div style="display: block;">
            <el-button @click.prevent="adddetail(index)" type="warning" size="mini" style="margin: 5px 5px 5px 0">新增详细</el-button>
            <el-button @click.prevent="removeguige(guige)" type="danger" size="mini" style="margin: 5px 5px 5px 0">删除规格</el-button>
          </div>
        </div>
        <el-button @click.prevent="addguige()" type="primary" size="mini" style="margin-top: 10px;">新增规格</el-button>
      </el-form-item>

      <el-form-item label="缩略图：" prop="logo">
        <el-upload class="upload-demo" :action="upurl" :data="uptoken" :on-success="handleSuccess" :show-file-list="false" accept="image/*">
          <img :src="newone.logo" class="pre-img" style="width:146px;height:146px;border:1px dashed #ccc;border-radius:6px;display: block;margin-top: 1px;">
          <p slot="tip" class="upload__tip">可上传JPG/PNG文件，建议图片长宽比为1:1</p>
        </el-upload>
      </el-form-item>

      <el-form-item label="相册：" prop="images">
        <el-upload :action="upurl" :data="uptoken" list-type="picture-card" :on-remove="handleRemove" :on-success="handlelistSuccess" :file-list="newone.images" :multiple="true" accept="image/*">
          <img src="../../../static/images/default1.png" class="pre-img" style="width:145px;height:144px;margin-top: 1px;display: block" >
          <p slot="tip" class="upload__tip">可上传JPG/PNG文件，建议图片长宽比为16:9</p>
        </el-upload>
      </el-form-item>

      <el-form-item label="商品详情：" prop="detail">
       <div class="edit_container"> 
        <quill-editor v-model="newone.detail" :options="editorOption" ref="myQuillEditor" class="editer"></quill-editor>
        <el-upload class="avatar-uploader quill-img" :action="upurl" :data="uptoken" :on-success='quillImgSuccess' style="display: none">
          <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
        </el-upload>
      </div>
    </el-form-item>

    <el-form-item label="常见问题：" prop="problem">
     <div class="edit_container"> 
      <quill-editor v-model="newone.problem" :options="editorOption1" ref="myQuillEditor1" class="editer"></quill-editor>
    </div>
  </el-form-item>

  <el-form-item style="margin-top: 20px;">
    <el-button type="primary" @click="save()" size="mini">提交</el-button>
    <el-button @click="golist()" size="mini">取 消</el-button>
  </el-form-item>
</el-form>

</el-col>


</el-row>
</template>

<script>

  import { shopGet } from '../../api/api';



  import { typeGet } from '../../api/api';

  import qiniu from '../../api/qiniu';
  import { goodoneGet } from '../../api/api';
  import { goodPost } from '../../api/api';

  import { Message } from 'element-ui';

  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

  import { quillEditor } from 'vue-quill-editor' //调用编辑器

  export default {
    data() {

      return {

        shoplist:[],


        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

        typeArr1:[],
        type1:'',
        typeArr2:[],
        type2:'',
        typeArr3:[],

        newone:{
          store_id:'',
          type_id:'',
          brokerage:'',
          fixed:'1',
          title:'',
          logo:'../static/images/default1.png',
          images:[],
          detail:'',
          problem:''
        },

        categories:[],

        goodid:'',

        rules:{
          title: [
          {required: true, message: '请输入活动标题', trigger: 'blur'},
          ],
          brokerage: [
          {required: true, message: '请输入佣金', trigger: 'blur'},
          ],

        },


        editorOption:{
          placeholder: '请输入详细内容（添加图片请点击上方第一个按钮）',
          theme: 'snow',
          modules: {
            toolbar: {
             container: [
             ['image'],
             ['bold', 'italic', 'underline', 'strike'],
             ['blockquote', 'code-block'],
             [{ 'direction': 'rtl' }],
             [{ 'size': ['small', false, 'large', 'huge'] }],
             [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
             [{ 'color': [] }, { 'background': [] }],
             [{ 'font': [] }],
             [{ 'align': [] }],
             ['clean']
             ],
             handlers: {
              'image': function (value) {
                if (value) {
                  document.querySelector('.quill-img input').click()
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },


      editorOption1:{
        placeholder: '请输入常见问题',
        theme: 'snow',
        modules: {
          toolbar: {
           container: [
           ['bold', 'italic', 'underline', 'strike'],
           ['blockquote', 'code-block'],
           [{ 'direction': 'rtl' }],
           [{ 'size': ['small', false, 'large', 'huge'] }],
           [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
           [{ 'color': [] }, { 'background': [] }],
           [{ 'font': [] }],
           [{ 'align': [] }],
           ['clean']
           ],
           handlers: {
            'image': function (value) {
              if (value) {
                document.querySelector('.quill-img input').click()
              } else {
                this.quill.format('image', false);
              }
            }
          }
        }
      }
    },

    allParams:null,

    date:'',
    pickerOptions:{
      disabledDate(time) {
        return time.getTime() < Date.now() - 8.64e7;
      }
    },
  };
},



methods:{


  checkid(){
    var goodid=sessionStorage.getItem('goodeditid');
    this.goodid=goodid

    if(goodid){
      var allParams = '?id='+ goodid;
      goodoneGet(allParams).then((res) => {
        this.newone.store_id=res.data.store_id;
        this.newone.title=res.data.title;
        this.newone.detail=res.data.detail;
        this.newone.problem=res.data.problem;
        this.newone.logo=res.data.logo;
        this.newone.fixed=res.data.fixed+'';
        this.newone.type_id=res.data.type_id;
        this.categories=res.data.categories;
        this.newone.brokerage=res.data.brokerage;


        this.type1=res.data.typeArray[0]
        this.gettype2(this.type1)
        this.type2=res.data.typeArray[1]
        this.gettype3(this.type2)

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
        this.newone.images=images
      });
    }
  },

  gettype1(){
    var allParams = '?level=1';
    typeGet(allParams).then((res) => {
      this.typeArr1=res.data.data;
    });
  },

  gettype2(e){
    var allParams = '?parent_id='+ e;
    typeGet(allParams).then((res) => {
      this.typeArr2=[];
      this.typeArr2=res.data.data;
    });
  },

  gettype3(e){
    var allParams = '?parent_id='+ e;
    typeGet(allParams).then((res) => {
      this.typeArr3=res.data.data;
    });
  },

  removeguige(item) {
    var index = this.categories.indexOf(item)
    if (index !== -1) {
      this.categories.splice(index, 1)
    }
  },

  adddetail(e) {
    this.categories[e].details.push({
      title:''
    });
  },

  addguige() {
    this.categories.push({
      title: '',
      details:[{
        title:''
      }]
    });
  },



  handleSuccess(res, file) {
    this.newone.logo = qiniu.showurl+ res.key
  },

  handleRemove(file, fileList) {
    this.newone.images=[]
    for(var i=0;i<fileList.length;i++){
      if(fileList[i].response.key !== 1){
        this.newone.images.push(qiniu.showurl+ fileList[i].response.key)
      }else {
        this.newone.images.push(fileList[i].url)
      }
    }
  },

  handlelistSuccess(res, file,fileList){
    console.log(fileList)
    this.newone.images=[]
    for(var i=0;i<fileList.length;i++){
      if(fileList[i].response){
        if(fileList[i].response.key !== 1){
          this.newone.images.push(qiniu.showurl+ fileList[i].response.key)  
        }else {
          this.newone.images.push(fileList[i].url)
        }
      }
    }
  },

  quillImgSuccess(res, file) {
    console.log(res)
    let quill = this.$refs.myQuillEditor.quill
    if (res.key) {
      let length = quill.getSelection().index;
      quill.insertEmbed(length, 'image', qiniu.showurl+ res.key)
      quill.setSelection(length + 1)
    } else {
      this.$message.error('图片插入失败')
    }
  },


  save(){
    if(this.newone.type_id==''){
      Message({
        message: "请选择分类",
        type: 'error'
      });
      console.log(1)
      return
    } 
    else if(this.categories.length!==0){
      var guige =this.categories
      for(var i=0;i<guige.length;i++){
        if(guige[i].title==''){
          Message({
            message: "请填写规格名",
            type: 'error'
          });
          return
        }else{
          for(var j=0;j<guige[i].details.length;j++){
            if(guige[i].details[j].title==''){
              Message({
                message: "请填写详细内容",
                type: 'error'
              });
              return
            }
          }
        }
      }
    } 
    else if(this.newone.logo=='../static/images/default1.png'){
      Message({
        message: "请上传缩略图",
        type: 'error'
      });
      return
    } 

    else if(this.newone.images.length==0){
      Message({
        message: "请上传相册",
        type: 'error'
      });
      return
    }


    else if(this.newone.detail==''){
      Message({
        message: "请输入商品详情",
        type: 'error'
      });
      return
    } 

    else if(this.newone.problem==''){
      Message({
        message: "请输入常见问题",
        type: 'error'
      });
      return
    } 

    // console.log(this.newone.fixed)
    this.$refs.newone.validate((valid) => {

      if (valid) {
        var allParams = {
          store_id:this.newone.store_id,
          title:this.newone.title,
          logo:this.newone.logo,
          detail:this.newone.detail,
          problem:this.newone.problem,
          categories:this.categories,
          fixed:this.newone.fixed,
          type_id:this.newone.type_id,
          brokerage:this.newone.brokerage,
        };

        var aaa =this.newone.images
        var images=[]
        for(var i=0; i<aaa.length; i++){
          if(typeof aaa[i] == 'object'){
            images.push(aaa[i].url)
          }else {
            images.push(aaa[i])
          }
        }

        allParams.images=images
        console.log(allParams)
        if(this.goodid){
          allParams.id=this.goodid
        }

        goodPost(allParams).then((res) => {
          console.log(res)
          if (res.msg == "ok") {
           this.$message({
            message: '提交成功',
            type: 'success'
          });
           this.$router.push({ path: '/Good/Goodlist' });

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

  golist(){
   this.$router.push({ path: '/Good/Goodlist' });
 },


 getshop(){
  var allParams = '?page=1&limit=9999'
  shopGet(allParams).then((res) => {
    this.shoplist=res.data.data;
  });
},

},

components: {
  quillEditor,
},

computed: {
  editor() {
    return this.$refs.myQuillEditor.quill
  },

  editor1() {
    return this.$refs.myQuillEditor1.quill
  },
},


mounted: function () {
  this.getshop();
  this.gettype1()
  this.checkid()
}
}
</script>



<style scope>
  .editer{
    height: 600px;
    margin-bottom: 70px;
  }
</style>
