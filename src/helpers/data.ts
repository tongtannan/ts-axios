import { isPlainObject } from './util'

//处理body信息
export function transformRequest(data:any): any {
    if (isPlainObject(data)) {
        return JSON.stringify(data)
    }
    return data
}
//如果data是字符串并可以转化为对象，就转化为对象
export function transformResponse(data:any): any {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data)
        } catch (e) {
            //do nothing
        }
    }
    return data
}