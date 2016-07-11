import _directive from "./angular-svg-nodes-directive";
import _bg_col_grid_directive from "./bg-col-grid/bg-col-grid-directive";
import _label_directive from "./label/label-directive";
import _line_directive from "./line/line-directive";
import _node_directive from "./node/node-directive";
import _svg_vbox_directive from "./svg-box/svg-vbox-directive";

let _module = angular.module('AngularSvgNodes', []);

_module.directive('angularSvgNodes', () => _directive);
_module.directive('angularSvgNodesBgColGrid', () => _bg_col_grid_directive);
_module.directive('angularSvgNodesLabel', () => _label_directive);
_module.directive('angularSvgNodesLine', () => _line_directive);
_module.directive('angularSvgNodesNode', () => _node_directive);
_module.directive('svgVbox', () => _svg_vbox_directive);

export default _module;