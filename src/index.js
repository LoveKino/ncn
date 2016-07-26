'use strict';

let {
    isString, isObject, isNode, isArray
} = require('./util');

let parseAttribute = require('./parseAttribute');

const svgNS = 'http://www.w3.org/2000/svg';

let cn = (create) => {
    let nodeGen = nodeGener(create);
    return (...args) => {
        let {
            tagName, attributes, childExp
        } = parseArgs(args);
        return nodeGen(tagName, attributes, childExp);
    };
};

let nodeGener = (create) => (tagName, attributes, childExp) => {
    let node = create(tagName);
    applyNode(node, attributes, childExp);

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

    if (isArray(next) || isString(next)) {
        childExp = next;
    } else if (isObject(next)) {
        nextAttr = next;
        childExp = args.shift() || [];
    }

    attributes = parseAttribute(attributes, nextAttr);

    return {
        tagName,
        attributes,
        childExp
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

let applyNode = (node, attributes, childExp) => {
    setAttributes(node, attributes);

    appendChildExp(node, childExp);
};

let setAttributes = (node, attributes) => {
    for (let name in attributes) {
        let attr = attributes[name];
        node.setAttribute(name, attr);
    }
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
