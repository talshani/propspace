/// <reference path="../typings/tsd.d.ts" />

import propsModule = require('../src/props');
import chai = require('chai');
import utils = require('./_utils')
var expect = chai.expect;

chai.use(utils.OuterProduct);
chai.use(utils.OuterProductEquals);

describe("Props", function () {

    var props:propsModule.Props;

    beforeEach(function() {
        props = new propsModule.Props();
    });

    it("should handle empty properties", function () {
        expect(props.buildOuterProduct()).to.be.outerProductEquals([]);
        expect(props.buildOuterProduct()).to.not.outerProductEquals([['sdsd']]);
    });

    it("should split the properties", function () {
        props.define('property', 'value1', 'value2', 'value3');
        expect(props.buildOuterProduct()).to.be.outerProductEquals([['value1'], ['value2'], ['value3']]);
        expect(props.buildOuterProduct()).to.not.be.outerProductEquals([['value1'], ['value2']]);
    });

    describe('#set', function() {
        it("should only use the set values", function() {
            props.define('property', 'value1', 'value2', 'value3')
            .set('property', 'value2', 'someUnknownValue');
            expect(props.buildOuterProduct()).to.be.outerProductEquals([['value2']]);
        });
        it("should support several values", function() {
            props.define('property', 'value1', 'value2', 'value3')
            .set('property', 'value2', 'value1');
            expect(props.buildOuterProduct()).to.be.outerProductEquals([['value2'],['value1']]);
        });
        it("should support several properties", function() {
            props.define('property', 'value1', 'value2', 'value3')
                .set('property', 'value2', 'value1');
            props.define('other', 'a');
            expect(props.buildOuterProduct()).to.be.outerProductEquals([['value2', 'a'],['value1', 'a']]);
        });
    });

    describe('#filter', function() {
        it("should always filter out some values", function() {
            props.define('property', 'value1', 'value2', 'value3')
                .filter('true', 'property == "value1"');
            expect(props.buildOuterProduct()).to.be.outerProductEquals([['value1']]);
        });
        it("should handle empty condition like true condition", function() {
            props.define('property', 'value1', 'value2', 'value3')
                .filter('property == "value1"');
            expect(props.buildOuterProduct()).to.be.outerProductEquals([['value1']]);
        });
        it("should not filter anything", function() {
            props.define('property', 'value1', 'value2', 'value3')
                .filter('false', 'property == "value1"');
            expect(props.buildOuterProduct()).to.be.outerProductEquals([['value1'],['value2'],['value3']]);
        });
        it("should handle some complex filtering", function() {
            props.define('property', 'value1', 'value2', 'value3')
                .define('lang', 'en', 'en_us')
                .filter('lang == "en_us"', 'property == "value1"')
                .filter('lang == "en"', 'property == "value2"');
            expect(props.buildOuterProduct()).to.be.outerProductEquals([['value1', 'en_us'],['value2', 'en']]);
        });
    });
});