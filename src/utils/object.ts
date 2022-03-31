/*
 * @Author: Lisc
 * @Date: 2022-03-30 21:13:44
 * @Description:
 */
function objectOrNot(o: any): o is object {
  return o !== null && typeof o === 'object'
}

export { objectOrNot }
