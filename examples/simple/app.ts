/*
 * @Author: Lisc
 * @Date: 2022-03-30 18:42:47
 * @Description:
 */
import axios from '../../src/index'

axios({
  method: 'get',
  url: '/simple/get',
  params: {
    a: 1,
    b: 2,
  },
}).then((res) => {
  console.log(res)
})
