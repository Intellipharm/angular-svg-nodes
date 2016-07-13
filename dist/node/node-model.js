"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AngularSvgNode = function AngularSvgNode(data) {
    _classCallCheck(this, AngularSvgNode);

    this.label = !_.isUndefined(data.label) ? data.label : "";
    this.join = !_.isUndefined(data.join) ? data.join : [];
};

exports.default = AngularSvgNode;
//# sourceMappingURL=../sourcemaps/node/node-model.js.map
