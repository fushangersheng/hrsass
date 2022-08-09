import axios from "axios";
import { Message } from "element-ui";
import { getTime } from "@/utils/auth";
import store from "@/store";
import router from "@/router";
const TimeOut = 36000;
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 3000,
});

function checkTimeout() {
  const currTime = Date.now();
  const timestamp = getTime();
  return currTime - timestamp < TimeOut;
}
request.interceptors.request.use(
  (config) => {
    const token = store.getters.token;
    if (token) {
      // console.log(checkTimeout());
      // if (checkTimeout) {
      //   store.dispatch("user/logout");
      //   router.push("/login");
      //   return Promise.reject(new Error("超时了"));
      // }

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    const {
      data: { data, success, message },
    } = response;
    if (success) {
      return data;
    }
    Message.error(message || "系统错误");
    return Promise.reject(message || "系统错误");
  },
  (error) => {
    if (error.response.status === 401) {
      store.dispatch("user/logout");
      router.push("/login");
    }
    Message.error(error.response?.data?.message || "系统错误");
    return Promise.reject(error);
  }
);

export default request;
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// // create an axios instance
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000 // request timeout
// })

// // request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// // response interceptor
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export default service
