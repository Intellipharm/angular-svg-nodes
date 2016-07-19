"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angularSvgNodesController = require("./angular-svg-nodes-controller");

var _angularSvgNodesController2 = _interopRequireDefault(_angularSvgNodesController);

var _angularSvgNodes = require("./angular-svg-nodes.html!text");

var _angularSvgNodes2 = _interopRequireDefault(_angularSvgNodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    restrict: 'E',
    scope: {
        api: "<?",
        config_block_width: "<?blockWidth",
        config_block_height: "<?blockHeight",
        config_col_spacing: "<?colSpacing",
        config_disable_control_nodes: "<?disableControlNodes",
        config_highlight_node_on: "<?highlightNodeOn",
        config_initial_grid_cols: "<?initialGridCols",
        config_initial_grid_rows: "<?initialGridRows",
        config_label_spacing: "<?labelSpacing",
        config_max_viewport_width_increase: "<?maxViewportWidthIncrease",
        config_max_viewport_height_increase: "<?maxViewportHeightIncrease",
        config_new_node_label: "<?newNodeLabel",
        config_row_spacing: "<?rowSpacing",
        initial_state: "<?initialState",
        onNodeSelectionCallback: "&onNodeSelection",
        onNodeDeselectionCallback: "&onNodeDeselection",
        onNodeConnectionChangeCallback: "&onNodeConnectionChange",
        onNodeAddedCallback: "&onNodeAdded"
    },
    controller: _angularSvgNodesController2.default,
    controllerAs: "AngularSvgNodes",
    bindToController: true,
    template: _angularSvgNodes2.default,
    link: function link(scope, element, attrs, controller) {

        controller.parent_coords = element[0].getBoundingClientRect();

        element.addClass('angular-svg-nodes');

        element[0].addEventListener("mouseup", controller.onRootDeselect.bind(controller));

        element[0].addEventListener("mouseleave", controller.onRootMouseLeave.bind(controller));
    }
};
//# sourceMappingURL=sourcemaps/angular-svg-nodes-directive.js.map
