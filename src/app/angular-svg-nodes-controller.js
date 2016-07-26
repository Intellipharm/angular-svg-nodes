// local: constants
import {
    BLOCK_TOP_LEFT,
    BLOCK_TOP,
    BLOCK_CENTER,
    BLOCK_BOTTOM,
    HIGHLIGHT_NODE_ON_SELECT,
    HIGHLIGHT_NODE_ON_DESELECT,
    HIGHLIGHT_NODE_ON_ADD,
    DEFAULT_NEW_NODE_LABEL,
    DEFAULT_HIGHLIGHT_NODE_ON,
    DEFAULT_INITIAL_GRID_COLS,
    DEFAULT_INITIAL_GRID_ROWS,
    DEFAULT_BLOCK_WIDTH,
    DEFAULT_BLOCK_HEIGHT,
    DEFAULT_COL_SPACING,
    DEFAULT_ROW_SPACING,
    DEFAULT_LABEL_SPACING,
    DEFAULT_DISABLE_CONTROL_NODES,
    DEFAULT_MAX_VIEWPORT_WIDTH_INCREASE,
    DEFAULT_MAX_VIEWPORT_HEIGHT_INCREASE
} from "./angular-svg-nodes-settings";

// local: services
import * as Utils from './angular-svg-nodes-utils';
import * as ApiValidator from './api/api-validator';

export default class AngularSvgNodesController {

    constructor($s) {

        this.$s = $s;

        //-----------------------------
        // directives vars
        //-----------------------------
        //
        // this.initial_state
        // this.api
        //
        //-----------------------------

        if (_.isUndefined(this.api)) {
            this.api = {};
        }

        //-----------------------------
        // state
        //-----------------------------

        this.state = [];

        //-----------------------------
        // config
        //-----------------------------

        // TODO: validate highlight node on array (remove invalid options)

        this.config = {
            new_node_label: !_.isUndefined(this.config_new_node_label) ? this.config_new_node_label : DEFAULT_NEW_NODE_LABEL,
            initial_grid_cols: !_.isUndefined(this.config_initial_grid_cols) ? this.config_initial_grid_cols : DEFAULT_INITIAL_GRID_COLS,
            initial_grid_rows: !_.isUndefined(this.config_initial_grid_rows) ? this.config_initial_grid_rows : DEFAULT_INITIAL_GRID_ROWS,
            highlight_node_on: !_.isUndefined(this.config_highlight_node_on) ? this.config_highlight_node_on : DEFAULT_HIGHLIGHT_NODE_ON,
            block_width: !_.isUndefined(this.config_block_width) ? this.config_block_width : DEFAULT_BLOCK_WIDTH,
            block_height: !_.isUndefined(this.config_block_height) ? this.config_block_height : DEFAULT_BLOCK_HEIGHT,
            col_spacing: !_.isUndefined(this.config_col_spacing) ? this.config_col_spacing : DEFAULT_COL_SPACING,
            row_spacing: !_.isUndefined(this.config_row_spacing) ? this.config_row_spacing : DEFAULT_ROW_SPACING,
            label_spacing: !_.isUndefined(this.config_label_spacing) ? this.config_label_spacing : DEFAULT_LABEL_SPACING,
            disable_control_nodes: !_.isUndefined(this.config_disable_control_nodes) ? this.config_disable_control_nodes : DEFAULT_DISABLE_CONTROL_NODES,
            max_viewport_width_increase: !_.isUndefined(this.config_max_viewport_width_increase) ? this.config_max_viewport_width_increase : DEFAULT_MAX_VIEWPORT_WIDTH_INCREASE,
            max_viewport_height_increase: !_.isUndefined(this.config_max_viewport_height_increase) ? this.config_max_viewport_height_increase : DEFAULT_MAX_VIEWPORT_HEIGHT_INCREASE
        };

        //-----------------------------
        // control
        //-----------------------------

        this.is_initialising = false;

        // allows onNodeDeselection to decide whether or not to fire external callback straight after onConnectionChange callback was fired
        this.was_connection_change_called = false;
        this.is_connection_change_busy = false;

        // an array of block coords that will be set as connected on teh line
        this.blocks_waiting_for_connection = [];

        // parent coordinates (for reference)
        this.parent_coords = [];

        // view coordinates (for reference)
        this.coords = [];

        // view element data
        this.blocks = [];

        // array for bg grid
        this.bg_col_grid = [];
        this.bg_col_grid_hover_index = null;

        // grid dimmensions
        this.grid_col_count = this.config.initial_grid_cols;
        this.grid_row_count = this.config.initial_grid_rows;
        this.label_width = this.config.block_width - (this.config.label_spacing * 2);
        this.label_height = this.config.block_height - (this.config.label_spacing * 2);

        // viewport style & bounds
        this.wrapper_style = "";
        this.viewport_style = "";
        this.viewport_width = 0;
        this.viewport_height = 0;
        this.viewport_viewbox = "";

        // node selections
        this.selection = [];
        this.source_exit_side = null;

        // active node
        this.selected_node = [];

        // highlighted selected node
        this.highlight_selected_node = {};

        this.new_node = {};

        ////////////////////////////////////////////////
        //
        // watchers
        //
        ////////////////////////////////////////////////

        this.$s.$watch('AngularSvgNodes.selection', (newValue, oldValue) => {

            if (_.isUndefined(newValue)) {
                return;
            }

            // two selected & target is child of source
            if (newValue.length === 2 && newValue[1][1] > newValue[0][1]) {

                // new target selection
                if (newValue.length > oldValue.length) {

                    // add line
                    this.addLine(this.selection[0], this.selection[1]);
                }

                // updated target selection
                else {

                    // update line
                    this.updateLineTarget(this.selection[0], this.selection[1]);
                }
            }
        }, true);

        this.$s.$watch('AngularSvgNodes.initial_state', (newValue, oldValue) => {

            this.init();
        });

        ////////////////////////////////////////////////
        //
        // api
        //
        ////////////////////////////////////////////////

        /**
         * addRow
         *
         * @param label
         */
        this.api.addRow = (label = "") => {

            let _row_index = this.blocks.length;
            let _col_index = 0;

            this.addBlock(_col_index, _row_index, label, []);
            this.addControl(_row_index);
        };

        /**
         * removeNode
         *
         * @param _row_index
         * @param _col_index
         */
        this.api.removeNode = (row_index, col_index) => {

            if (!ApiValidator.areApiCoordsValid(this.blocks, row_index, col_index)) {
                return;
            }

            this.removeBlock(col_index, row_index);
        };

        /**
         * insertNode
         *
         * @param row_index
         * @param col_index
         * @param label
         * @param connections
         */
        this.api.insertNode = (row_index, col_index, label, connections) => {

            if (!ApiValidator.areApiCoordsValidForInsert(this.blocks, row_index, col_index)) {
                return;
            }
            if (!ApiValidator.areApiConnectionsValid(this.blocks, row_index - 1, connections)) {
                return;
            }

            this.insertBlock(col_index, row_index, label, connections);
        };

        /**
         * updateNodeConnections
         *
         * @param row_index
         * @param col_index
         * @param connections
         */
        this.api.updateNodeConnections = (row_index, col_index, connections) => {

            if (!ApiValidator.areApiCoordsValid(this.blocks, row_index, col_index)) {
                return;
            }
            if (!ApiValidator.areApiConnectionsValid(this.blocks, row_index, connections)) {
                return;
            }

            let _label = this.blocks[row_index].columns[col_index].label;
            let _lines = _.map(this.blocks[row_index].columns[col_index].lines, (line) => {
                return _.has(line, 'to') ? line.to[0] : line;
            });
            let _connections = _.uniq([..._lines, ...connections]);

            this.updateBlock(col_index, row_index, _label, _connections);
        };

        /**
         * setNodeLabel
         *
         * @param row_index
         * @param col_index
         * @param label
         */
        this.api.setNodeLabel = (row_index, col_index, label) => {

            if (!ApiValidator.areApiCoordsValid(this.blocks, row_index, col_index)) {
                return;
            }

            this.updateBlock(col_index, row_index, label);
        };

        /**
         * setNodeHighlight
         *
         * @param row_index
         * @param col_index
         * @param value
         */
        this.api.setNodeHighlight = (row_index, col_index, value) => {

            if (!ApiValidator.areApiCoordsValid(this.blocks, row_index, col_index)) {
                return;
            }

            this.blocks[row_index].columns[col_index].highlight = value;
        };
    }

