import * as d3 from 'd3';
import _ from 'lodash';

// local: constants
import {
    HIGHLIGHT_NODE_ON_SELECT,
    HIGHLIGHT_NODE_ON_DESELECT,
    HIGHLIGHT_NODE_ON_ADD,
    DEFAULT_HIGHLIGHT_NODE_ON,
    DEFAULT_INITIAL_GRID_COLS,
    DEFAULT_INITIAL_GRID_ROWS,
    DEFAULT_NODE_WIDTH,
    DEFAULT_NODE_HEIGHT,
    DEFAULT_COL_SPACING,
    DEFAULT_ROW_SPACING,
    DEFAULT_LABEL_SPACING,
    DEFAULT_DISABLE_CONTROL_NODES,
    DEFAULT_MAX_VIEWPORT_WIDTH_INCREASE,
    DEFAULT_MAX_VIEWPORT_HEIGHT_INCREASE
} from "./angular-svg-nodes-settings";
import {
    NODE_TOP_LEFT,
    NODE_TOP,
    NODE_CENTER,
    NODE_BOTTOM,
    DEFAULT_NEW_NODE_LABEL
} from "./node/node-settings";

// local: services
import * as NodeUtils from './node/node-utils';

function calculateColX(index, config) {
    if (index === 0) {
        return 0;
    }
    let first_col_width = config.node_width + (config.col_spacing / 2);
    let col_width = config.node_width + (config.col_spacing);
    return first_col_width + ((index - 1) * col_width);
}

function calculateColWidth(index, config) {
    let total_item_width = index === 0 ? config.node_width + (config.col_spacing / 2) : config.node_width + config.col_spacing;
    return total_item_width;
}

