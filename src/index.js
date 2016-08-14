'use strict';

let {
    isString, isObject, isNode, likeArray, isNumber, isBool
} = require('basetype');

let parseAttribute = require('./parseAttribute');

const svgNS = 'http://www.w3.org/2000/svg';

let cn = (create) => {
    let nodeGen = nodeGener(create);
    return (...args) => {
        let {
            tagName, attributes, childs
        } = parseArgs(args);
        return nodeGen(tagName, attributes, childs);
    };
};

let nodeGener = (create) => (tagName, attributes, childs) => {
    let node = create(tagName);
    applyNode(node, attributes, childs);

    return node;
};

let parseArgs = (args) => {
    let tagName,
        attributes = {},
        childExp = [];

    let first = args.shift();

    let parts = splitTagNameAttribute(first);

    if (parts.length > 1) { // not only tagName
        tagName = parts[0];
        attributes = parts[1];
    } else {
        tagName = first;
    }

    tagName = tagName.toLowerCase();

    let next = args.shift();

    let nextAttr = {};

    if (likeArray(next) ||
        isString(next) ||
        isNode(next) ||
        isNumber(next) ||
        isBool(next)) {
        childExp = next;
    } else if (isObject(next)) {
        nextAttr = next;
        childExp = args.shift() || [];
    }

    attributes = parseAttribute(attributes, nextAttr);

    let childs = parseChildExp(childExp);

    return {
        tagName,
        attributes,
        childs
    };
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

let applyNode = (node, attributes, childs) => {
    setAttributes(node, attributes);
    for (let i = 0; i < childs.length; i++) {
        let child = childs[i];
        if (isString(child)) {
            node.textContent = child;
        } else {
            node.appendChild(child);
        }
    }
};

let setAttributes = (node, attributes) => {
    for (let name in attributes) {
        let attr = attributes[name];
        node.setAttribute(name, attr);
    }
};

let parseChildExp = (childExp) => {
    let ret = [];
    if (isNode(childExp)) {
        ret.push(childExp);
    } else if (likeArray(childExp)) {
        for (let i = 0; i < childExp.length; i++) {
            let child = childExp[i];
            ret = ret.concat(parseChildExp(child));
        }
    } else if (childExp) {
        ret.push(childExp.toString());
    }
    return ret;
};

let createElement = (tagName) => document.createElement(tagName);

let createSvgElement = (tagName) => document.createElementNS(svgNS, tagName);

module.exports = {
    svgn: cn(createSvgElement),
    n: cn(createElement),
    parseArgs,
    nodeGener,
    createElement,
    createSvgElement,
    cn
};
