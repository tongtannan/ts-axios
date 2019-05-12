import { ResolvedFn, RejectedFn} from '../types'

interface interceptor<T> {
    resolved: ResolvedFn<T>
    rejected?: RejectedFn
}

export default class InterceptorManager<T> {
    //私有属性,存储拦截器
    private interceptors: Array<interceptor<T> | null>

    constructor() {
        this.interceptors = []
   }

   use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
       this.interceptors.push({
           resolved,
           rejected
       })
       return this.interceptors.length - 1
   }

   forEach(fn: (interceptor: interceptor<T>)=>void ): void {
       this.interceptors.forEach(intercepror => {
           if (intercepror !== null) {
               fn(intercepror)
           }
       })
   }

   eject(id: number): void {
       if (this.interceptors[id]) {
           this.interceptors[id] = null
       }
   }
}