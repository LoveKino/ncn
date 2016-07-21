'use strict';

const svgNS = 'http://www.w3.org/2000/svg';

let cn = (create) => (...args) => {
    let tagName,
        attributes = {},
        childExp = [];

    let first = args.shift();

    let node = null;

    if (isNode(tagName)) {
        node = tagName;
    } else {
        let parts = splitTagNameAttribute(first);

        if (parts.length > 1) { // not only tagName
            tagName = parts[0];
            attributes = parts[1];
        } else {
            tagName = first;
        }

        node = create(tagName);
    }

    attributes = parseAttribute(attributes);

    let next = args.shift();
    if (isArray(next) || isString(next)) {
        childExp = next;
    } else if (isObject(next)) {
        attributes = merge(attributes, next);
        childExp = args.shift() || [];
    }

    applyNode(node, attributes, childExp);

    return node;
};

let merge = (map1 = {}, map2) => {
    for (let name in map2) {
        map1[name] = map2[name];
    }
    return map1;
};

let splitTagNameAttribute = (str = '') => {
    let tagName = str.split(' ')[0];
    let attr = str.substring(tagName.length);
    attr = attr && attr.trim();
    if (attr) {
        return [tagName, attr];
    } else {
        return [tagName];
    }
};

const ITEM_REG = /([\w-]+)\s*=\s*(([\w-]+)|('.*?')|(".*?"))/;

// TODO better key=value grammer
let parseAttribute = (attributes) => {
    // key=value key=value
    // value='abc' value=true value=123 value="def"
    if (isString(attributes)) {
        let str = attributes.trim(),
            kvs = [];

        let stop = false;
        while (!stop) {
            let newstr = str.replace(ITEM_REG, (matchStr, $1, $2) => {
                kvs.push([$1, $2]);
                return '';
            }).trim();
            if (newstr === str) {
                stop = true;
            }
            str = newstr;
        }

        attributes = {};
        for (let i = 0; i < kvs.length; i++) {
            let [key, value] = kvs[i];
            if (value[0] === '\'' && value[value.length - 1] === '\'' ||
                value[0] === '"' && value[value.length - 1] === '"') {
                value = value.substring(1, value.length - 1);
            }
            attributes[key] = value;
        }
    }

    return attributes;
};

let applyNode = (node, attributes, childExp) => {
    setAttributes(node, attributes);

    appendChildExp(node, childExp);
};

let setAttributes = (node, attributes) => {
    for (let name in attributes) {
        let attr = attributes[name];
        if (name === 'style') {
            attr = getStyleString(attr);
        }
        node.setAttribute(name, attr);
    }
};

let getStyleString = (attr = '') => {
    if (isString(attr)) {
        return attr;
    }

    if (!isObject(attr)) {
        throw new TypeError(`Expect object for style object, but got ${attr}`);
    }
    let style = '';
    for (let key in attr) {
        style = `${style};${key}: ${attr[key]}`;
    }
    return style;
};

let appendChildExp = (node, childExp) => {
    if (isNode(childExp)) {
        node.appendChild(childExp);
    } else if (isArray(childExp)) {
        for (let i = 0; i < childExp.length; i++) {
            let child = childExp[i];
            appendChildExp(node, child);
        }
    } else if (childExp) {
        node.textContent = childExp.toString();
    }
};

let isNode = (o) => {
    return (
        typeof Node === 'object' ? o instanceof Node :
        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
    );
};

let isArray = v => v && typeof v === 'object' && typeof v.length === 'number';

let isObject = v => v && typeof v === 'object';

let isString = v => typeof v === 'string';

module.exports = {
    svgn: cn((tagName) => document.createElementNS(svgNS, tagName)),
    n: cn((tagName) => document.createElement(tagName))
};