    ////////////////////////////////////////////////
    //
    // init
    //
    ////////////////////////////////////////////////

    /**
     * init
     */
    init() {

        this.is_initialising = true;

        // resets
        this.blocks = [];

        let _column_property_name = 'columns';
        let _data = !_.isUndefined(this.initial_state) ?  this.initial_state : [];

        // add placeholders
        for (var row_index = 0; row_index < this.config.initial_grid_rows; row_index++) {

            // add data placeholder
            if (row_index >= _data.length) {
                _data.push({columns: []});
            }
        }

        // add blocks
        _.forEach(_data, (row, row_index) => {

            _.forEach(row[ _column_property_name ], (col, col_index) => {

                this.addBlock(col_index, row_index, col.label, col.join, col);
            });

            this.addControl(row_index);
        });

        // add bg_col_grid array
        _.map(new Array(this.grid_col_count), (col, index) => {
            this.addBgGridCol(index);
        });

        this.setViewport(this.grid_col_count, this.grid_row_count);

        this.checkActive();

        this.update(_data, _column_property_name);

        this.is_initialising = false;
    }

    ////////////////////////////////////////////////
    //
    // handlers
    //
    ////////////////////////////////////////////////

    //-----------------------------
    // general
    //-----------------------------

    /**
     * onNodeSelect
     *
     * @param col_index
     * @param row_index
     * @returns {boolean}
     */
    onNodeSelect(col_index, row_index) {

        // if control
        if (this.blocks[row_index].columns[col_index].control) {
            if (!this.config.disable_control_nodes) {
                this.onControlNodeSelect(col_index, row_index);
            }
            return true;
        }

        // if block
        this.onBlockNodeSelect(col_index, row_index);

        // highlight node
        // ... if configured to do so
        if (_.includes(this.config.highlight_node_on, HIGHLIGHT_NODE_ON_SELECT)) {

            // remove existing node highlight
            if (_.has(this.highlight_selected_node, 'row_index')) {
                this.blocks[ this.highlight_selected_node.row_index ].columns[ this.highlight_selected_node.col_index ].selected = false;
            }

            // set highlighted selected node
            this.highlight_selected_node.row_index = row_index;
            this.highlight_selected_node.col_index = col_index;

            // highlight node
            this.blocks[row_index].columns[col_index].selected = true;
        }

        // external callback
        if (!_.isUndefined(this.onNodeSelectionCallback)) {
            this.onNodeSelectionCallback({ col_index, row_index });
        }
    }

    /**
     * onNodeDeselect
     *
     * @param col_index
     * @param row_index
     * @returns {boolean}
     */
    onNodeDeselect(col_index, row_index) {

        // if control
        if (this.blocks[row_index].columns[col_index].control) {
            return false;
        }

        // if block
        this.onBlockNodeDeselect(col_index, row_index);

        let _is_new_node = _.isEqual(this.new_node, {row_index, col_index});

        // highlight node
        // ... if configured to do so
        // ... and node is not new node (just added)
        // ... and connection change callback was not just called
        // ... and connection change is not busy (happens on line remove)

        if (_.includes(this.config.highlight_node_on, HIGHLIGHT_NODE_ON_DESELECT) && !_is_new_node && !this.was_connection_change_called && !this.is_connection_change_busy) {

            // remove existing node highlight
            if (_.has(this.highlight_selected_node, 'row_index')) {
                this.blocks[ this.highlight_selected_node.row_index ].columns[ this.highlight_selected_node.col_index ].selected = false;
            }

            // set highlighted selected node
            this.highlight_selected_node.row_index = row_index;
            this.highlight_selected_node.col_index = col_index;

            // highlight node
            this.blocks[row_index].columns[col_index].selected = true;
        }

        // external callback
        // ... if connection change callback was not just called
        // ... and connection change is not busy (happens on line remove)

        if (!_.isUndefined(this.onNodeDeselectionCallback) && !_is_new_node && !this.was_connection_change_called && !this.is_connection_change_busy) {
            this.onNodeDeselectionCallback({ col_index, row_index });
        }

        this.new_node = {}; // reset
        this.was_connection_change_called = false; // reset
    }

    /**
     * onNodeMouseOver
     *
     * @param col_index
     * @param row_index
     * @returns {boolean}
     */
    onNodeMouseOver(col_index, row_index) {

        // if control
        if (this.blocks[row_index].columns[col_index].control) {
            this.onControlNodeMouseOver(col_index, row_index);
            return true;
        }

        // if block
        this.onBlockNodeMouseOver(col_index, row_index);
    }

    /**
     * onNodeMouseOut
     *
     * @param col_index
     * @param row_index
     * @param exit_side
     * @returns {boolean}
     */
    onNodeMouseOut(col_index, row_index, exit_side) {

        // if control
        if (this.blocks[row_index].columns[col_index].control) {
            this.onControlNodeMouseOut(col_index, row_index);
            return true;
        }

        // if block
        this.onBlockNodeMouseOut(col_index, row_index, exit_side);
    }

    //-------------------------------------------------
    // control node handlers
    //-------------------------------------------------

    /**
     * onControlNodeSelect
     *
     * @param col_index
     * @param row_index
     */
    onControlNodeSelect(col_index, row_index) {

        let _label = _.isFunction(this.config.new_node_label) ? this.config.new_node_label(row_index, col_index) : this.config.new_node_label;

        this.addBlock(col_index, row_index, _label, []);

        this.$s.$apply();
    }

    /**
     * onControlNodeMouseOver
     *
     * @param col_index
     * @param row_index
     */
    onControlNodeMouseOver(col_index, row_index) {

        // disallow if selection
        if (this.selection.length > 0) {
            return false;
        }

        // styles
        this.setNodeClass(col_index, row_index, 'control_hover', true);

        this.$s.$apply();
    }

    /**
     * onControlNodeMouseOut
     *
     * @param col_index
     * @param row_index
     * @returns {boolean}
     */
    onControlNodeMouseOut(col_index, row_index) {

        // disallow if selection
        if (this.selection.length > 0) {
            return false;
        }

        // styles
        this.setNodeClass(col_index, row_index, 'control_hover', false);

        this.$s.$apply();
    }

