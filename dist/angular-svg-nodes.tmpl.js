/*!
 * angular-svg-nodes v0.0.1
 * http://intellipharm.com/
 *
 * Copyright 2015 Intellipharm
 *
 * 2015-07-14 08:44:18
 *
 */
(function() {

    'use strict';

    //----------------------------------
    // Angular SVG Nodes
    //----------------------------------
    //
    // issues:
    // firefox foreignobject (solution: use d3 to wrap text)
    // ie 9 small size (solution: ???)
    // blocks connected out of bounds on init (solution: draw lines after blocks, and validate targets)
    // $s.rows....join array is not updated on adding and removing lines

    angular.module('AngularSvgNodes', []);
})();

(function() {

    "use strict";

    //----------------------------------
    // svg-vbox directive
    //----------------------------------

    var directive = function() {
        return {
            link: function(scope, element, attrs) {
                attrs.$observe('svgVbox', function(value) {
                    element[0].setAttribute("viewBox", value);
                });
            }
        };
    };

    angular.module('AngularSvgNodes').directive('svgVbox', directive);

})();

(function() {

    'use strict';

    //------------------------------------------
    // angular-svg-nodes-bg-col-grid directive
    //------------------------------------------

    var directive = function() {
        return {
            restrict: 'EA',
            scope: {
                index: "@angularSvgNodesBgColGridIndex",
                onMouseOver: "&angularSvgNodesBgColGridOnMouseOver"
            },
            link: function (scope, element) {

                ////////////////////////////////////////////////
                //
                // handlers
                //
                ////////////////////////////////////////////////

                //----------------------------------
                // mouse over
                //----------------------------------

                element[0].addEventListener("mouseover", function() {

                    var index = _.parseInt(scope.index);

                    // call external handler
                    scope.onMouseOver({index: index});
                });
            }
        };
    };

    angular.module('AngularSvgNodes').directive('angularSvgNodesBgColGrid', directive);

})();

