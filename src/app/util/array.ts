interface PromiseFilterResult<T = any> {
    result: boolean;
    value: T
}
export const PromiseFilter = async <T = any>(arr: Array<T>, func: (v: T) => Promise<boolean>): Promise<Array<T>> => {
    const vals: Array<PromiseFilterResult> = await Promise.all(
        arr.map((value: T): Promise<PromiseFilterResult<T>> => func(value).then(result => ({ result, value }))
        ))
    return vals.filter(v => v.result).map(v => v.value)
}
export const Max = <T = number | Date>(...arr: T[]): T => {
    let m: T | undefined = undefined;
    for (const v of arr) {
        if (m == undefined || v > m) {
            m = v;
        }
    }
    if (m == undefined) {
        throw Error("Max: Empty Array")
    }
    return m;
}

export const Min = <T = number | Date>(...arr: T[]): T => {
    let m: T | undefined = undefined;
    for (const v of arr) {
        if (m == undefined || v < m) {
            m = v;
        }
    }
    if (m == undefined) {
        throw Error("Min: Empty Array")
    }
    return m;
}