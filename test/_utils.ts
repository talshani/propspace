/// <reference path="../typings/tsd" />

import outerProduct = require('outer-product');

export function OuterProduct(_chai, utils) {
    var Assertion = _chai.Assertion;

    Assertion.addMethod('outerProduct', function (b) {
        new Assertion(this._obj).to.be.instanceof(Array);
        new Assertion(b).to.be.instanceof(Array);
        new Assertion(organize(outerProduct(this._obj))).to.be.deep.equal(organize(b));
    });
}

export function OuterProductEquals(_chai, utils) {
    var Assertion = _chai.Assertion;

    Assertion.addMethod('outerProductEquals', function (b) {
        new Assertion(this._obj).to.be.instanceof(Array);
        new Assertion(b).to.be.instanceof(Array);
        this.assert(
            organize(this._obj).join(' <<>> ') == organize(b).join(' <<>> ')
            , "expected #{this} to be a permutation of #{exp}"
            , "expected #{this} to not be a permutation of of #{exp}"
            , b     // expected
            , this._obj   // actual
        );
    });
}



function organize(product) {
    return product.map((vector) => {
        return vector.join(', ');
    }).sort();
}