(function () {

    "use strict";

    //-------------------------
    // Main Controller
    //-------------------------

    var controller = function (
        $s,
        BLOCK_TOP_LEFT,
        BLOCK_TOP,
        BLOCK_CENTER,
        BLOCK_BOTTOM,
        ACTION_ADD,
        ACTION_REMOVE,
        ACTION_UPDATE,
        INITIAL_GRID_COLS,
        INITIAL_GRID_ROWS,
        BLOCK_WIDTH,
        BLOCK_HEIGHT,
        COL_SPACING,
        ROW_SPACING,
        LABEL_SPACING,
        DISABLE_CONTROL_NODES,
        MAX_VIEWPORT_WIDTH_INCREASE,
        MAX_VIEWPORT_HEIGHT_INCREASE
        ) {

        var self = this;

        ////////////////////////////////////////////////
        //
        // vars
        //
        ////////////////////////////////////////////////

        //-----------------------------
        // api
        //-----------------------------

        this.api = $s.api || {};

        //-----------------------------
        // control
        //-----------------------------

        var initialized = false;

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
        this.block_width    = BLOCK_WIDTH;
        this.block_height   = BLOCK_HEIGHT;
        this.col_spacing    = COL_SPACING;
        this.row_spacing    = ROW_SPACING;
        this.grid_col_count = INITIAL_GRID_COLS;
        this.grid_row_count = INITIAL_GRID_ROWS;
        this.label_width    = BLOCK_WIDTH - (LABEL_SPACING * 2);
        this.label_height   = BLOCK_HEIGHT - (LABEL_SPACING * 2);

        // viewport style & bounds
        this.wrapper_style = "";
        this.viewport_style = "";
        this.viewport_width = 0;
        this.viewport_height = 0;
        this.viewport_viewbox = "";

        // node selections
        this.selection = [];
        this.source_exit_side = null;

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
        this.onNodeSelect = function(col_index, row_index) {

            // external handler
            if (!_.isUndefined($s.onNodeMouseDown)) {
                $s.onNodeMouseDown(self.getExternalNodeEventHandlerData(col_index, row_index));
            }

            // if control
            if (self.blocks[row_index].columns[col_index].control) {
                if (!DISABLE_CONTROL_NODES) {
                    this.onControlNodeSelect(col_index, row_index);
                }
                return true;
            }

            // if block
            this.onBlockNodeSelect(col_index, row_index);
        };

        /**
         * onNodeDeselect
         *
         * @param col_index
         * @param row_index
         * @returns {boolean}
         */
        this.onNodeDeselect = function(col_index, row_index) {

            // external handler
            if (!_.isUndefined($s.onNodeMouseUp)) {
                $s.onNodeMouseUp(self.getExternalNodeEventHandlerData(col_index, row_index));
            }

            // if control
            if (self.blocks[row_index].columns[col_index].control) {
                return false;
            }

            // if block
            this.onBlockNodeDeselect(col_index, row_index);
        };

        /**
         * onNodeMouseOver
         *
         * @param col_index
         * @param row_index
         * @returns {boolean}
         */
        this.onNodeMouseOver = function(col_index, row_index) {

            // if control
            if (self.blocks[row_index].columns[col_index].control) {
                self.onControlNodeMouseOver(col_index, row_index);
                return true;
            }

            // if block
            self.onBlockNodeMouseOver(col_index, row_index);
        };

        /**
         * onNodeMouseOut
         *
         * @param col_index
         * @param row_index
         * @param exit_side
         * @returns {boolean}
         */
        this.onNodeMouseOut = function(col_index, row_index, exit_side) {

            // if control
            if (self.blocks[row_index].columns[col_index].control) {
                self.onControlNodeMouseOut(col_index, row_index);
                return true;
            }

            // if block
            self.onBlockNodeMouseOut(col_index, row_index, exit_side);
        };

        //-------------------------------------------------
        // control node handlers
        //-------------------------------------------------

        /**
         * onControlNodeSelect
         *
         * @param col_index
         * @param row_index
         */
        this.onControlNodeSelect = function(col_index, row_index) {

            self.addBlock(col_index, row_index, "NEW", []);

            $s.$apply();
        };

        /**
         * onControlNodeMouseOver
         *
         * @param col_index
         * @param row_index
         */
        this.onControlNodeMouseOver = function(col_index, row_index) {

            // disallow if selection
            if (self.selection.length > 0) {
                return false;
            }

            // styles
            self.setNodeClass(col_index, row_index, 'control_hover', true);

            $s.$apply();
        };

        /**
         * onControlNodeMouseOut
         *
         * @param col_index
         * @param row_index
         * @returns {boolean}
         */
        this.onControlNodeMouseOut = function(col_index, row_index) {

            // disallow if selection
            if (self.selection.length > 0) {
                return false;
            }

            // styles
            self.setNodeClass(col_index, row_index, 'control_hover', false);

            $s.$apply();
        };

        //-------------------------------------------------
        // block node handlers
        //-------------------------------------------------

        /**
         * onBlockNodeSelect
         *
         * @param col_index
         * @param row_index
         */
        this.onBlockNodeSelect = function(col_index, row_index) {

            //-------------------------
            // styles
            //-------------------------

            self.setNodeClass(col_index, row_index, 'source_hover', false);
            self.setNodeClass(col_index, row_index, 'source', true);
            self.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', false);
            self.setPotentialNodeClasses(col_index, row_index, 'potential_target', true);

            //-------------------------
            // selection updates
            //-------------------------

            // set selection
            self.selection = [[col_index, row_index]];

            $s.$apply();
        };

        /**
         * onBlockNodeDeselect
         *
         * @param col_index
         * @param row_index
         */
        this.onBlockNodeDeselect = function(col_index, row_index) {

            // reset last exit side
            self.source_exit_side = null;

            //-------------------------
            // styles
            //-------------------------

            // if one selection
            if (self.selection.length === 1) {

                // if deselecting on current source
                if (_.isEqual(self.selection[0], [col_index, row_index])) {

                    self.setNodeClass(col_index, row_index, 'source', false);
                    self.setNodeClass(col_index, row_index, 'source_hover', true);
                    self.setPotentialNodeClasses(col_index, row_index, 'potential_target', false);
                    self.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', true);
                }
            }

            // if two selections
            else if (self.selection.length === 2) {

                // if deselecting on current target (& is potential ?)
                if (_.isEqual(self.selection[1], [col_index, row_index])) {

                    self.setNodeClass(col_index, row_index, 'target', false);

                    // if  block has no parent connections
                    if (!self.doesNodeHaveConnectedParents(col_index, row_index)) {
                        self.setPotentialNodeClasses(col_index, row_index, 'potential_target', false);
                    }

                    // check active
                    self.checkActive();
                }
            }

            //-------------------------
            // line updates
            //-------------------------

            // if 2 selections
            if (self.selection.length === 2) {

                // if deselecting on current target & is potential
                if (_.isEqual(self.selection[1], [col_index, row_index]) && self.isNodePotential(self.selection[0], [col_index, row_index])) {

                    var is_target_parent = self.selection[0][1] > row_index;

                    // if target is parent then remove line
                    if (is_target_parent) {
                        self.removeLine(self.selection[1], self.selection[0]);
                    }

                    // if target is child then setAsConnected line
                    else {
                        self.setAsConnectedLines(self.selection, "A");

                        // check active
                        self.checkActive();
                    }
                }
            }
        };

        /**
         * onBlockNodeMouseOver
         *
         * @param col_index
         * @param row_index
         */
        this.onBlockNodeMouseOver = function(col_index, row_index) {

            //-------------------------
            // styles
            //-------------------------

            // if no selection
            if (self.selection.length === 0) {

                self.setNodeClass(col_index, row_index, 'source_hover', true);
                self.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', true);
            }

            // if two selections
            if (self.selection.length === 2) {

                // if potential
                if (self.isNodePotential(self.selection[0], [col_index, row_index])) {

                    self.setNodeClass(col_index, row_index, 'potential_target', false);
                    self.setNodeClass(col_index, row_index, 'target', true);
                    self.setLineClass(self.selection[0], [col_index, row_index], 'target', true);
                }
            }

            // if col changed
            if (self.bg_col_grid_hover_index !== col_index) {

                //self.bg_col_grid_hover_index = col_index;

                //-------------------------
                // selection updates
                //-------------------------

                // if 2 selections and new col index is potential
                //if (self.selection.length === 2 && self.isNodePotential(self.selection[0], [col_index, self.selection[1][1]])) {
                //    self.selection[1][0] = col_index;
                //}
            }

            $s.$apply();
        };

        /**
         * onBlockNodeMouseOut
         *
         * @param col_index
         * @param row_index
         * @param exit_side
         * @returns {boolean}
         */
        this.onBlockNodeMouseOut = function(col_index, row_index, exit_side) {

            //-------------------------
            // styles
            //-------------------------

            // if no selections
            if (self.selection.length === 0) {

                self.setNodeClass(col_index, row_index, 'source_hover', false);
                self.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', false);
            }

            // if two selections
            else if (self.selection.length === 2) {

                // if potential
                if (self.isNodePotential(self.selection[0], [col_index, row_index])) {

                    self.setNodeClass(col_index, row_index, 'target', false);
                    self.setNodeClass(col_index, row_index, 'potential_target', true);
                    self.setLineClass(self.selection[0], [col_index, row_index], 'target', false);
                }
            }

            // if this is source selection & source_exit_side not yet set
            if (_.isEqual(self.selection[0], [col_index, row_index]) && _.isNull(self.source_exit_side)) {

                // if exited top
                if (exit_side === 'top') {

                    // remove 'potential child' class from potential children
                    self.setPotentialChildNodeClasses(col_index, row_index, 'potential_target', false);
                }

                // if exited bottom
                else if (exit_side === 'bottom') {

                    // remove 'potential child' class from potential parent
                    self.setPotentialParentNodeClasses(col_index, row_index, 'potential_target', false);
                }
            }

            //-------------------------
            // selection updates
            //-------------------------

            // if one selection one selected
            if (self.selection.length === 1) {

                // if this is source selection
                if (_.isEqual(self.selection[0], [col_index, row_index])) {

                    // update source exit side
                    self.source_exit_side = exit_side;
                }

                var target_coords;

                // if exited top
                if (exit_side === 'top') {

                    target_coords = [self.bg_col_grid_hover_index, row_index - 1];

                    // if target is potential
                    if (self.isNodePotential([col_index, row_index], target_coords)) {
                        self.selection.push(target_coords);
                    }
                }

                // if exited bottom
                else if (exit_side === 'bottom') {

                    var target_row_index = row_index + 1;
                    target_coords = [self.bg_col_grid_hover_index, target_row_index];

                    // if not spanning more than one row && target is potential
                    if (Math.abs(self.selection[0][1] - target_row_index) <= 1 && self.isNodePotential([col_index, row_index], target_coords)) {

                        self.selection.push(target_coords);
                    }

                }
            }

            $s.$apply();
        };

        //-------------------------------------------------
        // grid handlers
        //-------------------------------------------------

        /**
         * onRootDeselect
         */
        this.onRootDeselect = function() {

            // reset source_exit_side
            self.source_exit_side = null;

            // nothing to do if there are no selections
            if (self.selection.length === 0) {
                return true;
            }

            //-------------------------
            // styles
            //-------------------------

            // if selections
            if (self.selection.length > 0) {

                self.setNodeClass(self.selection[0][0], self.selection[0][1], 'source', false);
                self.setPotentialNodeClasses(self.selection[0][0], self.selection[0][1], 'target', false);
                self.setPotentialNodeClasses(self.selection[0][0], self.selection[0][1], 'potential_target', false);
            }

            //-------------------------
            // line updates
            //-------------------------

            // if 2 selections
            if (self.selection.length === 2) {

                // remove Unconnected lines
                self.removeUnconnectedLines(self.selection);
            }

            //-------------------------
            // selection updates
            //-------------------------

            // reset if there are not 2 selections
            if (self.selection.length > 0) {
                self.selection = [];
            }

            $s.$apply();
        };

        /**
         * onBgColGridMouseOver
         */
        this.onBgColGridMouseOver = function(index) {

            // do nothing if unchanged
            if (self.bg_col_grid_hover_index === index) {
                return true;
            }

            self.bg_col_grid_hover_index = index;

            //-------------------------
            // selection updates
            //-------------------------

            // if 1 selection
            if (self.selection.length === 1) {

                var target_coords = self.source_exit_side === 'top' ? [index, self.selection[0][1] - 1] : [index, self.selection[0][1] + 1];

                // if target is potential
                if (self.isNodePotential(self.selection[0], target_coords)) {
                    self.selection.push(target_coords);
                }
            }

            // if 2 selections and new col index is potential
            else if (self.selection.length === 2 && self.isNodePotential(self.selection[0], [index, self.selection[1][1]])) {
                self.selection[1][0] = index;
            }

            $s.$apply();
        };

        /**
         * onRootMouseLeave
         *
         * @param e
         */
        this.onRootMouseLeave = function() {

            //-------------------------
            // styles
            //-------------------------

            // if 1 selection
            if (self.selection.length === 1) {

                self.setNodeClass(self.selection[0][0], self.selection[0][1], 'source', false);
                self.setPotentialNodeClasses(self.selection[0][0], self.selection[0][1], 'potential_target', false);
            }

            // if 2 selections
            else if (self.selection.length === 2) {

                self.setNodeClass(self.selection[0][0], self.selection[0][1], 'source', false);
                self.setNodeClass(self.selection[1][0], self.selection[1][1], 'target', false);
                self.setPotentialNodeClasses(self.selection[0][0], self.selection[0][1], 'potential_target', false);
            }

            //-------------------------
            // line updates
            //-------------------------

            // if 2 selections
            if (self.selection.length === 2) {

                // remove Unconnected lines
                self.removeUnconnectedLines(self.selection);
            }

            //-------------------------
            // selection updates
            //-------------------------

            self.selection = [];

            $s.$apply();
        };

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
        this.onLineRemoveComplete = function(source_coords, target_coords, line_index) {

            // update data
            $s.rows[source_coords[1]].columns[source_coords[0]].join.splice(line_index, 1);

            // update blocks
            var source = self.blocks[source_coords[1]].columns[source_coords[0]];

            // delete line
            source.lines.splice(line_index, 1);

            // if source block has no more lines then setAsNotConnected
            if (source.lines.length === 0) {

                // if  block has no parent connections
                if (!self.doesNodeHaveConnectedParents(source_coords[0], source_coords[1])) {
                    self.setAsNotConnectedBlock([source_coords[0], source_coords[1]]);
                }
            }

            // external handler
            if (!_.isUndefined($s.onLineRemove)) {
                $s.onLineRemove(self.getExternalLineEventHandlerData(source_coords, target_coords, line_index));
            }

            $s.$apply();
        };

        /**
         * onLineDrawComplete
         *
         * @param source_coords
         * @param target_coords
         * @param line_index
         */
        this.onLineDrawComplete = function(source_coords, target_coords) {

            var is_block_waiting_for_connection = false;

            _.forEach(self.blocks_waiting_for_connection, function (block, index) {
                if (_.isEqual(block, target_coords)) {
                    is_block_waiting_for_connection = true;
                    self.blocks_waiting_for_connection.splice(index, 1);
                    return false;
                }
            });

            if (is_block_waiting_for_connection) {

                // connect block
                self.setAsConnectedBlock(target_coords);
            }

            $s.$apply();
        };

        ////////////////////////////////////////////////
        //
        // utils
        //
        ////////////////////////////////////////////////

        //-----------------------------
        // data for external event handlers
        //-----------------------------

        /**
         * getExternalNodeEventHandlerData
         *
         * @param col_index
         * @param row_index
         * @returns {{node: *, data: null}}
         */
        this.getExternalNodeEventHandlerData = function(col_index, row_index) {

            var data_clone = _.clone($s.rows[row_index].columns[col_index]);
            var node_clone = _.clone(self.blocks[row_index].columns[col_index]);
            var result = {
                node: node_clone,
                data: null
            };
            if (!_.isUndefined(data_clone)) {
                result.data = data_clone;
            }
            return result;
        };

        /**
         * getExternalLineEventHandlerData
         *
         * @param source_coords
         * @param target_coords
         * @param line_index
         * @returns {{node: *, data: null}}
         */
        this.getExternalLineEventHandlerData = function(source_coords, target_coords, line_index) {

            var source_data = self.getExternalNodeEventHandlerData(source_coords[0], source_coords[1]);
            var target_data = self.getExternalNodeEventHandlerData(target_coords[0], target_coords[1]);

            return {
                source_node: source_data.node,
                source_data: source_data.data,
                target_node: target_data.node,
                target_data: target_data.data,
                line_index: line_index
            };
        };

        //-----------------------------
        // active check
        //-----------------------------

        /**
         * checkActive
         */
        this.checkActive = function() {

            if (self.blocks.length === 0) {
                return false;
            }

            _.forEach(self.blocks[0].columns, function (col, col_index) {
                if (col.lines.length > 0) {
                    self.activateBlock(col_index, 0);
                }
            });
        };

        /**
         * activateBlock
         *
         * @param col_index
         * @param row_index
         */
        this.activateBlock = function(col_index, row_index) {

            var block = self.blocks[row_index].columns[col_index];
            block.active = true;

            if (block.lines.length > 0) {

                _.forEach(block.lines, function (line) {

                    // activate line
                    line.active = true;

                    // activate target block
                    self.activateBlock(line.to[0], line.to[1]);
                });
            }
        };

        /**
         * deactivateBlock
         *
         * @param col_index
         * @param row_index
         */
        this.deactivateBlock = function(col_index, row_index) {

            var block = self.blocks[row_index].columns[col_index];
            block.active = false;

            if (block.lines.length > 0) {
                _.forEach(block.lines, function (line) {

                    // deactivate line
                    line.active = false;

                    var does_parent_have_active_nodes = self.doesNodeHaveActiveParents(line.to[0], line.to[1]);

                    // deactivate target block if no active parents
                    if (!does_parent_have_active_nodes) {
                        self.deactivateBlock(line.to[0], line.to[1]);
                    }
                });
            }
        };

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
        this.doesNodeHaveActiveParents = function(col_index, row_index, exclude_coords) {

            if (row_index === 0) {
                return false;
            }

            var result = false;
            var parent_row_index = row_index - 1;
            var parents = self.blocks[parent_row_index].columns;

            _.forEach(parents, function (parent, parent_col_index) {
                _.forEach(parent.lines, function (line) {

                    // if parent coords are not equal to exclude coords
                    // ... and parent has a line to this block
                    // ... and parent is active
                    if (!_.isEqual([parent_col_index, parent_row_index], exclude_coords) && _.isEqual(line.to, [col_index, row_index]) && parent.active) {
                        result = true;
                    }
                });
            });

            return result;
        };

        /**
         * doesNodeHaveConnectedParents
         *
         * @param col_index
         * @param row_index
         * @param exclude_coords
         */
        this.doesNodeHaveConnectedParents = function(col_index, row_index, exclude_coords) {

            if (row_index === 0) {
                return false;
            }

            if (_.isUndefined(exclude_coords)) {
                exclude_coords = [];
            }

            var result = false;
            var parent_row_index = row_index - 1;
            var parents = self.blocks[parent_row_index].columns;

            _.forEach(parents, function (parent, parent_col_index) {

                // if parent coords are not equal to exclude coords and parent is potential (potential parent node is always connected)
                if (!_.isEqual([parent_col_index, parent_row_index], exclude_coords) && self.isNodePotential([col_index, row_index], [parent_col_index, parent_row_index])) {

                    result = true;
                    return false;
                }
            });

            return result;
        };

        /**
         * isNodePotential
         *
         * @param source_coords
         * @param target_coords
         */
        this.isNodePotential = function(source_coords, target_coords) {

            // if not ready
            if (_.isUndefined(self.blocks[target_coords[1]])) {
                return false;
            }
            if (_.isUndefined(self.blocks[target_coords[1]].columns[target_coords[0]])) {
                return false;
            }

            // refuse if control
            if (self.blocks[target_coords[1]].columns[target_coords[0]].control) {
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
            if (target_coords[1] >= self.blocks.length) {
                return false;
            }

            // target col index out of bounds check
            if (target_coords[0] >= self.blocks[target_coords[1]].columns.length) {
                return false;
            }

            // check if target is parent or child
            var is_target_parent = target_coords[1] < source_coords[1];
            var source = self.blocks[source_coords[1]].columns[source_coords[0]];
            var target = self.blocks[target_coords[1]].columns[target_coords[0]];
            var result;

            // if target is parent, then check if target has connected lines to source
            if (is_target_parent) {

                result = false;

                // check that last exit was not bottom
                if (self.source_exit_side === 'bottom') {
                    return false;
                }

                // check if target has an connected line from it source
                _.forEach(target.lines, function (line) {
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
                if (self.source_exit_side === 'top') {
                    return false;
                }

                // check if source does not have an connected line to it
                _.forEach(source.lines, function (line) {
                    if (line.connected && _.isEqual(line.to, target_coords)) {
                        result = false;
                        return false;
                    }
                });
            }

            return result;
        };

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
        this.setLineClass = function(source_coords, target_coords, key, value) {

            // loop child row columns
            _.forEach(self.blocks[source_coords[1]].columns[source_coords[0]].lines, function (line) {

                // if child node is potential then update class property
                if (_.isEqual(line.to, target_coords)) {
                    line[key] = value;
                }
            });
        };

        /**
         * setNodeClass
         *
         * @param col_index
         * @param row_index
         * @param key
         * @param value
         */
        this.setNodeClass = function(col_index, row_index, key, value) {
            self.blocks[row_index].columns[col_index][key] = value;
        };

        /**
         * setPotentialNodeClasses
         *
         * @param col_index
         * @param row_index
         * @param key
         * @param value
         */
        this.setPotentialNodeClasses = function(col_index, row_index, key, value) {

            self.setPotentialChildNodeClasses(col_index, row_index, key, value);
            self.setPotentialParentNodeClasses(col_index, row_index, key, value);
        };

        /**
         * setPotentialChildNodeClasses
         *
         * @param col_index
         * @param row_index
         * @param key
         * @param value
         */
        this.setPotentialChildNodeClasses = function(col_index, row_index, key, value) {

            // if child row is not out of bounds
            if ((row_index + 1) < (self.blocks.length)) {

                // loop child row columns
                _.forEach(self.blocks[row_index + 1].columns, function (child_col, child_col_index) {

                    // if child node is potential then update class property
                    if (self.isNodePotential([col_index, row_index], [child_col_index, row_index + 1])) {
                        child_col[key] = value;
                    }
                });
            }
        };

        /**
         * setPotentialParentNodeClasses
         *
         * @param col_index
         * @param row_index
         * @param key
         * @param value
         */
        this.setPotentialParentNodeClasses = function(col_index, row_index, key, value) {

            if (row_index > 0) {

                // loop parent node columns
                _.forEach(self.blocks[row_index - 1].columns, function (parent_col, parent_col_index) {

                    // if parent node is potential then update class property
                    if (self.isNodePotential([col_index, row_index], [parent_col_index, row_index - 1])) {
                        parent_col[key] = value;
                    }
                });
            }
        };

        //-----------------------------
        // viewport
        //-----------------------------

        /**
         * setViewport
         *
         * @param cols
         * @param rows
         */
        this.setViewport = function(cols, rows) {

            var total_item_width = BLOCK_WIDTH + COL_SPACING;
            var total_item_height = BLOCK_HEIGHT + ROW_SPACING;

            self.viewport_width = total_item_width * cols;
            self.viewport_height = total_item_height * rows;

            self.viewport_style = {
                'background-color': "#ccc",
                'min-width': self.viewport_width +"px",
                'min-height': self.viewport_height +"px"
            };

            self.wrapper_style = {
                'max-width': (self.viewport_width + MAX_VIEWPORT_WIDTH_INCREASE) +"px",
                'min-width': self.viewport_width +"px",
                'max-height': (self.viewport_height + (MAX_VIEWPORT_HEIGHT_INCREASE * rows)) +"px",
                'min-height': self.viewport_height +"px"
            };

            self.viewport_viewbox = " 0 0 " + self.viewport_width + " " + self.viewport_height;
        };

        /**
         * checkViewport
         *
         * @param col_index
         * @param row_index
         */
        this.checkViewport = function(col_index, row_index) {

            var should_update_viewport = false;

            // row bounds check
            if (row_index >= self.grid_row_count) {

                // increase rowspan
                self.grid_row_count++;
                should_update_viewport = true;
            }

            // col bounds check
            if (col_index >= self.grid_col_count) {

                // increase colspan
                self.grid_col_count++;
                should_update_viewport = true;

                // add bg grid col
                self.addBgGridCol(self.grid_col_count - 1);
            }

            // set viewport
            if (should_update_viewport) {
                self.setViewport(self.grid_col_count, self.grid_row_count);
            }
        };

        //-----------------------------
        // coords
        //-----------------------------

        /**
         * calculateColX
         *
         * @param index
         */
        this.calculateColX = function(index) {
            if (index === 0) {
                return 0;
            }
            var first_col_width = BLOCK_WIDTH + (COL_SPACING / 2);
            var col_width = BLOCK_WIDTH + (COL_SPACING);
            return first_col_width + ((index - 1) * col_width);
        };

        /**
         * calculateColWidth
         *
         * @param index
         */
        this.calculateColWidth = function(index) {
            var total_item_width = index === 0 ? BLOCK_WIDTH + (COL_SPACING / 2) : BLOCK_WIDTH + COL_SPACING;
            return total_item_width;
        };

        /**
         * calculateRowY
         *
         * @param index
         */
        this.calculateRowY = function(index) {
            var row_height = BLOCK_HEIGHT + ROW_SPACING;
            return index * row_height;
        };

        /**
         * calculateRowHeight
         *
         * @param index
         */
        this.calculateRowHeight = function() {
            return BLOCK_HEIGHT + ROW_SPACING;
        };

        /**
         * getCoords
         *
         * @param position
         * @param col_index
         * @param row_index
         * @returns {*}
         */
        this.getCoords = function(col_index, row_index, position) {

            var total_width = BLOCK_WIDTH + COL_SPACING;
            var total_height = BLOCK_HEIGHT + ROW_SPACING;

            var x = ( col_index + 1 ) * total_width - total_width;
            var y = ( row_index + 1 ) * total_height - total_height;

            var result = null;

            switch (position) {
                case BLOCK_TOP_LEFT:
                    result = [x, y];
                    break;

                case BLOCK_TOP:
                    x += BLOCK_WIDTH / 2;
                    result = [x, y];
                    break;

                case BLOCK_CENTER:
                    x += BLOCK_WIDTH / 2;
                    y += BLOCK_HEIGHT / 2;
                    result = [x, y];
                    break;

                case BLOCK_BOTTOM:
                    x += BLOCK_WIDTH / 2;
                    y += BLOCK_HEIGHT;
                    result = [x, y];
                    break;
            }
            return result;
        };

        //-----------------------------
        // drawing
        //-----------------------------

        /**
         * addLine
         *
         * @param source_coords
         * @param target_coords
         */
        this.addLine = function(source_coords, target_coords, connected) {

            // check bounds
            if (target_coords[1] >= self.blocks.length) {
                return false;
            }

            // get coords
            var source_lock_coords     = self.getCoords(source_coords[0], source_coords[1], BLOCK_BOTTOM);
            var target_lock_coords     = self.getCoords(target_coords[0], target_coords[1], BLOCK_TOP);

            // add line properties
            self.blocks[source_coords[1]].columns[source_coords[0]].lines.push({
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
                $s.rows[source_coords[1]].columns[source_coords[0]].join.push(target_coords[0]);
            }
        };

        /**
         * updateLineTarget
         *
         * @param source_coords
         * @param target_coords
         */
        this.updateLineTarget = function(source_coords, target_coords) {

            // get target lock coords
            var target_lock_coords     = self.getCoords(target_coords[0], target_coords[1], BLOCK_TOP);

            // find line
            _.forEach(self.blocks[source_coords[1]].columns[source_coords[0]].lines, function(line) {

                if (_.isEqual(line.from, source_coords) && _.isEqual(line.to, target_coords)) {

                    line.x2 =  target_lock_coords[0];
                    line.y2 =  target_lock_coords[1];
                    line.to =  target_coords;
                    return false;
                }
            });
        };

        /**
         * removeLine
         *
         * @param source_coords
         * @param target_coords
         */
        this.removeLine = function(source_coords, target_coords) {

            // get target lock coords
            var target_lock_coords  = self.getCoords(source_coords[0], source_coords[1], BLOCK_BOTTOM);

            // find line
            _.forEach(self.blocks[source_coords[1]].columns[source_coords[0]].lines, function(line) {

                if (_.isEqual(line.from, source_coords) && _.isEqual(line.to, target_coords)) {

                    var block = self.blocks[target_coords[1]].columns[target_coords[0]];
                    var block_has_connected_parents = self.doesNodeHaveConnectedParents(target_coords[0], target_coords[1], source_coords);

                    // if block has no lines & has no parent connections
                    if (block.lines.length === 0 && !block_has_connected_parents) {
                        // set as not connected
                        self.setAsNotConnectedBlock(target_coords);
                    }

                    // if block has no parent connections
                    var block_has_active_parents = self.doesNodeHaveActiveParents(target_coords[0], target_coords[1], source_coords);

                    if (!block_has_active_parents) {

                        // deactivate block
                        self.deactivateBlock(target_coords[0], target_coords[1]);
                    }

                    // set line properties
                    line.x2 =  target_lock_coords[0];
                    line.y2 =  target_lock_coords[1];
                    line.previous_to = line.to; // TODO: this feels a bit hacky
                    line.to =  [source_coords[0], source_coords[1]];
                    return false;
                }
            });
        };

        /**
         * removeUnconnectedLines
         *
         * @param selection
         */
        this.removeUnconnectedLines = function(selection) {

            _.forEach(self.blocks[selection[0][1]].columns[selection[0][0]].lines, function (line) {
                if (!line.connected) {
                    self.removeLine(self.selection[0], self.selection[1]);
                }
            });
        };

        /**
         * setAsConnectedLines
         *
         * @param selection
         */
        this.setAsConnectedLines = function(selection) {

            _.forEach(self.blocks[selection[0][1]].columns[selection[0][0]].lines, function(line, line_index) {
                if (!line.connected) {

                    // setAsConnected line
                    line.connected = true;

                    // setAsConnected blocks
                    self.setAsConnectedBlock(line.from);
                    self.setAsConnectedBlock(line.to);

                    // update data
                    $s.rows[line.from[1]].columns[line.from[0]].join.splice(line_index, 0, line.to[0]);

                    // external handler
                    if (!_.isUndefined($s.onLineAdd)) {
                        $s.onLineAdd(self.getExternalLineEventHandlerData(line.from, line.to, line_index));
                    }
                }
            });
        };

        /**
         * setAsConnectedBlock
         *
         * @param coords
         */
        this.setAsConnectedBlock = function(coords) {
            self.blocks[coords[1]].columns[coords[0]].connected = true;
        };

        /**
         * setAsNotConnectedBlock
         *
         * @param coords
         */
        this.setAsNotConnectedBlock = function(coords) {
            self.blocks[coords[1]].columns[coords[0]].connected = false;
        };

        /**
         * addBlock
         *
         * @param col_index
         * @param row_index
         * @param label
         * @param lines
         * @returns {boolean}
         */
        this.addBlock = function(col_index, row_index, label, lines) {

            if (row_index > self.blocks.length) {
                throw new Error("Invalid row index");
            }

            // create row if it doesn't exist
            if (row_index === self.blocks.length) {
                self.blocks.push({columns: []});
            }

            // if block already exists (control) then remove and re-add after block
            var removed_block;

            if (!_.isUndefined(self.blocks[row_index].columns[col_index])) {
                removed_block = self.blocks[row_index].columns.splice(col_index, 1);
            }

            // get top left coords
            var top_left_coords     = self.getCoords(col_index, row_index, BLOCK_TOP_LEFT);

            // lines
            var block_lines = [];
            var line_source_lock_coords     = self.getCoords(col_index, row_index, BLOCK_BOTTOM);

            _.forEach(lines, function(line_target_col_index) {

                var line_target_coords = [line_target_col_index, row_index + 1];
                var line_target_lock_coords     = self.getCoords(line_target_coords[0], line_target_coords[1], BLOCK_TOP);

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
                self.blocks_waiting_for_connection.push(line_target_coords);
            });

            // set block properties
            var block = {
                coords: top_left_coords,
                x: top_left_coords[0],
                y: top_left_coords[1],
                label_x: top_left_coords[0] + LABEL_SPACING,
                label_y: top_left_coords[1] + LABEL_SPACING,
                label: label,
                connected: block_lines.length > 0,
                control: false,
                row_index: row_index,
                col_index: col_index,
                lines: block_lines
            };

            // add block
            self.blocks[row_index].columns.push(block);

            // check viewport
            self.checkViewport(col_index, row_index);

            // replace removed block
            if (!_.isUndefined(removed_block)) {
                self.addControl(removed_block[0].row_index);
            }
        };

        /**
         * updateBlock
         *
         * @param col_index
         * @param row_index
         * @param label
         */
        this.updateBlock = function(col_index, row_index, label) {

            // update label
            if (!_.isUndefined(label) && self.blocks[row_index].columns[col_index].label !== label) {
                self.blocks[row_index].columns[col_index].label = label;
            }

            // // update lines
            // if (!_.isUndefined(lines)) {
            //
            //     var line_source_lock_coords     = self.getCoords(col_index, row_index, BLOCK_BOTTOM);
            //
            //     _.forEach(lines, function(line_target_col_index) {
            //
            //         var line_target_coords = [line_target_col_index, row_index + 1];
            //         var line_target_lock_coords     = self.getCoords(line_target_coords[0], line_target_coords[1], BLOCK_TOP);
            //
            //         self.blocks[row_index].columns[col_index].lines.push({
            //             connected: true,
            //             from: [col_index, row_index],
            //             to: line_target_coords,
            //             x1: line_source_lock_coords[0],
            //             y1: line_source_lock_coords[1],
            //             x2: line_target_lock_coords[0],
            //             y2: line_target_lock_coords[1]
            //         });
            //
            //         self.setNodeClass(col_index, row_index, 'connected', true);
            //
            //         // set blocks as connected
            //         self.blocks_waiting_for_connection.push(line_target_coords);
            //     });
            // }
        };

        /**
         * removeBlock
         *
         * @param col_index
         * @param row_index
         */
        this.removeBlock = function(col_index, row_index) {

            if (row_index >= self.blocks.length) {
                return true;
            }

            if (col_index >= self.blocks[row_index].columns.length - 1) {
                return true;
            }

            // remove lines
            _.forEach(self.blocks[row_index].columns[col_index].lines, function(line) {
                self.removeLine(line.from, line.to);
            });

            // remove block
            self.blocks[row_index].columns.splice(col_index, 1);

            // update data
            $s.rows[row_index].columns.splice(col_index, 1);

            // update siblings
            for (var i = col_index; i < (self.blocks[row_index].columns.length); i++) {
                self.updateBlockAfterSiblingAddedOrRemoved(i, row_index);

                // if not last column (control)
                if (i < self.blocks[row_index].columns.length - 1) {
                    $s.rows[row_index].columns[i].data.ui_column_index = i;
                    $s.rows[row_index].columns[i].data.ui_row_index = row_index;
                }
            }

            // update parents
            if (row_index !== 0) {
                var parent_row_index = row_index - 1;
                _.forEach(self.blocks[parent_row_index].columns, function(column, parent_col_index) {
                    _.forEach(column.lines, function(line, line_index) {

                        // if parent connects to this node
                        if (_.isEqual(line.to, [col_index, row_index])) {
                            column.lines.splice(line_index, 1);

                            // update data
                            $s.rows[parent_row_index].columns[parent_col_index].join.splice(line_index, 1);
                        }

                        // if parent connects to a sibling (right) then adjust line target col index
                        if (line.to[0] > col_index) {

                            // update lines target
                            var new_line_to = [line.to[0] - 1, line.to[1]];

                            // get target lock coords
                            var target_lock_coords     = self.getCoords(new_line_to[0], new_line_to[1], BLOCK_TOP);

                            line.to = [new_line_to[0], new_line_to[1]];
                            line.x2 = target_lock_coords[0];
                            line.y2 = target_lock_coords[1];
                        }
                    });
                });
            }

            // update children
            if (row_index !== $s.rows.length - 1) {
                var children_row_index = row_index + 1;
                _.forEach(self.blocks[children_row_index].columns, function(column, children_col_index) {

                    // if  block has no parent connections
                    if (!self.doesNodeHaveConnectedParents(children_col_index, children_row_index)) {
                        self.setAsNotConnectedBlock([children_col_index, children_row_index]);
                    }
                });
            }
        };

        /**
         * insertBlock
         *
         * @param col_index
         * @param row_index
         * @param data
         */
        this.insertBlock = function(col_index, row_index, data) {

            if (row_index >= self.blocks.length) {
                return true;
            }

            if (col_index > self.blocks[row_index].columns.length - 1) {
                return true;
            }

            // get top left coords
            var top_left_coords     = self.getCoords(col_index, row_index, BLOCK_TOP_LEFT);

            // lines
            var block_lines = [];
            var line_source_lock_coords     = self.getCoords(col_index, row_index, BLOCK_BOTTOM);

            _.forEach(data.join, function(line_target_col_index) {

                var line_target_coords          = [line_target_col_index, row_index + 1];
                var line_target_lock_coords     = self.getCoords(line_target_coords[0], line_target_coords[1], BLOCK_TOP);

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
                self.blocks_waiting_for_connection.push(line_target_coords);
            });

            // set block properties
            var block = {
                coords: top_left_coords,
                x: top_left_coords[0],
                y: top_left_coords[1],
                label_x: top_left_coords[0] + LABEL_SPACING,
                label_y: top_left_coords[1] + LABEL_SPACING,
                label: data.label,
                connected: block_lines.length > 0,
                control: false,
                row_index: row_index,
                col_index: col_index,
                lines: block_lines
            };

            // insert block
            self.blocks[row_index].columns.splice(col_index, 0, block);

            // update data
            $s.rows[row_index].columns.splice(col_index, 0, data);

            // update siblings
            for (var i = col_index + 1; i < (self.blocks[row_index].columns.length); i++) {

                self.updateBlockAfterSiblingAddedOrRemoved(i, row_index);

                // if not last column (control)
                if (i < self.blocks[row_index].columns.length - 1) {
                    $s.rows[row_index].columns[i].data.ui_column_index = i;
                    $s.rows[row_index].columns[i].data.ui_row_index = row_index;
                }
            }

            // update parents
            if (row_index !== 0) {
                var parent_row_index = row_index - 1;
                _.forEach(self.blocks[parent_row_index].columns, function(column) {
                    _.forEach(column.lines, function(line) {

                        // if parent connects to a sibling (right) then adjust line target col index
                        if (line.to[0] >= col_index) {

                            // update lines target
                            var new_line_to = [line.to[0] + 1, line.to[1]];

                            // get target lock coords
                            var target_lock_coords     = self.getCoords(new_line_to[0], new_line_to[1], BLOCK_TOP);

                            line.to = [new_line_to[0], new_line_to[1]];
                            line.x2 = target_lock_coords[0];
                            line.y2 = target_lock_coords[1];
                        }
                    });
                });
            }
        };

        /**
         * updateBlockAfterSiblingAddedOrRemoved
         *
         * @param col_index
         * @param row_index
         */
        this.updateBlockAfterSiblingAddedOrRemoved = function(col_index, row_index) {

            var top_left_coords     = self.getCoords(col_index, row_index, BLOCK_TOP_LEFT);
            var center_coords       = self.getCoords(col_index, row_index, BLOCK_CENTER);

            // update block

            self.blocks[row_index].columns[col_index].col_index = col_index;
            self.blocks[row_index].columns[col_index].coords = top_left_coords;
            self.blocks[row_index].columns[col_index].x = top_left_coords[0];
            self.blocks[row_index].columns[col_index].y = top_left_coords[1];

            // update labels
            // last block has different label position
            if (col_index === (self.blocks[row_index].columns.length - 1)) {
                self.blocks[row_index].columns[col_index].label_x = center_coords[0];
                self.blocks[row_index].columns[col_index].label_y = center_coords[1];
            } else {
                self.blocks[row_index].columns[col_index].label_x = top_left_coords[0] + LABEL_SPACING;
                self.blocks[row_index].columns[col_index].label_y = top_left_coords[1] + LABEL_SPACING;
            }

            // update lines
            _.forEach(self.blocks[row_index].columns[col_index].lines, function(line) {

                // get target lock coords
                var source_lock_coords     = self.getCoords(col_index, row_index, BLOCK_TOP);

                line.from = [col_index, row_index];
                line.x1 = source_lock_coords[0];
                line.y1 = source_lock_coords[1];
            });

            // check viewport
            self.checkViewport(col_index, row_index);
        };

        /**
         * updateBlockAfterChildAddedOrRemoved
         *
         * @param col_index
         * @param row_index
         */
        this.updateBlockAfterChildAddedOrRemoved = function(col_index, row_index) {

            var top_left_coords     = self.getCoords(col_index, row_index, BLOCK_TOP_LEFT);
            var center_coords       = self.getCoords(col_index, row_index, BLOCK_CENTER);

            // update block

            self.blocks[row_index].columns[col_index].col_index = col_index;
            self.blocks[row_index].columns[col_index].coords = top_left_coords;
            self.blocks[row_index].columns[col_index].x = top_left_coords[0];
            self.blocks[row_index].columns[col_index].y = top_left_coords[1];

            // update labels
            // last block has different label position
            if (col_index === (self.blocks[row_index].columns.length - 1)) {
                self.blocks[row_index].columns[col_index].label_x = center_coords[0];
                self.blocks[row_index].columns[col_index].label_y = center_coords[1];
            } else {
                self.blocks[row_index].columns[col_index].label_x = top_left_coords[0] + LABEL_SPACING;
                self.blocks[row_index].columns[col_index].label_y = top_left_coords[1] + LABEL_SPACING;
            }

            // update lines
            _.forEach(self.blocks[row_index].columns[col_index].lines, function(line) {

                // get target lock coords
                var source_lock_coords     = self.getCoords(col_index, row_index, BLOCK_TOP);

                line.from = [col_index, row_index];
                line.x1 = source_lock_coords[0];
                line.y1 = source_lock_coords[1];
            });

            // check viewport
            self.checkViewport(col_index, row_index);
        };

        /**
         * addControl
         *
         * @param row_index
         */
        this.addControl = function(row_index) {

            // create row if it doesn't exist
            if (row_index === self.blocks.length) {
                self.blocks.push({columns: []});
            }

            // validate row index
            if (row_index >= self.blocks.length) {
                throw new Error("Invalid row index");
            }

            var col_index = self.blocks[row_index].columns.length;

            // get top left coords
            var top_left_coords     = self.getCoords(col_index, row_index, BLOCK_TOP_LEFT);
            var center_coords       = self.getCoords(col_index, row_index, BLOCK_CENTER);

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
            self.blocks[row_index].columns.push(block);

            // check viewport
            self.checkViewport(col_index, row_index);

        };

        /**
         * addBgGridCol
         *
         * @param index
         */
        this.addBgGridCol = function(index) {

            self.bg_col_grid.push({
                index:  index,
                x:      self.calculateColX(index),
                width:  self.calculateColWidth(index)
            });
        };

        ////////////////////////////////////////////////
        //
        // watchers
        //
        ////////////////////////////////////////////////

        $s.$watch('ctrl.selection', function(newValue, oldValue) {

            if (!_.isUndefined(newValue)) {

                // two selected & target is child of source
                if (newValue.length === 2 && newValue[1][1] > newValue[0][1]) {

                    // new target selection
                    if (newValue.length > oldValue.length) {

                        // add line
                        self.addLine(self.selection[0], self.selection[1]);
                    }

                    // updated target selection
                    else {

                        // update line
                        self.updateLineTarget(self.selection[0], self.selection[1]);
                    }
                }
            }
        }, true);

        $s.$watch('rows', function(newValue) {

            if (!_.isUndefined(newValue)) {

                // init
                if (!initialized) {
                    self.init(newValue, 'columns');
                    initialized = true;
                    return true;
                }

                // update
                self.update(newValue, 'columns');
            }
        }, true);

        ////////////////////////////////////////////////
        //
        // init / update
        //
        ////////////////////////////////////////////////

        /**
         * init
         *
         * @param data
         * @param column_property_name
         */
        this.init = function(data, column_property_name) {

            // add placeholders
            for (var row_index = 0; row_index < INITIAL_GRID_ROWS; row_index++) {

                // add data placeholder
                if (row_index >= data.length) {
                    data.push({columns: []});
                }
            }

            // add blocks
            _.forEach(data, function (row, row_index) {

                _.forEach(row[column_property_name], function (col, col_index) {

                    // add block
                    self.addBlock(col_index, row_index, col.label, col.join);
                });

                // add control
                self.addControl(row_index);
            });

            // add bg_col_grid array
            _.map(new Array(self.grid_col_count), function(col, index) {

                // add bg grid col
                self.addBgGridCol(index);
            });

            // set viewport
            self.setViewport(self.grid_col_count, self.grid_row_count);

            // check active
            self.checkActive();
        };

        /**
         * update
         *
         * @param data
         * @param column_property_name
         */
        this.update = function(data, column_property_name) {

            // add controls
            _.forEach(data, function (row, row_index) {

                // ... if row index exceeds or equals current UI rows
                if (row_index >= self.blocks.length) {
                    self.addControl(row_index);
                }
            });

            // add blocks
            _.forEach(data, function (row, row_index) {
                _.forEach(row[column_property_name], function (col, col_index) {

                    // update block
                    self.updateBlock(col_index, row_index, col.label);

                    // ... if column index exceeds or equals current UI cols (excluding control)
                    if (col_index >= self.blocks[row_index].columns.length - 1) {
                        var label = _.has(col, 'label') ? col.label : "";
                        var lines = _.has(col, 'join') ? col.join : [];
                        self.addBlock(col_index, row_index, label, lines);
                    }
                });
            });

            // set viewport
            self.setViewport(self.grid_col_count, self.grid_row_count);

            // check active
            self.checkActive();
        };

        ////////////////////////////////////////////////
        //
        // api
        //
        ////////////////////////////////////////////////

        /**
         * addLine
         *
         * @param source_coords
         * @param target_coords
         * @param connected
         */

        this.api.addLine = function(source_coords, target_coords, connected) {

            // style block
            self.setNodeClass(source_coords[0], source_coords[1], 'connected', true);

            // set target as waiting for connection
            self.blocks_waiting_for_connection.push(target_coords);

            // add line
            self.addLine(source_coords, target_coords, connected);
        };

        /**
         * insertBlock
         *
         * @param col_index
         * @param row_index
         * @param data
         */

        this.api.insertBlock = function(col_index, row_index, data) {
            self.insertBlock(col_index, row_index, data);
        };

        /**
         * removeBlock
         *
         * @param col_index
         * @param row_index
         */
        this.api.removeBlock = function(col_index, row_index) {
            //console.log(col_index, row_index);
            self.removeBlock(col_index, row_index);
        };
    };

    controller.$inject = [
        '$scope',
        'BLOCK_TOP_LEFT',
        'BLOCK_TOP',
        'BLOCK_CENTER',
        'BLOCK_BOTTOM',
        'ACTION_ADD',
        'ACTION_REMOVE',
        'ACTION_UPDATE',
        'INITIAL_GRID_COLS',
        'INITIAL_GRID_ROWS',
        'BLOCK_WIDTH',
        'BLOCK_HEIGHT',
        'COL_SPACING',
        'ROW_SPACING',
        'LABEL_SPACING',
        'DISABLE_CONTROL_NODES',
        'MAX_VIEWPORT_WIDTH_INCREASE',
        'MAX_VIEWPORT_HEIGHT_INCREASE'
    ];

    angular.module('AngularSvgNodes').controller('AngularSvgNodesController', controller);

})();

(function() {

    "use strict";

    //----------------------------------
    // angular-svg-nodes directive
    //----------------------------------

    var directive = function() {
        return {
            restrict: 'EA',
            scope: {
                rows: "=angularSvgNodes",
                onNodeMouseDown: "&angularSvgNodesNodeMouseDown",
                onNodeMouseUp: "&angularSvgNodesNodeMouseUp",
                onLineAdd: "&angularSvgNodesLineAdd",
                onLineRemove: "&angularSvgNodesLineRemove",
                api: "=angularSvgNodesApi"
            },
            replace: true,
            controller: "AngularSvgNodesController as ctrl",
            link: function (scope, element, attrs, controller) {

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

                element[0].addEventListener("mouseup", controller.onRootDeselect);

                //----------------------------------
                // mouse leave
                //----------------------------------

                element[0].addEventListener("mouseleave", controller.onRootMouseLeave);

            },
            templateUrl: 'views/angular-svg-nodes.html'
        };
    };

    angular.module('AngularSvgNodes').directive('angularSvgNodes', directive);

})();

(function() {
    'use strict';

    //----------------------------------
    // angular-svg-nodes-line directive
    //----------------------------------

    var directive = function() {
        return {
            restrict: 'EA',
            scope: {
                coords:     "=angularSvgNodesLineCoords",
                col_index:  "@angularSvgNodesLineColIndex",
                row_index:  "@angularSvgNodesLineRowIndex",
                line_index: "@angularSvgNodesLineLineIndex",
                onRemoveComplete:   "&angularSvgNodesLineOnRemoveComplete",
                onMoveLineTargetComplete:     "&angularSvgNodesLineonMoveLineTargetComplete",
                onDrawComplete:     "&angularSvgNodesLineOnDrawComplete"
            },
            link: function (scope, element) {

                var ANIM_DURATION = 0.5;

                // control

                var is_initialized = false;
                var source_coords;
                var target_coords;
                var previous_target_coords; // TODO: this feels hacky

                ////////////////////////////////////////////////
                //
                // handlers
                //
                ////////////////////////////////////////////////

                //----------------------------------
                // remove complete
                //----------------------------------

                var onRemoveComplete = function() {

                    var line_index = _.parseInt(scope.line_index);

                    scope.onRemoveComplete({source_coords: source_coords, target_coords: previous_target_coords, line_index: line_index});
                };

                //----------------------------------
                // move line target complete
                //----------------------------------

                var onMoveLineTargetComplete = function() {

                    var line_index = _.parseInt(scope.line_index);

                    scope.onMoveLineTargetComplete({source_coords: source_coords, target_coords: target_coords, line_index: line_index});
                };

                //----------------------------------
                // move line source complete
                //----------------------------------

                var onMoveLineSourceComplete = function() {

                    // var line_index = _.parseInt(scope.line_index);
                    //
                    // scope.onMoveLineTargetComplete({source_coords: source_coords, target_coords: target_coords, line_index: line_index});
                };

                //----------------------------------
                // draw complete
                //----------------------------------

                var onDrawComplete = function() {

                    var line_index = _.parseInt(scope.line_index);

                    scope.onDrawComplete({source_coords: source_coords, target_coords: target_coords, line_index: line_index});
                };

                ////////////////////////////////////////////////
                //
                // utils
                //
                ////////////////////////////////////////////////

                /**
                 * removeLineTarget
                 *
                 * @param x
                 * @param y
                 */
                scope.removeLineTarget = function(x, y) {

                    TweenLite.to(element, ANIM_DURATION, {
                        attr: {x2: x, y2: y},
                        ease: Power4.easeOut,
                        onComplete: onRemoveComplete
                    });
                };

                /**
                 * moveLineTarget
                 *
                 * @param x
                 */
                scope.moveLineTarget = function(x) {

                    TweenLite.to(element, ANIM_DURATION, {
                        attr: {x2: x},
                        ease: Power4.easeOut,
                        onComplete: onMoveLineTargetComplete
                    });
                };

                /**
                 * moveLineSource
                 *
                 * @param x
                 */
                scope.moveLineSource = function(x) {

                    TweenLite.to(element, ANIM_DURATION, {
                        attr: {x1: x},
                        ease: Power4.easeOut,
                        onComplete: onMoveLineSourceComplete
                    });
                };

                /**
                 * drawLine
                 *
                 * @param x1
                 * @param y1
                 * @param x2
                 * @param y2
                 */
                scope.drawLine = function(x1, y1, x2, y2) {

                    TweenLite.set(element, {attr: {x1: x1, y1: y1, x2: x1, y2: y1}});
                    TweenLite.to(element, ANIM_DURATION, {
                        attr: {x2: x2, y2: y2},
                        ease: Power4.easeOut,
                        onComplete: onDrawComplete
                    });
                };

                ////////////////////////////////////////////////
                //
                // watchers
                //
                ////////////////////////////////////////////////

                scope.$watch('coords', function(newValue, oldValue) {

                    if (!_.isUndefined(newValue)) {

                        source_coords = newValue.from;
                        target_coords = newValue.to;
                        previous_target_coords = newValue.previous_to;

                        //console.log("COL: "+oldValue.to[0] +" === "+ newValue.to[0]);
                        //console.log("ROW: "+oldValue.to[1] +" === "+ newValue.to[1]);
                        //console.log("ROW: "+oldValue.y2 +" === "+ newValue.y2);

                        // init
                        if (!is_initialized) {
                            scope.drawLine(newValue.x1, newValue.y1, newValue.x2, newValue.y2);
                            is_initialized = true;
                        }

                        // if only target col coord has changed
                        else if (oldValue.to[1] === newValue.to[1] && oldValue.to[0] !== newValue.to[0]) {
                            scope.moveLineTarget(newValue.x2);
                        }

                        // if only target row coord has changed
                        else if (oldValue.to[0] === newValue.to[0] && oldValue.to[1] !== newValue.to[1]) {
                            scope.removeLineTarget(newValue.x2, newValue.y2);
                        }

                        // if col & row change
                        else if (oldValue.to[1] !== newValue.to[1] && oldValue.to[0] !== newValue.to[0]) {

                            // row decrease
                            if (newValue.to[1] < oldValue.to[1]) {
                                scope.removeLineTarget(newValue.x2, newValue.y2);
                            }

                            // row increase
                            else {
                                // ???
                                console.log("row increase");
                            }
                        }
                        // if source col change
                        else if (oldValue.from[0] !== newValue.from[0]) {
                            scope.moveLineSource(newValue.x1);
                        }
                    }
                }, true);

            }
        };
    };

    angular.module('AngularSvgNodes').directive('angularSvgNodesLine', directive);

})();

(function() {
    'use strict';

    //----------------------------------
    // angular-svg-nodes-node directive
    //----------------------------------

    var directive = function() {
        return {
            restrict: 'EA',
            scope: {
                coords:         "=angularSvgNodesNodeCoords",
                col_index:      "@angularSvgNodesNodeColIndex",
                row_index:      "@angularSvgNodesNodeRowIndex",
                onSelect:       "&angularSvgNodesNodeOnSelect",
                onDeselect:     "&angularSvgNodesNodeOnDeselect",
                onMouseOver:    "&angularSvgNodesNodeOnMouseOver",
                onMouseOut:     "&angularSvgNodesNodeOnMouseOut"
            },
            link: function (scope, element) {

                var curr_x = null;
                var ANIM_DURATION = 0.2;

                ////////////////////////////////////////////////
                //
                // handlers
                //
                ////////////////////////////////////////////////

                //----------------------------------
                // mouse down
                //----------------------------------

                element[0].addEventListener("mousedown", function() {

                    var col_index = _.parseInt(scope.col_index);
                    var row_index = _.parseInt(scope.row_index);

                    // call external handler
                    scope.onSelect({col_index: col_index, row_index: row_index});
                });

                //----------------------------------
                // mouse down
                //----------------------------------

                element[0].addEventListener("mouseover", function() {

                    var col_index = _.parseInt(scope.col_index);
                    var row_index = _.parseInt(scope.row_index);

                    // call external handler
                    scope.onMouseOver({col_index: col_index, row_index: row_index});
                });

                //----------------------------------
                // mouse out
                //----------------------------------

                element[0].addEventListener("mouseout", function(e) {

                    var element_bounds  = element[0].getBoundingClientRect();
                    var mouse_y         = e.clientY;
                    var element_center  = element_bounds.top + (element_bounds.height / 2);
                    //var element_top     = element_bounds.top + VERTICAL_ALLOWANCE;
                    //var element_bottom  = element_bounds.bottom - VERTICAL_ALLOWANCE;

                    //console.log(element_top, element_bottom);
                    //console.log(e.clientY, e.layerY ,e.offsetY ,e.screenY, e.y);

                    var col_index = _.parseInt(scope.col_index);
                    var row_index = _.parseInt(scope.row_index);
                    var exit_side = mouse_y < element_center ? 'top' : 'bottom';

                    // call external handler
                    scope.onMouseOut({col_index: col_index, row_index: row_index, exit_side: exit_side});
                });

                //----------------------------------
                // mouse up
                //----------------------------------

                element[0].addEventListener("mouseup", function() {

                    var col_index = _.parseInt(scope.col_index);
                    var row_index = _.parseInt(scope.row_index);

                    // call external handler
                    scope.onDeselect({col_index: col_index, row_index: row_index});
                });

                //----------------------------------
                // position complete
                //----------------------------------

                var onPositionComplete = function() {

                };

                ////////////////////////////////////////////////
                //
                // watchers
                //
                ////////////////////////////////////////////////

                scope.$watch('coords', function(newValue) {

                    if (!_.isUndefined(newValue)) {
                        var duration = _.isNull(curr_x) ? 0 : ANIM_DURATION;

                        TweenLite.to(element, duration, {
                            x: newValue[0], y: newValue[1],
                            ease: Power4.easeOut,
                            onComplete: onPositionComplete
                        });

                        curr_x = newValue[0];
                    }
                });
            }
        };
    };

    angular.module('AngularSvgNodes').directive('angularSvgNodesNode', directive);

})();

(function() {

    'use strict';

    //----------------------------------
    // AngularSvgNodes Settings
    //----------------------------------

    angular.module('AngularSvgNodes')
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
})();

angular.module('AngularSvgNodes').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/angular-svg-nodes.html',
    "<div class=\"angular-svg-nodes\" ng-style=\"ctrl.wrapper_style\">\n" +
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
    "                <rect ng-attr-width=\"{{ctrl.block_width}}\" ng-attr-height=\"{{ctrl.block_height}}\"\n" +
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
    "                      'control-hover': col.control_hover,\n" +
    "                      }\"\n" +
    "                      angular-svg-nodes-node\n" +
    "                      angular-svg-nodes-node-coords=\"col.coords\"\n" +
    "                      angular-svg-nodes-node-col-index=\"{{col.col_index}}\"\n" +
    "                      angular-svg-nodes-node-row-index=\"{{col.row_index}}\"\n" +
    "                      angular-svg-nodes-node-on-select=\"ctrl.onNodeSelect(col_index, row_index)\"\n" +
    "                      angular-svg-nodes-node-on-deselect=\"ctrl.onNodeDeselect(col_index, row_index)\"\n" +
    "                      angular-svg-nodes-node-on-mouse-out=\"ctrl.onNodeMouseOut(col_index, row_index, exit_side)\"\n" +
    "                      angular-svg-nodes-node-on-mouse-over=\"ctrl.onNodeMouseOver(col_index, row_index)\"></rect>\n" +
    "\n" +
    "                <!-- control label -->\n" +
    "\n" +
    "                <text ng-show=\"col.control\"\n" +
    "                      class=\"angular-svg-nodes-node-label\"\n" +
    "                      ng-class=\"{\n" +
    "                      'control': col.control,\n" +
    "                      'control_hover': col.control_hover,\n" +
    "                      }\"\n" +
    "                      ng-attr-x=\"{{col.label_x}}\" ng-attr-y=\"{{col.label_y}}\"\n" +
    "                      angular-svg-nodes-label\n" +
    "                      angular-svg-nodes-label-coords=\"col\"\n" +
    "                      text-anchor=\"middle\" alignment-baseline=\"middle\">+</text>\n" +
    "\n" +
    "                <!-- label -->\n" +
    "\n" +
    "                <foreignObject ng-show=\"!col.control\"\n" +
    "                               angular-svg-nodes-label\n" +
    "                               angular-svg-nodes-label-coords=\"col\"\n" +
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
