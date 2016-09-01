'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _angularSvgNodesSettings = require('./angular-svg-nodes-settings');

var _nodeSettings = require('./node/node-settings');

var _nodeUtils = require('./node/node-utils');

var NodeUtils = _interopRequireWildcard(_nodeUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function calculateColX(index, config) {
    if (index === 0) {
        return 0;
    }
    var first_col_width = config.node_width + config.col_spacing / 2;
    var col_width = config.node_width + config.col_spacing;
    return first_col_width + (index - 1) * col_width;
}

function calculateColWidth(index, config) {
    var total_item_width = index === 0 ? config.node_width + config.col_spacing / 2 : config.node_width + config.col_spacing;
    return total_item_width;
}

exports.default = {
    restrict: 'E',
    scope: {
        api: "<?",
        config_node_width: "<?nodeWidth",
        config_node_height: "<?nodeHeight",
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
        initial_state: "<?initialState"
    },
    controller: function controller() {},
    controllerAs: "AngularSvgNodesD3",
    bindToController: true,
    template: '<div id="angular-svg-nodes-wrapper" class="angular-svg-nodes-wrapper" ng-style="AngularSvgNodes.wrapper_style">',
    link: function link(scope, element, attrs, controller) {

        var _config = {
            new_node_label: !_lodash2.default.isUndefined(controller.config_new_node_label) ? controller.config_new_node_label : "NEW NODE",
            initial_grid_cols: !_lodash2.default.isUndefined(controller.config_initial_grid_cols) ? controller.config_initial_grid_cols : _angularSvgNodesSettings.DEFAULT_INITIAL_GRID_COLS,
            initial_grid_rows: !_lodash2.default.isUndefined(controller.config_initial_grid_rows) ? controller.config_initial_grid_rows : _angularSvgNodesSettings.DEFAULT_INITIAL_GRID_ROWS,
            highlight_node_on: !_lodash2.default.isUndefined(controller.config_highlight_node_on) ? controller.config_highlight_node_on : _angularSvgNodesSettings.DEFAULT_HIGHLIGHT_NODE_ON,
            node_width: !_lodash2.default.isUndefined(controller.config_node_width) ? controller.config_node_width : _angularSvgNodesSettings.DEFAULT_NODE_WIDTH,
            node_height: !_lodash2.default.isUndefined(controller.config_node_height) ? controller.config_node_height : _angularSvgNodesSettings.DEFAULT_NODE_HEIGHT,
            col_spacing: !_lodash2.default.isUndefined(controller.config_col_spacing) ? controller.config_col_spacing : _angularSvgNodesSettings.DEFAULT_COL_SPACING,
            row_spacing: !_lodash2.default.isUndefined(controller.config_row_spacing) ? controller.config_row_spacing : _angularSvgNodesSettings.DEFAULT_ROW_SPACING,
            label_spacing: !_lodash2.default.isUndefined(controller.config_label_spacing) ? controller.config_label_spacing : _angularSvgNodesSettings.DEFAULT_LABEL_SPACING,
            disable_control_nodes: !_lodash2.default.isUndefined(controller.config_disable_control_nodes) ? controller.config_disable_control_nodes : _angularSvgNodesSettings.DEFAULT_DISABLE_CONTROL_NODES,
            max_viewport_width_increase: !_lodash2.default.isUndefined(controller.config_max_viewport_width_increase) ? controller.config_max_viewport_width_increase : _angularSvgNodesSettings.DEFAULT_MAX_VIEWPORT_WIDTH_INCREASE,
            max_viewport_height_increase: !_lodash2.default.isUndefined(controller.config_max_viewport_height_increase) ? controller.config_max_viewport_height_increase : _angularSvgNodesSettings.DEFAULT_MAX_VIEWPORT_HEIGHT_INCREASE
        };

        var _cols = _config.initial_grid_cols;
        var _rows = 4;

        var _total_item_width = _config.node_width + _config.col_spacing;
        var _total_item_height = _config.node_height + _config.row_spacing;

        var _viewport_width = _total_item_width * _cols;
        var _viewport_height = _total_item_height * _rows;

        controller.wrapper_style = {
            'max-width': _viewport_width + _config.max_viewport_width_increase + "px",
            'min-width': _viewport_width + "px",
            'max-height': _viewport_height + _config.max_viewport_height_increase * _rows + "px",
            'min-height': _viewport_height + "px"
        };

        var _wrapper = d3.select("#angular-svg-nodes-wrapper").append("svg:svg").attr("version", "1.1").attr("xmlns", "http://www.w3.org/2000/svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", " 0 0 " + _viewport_width + " " + _viewport_height).attr("width", "100%").style("stroke", "rgb(6,120,155)").style("background-color", "#ccc").style("min-width", _viewport_width + "px").style("min-height", _viewport_height + "px");

        var _grid_col_count = 4;

        _lodash2.default.map(new Array(_grid_col_count), function (bgcol, bgcoli) {

            var _x = calculateColX(bgcoli, _config);
            var _width = calculateColWidth(bgcoli, _config);

            var _bg_col_svg = _wrapper.append("svg:svg");

            var _bg_col_rect_svg = _bg_col_svg.append("svg:rect").attr("x", _x).attr("y", 0).attr("width", _width).attr("height", "100%").attr("class", "angular-svg-nodes-bg-col-grid-col");
        });

        _lodash2.default.map(controller.initial_state, function (row, rowi) {

            var _row_svg = _wrapper.append("svg:svg").attr("x", 0).attr("y", 0);

            _lodash2.default.map(row.columns, function (col, coli) {

                var _col_svg = _row_svg.append("svg:svg").attr("class", "angular-svg-nodes-col");

                var _line_source_lock_coords = NodeUtils.getNodeCoords(rowi, coli, _nodeSettings.NODE_BOTTOM, _config);

                _lodash2.default.map(col.connections, function (line, linei) {

                    var _line_target_coords = [linei, rowi + 1];
                    var _line_target_lock_coords = NodeUtils.getNodeCoords(_line_target_coords[1], _line_target_coords[0], _nodeSettings.NODE_TOP, _config);

                    var _line = _col_svg.append("svg:line").attr("x1", _line_source_lock_coords[0]).attr("y1", _line_source_lock_coords[1]).attr("x2", _line_source_lock_coords[0]).attr("y2", _line_source_lock_coords[1]).attr("class", "angular-svg-nodes-line").style("stroke", "red").style("stroke-width", 1).style("stroke-dasharray", 0).transition().delay(1).attr("x2", _line_target_lock_coords[0]).attr("y2", _line_target_lock_coords[1]).duration(1000);
                });

                var _top_left_coords = NodeUtils.getNodeCoords(rowi, coli, _nodeSettings.NODE_TOP_LEFT, _config);

                var _node = _col_svg.append("svg:rect").attr("x", _top_left_coords[0]).attr("y", _top_left_coords[1]).attr("width", _config.node_width).attr("height", _config.node_height).attr("class", "angular-svg-nodes-node");
            });
        });
    }
};
//# sourceMappingURL=sourcemaps/angular-svg-nodes-directive-d3.js.map
