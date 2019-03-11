import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '*',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/category',
    component: Layout,
    redirect: '/category/#',
    children: [
      {
        path: 'index',
        component: () => import('@/views/yhadmin/category'),
        name: 'Category',
        meta: { title: '分类管理', icon: 'documentation', noCache: true }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/#',
    children: [
      {
        path: 'index',
        component: () => import('@/views/yhadmin/goods'),
        name: 'Goods',
        meta: { title: '商品管理', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/cardPwd',
    component: Layout,
    redirect: '/cardpwd/#',
    meta: { title: '卡密管理', icon: 'lock', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/yhadmin/cardpwd'),
        name: 'cardPwd',
        meta: { title: '卡密列表', icon: 'list', noCache: true }
      },
      {
        path: 'cardAddBatch',
        component: () => import('@/views/yhadmin/cardAddBatch'),
        name: 'cardPwdAdd',
        meta: { title: '批量增加', icon: 'edit', noCache: true }
      },
      {
        path: 'cardDelBatch',
        component: () => import('@/views/yhadmin/cardDelBatch'),
        name: 'cardPwdDel',
        meta: { title: '批量删除', icon: 'tab', noCache: true }
      }

    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/#',
    meta: { title: '订单管理', icon: 'money', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/yhadmin/orderList'),
        name: 'orderList',
        meta: { title: '订单列表', icon: 'list', noCache: true }
      },
      {
        path: 'orderAlia',
        component: () => import('@/views/yhadmin/orderAlia'),
        name: 'orderAlia',
        meta: { title: '订单分析', icon: 'chart', noCache: true }
      }

    ]
  },
  {
    path: '/coupon',
    component: Layout,
    redirect: '/coupon/#',
    children: [
      {
        path: 'index',
        component: () => import('@/views/yhadmin/coupon'),
        name: 'Coupon',
        meta: { title: '优惠券管理', icon: 'tree', noCache: true }
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    redirect: '/config/#',
    meta: { title: '平台信息配置', icon: 'component', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/yhadmin/webconfig'),
        name: 'webConfig',
        meta: { title: '基本信息配置', icon: 'example', noCache: true }
      },
      {
        path: 'adminuser',
        component: () => import('@/views/yhadmin/adminuser'),
        name: 'adminUser',
        meta: { title: '管理员配置', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/interfaceConfig',
    component: Layout,
    redirect: '/config/#',
    meta: { title: '系统全局配置', icon: 'clipboard', noCache: true },
    children: [
      {
        path: 'phoneMsgConfig',
        component: () => import('@/views/yhadmin/phoneMsgConfig'),
        name: 'phoneMsgConfig',
        meta: { title: '短信接口', icon: 'message', noCache: true }
      }, {
        path: 'mailConfig',
        component: () => import('@/views/yhadmin/mailConfig'),
        name: 'mailConfig',
        meta: { title: '邮件发送', icon: 'email', noCache: true }
      },
      {
        path: 'payConfig',
        component: () => import('@/views/yhadmin/payConfig'),
        name: 'payConfig',
        meta: { title: '支付接口', icon: 'shopping', noCache: true }
      },
      {
        path: 'paySwitchConfig',
        component: () => import('@/views/yhadmin/paySwitchConfig'),
        name: 'paySwitchConfig',
        meta: { title: '支付接口开关', icon: 'wechat', noCache: true }
      },
      {
        path: 'indexStyle',
        component: () => import('@/views/yhadmin/indexStyle'),
        name: 'indexStyle',
        meta: { title: '首页模板', icon: 'theme', noCache: true }
      }
    ]
  },
  {
    path: '/logs',
    component: Layout,
    redirect: '/logs/#',
    meta: { title: '平台全局日志', icon: 'eye', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/yhadmin/optlogs'),
        name: 'Optlogs',
        meta: { title: '操作日志', icon: 'people', noCache: true }
      },
      {
        path: 'accesslog',
        component: () => import('@/views/yhadmin/accesslogs'),
        name: 'Accesslogs',
        meta: { title: '请求日志', icon: 'peoples', noCache: true }
      }

    ]
  },
  {
    path: '/version',
    component: Layout,
    redirect: '/version/#',
    children: [
      {
        path: 'index',
        component: () => import('@/views/yhadmin/version'),
        name: 'Version',
        meta: { title: '程序信息', icon: 'star', noCache: false }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/svg-icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]