    //-------------------------------------------------
    // block node handlers
    //-------------------------------------------------

    /**
     * onBlockNodeSelect
     *
     * @param col_index
     * @param row_index
     */
    onBlockNodeSelect(col_index, row_index) {

        //-------------------------
        // styles
        //-------------------------

        this.setNodeClass(col_index, row_index, 'source_hover', false);
        this.setNodeClass(col_index, row_index, 'source', true);
        this.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', false);
        this.setPotentialNodeClasses(col_index, row_index, 'potential_target', true);

        //-------------------------
        // selection updates
        //-------------------------

        // set selection
        this.selection = [[col_index, row_index]];
        this.selected_node = [col_index, row_index];

        this.$s.$apply();
    }

    /**
     * onBlockNodeDeselect
     *
     * @param col_index
     * @param row_index
     */
    onBlockNodeDeselect(col_index, row_index) {

        // reset last exit side
        this.source_exit_side = null;

        //-------------------------
        // styles
        //-------------------------

        // if one selection
        if (this.selection.length === 1) {

            // if deselecting on current source
            if (_.isEqual(this.selection[0], [col_index, row_index])) {

                this.setNodeClass(col_index, row_index, 'source', false);
                this.setNodeClass(col_index, row_index, 'source_hover', true);
                this.setPotentialNodeClasses(col_index, row_index, 'potential_target', false);
                this.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', true);
            }
        }

        // if two selections
        else if (this.selection.length === 2) {

            // if deselecting on current target (& is potential ?)
            if (_.isEqual(this.selection[1], [col_index, row_index])) {

                this.setNodeClass(col_index, row_index, 'target', false);

                // if  block has no parent connections
                if (!this.doesNodeHaveConnectedParents(col_index, row_index)) {
                    this.setPotentialNodeClasses(col_index, row_index, 'potential_target', false);
                }

                // check active
                this.checkActive();
            }
        }

        //-------------------------
        // line updates
        //-------------------------

        // if 2 selections
        if (this.selection.length === 2) {

            // if deselecting on current target & is potential
            if (_.isEqual(this.selection[1], [col_index, row_index]) && this.isNodePotential(this.selection[0], [col_index, row_index])) {

                var is_target_parent = this.selection[0][1] > row_index;

                // if target is parent then remove line
                if (is_target_parent) {
                    this.removeLine(this.selection[1], this.selection[0]);
                }

                // if target is child then setAsConnected line
                else {
                    this.setAsConnectedLines(this.selection, "A");

                    // check active
                    this.checkActive();
                }
            }
        }
    }

    /**
     * onBlockNodeMouseOver
     *
     * @param col_index
     * @param row_index
     */
    onBlockNodeMouseOver(col_index, row_index) {

        //-------------------------
        // styles
        //-------------------------

        // if no selection
        if (this.selection.length === 0) {

            this.setNodeClass(col_index, row_index, 'source_hover', true);
            this.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', true);
        }

        // if two selections
        if (this.selection.length === 2) {

            // if potential
            if (this.isNodePotential(this.selection[0], [col_index, row_index])) {

                this.setNodeClass(col_index, row_index, 'potential_target', false);
                this.setNodeClass(col_index, row_index, 'target', true);
                this.setLineClass(this.selection[0], [col_index, row_index], 'target', true);
            }
        }

        // if col changed
        if (this.bg_col_grid_hover_index !== col_index) {

            //this.bg_col_grid_hover_index = col_index;

            //-------------------------
            // selection updates
            //-------------------------

            // if 2 selections and new col index is potential
            //if (this.selection.length === 2 && this.isNodePotential(this.selection[0], [col_index, this.selection[1][1]])) {
            //    this.selection[1][0] = col_index;
            //}
        }

        this.$s.$apply();
    }

    /**
     * onBlockNodeMouseOut
     *
     * @param col_index
     * @param row_index
     * @param exit_side
     * @returns {boolean}
     */
    onBlockNodeMouseOut(col_index, row_index, exit_side) {

        //-------------------------
        // styles
        //-------------------------

        // if no selections
        if (this.selection.length === 0) {

            this.setNodeClass(col_index, row_index, 'source_hover', false);
            this.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', false);
        }

        // if two selections
        else if (this.selection.length === 2) {

            // if potential
            if (this.isNodePotential(this.selection[0], [col_index, row_index])) {

                this.setNodeClass(col_index, row_index, 'target', false);
                this.setNodeClass(col_index, row_index, 'potential_target', true);
                this.setLineClass(this.selection[0], [col_index, row_index], 'target', false);
            }
        }

        // if this is source selection & source_exit_side not yet set
        if (_.isEqual(this.selection[0], [col_index, row_index]) && _.isNull(this.source_exit_side)) {

            // if exited top
            if (exit_side === 'top') {

                // remove 'potential child' class from potential children
                this.setPotentialChildNodeClasses(col_index, row_index, 'potential_target', false);
            }

            // if exited bottom
            else if (exit_side === 'bottom') {

                // remove 'potential child' class from potential parent
                this.setPotentialParentNodeClasses(col_index, row_index, 'potential_target', false);
            }
        }

        //-------------------------
        // selection updates
        //-------------------------

        // if one selection one selected
        if (this.selection.length === 1) {

            // if this is source selection
            if (_.isEqual(this.selection[0], [col_index, row_index])) {

                // update source exit side
                this.source_exit_side = exit_side;
            }

            var target_coords;

            // if exited top
            if (exit_side === 'top') {

                target_coords = [this.bg_col_grid_hover_index, row_index - 1];

                // if target is potential
                if (this.isNodePotential([col_index, row_index], target_coords)) {
                    this.selection.push(target_coords);
                }
            }

            // if exited bottom
            else if (exit_side === 'bottom') {

                var target_row_index = row_index + 1;
                target_coords = [this.bg_col_grid_hover_index, target_row_index];

                // if not spanning more than one row && target is potential
                if (Math.abs(this.selection[0][1] - target_row_index) <= 1 && this.isNodePotential([col_index, row_index], target_coords)) {

                    this.selection.push(target_coords);
                }

            }
        }

        this.$s.$apply();
    }

    //-------------------------------------------------
    // grid handlers
    //-------------------------------------------------

    /**
     * onRootDeselect
     */
    onRootDeselect() {

        // reset source_exit_side
        this.source_exit_side = null;

        // nothing to do if there are no selections
        if (this.selection.length === 0) {
            return true;
        }

        //-------------------------
        // styles
        //-------------------------

        // if selections
        if (this.selection.length > 0) {

            this.setNodeClass(this.selection[0][0], this.selection[0][1], 'source', false);
            this.setPotentialNodeClasses(this.selection[0][0], this.selection[0][1], 'target', false);
            this.setPotentialNodeClasses(this.selection[0][0], this.selection[0][1], 'potential_target', false);
        }

        //-------------------------
        // line updates
        //-------------------------

        // if 2 selections
        if (this.selection.length === 2) {

            // remove Unconnected lines
            this.removeUnconnectedLines(this.selection);
        }

        //-------------------------
        // selection updates
        //-------------------------

        // reset if there are not 2 selections
        if (this.selection.length > 0) {
            this.selection = [];
        }

        this.$s.$apply();
    }

