export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
    return new Promise(resolve => {
        setTimeout(() => {
            //伪造xhr对象
            return resolve(jasmine.Ajax.requests.mostRecent())
        }, 0)
    })
}