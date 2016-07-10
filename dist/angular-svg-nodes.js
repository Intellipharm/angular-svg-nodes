"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angularSvgNodesComponent = require("./angular-svg-nodes-component");

var _angularSvgNodesComponent2 = _interopRequireDefault(_angularSvgNodesComponent);

var _gridComponent = require("./bg-col-grid/grid-component");

var _gridComponent2 = _interopRequireDefault(_gridComponent);

var _labelComponent = require("./label/label-component");

var _labelComponent2 = _interopRequireDefault(_labelComponent);

var _lineComponent = require("./line/line-component");

var _lineComponent2 = _interopRequireDefault(_lineComponent);

var _nodeComponent = require("./node/node-component");

var _nodeComponent2 = _interopRequireDefault(_nodeComponent);

var _boxComponent = require("./svg-box/box-component");

var _boxComponent2 = _interopRequireDefault(_boxComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _module = angular.module('AngularSvgNodes', []);

_module.component('angularSvgNodesBgColGrid', _angularSvgNodesComponent2.default);
_module.component('angularSvgNodesLabel', _gridComponent2.default);
_module.component('angularSvgNodesLine', _labelComponent2.default);
_module.component('angularSvgNodesNode', _nodeComponent2.default);
_module.component('svgVbox', _boxComponent2.default);

_module.constant('BLOCK_TOP_LEFT', 0).constant('BLOCK_TOP', 1).constant('BLOCK_CENTER', 2).constant('BLOCK_BOTTOM', 3).constant('ACTION_ADD', 0).constant('ACTION_REMOVE', 1).constant('ACTION_UPDATE', 2).constant('INITIAL_GRID_COLS', 4).constant('INITIAL_GRID_ROWS', 2).constant('BLOCK_WIDTH', 80).constant('BLOCK_HEIGHT', 80).constant('COL_SPACING', 20).constant('ROW_SPACING', 40).constant('LABEL_SPACING', 5).constant('DISABLE_CONTROL_NODES', true).constant('MAX_VIEWPORT_WIDTH_INCREASE', 100).constant('MAX_VIEWPORT_HEIGHT_INCREASE', 100);

exports.default = _module;
//# sourceMappingURL=sourcemaps/angular-svg-nodes.js.map
