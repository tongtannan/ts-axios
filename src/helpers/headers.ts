import { isPlainObject } from './util'

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
        let [key, val] = line.split(':')
        key = key.trim().toLowerCase()  //去除空格并小写
        if (!key) {
            return
        }
        if (val) {
            val = val.trim()
        }
        parsed[key] = val
    })
    return parsed
}