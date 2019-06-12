import { isPlainObject, deepMerge } from './util'
import { Method } from '../types'

function normalizeHeaderName(headers:any, normalizeName: string): void {
    if (!headers) {
        return
    }
    Object.keys(headers).forEach((name) => {
        if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
            headers[normalizeName] = headers[name]
            delete headers[name]
        }
    })
}

export function processHeasers(headers:any, data: any): any {
    //将content-type转化成Content-Type
    normalizeHeaderName(headers, 'Content-Type')
    //如果没传content-type
    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }

    return headers
}

export function parseHeaders(headers:string): any {
    let parsed = Object.create(null)  //空对象
    if (!headers) {
        return parsed
    }
    headers.split('\r\n').forEach((line) => {
        let [key, ...vals] = line.split(':')
        key = key.trim().toLowerCase()  //去除空格并小写
        if (!key) {
            return
        }
        const val = vals.join(':').trim()
        parsed[key] = val
    })
    return parsed
}

export function flattenHeaders(headers: any, method: Method): any {
    if (!headers) {
        return headers
    }
    headers = deepMerge(headers.common, headers[method], headers)
    const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
    methodsToDelete.forEach(method => {
        delete headers[method]
    })
    return headers
}