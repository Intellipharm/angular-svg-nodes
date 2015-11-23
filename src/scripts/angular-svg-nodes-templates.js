angular.module('AngularSvgNodes').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/angular-svg-nodes.html',
    "<div class=\"angular-svg-nodes-wrapper\" ng-style=\"ctrl.wrapper_style\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\r" +
    "\n" +
    "         preserveAspectRatio=\"xMinYMin meet\"\r" +
    "\n" +
    "         ng-style=\"viewport_style\"\r" +
    "\n" +
    "         width=\"100%\"\r" +
    "\n" +
    "         svg-vbox=\"{{ctrl.viewport_viewbox}}\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- bg column grid -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <svg ng-repeat=\"col in ctrl.bg_col_grid\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <rect ng-attr-x=\"{{col.x}}\" y=\"0\"\r" +
    "\n" +
    "                  ng-attr-width=\"{{col.width}}\"\r" +
    "\n" +
    "                  height=\"100%\"\r" +
    "\n" +
    "                  class=\"angular-svg-nodes-bg-col-grid-col\"\r" +
    "\n" +
    "                  angular-svg-nodes-bg-col-grid\r" +
    "\n" +
    "                  angular-svg-nodes-bg-col-grid-index=\"{{col.index}}\"\r" +
    "\n" +
    "                  angular-svg-nodes-bg-col-grid-on-mouse-over=\"ctrl.onBgColGridMouseOver(index)\"></rect>\r" +
    "\n" +
    "        </svg>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- rows -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <svg ng-repeat=\"row in ctrl.blocks\" x=\"0\" y=\"0\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- columns -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <svg ng-repeat=\"col in row.columns\" class=\"angular-svg-nodes-col\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <!-- lines -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <line ng-repeat=\"line in col.lines\"\r" +
    "\n" +
    "                      class=\"angular-svg-nodes-line\"\r" +
    "\n" +
    "                      ng-class=\"{\r" +
    "\n" +
    "                      'connected': line.connected,\r" +
    "\n" +
    "                      'active': line.active,\r" +
    "\n" +
    "                      'target': line.target,\r" +
    "\n" +
    "                      'potential_remove': line.potential_remove\r" +
    "\n" +
    "                      }\"\r" +
    "\n" +
    "                      angular-svg-nodes-line\r" +
    "\n" +
    "                      angular-svg-nodes-line-coords=\"line\"\r" +
    "\n" +
    "                      angular-svg-nodes-line-col-index=\"{{col.col_index}}\"\r" +
    "\n" +
    "                      angular-svg-nodes-line-row-index=\"{{col.row_index}}\"\r" +
    "\n" +
    "                      angular-svg-nodes-line-line-index=\"{{$index}}\"\r" +
    "\n" +
    "                      angular-svg-nodes-line-on-remove-complete=\"ctrl.onLineRemoveComplete(source_coords, target_coords, line_index)\"\r" +
    "\n" +
    "                      angular-svg-nodes-line-on-draw-complete=\"ctrl.onLineDrawComplete(source_coords, target_coords, line_index)\"></line>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <!-- blocks -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <rect ng-attr-x=\"{{col.x}}\" ng-attr-y=\"{{col.y}}\"\r" +
    "\n" +
    "                      ng-attr-width=\"{{ctrl.block_width}}\" ng-attr-height=\"{{ctrl.block_height}}\"\r" +
    "\n" +
    "                      class=\"angular-svg-nodes-node\"\r" +
    "\n" +
    "                      ng-class=\"{\r" +
    "\n" +
    "                      'connected': col.connected,\r" +
    "\n" +
    "                      'active': col.active,\r" +
    "\n" +
    "                      'source': col.source,\r" +
    "\n" +
    "                      'source-hover': col.source_hover,\r" +
    "\n" +
    "                      'target': col.target,\r" +
    "\n" +
    "                      'target-hover': col.target_hover,\r" +
    "\n" +
    "                      'potential-target': col.potential_target,\r" +
    "\n" +
    "                      'potential-target-hover': col.potential_target_hover,\r" +
    "\n" +
    "                      'control': col.control,\r" +
    "\n" +
    "                      'control_hover': col.control_hover,\r" +
    "\n" +
    "                      'highlight': col.highlight,\r" +
    "\n" +
    "                      'selected': ($index === ctrl.selected_node[0] && $parent.$index === ctrl.selected_node[1])\r" +
    "\n" +
    "                      }\"\r" +
    "\n" +
    "                      angular-svg-nodes-node\r" +
    "\n" +
    "                      angular-svg-nodes-node-col-index=\"{{col.col_index}}\"\r" +
    "\n" +
    "                      angular-svg-nodes-node-row-index=\"{{col.row_index}}\"\r" +
    "\n" +
    "                      angular-svg-nodes-node-on-select=\"ctrl.onNodeSelect(col_index, row_index)\"\r" +
    "\n" +
    "                      angular-svg-nodes-node-on-deselect=\"ctrl.onNodeDeselect(col_index, row_index)\"\r" +
    "\n" +
    "                      angular-svg-nodes-node-on-mouse-out=\"ctrl.onNodeMouseOut(col_index, row_index, exit_side)\"\r" +
    "\n" +
    "                      angular-svg-nodes-node-on-mouse-over=\"ctrl.onNodeMouseOver(col_index, row_index)\"></rect>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <!-- control label -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <text ng-if=\"col.control\"\r" +
    "\n" +
    "                      class=\"angular-svg-nodes-node-label\"\r" +
    "\n" +
    "                      ng-class=\"{\r" +
    "\n" +
    "                      'control': col.control,\r" +
    "\n" +
    "                      'control_hover': col.control_hover,\r" +
    "\n" +
    "                      }\"\r" +
    "\n" +
    "                      ng-attr-x=\"{{col.label_x}}\" ng-attr-y=\"{{col.label_y}}\"\r" +
    "\n" +
    "                      text-anchor=\"middle\" alignment-baseline=\"middle\">+</text>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <!-- label -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <foreignObject ng-if=\"!col.control\"\r" +
    "\n" +
    "                               ng-attr-x=\"{{col.label_x}}\" ng-attr-y=\"{{col.label_y}}\"\r" +
    "\n" +
    "                               ng-attr-width=\"{{ctrl.label_width}}\" ng-attr-height=\"{{ctrl.label_height}}\"\r" +
    "\n" +
    "                               class=\"angular-svg-nodes-node-label-foreign-object\">\r" +
    "\n" +
    "                    <div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"angular-svg-nodes-node-label noselect\">{{col.label}}</div>\r" +
    "\n" +
    "                </foreignObject>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </svg>\r" +
    "\n" +
    "        </svg>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!--<text x=\"600\" y=\"200\"\r" +
    "\n" +
    "              style=\"font-size: 20px; color: #000;\"\r" +
    "\n" +
    "              text-anchor=\"middle\" alignment-baseline=\"middle\">{{ctrl.selection}}</text>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </svg>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
