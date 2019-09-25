import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
import router from '../router/index'

axios.defaults.timeout = 1500000
axios.defaults.withCredentials = true
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'


//请求拦截器
axios.interceptors.request.use(config => {
	if (config.method === 'post') {
		config.data = qs.stringify(config.data)
	}
	return config
}, 
error => {

	console.log('错误的传参！')
})

axios.interceptors.request.use(config => {
	if (config.method === 'put') {
		config.data = qs.stringify(config.data)
	}
	return config
}, 
error => {

	console.log('错误的传参！')
})

//响应拦截器
axios.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if(error.response.status==401){
			var that=this;
			MessageBox.alert('请重新登录', '登录超时', {
				confirmButtonText: '确定',
				closeOnPressEscape:false,
				showClose:false,
				callback: action => {
					if(action=='confirm'){
						router.push('/login');
					}
				}
			});
		}else{
			Message({
				message: error.response.data.msg,
				type: 'error'
			});
		}
		return Promise.reject(error)
	})


let hosturl ='https://h.fengniaotuangou.cn/'


let base = hosturl+ 'v1'


export default hosturl

//登录
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }

export const requestLogout = params => { return axios.get(`${base}/logout`+`${params}`).then(res => res.data)}




//店铺
export const shopPost = params => { return axios.post(`${base}/store`, params).then(res => res.data)}

export const shopGet = params => { return axios.get(`${base}/stores`+`${params}`).then(res => res.data)}

export const shoponeGet = params => { return axios.get(`${base}/store`+`${params}`).then(res => res.data)}

export const storeCheck = params => { return axios.get(`${base}/check/store`+`${params}`).then(res => res.data)}

export const storeDel = params => { return axios.delete(`${base}/store`+`${params}`).then(res => res.data)}






//优惠券
export const couponPost = params => { return axios.post(`${base}/coupon`, params).then(res => res.data)}

export const couponGet = params => { return axios.get(`${base}/coupons`+`${params}`).then(res => res.data)}

export const couponDel = params => { return axios.get(`${base}/del/coupon`+`${params}`).then(res => res.data)}






//分类
export const typeGet = params => { return axios.get(`${base}/types`+`${params}`).then(res => res.data)}

export const typePost = params => { return axios.post(`${base}/type`, params).then(res => res.data)}

export const typeDel = params => { return axios.get(`${base}/del/type`+`${params}`).then(res => res.data)}



//商品
export const goodGet = params => { return axios.get(`${base}/products`+`${params}`).then(res => res.data)}

export const goodPost = params => { return axios.post(`${base}/product`, params).then(res => res.data)}

export const goodoneGet = params => { return axios.get(`${base}/product`+`${params}`).then(res => res.data)}

export const gooddel = params => { return axios.get(`${base}/del/product`+`${params}`).then(res => res.data)}

export const goodkcdel = params => { return axios.get(`${base}/del/stock`+`${params}`).then(res => res.data)}

export const goodhot = params => { return axios.post(`${base}/hot/product`, params).then(res => res.data)}//推荐

export const goodstate = params => { return axios.get(`${base}/enable/product`+`${params}`).then(res => res.data)}

export const stocksPost = params => { return axios.post(`${base}/stocks`, params).then(res => res.data)}



export const gcomments = params => { return axios.get(`${base}/comments`+`${params}`).then(res => res.data)}

export const commentstate = params => { return axios.post(`${base}/comment`, params).then(res => res.data)}






//用户
export const userGet = params => { return axios.get(`${base}/wechat/users`+`${params}`).then(res => res.data)}

export const userPost = params => { return axios.post(`${base}/wechat/user`, params).then(res => res.data)}

export const usertohy = params => { return axios.post(`${base}/member/list`, params).then(res => res.data)}//用户成为会员、续费

export const bindshop = params => { return axios.post(`${base}/store/seller`, params).then(res => res.data)}


//会员
export const mconfigPost = params => { return axios.post(`${base}/member`, params).then(res => res.data)}//设置会员等级

export const mconfigGet = params => { return axios.get(`${base}/members`+`${params}`).then(res => res.data)}//获取会员等级

export const mconfigDel = params => { return axios.get(`${base}/del/member`+`${params}`).then(res => res.data)}//删除会员等级


export const memberGet = params => { return axios.get(`${base}/member/lists`+`${params}`).then(res => res.data)}//会员列表

