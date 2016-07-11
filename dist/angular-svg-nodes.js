"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _angularSvgNodesDirective = require("./angular-svg-nodes-directive");

var _angularSvgNodesDirective2 = _interopRequireDefault(_angularSvgNodesDirective);

var _bgColGridDirective = require("./bg-col-grid/bg-col-grid-directive");

var _bgColGridDirective2 = _interopRequireDefault(_bgColGridDirective);

var _labelDirective = require("./label/label-directive");

var _labelDirective2 = _interopRequireDefault(_labelDirective);

var _lineDirective = require("./line/line-directive");

var _lineDirective2 = _interopRequireDefault(_lineDirective);

var _nodeDirective = require("./node/node-directive");

var _nodeDirective2 = _interopRequireDefault(_nodeDirective);

var _svgVboxDirective = require("./svg-box/svg-vbox-directive");

var _svgVboxDirective2 = _interopRequireDefault(_svgVboxDirective);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _module = angular.module('AngularSvgNodes', []);

_module.directive('angularSvgNodes', function () {
  return _angularSvgNodesDirective2.default;
});
_module.directive('angularSvgNodesBgColGrid', function () {
  return _bgColGridDirective2.default;
});
_module.directive('angularSvgNodesLabel', function () {
  return _labelDirective2.default;
});
_module.directive('angularSvgNodesLine', function () {
  return _lineDirective2.default;
});
_module.directive('angularSvgNodesNode', function () {
  return _nodeDirective2.default;
});
_module.directive('svgVbox', function () {
  return _svgVboxDirective2.default;
});

exports.default = _module;
//# sourceMappingURL=sourcemaps/angular-svg-nodes.js.map
