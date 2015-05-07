/// <reference path="outer-produce.d.ts" />
/// <reference path="mocha/mocha.d.ts" />
/// <reference path="chai/chai.d.ts" />


declare module chai {
    interface Expect {
        outerProductEquals(product:any[][]): any;
        outerProduct(product:any[][]): any;
    }
}