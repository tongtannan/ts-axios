function isPlainObject(val:any): val is Object {
    return toString.call(val) === '[object Object]'
}
function deepMerge(...objs: any[]): any {
    const result = Object.create(null)
    objs.forEach(obj => {
        if (obj) {
            Object.keys(obj).forEach(key => {
                const val = obj[key]
                if (isPlainObject(val)) {
                    if (isPlainObject(result[key])) {
                        result[key] = deepMerge(result[key], val)
                    } else {
                        result[key] = deepMerge(val)
                    }
                } else {
                    result[key] = val
                }
            })
        }
    })
    return result
}

console.log(deepMerge(...[
    {
        a: 1,
        b: 2
    }, {
        c: 3,
        a: 2
    }
]))