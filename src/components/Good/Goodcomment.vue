<template>
	<el-row class="warp" style="padding:20px 0 0 20px;">
		<el-col :span="24" class="warp-breadcrum">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
				<el-breadcrumb-item>评分管理</el-breadcrumb-item>
				<el-breadcrumb-item>客户评分</el-breadcrumb-item>
			</el-breadcrumb>
		</el-col>

		<el-col :span="24" class="warp-main">


			<el-table :data="comments" border stripe size="small" style="width:1300px;">
				<el-table-column prop="id" label="用户编号" width="100" align="center">
				</el-table-column>
				<el-table-column prop="user.nickname" label="昵称" min-width="140" align="center">
				</el-table-column>

				<el-table-column prop="user.avatarUrl" label="头像" min-width="100" align="center">
					<template slot-scope="scope">
						<img :src="scope.row.user.avatarUrl" style="width:40px;height:40px;border-radius:50%;margin:5px 0 -5px 0;" />
					</template>
				</el-table-column>

				<el-table-column prop="product_id" label="商品id" width="100" align="center">
				</el-table-column>

				<el-table-column prop="score" label="评分" width="200" align="center">
					<template slot-scope="scope">
						<el-rate v-model="scope.row.score" :show-score="true" disabled></el-rate>
					</el-rate>
				</template>
			</el-table-column>

			<el-table-column prop="detail" label="评论" min-width="220" align="center">
			</el-table-column>

			<el-table-column prop="state" label="状态" min-width="120" align="center">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.state==1" size="mini">显示</el-tag>
					<el-tag type="info" v-if="scope.row.state==2"  size="mini">不显示</el-tag>
				</template>
			</el-table-column>

			<el-table-column prop="state" label="操作" min-width="120" align="center">
				<template slot-scope="scope">
					<el-button type="success" size="mini" @click="handleshow(scope.$index, scope.row)">显示</el-button>
					<el-button type="info" size="mini" @click="handlehidden(scope.$index, scope.row)">不显示</el-button>
				</template>
			</el-table-column>


		</el-table>
		<el-pagination :current-page="currentPage" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页"></el-pagination>
	</el-col>
</el-row>
</template>


<script>

	import { gcomments } from '../../api/api';
	import { commentstate } from '../../api/api';

	export default {
		data() {
			return {
				currentPage: 1,
				comments:[],
				count:0,
				limit:10,
				count:0,
			}
		},
		methods: {

			getlist () {
				var param='?page='+ this.currentPage +'&limit='+this.limit+'&state=0'
				gcomments(param).then((res) => {
					this.count=res.data.count
					this.comments = res.data.data;
				});
			},

			handleshow(index,row){
				var param={
					id:row.id,
					state:1
				}
				commentstate(param).then((res) => {
					this.getlist();
				});
			},

			handlehidden(index,row){
				var param={
					id:row.id,
					state:2
				}
				commentstate(param).then((res) => {
					this.getlist();
				});
			},

		//页码更改
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getUser();
		},

    //改变每页条数
    handleSizeChange(val){
    	this.limit = val;
    	this.getUser();
    },

  },
  mounted() {
  	this.getlist();
  }
}
</script>

<style scope>

</style>