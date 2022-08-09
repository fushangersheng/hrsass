import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // 引入一份进度条插件
import "nprogress/nprogress.css"; // 引入进度条样式
const loginPath = "/login";
const notPath = "/404";
const whiteList = [loginPath, notPath];
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (store.getters.token) {
    if (!store.getters.userId) {
      const { roles } = await store.dispatch("user/getUserInfo");
      console.log(roles);
      const routes = await store.dispatch(
        "permission/filterRoute",
        roles.menus
      );
      router.addRoutes([...routes], {
        path: "*",
        redirect: "/404",
        hidden: true,
      });
      next(to.path);
    }
    if (to.path === loginPath) {
      next("/");
    } else {
      next();
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next(loginPath);
    }
  }
  NProgress.done();
});
router.afterEach(function () {
  NProgress.done(); // 关闭进度条
});
// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
