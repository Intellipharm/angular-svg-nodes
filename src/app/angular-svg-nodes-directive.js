import _controller from "./angular-svg-nodes-controller";
import _template from "./angular-svg-nodes.html!text";

export default {
    restrict: 'E',
    scope: {
        api:                                    "<?",
        config_block_width:                     "<?blockWidth",
        config_block_height:                    "<?blockHeight",
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
        initial_state:                          "<?initialState",
        onNodeSelectionCallback:                "&onNodeSelection",
        onNodeDeselectionCallback:              "&onNodeDeselection",
        onNodeConnectionChangeCallback:         "&onNodeConnectionChange",
        onNodeAddedCallback:                    "&onNodeAdded"
    },
    controller:     _controller,
    controllerAs:   "AngularSvgNodes",
    bindToController: true,
    template:       _template,
    link: function(scope, element, attrs, controller) {

        controller.parent_coords = element[0].getBoundingClientRect();

        element.addClass('angular-svg-nodes');

        ////////////////////////////////////////////////
        //
        // handlers
        //
        ////////////////////////////////////////////////

        //----------------------------------
        // mouse up
        //----------------------------------

        element[0].addEventListener("mouseup", controller.onRootDeselect.bind(controller));

        //----------------------------------
        // mouse leave
        //----------------------------------

        element[0].addEventListener("mouseleave", controller.onRootMouseLeave.bind(controller));

    }
};