export const memberpay = params => { return axios.get(`${base}/member/records`+`${params}`).then(res => res.data)}//会员充值记录





//订单
export const allorderGet = params => { return axios.get(`${base}/orders`+`${params}`).then(res => res.data)}

export const shipgoods = params => { return axios.post(`${base}/delivery/order`, params).then(res => res.data)}

export const refundPost = params => { return axios.post(`${base}/refund`, params).then(res => res.data)}








// 设置
export const baseset = params => { return axios.post(`${base}/sys/config`, params).then(res => res.data)}

export const baseget = params => { return axios.get(`${base}/sys/configs`+`${params}`).then(res => res.data)}


//轮播
export const advertsGet = params => { return axios.get(`${base}/banners`+`${params}`).then(res => res.data)}
export const advertPost = params => { return axios.post(`${base}/banner`, params).then(res => res.data)}
export const advertDel = params => { return axios.get(`${base}/del/banner`+`${params}`).then(res => res.data)}











//快递
export const deliveryGet = params => { return axios.get(`${base}/expresses`+`${params}`).then(res => res.data)}

export const deliveryPost = params => { return axios.post(`${base}/express`, params).then(res => res.data)}

export const deliveryDel = params => { return axios.get(`${base}/del/express`+`${params}`).then(res => res.data)}

//快递配置
export const kdconfigGet = params => { return axios.get(`${base}/express/config`+`${params}`).then(res => res.data)}

export const kdconfigPost = params => { return axios.post(`${base}/express/config`, params).then(res => res.data)}








//代理申请
export const applyGet = params => { return axios.get(`${base}/proxy/applies`+`${params}`).then(res => res.data)}

export const applyCheck = params => { return axios.post(`${base}/check/proxy`,params).then(res => res.data)}


//分销


export const agentGet = params => { return axios.get(`${base}/proxy/users`+`${params}`).then(res => res.data)}

export const proxyGet = params => { return axios.get(`${base}/amount/details`+`${params}`).then(res => res.data)}

export const ratioPost = params => { return axios.post(`${base}/ratio`, params).then(res => res.data)}

export const ratioGet = params => { return axios.get(`${base}/ratio`+`${params}`).then(res => res.data)}

export const comGetAll = params => { return axios.get(`${base}/brokerages`+`${params}`).then(res => res.data)}

export const withdrawGet = params => { return axios.get(`${base}/withdraws`+`${params}`).then(res => res.data)}

export const withdrawPost = params => { return axios.post(`${base}/withdraw`, params).then(res => res.data)}


//管理员
export const adminGet = params => { return axios.get(`${base}/admins`+`${params}`).then(res => res.data)}

export const adminPost = params => { return axios.post(`${base}/admin`, params).then(res => res.data)}

export const adminDel = params => { return axios.delete(`${base}/user`+`${params}`).then(res => res.data)}



//角色
// export const permissionGet = params => { return axios.get(`${base}/permissions`+`${params}`).then(res => res.data)}

export const roleGet = params => { return axios.get(`${base}/roles`+`${params}`).then(res => res.data)}

export const rolePost = params => { return axios.post(`${base}/role`, params).then(res => res.data)}

export const roleDel = params => { return axios.delete(`${base}/role`+`${params}`).then(res => res.data)}

// export const defaultrole = params => { return axios.get(`${base}/default/role`+`${params}`).then(res => res.data)}





//微信设置
// export const wxconfigPost = params => { return axios.post(`${base}/tx/config`, params).then(res => res.data)}

// export const wxconfigGet = params => { return axios.get(`${base}/tx/config`+`${params}`).then(res => res.data)}

export const wxconfigPost = params => { return axios.post(`${base}/notify/config`, params).then(res => res.data)}

export const wxconfigGet = params => { return axios.get(`${base}/notify/configs`+`${params}`).then(res => res.data)}

export const wxconfigDel = params => { return axios.get(`${base}/del/notify/configs`+`${params}`).then(res => res.data)}



//海报
export const posterPost = params => { return axios.post(`${base}/poster/configs`, params).then(res => res.data)}

export const posterGet = params => { return axios.get(`${base}/poster/configs`+`${params}`).then(res => res.data)}






export const tuisongPost = params => { return axios.post(`${base}/notify/queue`, params).then(res => res.data)}

export const flashQrcode = params => { return axios.get(`${base}/api/access/token`).then(res => res.data)}
