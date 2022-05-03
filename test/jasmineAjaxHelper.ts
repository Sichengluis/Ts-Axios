/*
 * @Author: Lisc
 * @Date: 2022-04-28 15:24:21
 * @Description:
 */
export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
  return new Promise(function (resolve) {
    setTimeout(() => {
      return resolve(jasmine.Ajax.requests.mostRecent())
    }, 0)
  })
}