export default {
    restrict: 'E',
    scope: {
        api:                                    "<?",
        config_node_width:                      "<?nodeWidth",
        config_node_height:                     "<?nodeHeight",
        config_col_spacing:                     "<?colSpacing",
        config_disable_control_nodes:           "<?disableControlNodes",
        config_highlight_node_on:               "<?highlightNodeOn",
        config_initial_grid_cols:               "<?initialGridCols",
        config_initial_grid_rows:               "<?initialGridRows",
        config_label_spacing:                   "<?labelSpacing",
        config_max_viewport_width_increase:     "<?maxViewportWidthIncrease",
        config_max_viewport_height_increase:    "<?maxViewportHeightIncrease",
        config_new_node_label:                  "<?newNodeLabel",
        config_row_spacing:                     "<?rowSpacing",
        initial_state:                          "<?initialState"
    },
    controller: () => {

    },
    controllerAs:       "AngularSvgNodesD3",
    bindToController:   true,
    template: '<div id="angular-svg-nodes-wrapper" class="angular-svg-nodes-wrapper" ng-style="AngularSvgNodes.wrapper_style">',
    link: (scope, element, attrs, controller) => {

        let _config = {
            new_node_label:                 !_.isUndefined(controller.config_new_node_label) ? controller.config_new_node_label : "NEW NODE",
            initial_grid_cols:              !_.isUndefined(controller.config_initial_grid_cols) ? controller.config_initial_grid_cols : DEFAULT_INITIAL_GRID_COLS,
            initial_grid_rows:              !_.isUndefined(controller.config_initial_grid_rows) ? controller.config_initial_grid_rows : DEFAULT_INITIAL_GRID_ROWS,
            highlight_node_on:              !_.isUndefined(controller.config_highlight_node_on) ? controller.config_highlight_node_on : DEFAULT_HIGHLIGHT_NODE_ON,
            node_width:                     !_.isUndefined(controller.config_node_width) ? controller.config_node_width : DEFAULT_NODE_WIDTH,
            node_height:                    !_.isUndefined(controller.config_node_height) ? controller.config_node_height : DEFAULT_NODE_HEIGHT,
            col_spacing:                    !_.isUndefined(controller.config_col_spacing) ? controller.config_col_spacing : DEFAULT_COL_SPACING,
            row_spacing:                    !_.isUndefined(controller.config_row_spacing) ? controller.config_row_spacing : DEFAULT_ROW_SPACING,
            label_spacing:                  !_.isUndefined(controller.config_label_spacing) ? controller.config_label_spacing : DEFAULT_LABEL_SPACING,
            disable_control_nodes:          !_.isUndefined(controller.config_disable_control_nodes) ? controller.config_disable_control_nodes : DEFAULT_DISABLE_CONTROL_NODES,
            max_viewport_width_increase:    !_.isUndefined(controller.config_max_viewport_width_increase) ? controller.config_max_viewport_width_increase : DEFAULT_MAX_VIEWPORT_WIDTH_INCREASE,
            max_viewport_height_increase:   !_.isUndefined(controller.config_max_viewport_height_increase) ? controller.config_max_viewport_height_increase : DEFAULT_MAX_VIEWPORT_HEIGHT_INCREASE
        };

        let _cols = _config.initial_grid_cols;
        let _rows = 4;//_config.initial_grid_rows;

        let _total_item_width = _config.node_width + _config.col_spacing;
        let _total_item_height = _config.node_height + _config.row_spacing;

        let _viewport_width = _total_item_width * _cols;
        let _viewport_height = _total_item_height * _rows;

        controller.wrapper_style = {
            'max-width': (_viewport_width + _config.max_viewport_width_increase) + "px",
            'min-width': _viewport_width + "px",
            'max-height': (_viewport_height + (_config.max_viewport_height_increase * _rows)) + "px",
            'min-height': _viewport_height + "px"
        };

        // var _wrapper = d3.select(element[0]) // TODO: do this when we can remove wrapper
        var _wrapper = d3.select("#angular-svg-nodes-wrapper")
            .append("svg:svg")
            .attr("version", "1.1")
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", " 0 0 " + _viewport_width + " " + _viewport_height)
            .attr("width", "100%")
            .style("stroke", "rgb(6,120,155)")
            .style("background-color", "#ccc")
            .style("min-width", _viewport_width + "px")
            .style("min-height", _viewport_height + "px");

        let _grid_col_count = 4;

        // bg column grid

        _.map(new Array(_grid_col_count), (bgcol, bgcoli) => {

            let _x = calculateColX(bgcoli, _config);
            let _width = calculateColWidth(bgcoli, _config);

            let _bg_col_svg = _wrapper.append("svg:svg");

            let _bg_col_rect_svg = _bg_col_svg.append("svg:rect")
                .attr("x", _x)
                .attr("y", 0)
                .attr("width", _width)
                .attr("height", "100%")
                .attr("class", "angular-svg-nodes-bg-col-grid-col");
        });

        // rows

        _.map(controller.initial_state, (row, rowi) => {

            let _row_svg = _wrapper.append("svg:svg")
                .attr("x", 0)
                .attr("y", 0);

            // columns

            _.map(row.columns, (col, coli) => {

                let _col_svg = _row_svg.append("svg:svg")
                    .attr("class", "angular-svg-nodes-col");

                // lines

                let _line_source_lock_coords = NodeUtils.getNodeCoords(rowi, coli, NODE_BOTTOM, _config);

                _.map(col.connections, (line, linei) => {

                    let _line_target_coords = [ linei, rowi + 1 ];
                    let _line_target_lock_coords = NodeUtils.getNodeCoords(_line_target_coords[1], _line_target_coords[0], NODE_TOP, _config);

                    let _line = _col_svg.append("svg:line")
                        .attr("x1", _line_source_lock_coords[0])
                        .attr("y1", _line_source_lock_coords[1])
                        .attr("x2", _line_source_lock_coords[0])
                        .attr("y2", _line_source_lock_coords[1])
                        .attr("class", "angular-svg-nodes-line")
                        .style("stroke", "red")
                        .style("stroke-width", 1)
                        .style("stroke-dasharray", 0)
                        .transition()
                        .delay(1)
                        .attr("x2", _line_target_lock_coords[0])
                        .attr("y2", _line_target_lock_coords[1])
                        .duration(1000);
                });

                // node

                let _top_left_coords = NodeUtils.getNodeCoords(rowi, coli, NODE_TOP_LEFT, _config);

                let _node = _col_svg.append("svg:rect")
                    .attr("x", _top_left_coords[0])
                    .attr("y", _top_left_coords[1])
                    .attr("width", _config.node_width)
                    .attr("height", _config.node_height)
                    .attr("class", "angular-svg-nodes-node");
            });
        });
    }
};