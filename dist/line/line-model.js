"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AngularSvgNodeLine = function AngularSvgNodeLine(data) {
    _classCallCheck(this, AngularSvgNodeLine);

    this.active = !_.isUndefined(data.active) ? data.active : false;
    this.connected = !_.isUndefined(data.connected) ? data.connected : false;
    this.from = !_.isUndefined(data.from) ? data.from : null;
    this.to = !_.isUndefined(data.to) ? data.to : null;
    this.x1 = !_.isUndefined(data.x1) ? data.x1 : null;
    this.y1 = !_.isUndefined(data.y1) ? data.y1 : null;
    this.x2 = !_.isUndefined(data.x2) ? data.x2 : null;
    this.y2 = !_.isUndefined(data.y2) ? data.y2 : null;
    this.should_animate = !_.isUndefined(data.should_animate) ? data.should_animate : false;
};

exports.default = AngularSvgNodeLine;
//# sourceMappingURL=../sourcemaps/line/line-model.js.map
