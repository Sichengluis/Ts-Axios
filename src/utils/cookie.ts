/*
 * @Author: Lisc
 * @Date: 2022-04-12 12:44:52
 * @Description:
 */

const cookie = {
  /**
   * @description: 遍历cookie得到指定cookie
   * @param {string} cookieName
   * @return {*}
   */
  // getCookie(cookieName: string): string | null {
  //   const strCookie = document.cookie
  //   const cookieList = strCookie.split(';')
  //   for (let i = 0; i < cookieList.length; i++) {
  //     const arr = cookieList[i].split('=')
  //     if (cookieName === arr[0].trim()) {
  //       return arr[1]
  //     }
  //   }
  //   return null
  // }

  /**
   * @description: 正则表达式根据cookie的key匹配cookie的value
   * @param {string} key
   * @return {*}
   */
  getCookie(key: string): string | null {
    var str = `(^| )${key}=([^;]*)(;|$)`
    var reg = new RegExp(str)
    const arr = document.cookie.match(reg)
    if (!arr) {
      return null
    }
    return arr[2] //第2个小括号对应cookie的value
  }
}

export default cookie
