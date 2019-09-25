<template>
 <el-row class="warp" style="padding:20px 0 0 20px;">
  <el-col :span="24" class="warp-breadcrum">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>参数设置</el-breadcrumb-item>
    </el-breadcrumb>
  </el-col>


  <el-col :span="24" class="warp-main">
    <el-row>

      <el-button type="primary" size="mini" style="margin-bottom: 10px;" @click="newone">新增参数</el-button>

      <el-table :data="configdata" border stripe size="small" style="width:1200px;">
        <el-table-column prop="title" label="参数名" min-width="120" align="center">
        </el-table-column>

        <el-table-column prop="remark" label="备注" min-width="120" align="center">
        </el-table-column>

        <el-table-column prop="detail" label="参数值" min-width="200" align="center">
        </el-table-column>

        <el-table-column label="操作" min-width="200" align="center">
         <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-row>
</el-col>


<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newconfig" :model="newconfig" label-width="120px" :rules="rules">
      <el-form-item label="参数名：" prop="title" v-if="putorup=='up'">
        <el-input v-model="newconfig.title" placeholder="请输入参数名"></el-input>
      </el-form-item>

      <el-form-item label="备注：" prop="remark">
        <el-input v-model="newconfig.remark" placeholder="请输入备注"></el-input>
      </el-form-item>

      <el-form-item label="类型：" prop="type"  v-if="putorup=='up'">
        <el-radio-group size="small" v-model="newconfig.type" fill="#67c23a" :max='1'>
          <el-radio-button v-for="(item,index) in typearr" :key="item.id" :label="item.id">{{item.title}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="" prop="detail" v-if="newconfig.type==1">
        <el-input v-model="newconfig.detail" placeholder="请输入参数值"></el-input>
      </el-form-item>

      <el-form-item label="" prop="detail" v-if="newconfig.type==2">
        <el-upload class="upload-demo" :action="upurl" :data="uptoken" :on-success="imgSuccess" :show-file-list="false" accept="image/*">
          <img :src="imgconfig" class="pre-img" style="width:180px;height:320px;display: block;margin-top: 1px;border:1px dashed #ccc;">
        </el-upload>
      </el-form-item>

      <el-form-item label="" prop="detail" v-if="newconfig.type==3">
       <div class="edit_container"> 
        <quill-editor v-model="newconfig.detail" :options="editorOption" ref="myQuillEditor" class="editer"></quill-editor>
        <el-upload class="avatar-uploader quill-img" :action="upurl" :data="uptoken" :on-success='quillImgSuccess' style="display: none">
          <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
        </el-upload>
      </div>
    </el-form-item>

    <el-form-item style="margin-left: calc(50% - 200px);">
      <el-button size="mini" type="primary" @click="postconfig()">保 存</el-button>
      <el-button size="mini" @click="dialogNewVisible = false">取 消</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</el-col>




</el-row>
</template>



<script>
  import qiniu from '../../api/qiniu';

  import { baseset } from '../../api/api';
  import { baseget } from '../../api/api';

  import { Message } from 'element-ui';

  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

  import { quillEditor } from 'vue-quill-editor' //调用编辑器



  export default {
    data() {
      return {
        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

        diatitle:'新增',
        activeName:'config',

        newconfig:{
          title:'',
          detail:'',
          remark:'',
          type:'1'
        },
        editId:'',
        configdata:[],

        dialogNewVisible:false,
        putorup:'put',

        rules: {
          title: [{required: true, trigger: 'blur',message: '请输入参数名'}],
          remark: [{required: true, trigger: 'blur',message: '请输入备注'}],
          detail: [{required: true, trigger: 'blur',message: '请输入参数值'}],
        },

        typearr:[
        {id:1,title:'文本'},
        {id:2,title:'图片'},
        {id:3,title:'图文'},
        ],
        imgconfig:"../static/images/default2.png",


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
    };
  },


  components: {
    quillEditor,
  },

  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    },

  },

  methods:{

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

    

    getconfig(){
      var allParams = '';
      baseget(allParams).then((res) => {
        this.configdata=res.data
      });
    },

    handleEdit(index, row){
      this.diatitle='编辑'
      this.dialogNewVisible = true;
      this.putorup='put'
      this.newconfig={
        title:row.title,
        remark:row.remark,
        detail:row.detail,
        type:row.type
      }
      if(row.type=='2'){
        this.imgconfig=row.detail
      }
    },

    newone(){       
      this.putorup='up';
      this.diatitle='新增'
      this.dialogNewVisible=true
      this.newconfig={
        title:'',
        detail:'',
        remark:'',
        type:'1'
      }
    },

    imgSuccess(res, file){
      this.imgconfig = qiniu.showurl+ res.key
      this.newconfig.detail=qiniu.showurl+ res.key
    },

    postconfig(){
      this.$refs.newconfig.validate((valid) => {
        if (valid) {
          var allParams=this.newconfig
          console.log(allParams)
          baseset(allParams).then((res) => {
            if (res.msg === "ok") {
             this.$message({
              message: '提交成功',
              type: 'success'
            });

             this.dialogNewVisible = false;
             this.getconfig()
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


  },

  mounted: function(){
    this.getconfig();
  }
}
</script>

<style scoped>
  .grey{
    color: #aaa;
    float: left;
  }
</style>