    /**
     * onBgColGridMouseOver
     */
    onBgColGridMouseOver(index) {

        // do nothing if unchanged
        if (this.bg_col_grid_hover_index === index) {
            return true;
        }

        this.bg_col_grid_hover_index = index;

        //-------------------------
        // selection updates
        //-------------------------

        // if 1 selection
        if (this.selection.length === 1) {

            var target_coords = this.source_exit_side === 'top' ? [index, this.selection[0][1] - 1] : [index, this.selection[0][1] + 1];

            // if target is potential
            if (this.isNodePotential(this.selection[0], target_coords)) {
                this.selection.push(target_coords);
            }
        }

        // if 2 selections and new col index is potential
        else if (this.selection.length === 2 && this.isNodePotential(this.selection[0], [index, this.selection[1][1]])) {
            this.selection[1][0] = index;
        }

        this.$s.$apply();
    }

    /**
     * onRootMouseLeave
     *
     * @param e
     */
    onRootMouseLeave() {

        //-------------------------
        // styles
        //-------------------------

        // if 1 selection
        if (this.selection.length === 1) {

            this.setNodeClass(this.selection[0][0], this.selection[0][1], 'source', false);
            this.setPotentialNodeClasses(this.selection[0][0], this.selection[0][1], 'potential_target', false);
        }

        // if 2 selections
        else if (this.selection.length === 2) {

            this.setNodeClass(this.selection[0][0], this.selection[0][1], 'source', false);
            this.setNodeClass(this.selection[1][0], this.selection[1][1], 'target', false);
            this.setPotentialNodeClasses(this.selection[0][0], this.selection[0][1], 'potential_target', false);
        }

        //-------------------------
        // line updates
        //-------------------------

        // if 2 selections
        if (this.selection.length === 2) {

            // remove Unconnected lines
            this.removeUnconnectedLines(this.selection);
        }

        //-------------------------
        // selection updates
        //-------------------------

        this.selection = [];

        this.$s.$apply();
    }

    //-------------------------------------------------
    // line handlers
    //-------------------------------------------------

    /**
     * onLineRemoveComplete
     *
     * @param source_coords
     * @param target_coords
     * @param line_index
     */
    onLineRemoveComplete(source_coords, target_coords, line_index) {

        // update data
        //this.state[source_coords[1]].columns[source_coords[0]].join.splice(line_index, 1);

        // update blocks
        var source = this.blocks[source_coords[1]].columns[source_coords[0]];

        let _was_line_connected = source.lines[ line_index ].connected;

        // delete line
        source.lines.splice(line_index, 1);

        // if source block has no more lines then setAsNotConnected
        if (source.lines.length === 0) {

            // if  block has no parent connections
            if (!this.doesNodeHaveConnectedParents(source_coords[0], source_coords[1])) {
                this.setAsNotConnectedBlock([source_coords[0], source_coords[1]]);
            }
        }

        // external callback
        // ... if line was connected
        // ... dotted temp line used for showing intended target is not connected, and it's removal should not trigger callback
        if (!_.isUndefined(this.onNodeConnectionChangeCallback) && _was_line_connected) {

            // don't need to set here because this happens after onNodeDeselection
            // this.was_connection_change_called = true;

            let _params = {
                source_row_index: source_coords[1],
                source_col_index: source_coords[0],
                target_row_index: target_coords[1],
                target_col_index: target_coords[0],
                is_connected: false
            };
            this.onNodeConnectionChangeCallback(_params);
        }

        this.is_connection_change_busy = false;

        this.$s.$apply();
    }

    /**
     * onLineDrawComplete
     *
     * @param source_coords
     * @param target_coords
     * @param line_index
     */
    onLineDrawComplete(source_coords, target_coords) {

        var is_block_waiting_for_connection = false;

        _.forEach(this.blocks_waiting_for_connection, (block, index) => {
            if (_.isEqual(block, target_coords)) {
                is_block_waiting_for_connection = true;
                this.blocks_waiting_for_connection.splice(index, 1);
                return false;
            }
        });

        if (is_block_waiting_for_connection) {

            // connect block
            this.setAsConnectedBlock(target_coords);

            // check active
            this.checkActive();
        }

        this.$s.$apply();
    }

    ////////////////////////////////////////////////
    //
    // utils
    //
    ////////////////////////////////////////////////

    //-----------------------------
    // active check
    //-----------------------------

    /**
     * checkActive
     */
    checkActive() {

        if (this.blocks.length === 0) {
            return false;
        }

        _.forEach(this.blocks[0].columns, (col, col_index) => {
            if (col.lines.length > 0) {
                this.activateBlock(col_index, 0);
            }
        });
    }

    /**
     * activateBlock
     *
     * @param col_index
     * @param row_index
     */
    activateBlock(col_index, row_index) {

        var block = this.blocks[row_index].columns[col_index];
        block.active = true;

        if (block.lines.length > 0) {

            _.forEach(block.lines, (line) => {

                // activate line
                line.active = true;

                // activate target block
                this.activateBlock(line.to[0], line.to[1]);
            });
        }
    }

    /**
     * deactivateBlock
     *
     * @param col_index
     * @param row_index
     */
    deactivateBlock(col_index, row_index) {

        var block = this.blocks[row_index].columns[col_index];
        block.active = false;

        if (block.lines.length > 0) {
            _.forEach(block.lines, (line) => {

                // deactivate line
                line.active = false;

                var does_parent_have_active_nodes = this.doesNodeHaveActiveParents(line.to[0], line.to[1]);

                // deactivate target block if no active parents
                if (!does_parent_have_active_nodes) {
                    this.deactivateBlock(line.to[0], line.to[1]);
                }
            });
        }
    }

    //-----------------------------
    // node potential
    //-----------------------------

    /**
     * doesNodeHaveActiveParents
     *
     * @param col_index
     * @param row_index
     * @param exclude_coords
     */
    doesNodeHaveActiveParents(col_index, row_index, exclude_coords) {

        if (row_index === 0) {
            return false;
        }

        var result = false;
        var parent_row_index = row_index - 1;
        var parents = this.blocks[parent_row_index].columns;

        _.forEach(parents, (parent, parent_col_index) => {
            _.forEach(parent.lines, (line) => {

                // if parent coords are not equal to exclude coords
                // ... and parent has a line to this block
                // ... and parent is active
                if (!_.isEqual([parent_col_index, parent_row_index], exclude_coords) && _.isEqual(line.to, [col_index, row_index]) && parent.active) {
                    result = true;
                }
            });
        });

        return result;
    }

    /**
     * doesNodeHaveConnectedParents
     *
     * @param col_index
     * @param row_index
     * @param exclude_coords
     */
    doesNodeHaveConnectedParents(col_index, row_index, exclude_coords) {

        if (row_index === 0) {
            return false;
        }

        if (_.isUndefined(exclude_coords)) {
            exclude_coords = [];
        }

        var result = false;
        var parent_row_index = row_index - 1;
        var parents = this.blocks[parent_row_index].columns;

        _.forEach(parents, (parent, parent_col_index) => {

            // if parent coords are not equal to exclude coords and parent is potential (potential parent node is always connected)
            if (!_.isEqual([parent_col_index, parent_row_index], exclude_coords) && this.isNodePotential([col_index, row_index], [parent_col_index, parent_row_index])) {

                result = true;
                return false;
            }
        });

        return result;
    }

