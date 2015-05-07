/// <reference path="../typings/tsd.d.ts" />

import outerProduct = require('outer-product');

export class Props {

    private properties:{ [s: string]:  Array<string>} = {};
    private propertiesOrder:Array<string> = [];
    private filters:Array<IFilter> = [];
    private debug:boolean = false;
    /**
     * The set statements for each property
     */
    private propset:{ [s: string]:  string[]} = {};

    constructor() {

    }

    define(name:string, ...values:string[]):Props {
        if (this.properties.hasOwnProperty(name)) {
            throw new Error("Property by the name '" + name + "' already defined");
        }
        this.propertiesOrder.push(name);
        this.properties[name] = values;
        return this;
    }

    set(name:string, ...values:string[]):Props {
        this.propset[name] = values.slice(0);
        return this;
    }

    filter(condition:string, result?:string):Props {
        if (!result) {
            result = condition;
            condition = 'true';
        }
        this.filters.push({condition: condition, result: result});
        return this;
    }

    buildOuterProduct() {
        var filter = this.buildFilter();
        var product = outerProduct(this.buildDimensions());
        product = product.filter((item) => {
            return filter.apply(null, item);
        });
        return product;
    }

    private buildDimensions() {
        var dimensions = [];
        var l = this.propertiesOrder.length;
        var validValues;
        while (l--) {
            var propname = this.propertiesOrder[l];
            dimensions[l] = this.properties[propname].slice(0);
            // handle the set statements
            if (propname in this.propset) {
                validValues = this.propset[propname];
                dimensions[l] = dimensions[l].filter((value)=> {
                    return validValues.indexOf(value) > -1;
                });
            }
        }
        return dimensions;
    }

    private buildFilter():(...values:any[]) => boolean {
        var propNames = this.propertiesOrder.slice(0);
        var code = [];

        if (this.debug) propNames.forEach((p, i) => {
            var c = 'console.log("PROP ' + i + ' :", ' + JSON.stringify(p + ' == ') + ',' + 'arguments[' + i + ']' + ')\n';
            code.push(c);
        });

        this.filters.map((filter) => {
            if (this.debug) {
                var log = [];
                log.push('"Filter:"');
                log.push(JSON.stringify(filter.condition));
                log.push('" => "');
                log.push(JSON.stringify(filter.result));
                log.push('" >>>> "');
                log.push(filter.condition);
                log.push('" => "');
                log.push(filter.result);

                code.push("console.log(" + log.join(', ') + "); \n");
            }

            code.push('if((');
            code.push(filter.condition);
            code.push(') && !(');
            code.push(filter.result);
            code.push(')) return false;\n');
        });
        code.push('return true;\n');

        propNames.push(code.join(''));
        return Function.apply(null, propNames);
    }
}

export interface IFilter {
    condition:string;
    result:string;
}