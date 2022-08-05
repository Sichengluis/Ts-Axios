import axios, { TransformFn } from '../../src/index'
// import axios, { AxiosRequestTransformer, AxiosResponseTransformer } from 'axios'
// , { AxiosTransformer }
import qs from 'qs'
import { json } from 'stream/consumers'

// 测试Axios defaults配置化
// axios.defaults.data = { a: 1 }
// axios.defaults.headers.post['test2'] = 456

// axios({
//   url: '/config/post',
//   method: 'post',
//   // data: qs.stringify({
//   //   a: 1
//   // }),
//   headers: {
//     test: '321'
//   }
// }).then(res => {
//   console.log(res.data)
// })

// 请求和响应数据配置化功能测试
axios({
  transformRequest: [
    function (data, headers) {
      data.b = 2
      headers!['Content-Type'] = 'application/json'
      // return data
      return JSON.stringify(data)
    },
    // ...(axios.defaults.transformRequest as AxiosRequestTransformer[]),
  ],
  transformResponse: [
    // ...(axios.defaults.transformResponse as AxiosResponseTransformer[]),
    function (data) {
      if (typeof data === 'object') {
        data.c = 3
      }
      return data
    },
  ],
  url: '/config/post',
  method: 'post',
  data: {
    a: 1,
  },
}).then((res) => {
  console.log(res.data)
})

// const instance = axios.create({
//   transformRequest: [
//     function(data) {
//       return qs.stringify(data)
//     },
//     ...(axios.defaults.transformRequest as TransformFn[])
//   ],
//   transformResponse: [
//     ...(axios.defaults.transformResponse as TransformFn[]),
//     function(data) {
//       if (typeof data === 'object') {
//         data.b = 2
//       }
//       return data
//     }
//   ]
// })

// instance({
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   }
// }).then(res => {
//   console.log(res.data)
// })
