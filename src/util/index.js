'use strict';

let isArray = v => v && typeof v === 'object' && typeof v.length === 'number';

let isObject = v => v && typeof v === 'object';

let isString = v => typeof v === 'string';

let isNode = (o) => {
    return (
        typeof Node === 'object' ? o instanceof Node :
        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
    );
};

let merge = (map1 = {}, map2) => {
    for (let name in map2) {
        map1[name] = map2[name];
    }
    return map1;
};

module.exports = {
    isArray,
    isObject,
    isString,
    isNode,
    merge
};
