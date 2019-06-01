import { rejects } from "assert";
import { transformRequest, transformResponse } from "../helpers/data";

export type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'options' | 'post' | 'POST' |
                      'put' | 'PUT' | 'patch' | 'PATCH'

//所有公共类型
export interface AxiosRequestConfig {
    url?: string
    method?: Method
    data?: any
    params?: any
    headers?: any
    responseType?: XMLHttpRequestResponseType
    timeout?: number
    transformRequest?: AxiosTransformer | AxiosTransformer[]
    transformResponse?: AxiosTransformer | AxiosTransformer[]
    cancelToken?: CancelToken
    withCredentials?: boolean
    xsrfCookieName?: string
    xsrfHeaderName?: string
    onDownloadProgress?: (e: ProgressEvent) => void
    onUploadProgress?: (e: ProgressEvent) => void
    auth?: AxiosBasicCredentials
    validateStatus?: (status: number) => boolean
    paramsSerializer?: (params: any) => string
    //字符串索引签名
    baseURL?: string
    [propName: string]: any
}
//响应数据支持泛型
export interface AxiosResponse<T=any> {
    data: T
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request: any
}

export interface AxiosPromise<T=any> extends Promise<AxiosResponse<T>> {

}

export interface AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string | null
    request?: any
    response?: AxiosResponse
}

export interface Axios {
    defaults: AxiosRequestConfig
    interceptors: {
        request: AxiosInterceptorManager<AxiosRequestConfig>
        response: AxiosInterceptorManager<AxiosResponse>
    }
    request<T=any>(config: AxiosRequestConfig): AxiosPromise<T>
    get<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    delete<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    head<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    options<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    post<T=any>(url: string, data?: any,config?: AxiosRequestConfig): AxiosPromise<T>
    put<T=any>(url: string, data?: any,config?: AxiosRequestConfig): AxiosPromise<T>
    patch<T=any>(url: string, data?: any,config?: AxiosRequestConfig): AxiosPromise<T>
    getUri(config?: AxiosRequestConfig): string
}
//instance fun
export interface AxiosInstance extends Axios{
    <T=any>(config: AxiosRequestConfig): AxiosPromise<T>

    <T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
    create(config?: AxiosRequestConfig): AxiosInstance

    CancelToken: CancelTokenStatic
    Cancel: CancelStatic
    isCancel: (value: any) => boolean

    all<T>(promises: Array<T | Promise<T>>): Promise<T[]>

    spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R

    Axios: AxiosClassStatic
}

export interface AxiosClassStatic {
    new (config: AxiosRequestConfig): Axios
}

export interface AxiosInterceptorManager<T> {
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

    eject(id: number): void
}

export interface ResolvedFn<T=any> {
    (val: T): T | Promise<T>
}
export interface RejectedFn {
    (error: any): any
}

export interface AxiosTransformer {
    (data: any, headers?: any): any
}

export interface CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel

    throwIfRequested(): void
}
//取消方法
export interface Canceler {
    (message?: string): void
}
//传给calceltoken构造函数参数类型
export interface CancelExecutor {
    (cancel: Canceler): void
}
//canceltoken通过source方法返回对象
export interface CancelTokenSource {
    token: CancelToken
    cancel: Canceler
}
//canceltoken类的类型
export interface CancelTokenStatic {
    new(executor: CancelExecutor): CancelToken
    Source(): CancelTokenSource
}
//cancel类，cancel类的类型
export interface Cancel {
    message?: string
}
export interface CancelStatic {
    new(message?: string): Cancel
}

export interface AxiosBasicCredentials {
    username: string
    password: string
}