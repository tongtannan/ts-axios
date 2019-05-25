import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildRUL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeasers, flattenHeaders} from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfCancellationRequest(config)
    processConfig(config)
    return xhr(config).then((res) => {
        return transformResponseData(res)
    })
}
//处理配置
function processConfig(config:AxiosRequestConfig): void {
    config.url = transformURL(config)
    // config.headers = transformHeaders(config)
    // config.data = transformRequestData(config)
    config.data = transform(config.data, config.headers, config.transformRequest)
    config.headers = flattenHeaders(config.headers, config.method!)
}
//处理url
function transformURL(config:AxiosRequestConfig): string {
    const {url, params} = config
    //类型断言url不为空
    return buildRUL(url!, params)
}

// function transformRequestData(config:AxiosRequestConfig): any {
//     return transformRequest(config.data)
// }

// function transformHeaders(config:AxiosRequestConfig): any {
//     const { headers = {}, data} = config
//     return processHeasers(headers, data)
// }
//如果data是字符串并可以转化为对象，就转化为对象
function transformResponseData(res:AxiosResponse): AxiosResponse {
    res.data = transform(res.data, res.headers, res.config.transformResponse)
    return res
}
function throwIfCancellationRequest(config: AxiosRequestConfig): void {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested()
    }
}