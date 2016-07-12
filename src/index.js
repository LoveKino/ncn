'use strict';

const svgNS = 'http://www.w3.org/2000/svg';

let svgn = (tagName, attributes = {}, childExp = [], mount = {}) => {
    let node = document.createElementNS(svgNS, tagName);

    applyNode(node, attributes, childExp, mount);

    return node;
};

let n = (tagName, attributes = {}, childExp = [], mount = {}) => {
    let node = document.createElement(tagName);

    applyNode(node, attributes, childExp, mount);

    return node;
};

let applyNode = (node, attributes, childExp, mount) => {
    setAttributes(node, attributes);

    appendChildExp(node, childExp);

    hookData(node, mount);
};

let hookData = (node, mount) => {
    // hook data
    for (var name in mount) {
        node[name] = mount[name];
    }
};

let setAttributes = (node, attributes) => {
    for (let name in attributes) {
        node.setAttribute(name, attributes[name]);
    }
};

let appendChildExp = (node, childExp) => {
    if (isArray(childExp)) {
        for (let i = 0; i < childExp.length; i++) {
            let child = childExp[i];
            appendChildExp(node, child);
        }
    } else {
        addChild(node, childExp);
    }
};

let addChild = (parent, child) => {
    if (isNode(child)) {
        parent.appendChild(child);
    } else if (child) {
        parent.textContent = child.toString();
    }
};

let isNode = (o) => {
    return (
        typeof Node === 'object' ? o instanceof Node :
        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
    );
};

let isArray = v => v && typeof v === 'object' && typeof v.length === 'number';

module.exports = {
    n,
    svgn
};