    /**
     * isNodePotential
     *
     * @param source_coords
     * @param target_coords
     */
    isNodePotential(source_coords, target_coords) {

        // if not ready
        if (_.isUndefined(this.blocks[target_coords[1]])) {
            return false;
        }
        if (_.isUndefined(this.blocks[target_coords[1]].columns[target_coords[0]])) {
            return false;
        }

        // refuse if control
        if (this.blocks[target_coords[1]].columns[target_coords[0]].control) {
            return false;
        }

        // refuse if same row
        if (source_coords[1] === target_coords[1]) {
            return false;
        }

        // refuse if spanning more than 1 rows
        if (Math.abs(source_coords[1] - target_coords[1]) > 1) {
            return false;
        }

        // target row index out of bounds check
        if (target_coords[1] >= this.blocks.length) {
            return false;
        }

        // target col index out of bounds check
        if (target_coords[0] >= this.blocks[target_coords[1]].columns.length) {
            return false;
        }

        // check if target is parent or child
        var is_target_parent = target_coords[1] < source_coords[1];
        var source = this.blocks[source_coords[1]].columns[source_coords[0]];
        var target = this.blocks[target_coords[1]].columns[target_coords[0]];
        var result;

        // if target is parent, then check if target has connected lines to source
        if (is_target_parent) {

            result = false;

            // check that last exit was not bottom
            if (this.source_exit_side === 'bottom') {
                return false;
            }

            // check if target has an connected line from it source
            _.forEach(target.lines, (line) => {
                if (line.connected && _.isEqual(line.to, source_coords)) {
                    result = true;
                    return false;
                }
            });
        }

        // if target is child, then
        else {

            result = true;

            // check that last exit was not top
            if (this.source_exit_side === 'top') {
                return false;
            }

            // check if source does not have an connected line to it
            _.forEach(source.lines, (line) => {
                if (line.connected && _.isEqual(line.to, target_coords)) {
                    result = false;
                    return false;
                }
            });
        }

        return result;
    }

    //-----------------------------
    // node classes
    //-----------------------------

    /**
     * setLineClass
     *
     * @param source_coords
     * @param target_coords
     * @param key
     * @param value
     */
    setLineClass(source_coords, target_coords, key, value) {

        // loop child row columns
        _.forEach(this.blocks[source_coords[1]].columns[source_coords[0]].lines, (line) => {

            // if child node is potential then update class property
            if (_.isEqual(line.to, target_coords)) {
                line[key] = value;
            }
        });
    }

    /**
     * setNodeClass
     *
     * @param col_index
     * @param row_index
     * @param key
     * @param value
     */
    setNodeClass(col_index, row_index, key, value) {
        if (_.has(this.blocks[row_index].columns[col_index], key)) {
            this.blocks[row_index].columns[col_index][key] = value;
        }
    }

    /**
     * setPotentialNodeClasses
     *
     * @param col_index
     * @param row_index
     * @param key
     * @param value
     */
    setPotentialNodeClasses(col_index, row_index, key, value) {

        this.setPotentialChildNodeClasses(col_index, row_index, key, value);
        this.setPotentialParentNodeClasses(col_index, row_index, key, value);
    }

    /**
     * setPotentialChildNodeClasses
     *
     * @param col_index
     * @param row_index
     * @param key
     * @param value
     */
    setPotentialChildNodeClasses(col_index, row_index, key, value) {

        // if child row is not out of bounds
        if ((row_index + 1) < (this.blocks.length)) {

            // loop child row columns
            _.forEach(this.blocks[row_index + 1].columns, (child_col, child_col_index) => {

                // if child node is potential then update class property
                if (this.isNodePotential([col_index, row_index], [child_col_index, row_index + 1])) {
                    child_col[key] = value;
                }
            });
        }
    }

    /**
     * setPotentialParentNodeClasses
     *
     * @param col_index
     * @param row_index
     * @param key
     * @param value
     */
    setPotentialParentNodeClasses(col_index, row_index, key, value) {

        if (row_index > 0) {

            // loop parent node columns
            _.forEach(this.blocks[row_index - 1].columns, (parent_col, parent_col_index) => {

                // if parent node is potential then update class property
                if (this.isNodePotential([col_index, row_index], [parent_col_index, row_index - 1])) {
                    parent_col[key] = value;
                }
            });
        }
    }

    //-----------------------------
    // viewport
    //-----------------------------

    /**
     * setViewport
     *
     * @param cols
     * @param rows
     */
    setViewport(cols, rows) {

        var total_item_width = this.config.block_width + this.config.col_spacing;
        var total_item_height = this.config.block_height + this.config.row_spacing;

        this.viewport_width = total_item_width * cols;
        this.viewport_height = total_item_height * rows;

        this.viewport_style = {
            'background-color': "#ccc",
            'min-width': this.viewport_width + "px",
            'min-height': this.viewport_height + "px"
        };

        this.wrapper_style = {
            'max-width': (this.viewport_width + this.config.max_viewport_width_increase) + "px",
            'min-width': this.viewport_width + "px",
            'max-height': (this.viewport_height + (this.config.max_viewport_height_increase * rows)) + "px",
            'min-height': this.viewport_height + "px"
        };

        this.viewport_viewbox = " 0 0 " + this.viewport_width + " " + this.viewport_height;
    }

    /**
     * checkViewport
     *
     * @param col_index
     * @param row_index
     */
    checkViewport(col_index, row_index) {

        var should_update_viewport = false;

        // row bounds check
        if (row_index >= this.grid_row_count) {

            // increase rowspan
            this.grid_row_count++;
            should_update_viewport = true;
        }

        // col bounds check
        if (col_index >= this.grid_col_count) {

            // increase colspan
            this.grid_col_count++;
            should_update_viewport = true;

            // add bg grid col
            this.addBgGridCol(this.grid_col_count - 1);
        }

        // set viewport
        if (should_update_viewport) {
            this.setViewport(this.grid_col_count, this.grid_row_count);
        }
    }

    //-----------------------------
    // coords
    //-----------------------------

    /**
     * calculateColX
     *
     * @param index
     */
    calculateColX(index) {
        if (index === 0) {
            return 0;
        }
        var first_col_width = this.config.block_width + (this.config.col_spacing / 2);
        var col_width = this.config.block_width + (this.config.col_spacing);
        return first_col_width + ((index - 1) * col_width);
    }

    /**
     * calculateColWidth
     *
     * @param index
     */
    calculateColWidth(index) {
        var total_item_width = index === 0 ? this.config.block_width + (this.config.col_spacing / 2) : this.config.block_width + this.config.col_spacing;
        return total_item_width;
    }

    /**
     * calculateRowY
     *
     * @param index
     */
    calculateRowY(index) {
        var row_height = this.config.block_height + this.config.row_spacing;
        return index * row_height;
    }

    /**
     * calculateRowHeight
     *
     * @param index
     */
    calculateRowHeight() {
        return this.config.block_height + this.config.row_spacing;
    }

    //-----------------------------
    // drawing
    //-----------------------------

