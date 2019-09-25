import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import { MessageBox } from 'element-ui';

// import Console from '@/components/index/Console'



import Shoplist from '@/components/Shop/Shoplist'
import Newshop from '@/components/Shop/Newshop'
import Coupon from '@/components/Shop/Coupon'


import Goodlist from '@/components/Good/Goodlist'
import Goodtype from '@/components/Good/Goodtype'
import Goodnew from '@/components/Good/Goodnew'
import Goodcomment from '@/components/Good/Goodcomment'

import Orderlist from '@/components/Order/Orderlist'
import Refund from '@/components/Order/Refund'

import Userlist from '@/components/User/Userlist'

import Memberpay from '@/components/Member/Memberpay'
import Memberlist from '@/components/Member/Memberlist'
import MemberSet from '@/components/Member/MemberSet'



import Joinlist from '@/components/Agent/Joinlist'
import Proxylist from '@/components/Agent/Proxylist'
import Commission from '@/components/Agent/Commission'
import Withdraw from '@/components/Agent/Withdraw'

import Adminlist from '@/components/Setting/Adminlist'
import Rolelist from '@/components/Setting/Rolelist'


import Banner from '@/components/Setting/Banner'
import Delivelist from '@/components/Setting/Delivelist'
import Baseset from '@/components/Setting/Baseset'
// import Wechatset from '@/components/Setting/Wechatset'



const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
  mode: 'history', 
  routes: [{
    path: '/Login',
    name: '登录',
    component: Login
},
{
    // leaf: true,
    path: '/',
    name: '店铺管理',
    component: Home,
    redirect: '/Shop/Shoplist',
    menuShow: true,
    iconCls: 'iconfont menu-good',
    meta:{permission:''},
    children: [
    {path: '/Shop/Shoplist',component: Shoplist,name: '店铺列表',menuShow: true,meta:{permission: 'shopselect'}}, 
    {path: '/Shop/Newshop',component: Newshop,name: '新增店铺',menuShow: false,meta:{permission: 'shopinsert'}},
    {path: '/Shop/Coupon',component: Coupon,name: '券设置',menuShow: true,meta:{permission: 'couponselect'}},
    ]
},
{
    // leaf: true,
    path: '/',
    name: '商品管理',
    component: Home,
    redirect: '/Good/Goodlist',
    menuShow: true,
    iconCls: 'iconfont menu-good',
    children: [
    {path: '/Good/Goodlist',component: Goodlist,name: '商品列表',menuShow: true,meta:{permission: 'goodselect'}},
    {path: '/Good/Goodnew',component: Goodnew,name: '添加商品',menuShow: false,meta:{permission: 'goodinsert'}},
    {path: '/Good/Goodtype',component: Goodtype,name: '商品分类',menuShow: true,meta:{permission: 'gtypeselect'}},

    {path: '/Good/Goodcomment',component: Goodcomment,name: '评论',menuShow: true,meta:{permission: ''}},


    ]
},




{
    // leaf: true,
    path: '/',
    name: '订单管理',
    component: Home,
    redirect: '/Order/Orderlist',
    menuShow: true,
    iconCls: 'iconfont menu-dingdan',
    children: [
    {path: '/Order/Orderlist',component: Orderlist,name: '订单列表',menuShow: true,meta:{permission: 'orderlist'}},
    {path: '/Order/Refund',component: Refund,name: '退款',menuShow: true,meta:{permission: 'orderlist'}},
    ]
}, 
{
    leaf: true,
    path: '/',
    name: '用户',
    component: Home,
    redirect: '/User/Userlist',
    menuShow: true,
    iconCls: 'iconfont menu-yonghu',
    children: [
    {path: '/User/Userlist',component: Userlist,name: '用户列表',menuShow: true,meta:{permission: 'userlist'}},
    ]
}, 

{
    path: '/',
    name: '会员管理',
    component: Home,
    redirect: '/Member/Memberlist',
    menuShow: true,
    iconCls: 'iconfont menu-yonghu',
    children: [
    {path: '/Member/Memberlist',component: Memberlist,name: '会员列表',menuShow: true,meta:{permission: 'memberlist'}},
    {path: '/Member/MemberSet',component: MemberSet,name: '等级设置',menuShow: true,meta:{permission: 'memberset'}},
    {path: '/Member/Memberpay',component: Memberpay,name: '会员充值',menuShow: true,meta:{permission: 'memberrecord'}}
    ]
},


{
    // leaf: true,
    path: '/',
    name: '分销管理',
    component: Home,
    redirect: '/Agent/Proxylist',
    menuShow: true,
    iconCls: 'iconfont menu-kongzhi',
    children: [
    {path: '/Agent/Proxylist',component: Proxylist,name: '代理列表',menuShow: true,meta:{permission: 'agentlist'}},
    {path: '/Agent/Joinlist',component: Joinlist,name: '分销申请',menuShow: true,meta:{permission: 'agentrecheck'}},
    {path: '/Agent/Commission',component: Commission,name: '佣金列表',menuShow: true,meta:{permission: 'comrecord'}},
    {path: '/Agent/Withdraw',component: Withdraw,name: '提现管理',menuShow: true,meta:{permission: 'withdrawapply'}},
    ]
},

{    
    // leaf: true,
    path: '/',
    name: '系统设置',
    component: Home,
    redirect: '/Setting/Baseset',
    menuShow: true,
    iconCls: 'iconfont menu-xitong',
    children: [
    {path: '/Setting/Banner',component: Banner,name: '轮播图',menuShow: true,meta:{permission: 'bannerset'}},
    {path: '/Setting/Delivelist',component: Delivelist,name: '快递设置',menuShow: true,meta:{permission: 'expressset'}},
    {path: '/Setting/Baseset',component: Baseset,name: '参数设置',menuShow: true,meta:{permission: 'paramset'}},
    {path: '/Setting/Adminlist',component: Adminlist,name: '管理员列表',menuShow: true,meta:{permission: 'loginselect'}},
    {path: '/Setting/Rolelist',component: Rolelist,name: '角色列表',menuShow: true,meta:{permission: 'roleselect'}},


    // {path: '/Setting/Wechatset',component: Wechatset,name: '微信设置',menuShow: true,meta:{permission: ''}}
    ]
}, 






]
})


router.beforeEach((to, from, next) => {
    // next()
    if (to.path.startsWith('/Login')) {
      next()
  } else {
      let token = window.sessionStorage.getItem('token')
        // console.log(!token)
        if(!token){
          next({path: '/Login'})
      }else{
          next()
      }
 //        if (to.meta.permission && permissions) {
 //            if (permissions.indexOf(to.meta.permission)>-1) {
 //              next()
 //          } else {
 //           MessageBox.alert('没有访问权限', '提示', {
 //            confirmButtonText: '确定',
 //            closeOnPressEscape:false,
 //            showClose:false,
 //            callback: action => {

 //            }
 //        });
 //       }
 //   }else{
 //     next() 
 // }
}
})

export default router