var props = {
    define: {
        'color': ['red', 'green', 'blue'],
        'animal': ['dog', 'cat']
    },
    filter: {
        "animal == 'dog'": "color != 'red'"
    },
    set: {
        'animal': ['dog', 'cat', 'bird']
    }
};

export = props;