    /**
     * addLine
     *
     * @param source_coords
     * @param target_coords
     */
    addLine(source_coords, target_coords, connected) {

        // check bounds
        if (target_coords[1] >= this.blocks.length) {
            return false;
        }

        // get coords
        var source_lock_coords = Utils.getNodeCoords(source_coords[1], source_coords[0], BLOCK_BOTTOM, this.config);
        var target_lock_coords = Utils.getNodeCoords(target_coords[1], target_coords[0], BLOCK_TOP, this.config);

        // add line properties
        this.blocks[source_coords[1]].columns[source_coords[0]].lines.push({
            connected: !_.isUndefined(connected) ? connected : false,
            from: source_coords,
            to: target_coords,
            x1: source_lock_coords[0],
            y1: source_lock_coords[1],
            x2: target_lock_coords[0],
            y2: target_lock_coords[1]
        });

        if (connected) {
            // update data
            // this.state[source_coords[1]].columns[source_coords[0]].join.push(target_coords[0]);
        }
    }

    /**
     * updateLineTarget
     *
     * @param source_coords
     * @param target_coords
     */
    updateLineTarget(source_coords, target_coords) {

        // get target lock coords
        var target_lock_coords = Utils.getNodeCoords(target_coords[1], target_coords[0], BLOCK_TOP, this.config);

        // find line
        _.forEach(this.blocks[source_coords[1]].columns[source_coords[0]].lines, (line) => {

            if (_.isEqual(line.from, source_coords) && _.isEqual(line.to, target_coords)) {

                line.x2 = target_lock_coords[0];
                line.y2 = target_lock_coords[1];
                line.to = target_coords;
                return false;
            }
        });
    }

    /**
     * removeLine
     *
     * @param source_coords
     * @param target_coords
     * @param set_as_busy
     */
    removeLine(source_coords, target_coords, set_as_busy) {

        if (set_as_busy) {
            this.is_connection_change_busy = true;
        }

        // get target lock coords
        var target_lock_coords = Utils.getNodeCoords(source_coords[1], source_coords[0], BLOCK_BOTTOM, this.config);

        // find line
        _.forEach(this.blocks[source_coords[1]].columns[source_coords[0]].lines, (line) => {

            if (_.isEqual(line.from, source_coords) && _.isEqual(line.to, target_coords)) {

                var block = this.blocks[target_coords[1]].columns[target_coords[0]];
                var block_has_connected_parents = this.doesNodeHaveConnectedParents(target_coords[0], target_coords[1], source_coords);

                // if block has no lines & has no parent connections
                if (block.lines.length === 0 && !block_has_connected_parents) {
                    // set as not connected
                    this.setAsNotConnectedBlock(target_coords);
                }

                // if block has no parent connections
                var block_has_active_parents = this.doesNodeHaveActiveParents(target_coords[0], target_coords[1], source_coords);

                if (!block_has_active_parents) {

                    // deactivate block
                    this.deactivateBlock(target_coords[0], target_coords[1]);
                }

                // set line properties
                line.x2 = target_lock_coords[0];
                line.y2 = target_lock_coords[1];
                line.previous_to = line.to; // TODO: this feels a bit hacky
                line.to = [source_coords[0], source_coords[1]];
                return false;
            }
        });
    }

    /**
     * removeUnconnectedLines
     *
     * @param selection
     */
    removeUnconnectedLines(selection) {
        _.forEach(this.blocks[selection[0][1]].columns[selection[0][0]].lines, (line) => {
            if (!line.connected) {
                this.removeLine(this.selection[0], this.selection[1]);
            }
        });
    }

    /**
     * setAsConnectedLines
     *
     * @param selection
     */
    setAsConnectedLines(selection) {

        _.forEach(this.blocks[selection[0][1]].columns[selection[0][0]].lines, (line, line_index) => {
            if (!line.connected) {

                // setAsConnected line
                line.connected = true;

                // setAsConnected blocks
                this.setAsConnectedBlock(line.from);
                this.setAsConnectedBlock(line.to);

                // external callback
                if (!_.isUndefined(this.onNodeConnectionChangeCallback)) {

                    console.log("setAsConnectedLines");

                    // so that onNodeDeselection can decide whether to call as well
                    this.was_connection_change_called = true;

                    let _params = {
                        source_row_index: line.from[1],
                        source_col_index: line.from[0],
                        target_row_index: line.to[1],
                        target_col_index: line.to[0],
                        is_connected: true
                    };
                    this.onNodeConnectionChangeCallback(_params);
                }
            }
        });
    }

    /**
     * setAsConnectedBlock
     *
     * @param coords
     */
    setAsConnectedBlock(coords) {
        this.blocks[coords[1]].columns[coords[0]].connected = true;
    }

    /**
     * setAsNotConnectedBlock
     *
     * @param coords
     */
    setAsNotConnectedBlock(coords) {
        this.blocks[coords[1]].columns[coords[0]].connected = false;
    }

    /**
     * addBlock
     *
     * @param col_index
     * @param row_index
     * @param label
     * @param lines
     * @param data
     * @returns {boolean}
     */
    addBlock(col_index, row_index, label, lines, data) {

        // create row if it doesn't exist
        if (row_index === this.blocks.length) {
            this.blocks.push({columns: []});
        }

        // if block already exists (control) then remove and re-add after block
        var removed_block;

        if (!_.isUndefined(this.blocks[row_index].columns[col_index])) {
            removed_block = this.blocks[row_index].columns.splice(col_index, 1);
        }

        // get top left coords
        var top_left_coords = Utils.getNodeCoords(row_index, col_index, BLOCK_TOP_LEFT, this.config);

        // lines
        var block_lines = [];
        var line_source_lock_coords = Utils.getNodeCoords(row_index, col_index, BLOCK_BOTTOM, this.config);

        _.forEach(lines, (line_target_col_index) => {

            var line_target_coords = [line_target_col_index, row_index + 1];
            var line_target_lock_coords = Utils.getNodeCoords(line_target_coords[1], line_target_coords[0], BLOCK_TOP, this.config);

            block_lines.push({
                connected: true,
                from: [col_index, row_index],
                to: line_target_coords,
                x1: line_source_lock_coords[0],
                y1: line_source_lock_coords[1],
                x2: line_target_lock_coords[0],
                y2: line_target_lock_coords[1]
            });

            // set blocks as connected
            this.blocks_waiting_for_connection.push(line_target_coords);
        });

        // set block properties
        var block = {
            coords: top_left_coords,
            x: top_left_coords[0],
            y: top_left_coords[1],
            label_x: top_left_coords[0] + this.config.label_spacing,
            label_y: top_left_coords[1] + this.config.label_spacing,
            label: label,
            connected: block_lines.length > 0,
            control: false,
            row_index: row_index,
            col_index: col_index,
            lines: block_lines,
            selected: _.has(data, "selected") ? data.selected : false,
            highlight: _.has(data, "highlight") ? data.highlight : false
        };

        // if this block is selected
        if (block.selected) {

            // ... and there is another block already selected
            // ... then remove existing node highlight
            if (_.has(this.highlight_selected_node, 'row_index')) {
                this.blocks[ this.highlight_selected_node.row_index ].columns[ this.highlight_selected_node.col_index ].selected = false;
            }

            // set highlighted selected node
            this.highlight_selected_node.row_index = block.row_index;
            this.highlight_selected_node.col_index = block.col_index;
        }

        // add block
        this.blocks[row_index].columns.push(block);

        // check viewport
        this.checkViewport(col_index, row_index);

        // replace removed block
        if (!_.isUndefined(removed_block)) {
            this.addControl(removed_block[0].row_index);
        }

        this.new_node = { row_index, col_index };

        // highlight node
        // ... if configured to do so
        // ... and not initialising

        if (_.includes(this.config.highlight_node_on, HIGHLIGHT_NODE_ON_ADD) && !this.is_initialising) {

            // remove existing node highlight
            if (_.has(this.highlight_selected_node, 'row_index')) {
                this.blocks[ this.highlight_selected_node.row_index ].columns[ this.highlight_selected_node.col_index ].selected = false;
            }

            // set highlighted selected node
            this.highlight_selected_node.row_index = row_index;
            this.highlight_selected_node.col_index = col_index;

            // highlight node
            this.blocks[row_index].columns[col_index].selected = true;
        }

        // external callback
        // ... if not initialising
        if (!_.isUndefined(this.onNodeAddedCallback) && !this.is_initialising) {
            this.onNodeAddedCallback({ row_index, col_index });
        }
    }

