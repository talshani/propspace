declare module 'outer-product' {
    interface outerProduct {
        (dimensions):Array<Array<any>>
    }

    var fn:outerProduct;
    export = fn;
}