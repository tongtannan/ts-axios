import { AxiosPromise, AxiosRequestConfig, Method, AxiosResponse, ResolvedFn, RejectedFn} from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './interceptorManager'

interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
}
interface PromiseChain<T> {
    resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn
}

export default class Axios {
    interceptors: Interceptors

    constructor() {
        this.interceptors = {
            request: new InterceptorManager<AxiosRequestConfig>(),
            response: new InterceptorManager<AxiosResponse>()
        }
    }

    request(url?: any, config?: any): AxiosPromise {
        //函数重载
        if (typeof url === 'string') {
            if (!config) {
                config = {}
            }
            config.url = url
        } else {
            config = url
        }
        const chain: PromiseChain<any>[] = [{
            resolved: dispatchRequest,
            rejected: undefined
        }]
        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor)  //先添加的request后执行
        })
        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor)
        })
        let promise = Promise.resolve(config)
        while (chain.length) {
            const {resolved, rejected} = chain.shift()! //断言不为空
            promise = promise.then(resolved, rejected)
        }
        return promise
    }

    get(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithoutData('get', url, config)
    }
    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithoutData('delete', url, config)
    }
    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithoutData('head', url, config)
    }
    options(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithoutData('options', url, config)
    }
    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithData('post', url, data, config)
    }
    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithData('put', url, data, config)
    }
    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithData('patch', url, data, config)
    }
    requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
        return this.request(Object.assign(config || {}, {
            method: method,
            url
        }))
    }
    requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request(Object.assign(config || {}, {
            method: method,
            url,
            data
        }))
    }
}