    /**
     * updateBlock
     *
     * @param col_index
     * @param row_index
     * @param label
     * @param lines
     */
    updateBlock(col_index, row_index, label, lines = []) {

        // update label
        if (!_.isUndefined(label) && this.blocks[row_index].columns[col_index].label !== label) {
            this.blocks[row_index].columns[col_index].label = label;
        }

        // update lines
        if (!_.isUndefined(lines)) {

            var line_source_lock_coords     = Utils.getNodeCoords(row_index, col_index, BLOCK_BOTTOM, this.config);

            _.forEach(lines, (line_target_col_index) => {

                var line_target_coords = [line_target_col_index, row_index + 1];
                var line_target_lock_coords     = Utils.getNodeCoords(line_target_coords[1], line_target_coords[0], BLOCK_TOP, this.config);

                // if already has this connection
                if (_.includes(_.map(this.blocks[row_index].columns[col_index].lines, (line) => line.to[0]), line_target_col_index)) {
                    return;
                }

                this.blocks[row_index].columns[col_index].lines.push({
                    connected: true,
                    from: [col_index, row_index],
                    to: line_target_coords,
                    x1: line_source_lock_coords[0],
                    y1: line_source_lock_coords[1],
                    x2: line_target_lock_coords[0],
                    y2: line_target_lock_coords[1]
                });

                this.setNodeClass(col_index, row_index, 'connected', true);

                // set blocks as connected
                this.blocks_waiting_for_connection.push(line_target_coords);
            });
        }
    }

    /**
     * removeBlock
     *
     * @param col_index
     * @param row_index
     */
    removeBlock(col_index, row_index) {

        // remove lines
        let _set_as_busy = false;
        _.forEach(this.blocks[row_index].columns[col_index].lines, (line) => {
            this.removeLine(line.from, line.to, _set_as_busy);
        });

        // remove block
        this.blocks[row_index].columns.splice(col_index, 1);

        // update data
        // this.state[row_index].columns.splice(col_index, 1);

        // update siblings
        for (var i = col_index; i < (this.blocks[row_index].columns.length); i++) {
            this.updateBlockAfterSiblingAddedOrRemoved(i, row_index);

            // if not last column (control)
            if (i < this.blocks[row_index].columns.length - 1) {
                // TODO: why not update blocks???
                // this.state[row_index].columns[i].data.ui_column_index = i;
                // this.state[row_index].columns[i].data.ui_row_index = row_index;
            }
        }

        // update parents
        if (row_index !== 0) {
            var parent_row_index = row_index - 1;
            let remove_lines = [];

            _.forEach(this.blocks[parent_row_index].columns, (column, parent_col_index) => {
                _.forEach(column.lines, (line, line_index) => {

                    // if parent connects to this node
                    if (_.isEqual(line.to, [col_index, row_index])) {

                        // column.lines.splice(line_index, 1);

                        // mark lines for removal
                        remove_lines.push({
                            row_index: parent_row_index,
                            col_index: parent_col_index,
                            line_index: line_index
                        });

                        // update data
                        //this.state[parent_row_index].columns[parent_col_index].join.splice(line_index, 1);

                        // if parent no longer has any lines
                        if (column.lines.length === 0) {
                            this.setAsNotConnectedBlock([parent_col_index, parent_row_index]);
                        }
                    }

                    // if parent connects to a sibling (right) then adjust line target col index
                    if (line.to[0] > col_index) {

                        // update lines target
                        var new_line_to = [line.to[0] - 1, line.to[1]];

                        // get target lock coords
                        var target_lock_coords = Utils.getNodeCoords(new_line_to[1], new_line_to[0], BLOCK_TOP, this.config);

                        line.to = [new_line_to[0], new_line_to[1]];
                        line.x2 = target_lock_coords[0];
                        line.y2 = target_lock_coords[1];
                    }
                });
            });

            // remove lines
            _.map(remove_lines, (data) => {
                this.blocks[data.row_index].columns[data.col_index].lines.splice(data.line_index, 1);
            });
        }

        // update children
        // TODO: can we use block???
        if (row_index !== this.blocks.length - 1) {
            var children_row_index = row_index + 1;
            _.forEach(this.blocks[children_row_index].columns, (column, children_col_index) => {

                // if  block has no parent connections
                if (!this.doesNodeHaveConnectedParents(children_col_index, children_row_index)) {
                    this.setAsNotConnectedBlock([children_col_index, children_row_index]);
                }
            });
        }
    }

    /**
     * insertBlock
     *
     * @param col_index
     * @param row_index
     * @param label
     * @param joins
     * @returns {boolean}
     */
    insertBlock(col_index, row_index, label, joins) {

        // get top left coords
        var top_left_coords = Utils.getNodeCoords(row_index, col_index, BLOCK_TOP_LEFT, this.config);

        // lines
        var block_lines = [];
        var line_source_lock_coords = Utils.getNodeCoords(row_index, col_index, BLOCK_BOTTOM, this.config);

        _.forEach(joins, (line_target_col_index) => {

            var line_target_coords = [line_target_col_index, row_index + 1];
            var line_target_lock_coords = Utils.getNodeCoords(line_target_coords[1], line_target_coords[0], BLOCK_TOP, this.config);

            block_lines.push({
                connected: true,
                from: [col_index, row_index],
                to: line_target_coords,
                x1: line_source_lock_coords[0],
                y1: line_source_lock_coords[1],
                x2: line_target_lock_coords[0],
                y2: line_target_lock_coords[1]
            });

            // set blocks as connected
            this.blocks_waiting_for_connection.push(line_target_coords);
        });

        // set block properties
        var block = {
            coords: top_left_coords,
            x: top_left_coords[0],
            y: top_left_coords[1],
            label_x: top_left_coords[0] + this.config.label_spacing,
            label_y: top_left_coords[1] + this.config.label_spacing,
            label: label,
            connected: block_lines.length > 0,
            control: false,
            row_index: row_index,
            col_index: col_index,
            lines: block_lines
        };

        // TODO: add highlight and selected

        // insert block
        this.blocks[row_index].columns.splice(col_index, 0, block);

        // update data
        //this.state[row_index].columns.splice(col_index, 0, data);

        // update siblings
        for (var i = col_index + 1; i < (this.blocks[row_index].columns.length); i++) {

            this.updateBlockAfterSiblingAddedOrRemoved(i, row_index);

            // if not last column (control)
            // if (i < this.blocks[row_index].columns.length - 1) {
            //     this.state[row_index].columns[i].data.ui_column_index = i;
            //     this.state[row_index].columns[i].data.ui_row_index = row_index;
            // }
        }

        // update parents
        if (row_index !== 0) {
            var parent_row_index = row_index - 1;
            _.forEach(this.blocks[parent_row_index].columns, (column) => {
                _.forEach(column.lines, (line) => {

                    // if parent connects to a sibling (right) then adjust line target col index
                    if (line.to[0] >= col_index) {

                        // update lines target
                        var new_line_to = [line.to[0] + 1, line.to[1]];

                        // get target lock coords
                        var target_lock_coords = Utils.getNodeCoords(new_line_to[1], new_line_to[0], BLOCK_TOP, this.config);

                        line.to = [new_line_to[0], new_line_to[1]];
                        line.x2 = target_lock_coords[0];
                        line.y2 = target_lock_coords[1];
                    }
                });
            });
        }
    }

