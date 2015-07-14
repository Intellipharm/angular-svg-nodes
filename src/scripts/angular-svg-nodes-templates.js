angular.module('AngularSvgNodes').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/angular-svg-nodes.html',
    "<div class=\"angular-svg-nodes-wrapper\" ng-style=\"ctrl.wrapper_style\">\n" +
    "\n" +
    "    <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n" +
    "         preserveAspectRatio=\"xMinYMin meet\"\n" +
    "         ng-style=\"viewport_style\"\n" +
    "         width=\"100%\"\n" +
    "         svg-vbox=\"{{ctrl.viewport_viewbox}}\">\n" +
    "\n" +
    "        <!-- bg column grid -->\n" +
    "\n" +
    "        <svg ng-repeat=\"col in ctrl.bg_col_grid\">\n" +
    "\n" +
    "            <rect ng-attr-x=\"{{col.x}}\" y=\"0\"\n" +
    "                  ng-attr-width=\"{{col.width}}\"\n" +
    "                  height=\"100%\"\n" +
    "                  class=\"angular-svg-nodes-bg-col-grid-col\"\n" +
    "                  angular-svg-nodes-bg-col-grid\n" +
    "                  angular-svg-nodes-bg-col-grid-index=\"{{col.index}}\"\n" +
    "                  angular-svg-nodes-bg-col-grid-on-mouse-over=\"ctrl.onBgColGridMouseOver(index)\"></rect>\n" +
    "        </svg>\n" +
    "\n" +
    "        <!-- rows -->\n" +
    "\n" +
    "        <svg ng-repeat=\"row in ctrl.blocks\" x=\"0\" y=\"0\">\n" +
    "\n" +
    "            <!-- columns -->\n" +
    "\n" +
    "            <svg ng-repeat=\"col in row.columns\" class=\"angular-svg-nodes-col\">\n" +
    "\n" +
    "                <!-- lines -->\n" +
    "\n" +
    "                <line ng-repeat=\"line in col.lines\"\n" +
    "                      class=\"angular-svg-nodes-line\"\n" +
    "                      ng-class=\"{\n" +
    "                      'connected': line.connected,\n" +
    "                      'active': line.active,\n" +
    "                      'target': line.target,\n" +
    "                      'potential_remove': line.potential_remove\n" +
    "                      }\"\n" +
    "                      angular-svg-nodes-line\n" +
    "                      angular-svg-nodes-line-coords=\"line\"\n" +
    "                      angular-svg-nodes-line-col-index=\"{{col.col_index}}\"\n" +
    "                      angular-svg-nodes-line-row-index=\"{{col.row_index}}\"\n" +
    "                      angular-svg-nodes-line-line-index=\"{{$index}}\"\n" +
    "                      angular-svg-nodes-line-on-remove-complete=\"ctrl.onLineRemoveComplete(source_coords, target_coords, line_index)\"\n" +
    "                      angular-svg-nodes-line-on-draw-complete=\"ctrl.onLineDrawComplete(source_coords, target_coords, line_index)\"></line>\n" +
    "\n" +
    "                <!-- blocks -->\n" +
    "\n" +
    "                <rect ng-attr-x=\"{{col.x}}\" ng-attr-y=\"{{col.y}}\"\n" +
    "                      ng-attr-width=\"{{ctrl.block_width}}\" ng-attr-height=\"{{ctrl.block_height}}\"\n" +
    "                      class=\"angular-svg-nodes-node\"\n" +
    "                      ng-class=\"{\n" +
    "                      'connected': col.connected,\n" +
    "                      'active': col.active,\n" +
    "                      'source': col.source,\n" +
    "                      'source-hover': col.source_hover,\n" +
    "                      'target': col.target,\n" +
    "                      'target-hover': col.target_hover,\n" +
    "                      'potential-target': col.potential_target,\n" +
    "                      'potential-target-hover': col.potential_target_hover,\n" +
    "                      'control': col.control,\n" +
    "                      'control_hover': col.control_hover,\n" +
    "                      'highlight': col.highlight,\n" +
    "                      'selected': ($index === ctrl.selected_node[0] && $parent.$index === ctrl.selected_node[1])\n" +
    "                      }\"\n" +
    "                      angular-svg-nodes-node\n" +
    "                      angular-svg-nodes-node-col-index=\"{{col.col_index}}\"\n" +
    "                      angular-svg-nodes-node-row-index=\"{{col.row_index}}\"\n" +
    "                      angular-svg-nodes-node-on-select=\"ctrl.onNodeSelect(col_index, row_index)\"\n" +
    "                      angular-svg-nodes-node-on-deselect=\"ctrl.onNodeDeselect(col_index, row_index)\"\n" +
    "                      angular-svg-nodes-node-on-mouse-out=\"ctrl.onNodeMouseOut(col_index, row_index, exit_side)\"\n" +
    "                      angular-svg-nodes-node-on-mouse-over=\"ctrl.onNodeMouseOver(col_index, row_index)\"></rect>\n" +
    "\n" +
    "                <!-- control label -->\n" +
    "\n" +
    "                <text ng-if=\"col.control\"\n" +
    "                      class=\"angular-svg-nodes-node-label\"\n" +
    "                      ng-class=\"{\n" +
    "                      'control': col.control,\n" +
    "                      'control_hover': col.control_hover,\n" +
    "                      }\"\n" +
    "                      ng-attr-x=\"{{col.label_x}}\" ng-attr-y=\"{{col.label_y}}\"\n" +
    "                      text-anchor=\"middle\" alignment-baseline=\"middle\">+</text>\n" +
    "\n" +
    "                <!-- label -->\n" +
    "\n" +
    "                <foreignObject ng-if=\"!col.control\"\n" +
    "                               ng-attr-x=\"{{col.label_x}}\" ng-attr-y=\"{{col.label_y}}\"\n" +
    "                               ng-attr-width=\"{{ctrl.label_width}}\" ng-attr-height=\"{{ctrl.label_height}}\"\n" +
    "                               class=\"angular-svg-nodes-node-label-foreign-object\">\n" +
    "                    <div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"angular-svg-nodes-node-label noselect\">{{col.label}}</div>\n" +
    "                </foreignObject>\n" +
    "\n" +
    "            </svg>\n" +
    "        </svg>\n" +
    "\n" +
    "        <!--<text x=\"600\" y=\"200\"\n" +
    "              style=\"font-size: 20px; color: #000;\"\n" +
    "              text-anchor=\"middle\" alignment-baseline=\"middle\">{{ctrl.selection}}</text>-->\n" +
    "\n" +
    "    </svg>\n" +
    "</div>\n"
  );

}]);
