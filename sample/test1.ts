/// <reference path="../index" />
import propsModule = require('../index');

function properties(props:propsModule.Props) {
    props.define('color', 'red', 'green', 'blue')
        .define('animal', 'dog', 'cat')

        // dogs can't see red, so filter this combo
        .filter("animal == 'dog'", "color != 'red'")

        .set('animal', 'dog', 'cat', 'bird');
}

export = properties;