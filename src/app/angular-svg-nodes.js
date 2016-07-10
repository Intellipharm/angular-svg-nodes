import _component from "./angular-svg-nodes-component";
import _bg_col_grid_component from "./bg-col-grid/grid-component";
import _label_component from "./label/label-component";
import _line_component from "./line/line-component";
import _node_component from "./node/node-component";
import _svg_box_component from "./svg-box/box-component";

let _module = angular.module('AngularSvgNodes', []);

_module.component('angularSvgNodesBgColGrid', _component);
_module.component('angularSvgNodesLabel', _bg_col_grid_component);
_module.component('angularSvgNodesLine', _label_component);
_module.component('angularSvgNodesNode', _node_component);
_module.component('svgVbox', _svg_box_component);

_module
    .constant('BLOCK_TOP_LEFT',    0)
    .constant('BLOCK_TOP',         1)
    .constant('BLOCK_CENTER',      2)
    .constant('BLOCK_BOTTOM',      3)
    .constant('ACTION_ADD',        0)
    .constant('ACTION_REMOVE',     1)
    .constant('ACTION_UPDATE',     2)
    .constant('INITIAL_GRID_COLS', 4)
    .constant('INITIAL_GRID_ROWS', 2)
    .constant('BLOCK_WIDTH',       80)
    .constant('BLOCK_HEIGHT',      80)
    .constant('COL_SPACING',       20)
    .constant('ROW_SPACING',       40)
    .constant('LABEL_SPACING',     5)
    .constant('DISABLE_CONTROL_NODES',  true)
    .constant('MAX_VIEWPORT_WIDTH_INCREASE',   100)
    .constant('MAX_VIEWPORT_HEIGHT_INCREASE',  100);

export default _module;