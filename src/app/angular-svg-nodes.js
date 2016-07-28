import _directive from "./angular-svg-nodes-directive";
// import _directive from "./angular-svg-nodes-directive-d3";
import _bg_col_grid_directive from "./bg-col-grid/bg-col-grid-directive";
import _label_directive from "./label/label-directive";
import _line_directive from "./line/line-directive";
import _node_directive from "./node/node-directive";
import _svg_vbox_directive from "./svg-box/svg-vbox-directive";

export let module = angular.module('AngularSvgNodes', []);

module.directive('angularSvgNodes', () => _directive);
module.directive('angularSvgNodesBgColGrid', () => _bg_col_grid_directive);
module.directive('angularSvgNodesLabel', () => _label_directive);
module.directive('angularSvgNodesLine', () => _line_directive);
module.directive('angularSvgNodesNode', () => _node_directive);
module.directive('svgVbox', () => _svg_vbox_directive);

// relays

import * as Transformer from './angular-svg-nodes-transformer';
import AngularSvgNodesTransformerConfig from './transformer-config/transformer-config-model';

export { 
    Transformer,
    AngularSvgNodesTransformerConfig as TransformerConfig
};