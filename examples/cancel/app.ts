import axios, { CancelFn } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios
  .get('/cancel/get', {
    cancelToken: source.token
  })
  .catch(function(e) {
    if (axios.isCancel(e)) {
      console.log('Request canceled', e.message)
    }
  })

setTimeout(() => {
  console.log('定时器')
  source.cancel('Operation canceled by the user.')
  // 测试Token已经被使用过的情况
  axios.post('/cancel/post', { a: 1 }, { cancelToken: source.token }).catch(function(e) {
    if (axios.isCancel(e)) {
      console.log(e.message + '123')
    }
  })
}, 100)

// let cancel: CancelFn

// axios
//   .get('/cancel/get', {
//     cancelToken: new CancelToken(c => {
//       cancel = c
//     })
//   })
//   .catch(function(e) {
//     if (axios.isCancel(e)) {
//       console.log('Request canceled')
//     }
//   })

// setTimeout(() => {
//   cancel()
// }, 200)