    /**
     * updateBlockAfterSiblingAddedOrRemoved
     *
     * @param {Integer}    col_index
     * @param {Integer}    row_index
     */
    updateBlockAfterSiblingAddedOrRemoved(col_index, row_index) {

        var top_left_coords = Utils.getNodeCoords(row_index, col_index, BLOCK_TOP_LEFT, this.config);
        var center_coords = Utils.getNodeCoords(row_index, col_index, BLOCK_CENTER, this.config);

        // update block

        this.blocks[row_index].columns[col_index].col_index = col_index;
        this.blocks[row_index].columns[col_index].coords = top_left_coords;
        this.blocks[row_index].columns[col_index].x = top_left_coords[0];
        this.blocks[row_index].columns[col_index].y = top_left_coords[1];

        // update labels
        // last block has different label position
        if (col_index === (this.blocks[row_index].columns.length - 1)) {
            this.blocks[row_index].columns[col_index].label_x = center_coords[0];
            this.blocks[row_index].columns[col_index].label_y = center_coords[1];
        } else {
            this.blocks[row_index].columns[col_index].label_x = top_left_coords[0] + this.config.label_spacing;
            this.blocks[row_index].columns[col_index].label_y = top_left_coords[1] + this.config.label_spacing;
        }

        // update lines
        _.forEach(this.blocks[row_index].columns[col_index].lines, (line) => {

            // get target lock coords
            var source_lock_coords = Utils.getNodeCoords(row_index, col_index, BLOCK_TOP, this.config);

            line.from = [col_index, row_index];
            line.x1 = source_lock_coords[0];
            line.y1 = source_lock_coords[1];
        });

        // check viewport
        this.checkViewport(col_index, row_index);
    }

    /**
     * updateBlockAfterChildAddedOrRemoved
     *
     * @param {Integer}    col_index
     * @param {Integer}    row_index
     */
    updateBlockAfterChildAddedOrRemoved(col_index, row_index) {

        var top_left_coords = Utils.getNodeCoords(row_index, col_index, BLOCK_TOP_LEFT, this.config);
        var center_coords = Utils.getNodeCoords(row_index, col_index, BLOCK_CENTER, this.config);

        // update block

        this.blocks[row_index].columns[col_index].col_index = col_index;
        this.blocks[row_index].columns[col_index].coords = top_left_coords;
        this.blocks[row_index].columns[col_index].x = top_left_coords[0];
        this.blocks[row_index].columns[col_index].y = top_left_coords[1];

        // update labels
        // last block has different label position
        if (col_index === (this.blocks[row_index].columns.length - 1)) {
            this.blocks[row_index].columns[col_index].label_x = center_coords[0];
            this.blocks[row_index].columns[col_index].label_y = center_coords[1];
        } else {
            this.blocks[row_index].columns[col_index].label_x = top_left_coords[0] + this.config.label_spacing;
            this.blocks[row_index].columns[col_index].label_y = top_left_coords[1] + this.config.label_spacing;
        }

        // update lines
        _.forEach(this.blocks[row_index].columns[col_index].lines, (line) => {

            // get target lock coords
            var source_lock_coords = Utils.getNodeCoords(row_index, col_index, BLOCK_TOP, this.config);

            line.from = [col_index, row_index];
            line.x1 = source_lock_coords[0];
            line.y1 = source_lock_coords[1];
        });

        // check viewport
        this.checkViewport(col_index, row_index);
    }

    /**
     * addControl
     *
     * @param {Integer}    row_index
     */
    addControl(row_index) {

        // create row if it doesn't exist
        if (row_index === this.blocks.length) {
            this.blocks.push({columns: []});
        }

        // validate row index
        if (row_index >= this.blocks.length) {
            throw new Error("Invalid row index");
        }

        var col_index = this.blocks[row_index].columns.length;

        // get top left coords
        var top_left_coords = Utils.getNodeCoords(row_index, col_index, BLOCK_TOP_LEFT, this.config);
        var center_coords = Utils.getNodeCoords(row_index, col_index, BLOCK_CENTER, this.config);

        // set block properties
        var block = {
            coords: top_left_coords,
            x: top_left_coords[0],
            y: top_left_coords[1],
            label_x: center_coords[0],
            label_y: center_coords[1],
            label: "+",
            connected: false,
            control: true,
            row_index: row_index,
            col_index: col_index,
            lines: []
        };

        // add block
        this.blocks[row_index].columns.push(block);

        // check viewport
        this.checkViewport(col_index, row_index);

    }

    /**
     * addBgGridCol
     *
     * @param {Integer}    index
     */
    addBgGridCol(index) {

        this.bg_col_grid.push({
            index: index,
            x: this.calculateColX(index),
            width: this.calculateColWidth(index)
        });
    }

    ////////////////////////////////////////////////
    //
    // update
    //
    ////////////////////////////////////////////////

    /**
     * update
     *
     * @param data
     * @param column_property_name
     */
    update(data, column_property_name) {

        // add controls
        _.forEach(data, (row, row_index) => {

            // ... if row index exceeds or equals current UI rows
            if (row_index >= this.blocks.length) {
                this.addControl(row_index);
            }
        });

        // add blocks
        _.forEach(data, (row, row_index) => {
            _.forEach(row[column_property_name], (col, col_index) => {

                // update block
                this.updateBlock(col_index, row_index, col.label);

                // ... if column index exceeds or equals current UI cols (excluding control)
                if (col_index >= this.blocks[row_index].columns.length - 1) {
                    var label = _.has(col, 'label') ? col.label : "";
                    var lines = _.has(col, 'join') ? col.join : [];
                    this.addBlock(col_index, row_index, label, lines);
                }
            });
        });

        // set viewport
        this.setViewport(this.grid_col_count, this.grid_row_count);

        // check active
        this.checkActive();
    }
}

AngularSvgNodesController.$inject = [ '$scope' ];