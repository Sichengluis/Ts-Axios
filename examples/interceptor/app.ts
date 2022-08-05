// import axios from '../../src/index'
import axios from 'axios'

axios.interceptors.request.use(
  (config) => {
    config.headers!.test += '1'
    // return config
  }
  // (error) => {
  //   console.log('请求拦截器 失败 - 1号')
  //   console.log('内部' + error)
  //   return Promise.reject(error)
  // }
)
axios.interceptors.request.use(
  (config) => {
    config.headers!.test += '2'
    // return config
  },
  (error) => {
    console.log('请求拦截器 失败 - 2号')
    return Promise.reject(error)
  }
)
axios.interceptors.request.use(
  (config) => {
    config.headers!.test += '3'
    //
    // return Promise.reject('error')
  },
  (error) => {
    console.log('请求拦截器 失败 - 3号')
    return Promise.reject(error)
  }
)

axios.interceptors.response.use((res) => {
  res.data += '1'
  console.log('响应拦截器 成功 - 1号')
  return res
})
let interceptor = axios.interceptors.response.use((res) => {
  console.log('响应拦截器 成功 - 2号')
  res.data += '2'
  return res
})
axios.interceptors.response.use((res) => {
  console.log('响应拦截器 成功 - 3号')
  res.data += '3'
  return res
})

axios.interceptors.response.eject(interceptor)

axios({
  url: '/interceptor/get',
  method: 'get',
  headers: {
    test: '',
  },
}).then(
  (res) => {
    console.log(res.data)
  },
  (err) => {
    console.log('调用' + err)
  }
)
