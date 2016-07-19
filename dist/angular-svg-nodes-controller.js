"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _angularSvgNodesSettings = require("./angular-svg-nodes-settings");

var _angularSvgNodesUtils = require("./angular-svg-nodes-utils");

var Utils = _interopRequireWildcard(_angularSvgNodesUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AngularSvgNodesController = function () {
    function AngularSvgNodesController($s) {
        var _this = this;

        _classCallCheck(this, AngularSvgNodesController);

        this.$s = $s;

        if (_.isUndefined(this.api)) {
            this.api = {};
        }

        this.state = [];

        this.config = {
            new_node_label: !_.isUndefined(this.config_new_node_label) ? this.config_new_node_label : _angularSvgNodesSettings.DEFAULT_NEW_NODE_LABEL,
            initial_grid_cols: !_.isUndefined(this.config_initial_grid_cols) ? this.config_initial_grid_cols : _angularSvgNodesSettings.DEFAULT_INITIAL_GRID_COLS,
            initial_grid_rows: !_.isUndefined(this.config_initial_grid_rows) ? this.config_initial_grid_rows : _angularSvgNodesSettings.DEFAULT_INITIAL_GRID_ROWS,
            highlight_node_on: !_.isUndefined(this.config_highlight_node_on) ? this.config_highlight_node_on : _angularSvgNodesSettings.DEFAULT_HIGHLIGHT_NODE_ON,
            block_width: !_.isUndefined(this.config_block_width) ? this.config_block_width : _angularSvgNodesSettings.DEFAULT_BLOCK_WIDTH,
            block_height: !_.isUndefined(this.config_block_height) ? this.config_block_height : _angularSvgNodesSettings.DEFAULT_BLOCK_HEIGHT,
            col_spacing: !_.isUndefined(this.config_col_spacing) ? this.config_col_spacing : _angularSvgNodesSettings.DEFAULT_COL_SPACING,
            row_spacing: !_.isUndefined(this.config_row_spacing) ? this.config_row_spacing : _angularSvgNodesSettings.DEFAULT_ROW_SPACING,
            label_spacing: !_.isUndefined(this.config_label_spacing) ? this.config_label_spacing : _angularSvgNodesSettings.DEFAULT_LABEL_SPACING,
            disable_control_nodes: !_.isUndefined(this.config_disable_control_nodes) ? this.config_disable_control_nodes : _angularSvgNodesSettings.DEFAULT_DISABLE_CONTROL_NODES,
            max_viewport_width_increase: !_.isUndefined(this.config_max_viewport_width_increase) ? this.config_max_viewport_width_increase : _angularSvgNodesSettings.DEFAULT_MAX_VIEWPORT_WIDTH_INCREASE,
            max_viewport_height_increase: !_.isUndefined(this.config_max_viewport_height_increase) ? this.config_max_viewport_height_increase : _angularSvgNodesSettings.DEFAULT_MAX_VIEWPORT_HEIGHT_INCREASE
        };

        this.is_initialising = false;

        this.was_connection_change_called = false;
        this.is_connection_change_busy = false;

        this.blocks_waiting_for_connection = [];

        this.parent_coords = [];

        this.coords = [];

        this.blocks = [];

        this.bg_col_grid = [];
        this.bg_col_grid_hover_index = null;

        this.grid_col_count = this.config.initial_grid_cols;
        this.grid_row_count = this.config.initial_grid_rows;
        this.label_width = this.config.block_width - this.config.label_spacing * 2;
        this.label_height = this.config.block_height - this.config.label_spacing * 2;

        this.wrapper_style = "";
        this.viewport_style = "";
        this.viewport_width = 0;
        this.viewport_height = 0;
        this.viewport_viewbox = "";

        this.selection = [];
        this.source_exit_side = null;

        this.selected_node = [];

        this.highlight_selected_node = {};

        this.new_node = {};

        this.$s.$watch('AngularSvgNodes.selection', function (newValue, oldValue) {

            if (_.isUndefined(newValue)) {
                return;
            }

            if (newValue.length === 2 && newValue[1][1] > newValue[0][1]) {
                if (newValue.length > oldValue.length) {
                    _this.addLine(_this.selection[0], _this.selection[1]);
                } else {
                        _this.updateLineTarget(_this.selection[0], _this.selection[1]);
                    }
            }
        }, true);

        this.$s.$watch('AngularSvgNodes.initial_state', function (newValue, oldValue) {

            _this.init();
        });

        this.api.addRow = function () {
            var label = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

            var _row_index = _this.blocks.length;
            var _col_index = 0;
            _this.addBlock(_col_index, _row_index, label, []);
        };

        this.api.removeNode = function (_row_index, _col_index) {
            _this.removeBlock(_col_index, _row_index);
        };

        this.api.insertNode = function (row_index, col_index, label, connections) {
            _this.insertBlock(col_index, row_index, label, connections);
        };

        this.api.updateNodeConnections = function (row_index, col_index, connections) {

            var _label = _this.blocks[row_index].columns[col_index].label;
            var _lines = _.map(_this.blocks[row_index].columns[col_index].lines, function (line) {
                return _.has(line, 'to') ? line.to[0] : line;
            });
            var _connetions = _.uniq([].concat(_toConsumableArray(_lines), _toConsumableArray(connections)));

            _this.updateBlock(col_index, row_index, _label, _connetions);
        };

        this.api.setNodeLabel = function (row_index, col_index, label) {

            if (row_index >= _this.blocks.length) {
                console.error("AngularSvgNodes Error : invalid row index provided to setNodeLabel");
                return;
            }

            if (col_index >= _this.blocks[row_index].columns.length) {
                console.error("AngularSvgNodes Error : invalid col index provided to setNodeLabel");
                return;
            }

            _this.updateBlock(col_index, row_index, label);
        };

        this.api.setNodeHighlight = function (row_index, col_index, value) {

            if (row_index >= _this.blocks.length) {
                console.error("AngularSvgNodes Error : invalid row index provided to setNodeHighlight");
                return;
            }

            if (col_index >= _this.blocks[row_index].columns.length) {
                console.error("AngularSvgNodes Error : invalid col index provided to setNodeHighlight");
                return;
            }

            _this.blocks[row_index].columns[col_index].highlight = value;
        };
    }

    _createClass(AngularSvgNodesController, [{
        key: "init",
        value: function init() {
            var _this2 = this;

            this.is_initialising = true;

            this.blocks = [];

            var _column_property_name = 'columns';
            var _data = !_.isUndefined(this.initial_state) ? this.initial_state : [];

            for (var row_index = 0; row_index < this.config.initial_grid_rows; row_index++) {
                if (row_index >= _data.length) {
                    _data.push({ columns: [] });
                }
            }

            _.forEach(_data, function (row, row_index) {

                _.forEach(row[_column_property_name], function (col, col_index) {
                    _this2.addBlock(col_index, row_index, col.label, col.join, col);
                });

                _this2.addControl(row_index);
            });

            _.map(new Array(this.grid_col_count), function (col, index) {
                _this2.addBgGridCol(index);
            });

            this.setViewport(this.grid_col_count, this.grid_row_count);

            this.checkActive();

            this.update(_data, _column_property_name);

            this.is_initialising = false;
        }
    }, {
        key: "onNodeSelect",
        value: function onNodeSelect(col_index, row_index) {
            if (this.blocks[row_index].columns[col_index].control) {
                if (!this.config.disable_control_nodes) {
                    this.onControlNodeSelect(col_index, row_index);
                }
                return true;
            }

            this.onBlockNodeSelect(col_index, row_index);

            if (_.includes(this.config.highlight_node_on, _angularSvgNodesSettings.HIGHLIGHT_NODE_ON_SELECT)) {
                if (_.has(this.highlight_selected_node, 'row_index')) {
                    this.blocks[this.highlight_selected_node.row_index].columns[this.highlight_selected_node.col_index].selected = false;
                }

                this.highlight_selected_node.row_index = row_index;
                this.highlight_selected_node.col_index = col_index;

                this.blocks[row_index].columns[col_index].selected = true;
            }

            if (!_.isUndefined(this.onNodeSelectionCallback)) {
                this.onNodeSelectionCallback({ col_index: col_index, row_index: row_index });
            }
        }
    }, {
        key: "onNodeDeselect",
        value: function onNodeDeselect(col_index, row_index) {
            if (this.blocks[row_index].columns[col_index].control) {
                return false;
            }

            this.onBlockNodeDeselect(col_index, row_index);

            var _is_new_node = _.isEqual(this.new_node, { row_index: row_index, col_index: col_index });

            if (_.includes(this.config.highlight_node_on, _angularSvgNodesSettings.HIGHLIGHT_NODE_ON_DESELECT) && !_is_new_node && !this.was_connection_change_called && !this.is_connection_change_busy) {
                if (_.has(this.highlight_selected_node, 'row_index')) {
                    this.blocks[this.highlight_selected_node.row_index].columns[this.highlight_selected_node.col_index].selected = false;
                }

                this.highlight_selected_node.row_index = row_index;
                this.highlight_selected_node.col_index = col_index;

                this.blocks[row_index].columns[col_index].selected = true;
            }

            if (!_.isUndefined(this.onNodeDeselectionCallback) && !_is_new_node && !this.was_connection_change_called && !this.is_connection_change_busy) {
                this.onNodeDeselectionCallback({ col_index: col_index, row_index: row_index });
            }

            this.new_node = {};
            this.was_connection_change_called = false;
        }
    }, {
        key: "onNodeMouseOver",
        value: function onNodeMouseOver(col_index, row_index) {
            if (this.blocks[row_index].columns[col_index].control) {
                this.onControlNodeMouseOver(col_index, row_index);
                return true;
            }

            this.onBlockNodeMouseOver(col_index, row_index);
        }
    }, {
        key: "onNodeMouseOut",
        value: function onNodeMouseOut(col_index, row_index, exit_side) {
            if (this.blocks[row_index].columns[col_index].control) {
                this.onControlNodeMouseOut(col_index, row_index);
                return true;
            }

            this.onBlockNodeMouseOut(col_index, row_index, exit_side);
        }
    }, {
        key: "onControlNodeSelect",
        value: function onControlNodeSelect(col_index, row_index) {

            var _label = _.isFunction(this.config.new_node_label) ? this.config.new_node_label(row_index, col_index) : this.config.new_node_label;

            this.addBlock(col_index, row_index, _label, []);

            this.$s.$apply();
        }
    }, {
        key: "onControlNodeMouseOver",
        value: function onControlNodeMouseOver(col_index, row_index) {
            if (this.selection.length > 0) {
                return false;
            }

            this.setNodeClass(col_index, row_index, 'control_hover', true);

            this.$s.$apply();
        }
    }, {
        key: "onControlNodeMouseOut",
        value: function onControlNodeMouseOut(col_index, row_index) {
            if (this.selection.length > 0) {
                return false;
            }

            this.setNodeClass(col_index, row_index, 'control_hover', false);

            this.$s.$apply();
        }
    }, {
        key: "onBlockNodeSelect",
        value: function onBlockNodeSelect(col_index, row_index) {

            this.setNodeClass(col_index, row_index, 'source_hover', false);
            this.setNodeClass(col_index, row_index, 'source', true);
            this.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', false);
            this.setPotentialNodeClasses(col_index, row_index, 'potential_target', true);

            this.selection = [[col_index, row_index]];
            this.selected_node = [col_index, row_index];

            this.$s.$apply();
        }
    }, {
        key: "onBlockNodeDeselect",
        value: function onBlockNodeDeselect(col_index, row_index) {
            this.source_exit_side = null;

            if (this.selection.length === 1) {
                if (_.isEqual(this.selection[0], [col_index, row_index])) {

                    this.setNodeClass(col_index, row_index, 'source', false);
                    this.setNodeClass(col_index, row_index, 'source_hover', true);
                    this.setPotentialNodeClasses(col_index, row_index, 'potential_target', false);
                    this.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', true);
                }
            } else if (this.selection.length === 2) {
                    if (_.isEqual(this.selection[1], [col_index, row_index])) {

                        this.setNodeClass(col_index, row_index, 'target', false);

                        if (!this.doesNodeHaveConnectedParents(col_index, row_index)) {
                            this.setPotentialNodeClasses(col_index, row_index, 'potential_target', false);
                        }

                        this.checkActive();
                    }
                }

            if (this.selection.length === 2) {
                if (_.isEqual(this.selection[1], [col_index, row_index]) && this.isNodePotential(this.selection[0], [col_index, row_index])) {

                    var is_target_parent = this.selection[0][1] > row_index;

                    if (is_target_parent) {
                        this.removeLine(this.selection[1], this.selection[0]);
                    } else {
                            this.setAsConnectedLines(this.selection, "A");

                            this.checkActive();
                        }
                }
            }
        }
    }, {
        key: "onBlockNodeMouseOver",
        value: function onBlockNodeMouseOver(col_index, row_index) {
            if (this.selection.length === 0) {

                this.setNodeClass(col_index, row_index, 'source_hover', true);
                this.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', true);
            }

            if (this.selection.length === 2) {
                if (this.isNodePotential(this.selection[0], [col_index, row_index])) {

                    this.setNodeClass(col_index, row_index, 'potential_target', false);
                    this.setNodeClass(col_index, row_index, 'target', true);
                    this.setLineClass(this.selection[0], [col_index, row_index], 'target', true);
                }
            }

            if (this.bg_col_grid_hover_index !== col_index) {}

            this.$s.$apply();
        }
    }, {
        key: "onBlockNodeMouseOut",
        value: function onBlockNodeMouseOut(col_index, row_index, exit_side) {
            if (this.selection.length === 0) {

                this.setNodeClass(col_index, row_index, 'source_hover', false);
                this.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', false);
            } else if (this.selection.length === 2) {
                    if (this.isNodePotential(this.selection[0], [col_index, row_index])) {

                        this.setNodeClass(col_index, row_index, 'target', false);
                        this.setNodeClass(col_index, row_index, 'potential_target', true);
                        this.setLineClass(this.selection[0], [col_index, row_index], 'target', false);
                    }
                }

            if (_.isEqual(this.selection[0], [col_index, row_index]) && _.isNull(this.source_exit_side)) {
                if (exit_side === 'top') {
                    this.setPotentialChildNodeClasses(col_index, row_index, 'potential_target', false);
                } else if (exit_side === 'bottom') {
                        this.setPotentialParentNodeClasses(col_index, row_index, 'potential_target', false);
                    }
            }

            if (this.selection.length === 1) {
                if (_.isEqual(this.selection[0], [col_index, row_index])) {
                    this.source_exit_side = exit_side;
                }

                var target_coords;

                if (exit_side === 'top') {

                    target_coords = [this.bg_col_grid_hover_index, row_index - 1];

                    if (this.isNodePotential([col_index, row_index], target_coords)) {
                        this.selection.push(target_coords);
                    }
                } else if (exit_side === 'bottom') {

                        var target_row_index = row_index + 1;
                        target_coords = [this.bg_col_grid_hover_index, target_row_index];

                        if (Math.abs(this.selection[0][1] - target_row_index) <= 1 && this.isNodePotential([col_index, row_index], target_coords)) {

                            this.selection.push(target_coords);
                        }
                    }
            }

            this.$s.$apply();
        }
    }, {
        key: "onRootDeselect",
        value: function onRootDeselect() {
            this.source_exit_side = null;

            if (this.selection.length === 0) {
                return true;
            }

            if (this.selection.length > 0) {

                this.setNodeClass(this.selection[0][0], this.selection[0][1], 'source', false);
                this.setPotentialNodeClasses(this.selection[0][0], this.selection[0][1], 'target', false);
                this.setPotentialNodeClasses(this.selection[0][0], this.selection[0][1], 'potential_target', false);
            }

            if (this.selection.length === 2) {
                this.removeUnconnectedLines(this.selection);
            }

            if (this.selection.length > 0) {
                this.selection = [];
            }

            this.$s.$apply();
        }
    }, {
        key: "onBgColGridMouseOver",
        value: function onBgColGridMouseOver(index) {
            if (this.bg_col_grid_hover_index === index) {
                return true;
            }

            this.bg_col_grid_hover_index = index;

            if (this.selection.length === 1) {

                var target_coords = this.source_exit_side === 'top' ? [index, this.selection[0][1] - 1] : [index, this.selection[0][1] + 1];

                if (this.isNodePotential(this.selection[0], target_coords)) {
                    this.selection.push(target_coords);
                }
            } else if (this.selection.length === 2 && this.isNodePotential(this.selection[0], [index, this.selection[1][1]])) {
                    this.selection[1][0] = index;
                }

            this.$s.$apply();
        }
    }, {
        key: "onRootMouseLeave",
        value: function onRootMouseLeave() {
            if (this.selection.length === 1) {

                this.setNodeClass(this.selection[0][0], this.selection[0][1], 'source', false);
                this.setPotentialNodeClasses(this.selection[0][0], this.selection[0][1], 'potential_target', false);
            } else if (this.selection.length === 2) {

                    this.setNodeClass(this.selection[0][0], this.selection[0][1], 'source', false);
                    this.setNodeClass(this.selection[1][0], this.selection[1][1], 'target', false);
                    this.setPotentialNodeClasses(this.selection[0][0], this.selection[0][1], 'potential_target', false);
                }

            if (this.selection.length === 2) {
                this.removeUnconnectedLines(this.selection);
            }

            this.selection = [];

            this.$s.$apply();
        }
    }, {
        key: "onLineRemoveComplete",
        value: function onLineRemoveComplete(source_coords, target_coords, line_index) {
            var source = this.blocks[source_coords[1]].columns[source_coords[0]];

            source.lines.splice(line_index, 1);

            if (source.lines.length === 0) {
                if (!this.doesNodeHaveConnectedParents(source_coords[0], source_coords[1])) {
                    this.setAsNotConnectedBlock([source_coords[0], source_coords[1]]);
                }
            }

            if (!_.isUndefined(this.onNodeConnectionChangeCallback)) {

                var _params = {
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
    }, {
        key: "onLineDrawComplete",
        value: function onLineDrawComplete(source_coords, target_coords) {
            var _this3 = this;

            var is_block_waiting_for_connection = false;

            _.forEach(this.blocks_waiting_for_connection, function (block, index) {
                if (_.isEqual(block, target_coords)) {
                    is_block_waiting_for_connection = true;
                    _this3.blocks_waiting_for_connection.splice(index, 1);
                    return false;
                }
            });

            if (is_block_waiting_for_connection) {
                this.setAsConnectedBlock(target_coords);
            }

            this.$s.$apply();
        }
    }, {
        key: "checkActive",
        value: function checkActive() {
            var _this4 = this;

            if (this.blocks.length === 0) {
                return false;
            }

            _.forEach(this.blocks[0].columns, function (col, col_index) {
                if (col.lines.length > 0) {
                    _this4.activateBlock(col_index, 0);
                }
            });
        }
    }, {
        key: "activateBlock",
        value: function activateBlock(col_index, row_index) {
            var _this5 = this;

            var block = this.blocks[row_index].columns[col_index];
            block.active = true;

            if (block.lines.length > 0) {

                _.forEach(block.lines, function (line) {
                    line.active = true;

                    _this5.activateBlock(line.to[0], line.to[1]);
                });
            }
        }
    }, {
        key: "deactivateBlock",
        value: function deactivateBlock(col_index, row_index) {
            var _this6 = this;

            var block = this.blocks[row_index].columns[col_index];
            block.active = false;

            if (block.lines.length > 0) {
                _.forEach(block.lines, function (line) {
                    line.active = false;

                    var does_parent_have_active_nodes = _this6.doesNodeHaveActiveParents(line.to[0], line.to[1]);

                    if (!does_parent_have_active_nodes) {
                        _this6.deactivateBlock(line.to[0], line.to[1]);
                    }
                });
            }
        }
    }, {
        key: "doesNodeHaveActiveParents",
        value: function doesNodeHaveActiveParents(col_index, row_index, exclude_coords) {

            if (row_index === 0) {
                return false;
            }

            var result = false;
            var parent_row_index = row_index - 1;
            var parents = this.blocks[parent_row_index].columns;

            _.forEach(parents, function (parent, parent_col_index) {
                _.forEach(parent.lines, function (line) {
                    if (!_.isEqual([parent_col_index, parent_row_index], exclude_coords) && _.isEqual(line.to, [col_index, row_index]) && parent.active) {
                        result = true;
                    }
                });
            });

            return result;
        }
    }, {
        key: "doesNodeHaveConnectedParents",
        value: function doesNodeHaveConnectedParents(col_index, row_index, exclude_coords) {
            var _this7 = this;

            if (row_index === 0) {
                return false;
            }

            if (_.isUndefined(exclude_coords)) {
                exclude_coords = [];
            }

            var result = false;
            var parent_row_index = row_index - 1;
            var parents = this.blocks[parent_row_index].columns;

            _.forEach(parents, function (parent, parent_col_index) {
                if (!_.isEqual([parent_col_index, parent_row_index], exclude_coords) && _this7.isNodePotential([col_index, row_index], [parent_col_index, parent_row_index])) {

                    result = true;
                    return false;
                }
            });

            return result;
        }
    }, {
        key: "isNodePotential",
        value: function isNodePotential(source_coords, target_coords) {
            if (_.isUndefined(this.blocks[target_coords[1]])) {
                return false;
            }
            if (_.isUndefined(this.blocks[target_coords[1]].columns[target_coords[0]])) {
                return false;
            }

            if (this.blocks[target_coords[1]].columns[target_coords[0]].control) {
                return false;
            }

            if (source_coords[1] === target_coords[1]) {
                return false;
            }

            if (Math.abs(source_coords[1] - target_coords[1]) > 1) {
                return false;
            }

            if (target_coords[1] >= this.blocks.length) {
                return false;
            }

            if (target_coords[0] >= this.blocks[target_coords[1]].columns.length) {
                return false;
            }

            var is_target_parent = target_coords[1] < source_coords[1];
            var source = this.blocks[source_coords[1]].columns[source_coords[0]];
            var target = this.blocks[target_coords[1]].columns[target_coords[0]];
            var result;

            if (is_target_parent) {

                result = false;

                if (this.source_exit_side === 'bottom') {
                    return false;
                }

                _.forEach(target.lines, function (line) {
                    if (line.connected && _.isEqual(line.to, source_coords)) {
                        result = true;
                        return false;
                    }
                });
            } else {

                    result = true;

                    if (this.source_exit_side === 'top') {
                        return false;
                    }

                    _.forEach(source.lines, function (line) {
                        if (line.connected && _.isEqual(line.to, target_coords)) {
                            result = false;
                            return false;
                        }
                    });
                }

            return result;
        }
    }, {
        key: "setLineClass",
        value: function setLineClass(source_coords, target_coords, key, value) {
            _.forEach(this.blocks[source_coords[1]].columns[source_coords[0]].lines, function (line) {
                if (_.isEqual(line.to, target_coords)) {
                    line[key] = value;
                }
            });
        }
    }, {
        key: "setNodeClass",
        value: function setNodeClass(col_index, row_index, key, value) {
            if (_.has(this.blocks[row_index].columns[col_index], key)) {
                this.blocks[row_index].columns[col_index][key] = value;
            }
        }
    }, {
        key: "setPotentialNodeClasses",
        value: function setPotentialNodeClasses(col_index, row_index, key, value) {

            this.setPotentialChildNodeClasses(col_index, row_index, key, value);
            this.setPotentialParentNodeClasses(col_index, row_index, key, value);
        }
    }, {
        key: "setPotentialChildNodeClasses",
        value: function setPotentialChildNodeClasses(col_index, row_index, key, value) {
            var _this8 = this;

            if (row_index + 1 < this.blocks.length) {
                _.forEach(this.blocks[row_index + 1].columns, function (child_col, child_col_index) {
                    if (_this8.isNodePotential([col_index, row_index], [child_col_index, row_index + 1])) {
                        child_col[key] = value;
                    }
                });
            }
        }
    }, {
        key: "setPotentialParentNodeClasses",
        value: function setPotentialParentNodeClasses(col_index, row_index, key, value) {
            var _this9 = this;

            if (row_index > 0) {
                _.forEach(this.blocks[row_index - 1].columns, function (parent_col, parent_col_index) {
                    if (_this9.isNodePotential([col_index, row_index], [parent_col_index, row_index - 1])) {
                        parent_col[key] = value;
                    }
                });
            }
        }
    }, {
        key: "setViewport",
        value: function setViewport(cols, rows) {

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
                'max-width': this.viewport_width + this.config.max_viewport_width_increase + "px",
                'min-width': this.viewport_width + "px",
                'max-height': this.viewport_height + this.config.max_viewport_height_increase * rows + "px",
                'min-height': this.viewport_height + "px"
            };

            this.viewport_viewbox = " 0 0 " + this.viewport_width + " " + this.viewport_height;
        }
    }, {
        key: "checkViewport",
        value: function checkViewport(col_index, row_index) {

            var should_update_viewport = false;

            if (row_index >= this.grid_row_count) {
                this.grid_row_count++;
                should_update_viewport = true;
            }

            if (col_index >= this.grid_col_count) {
                this.grid_col_count++;
                should_update_viewport = true;

                this.addBgGridCol(this.grid_col_count - 1);
            }

            if (should_update_viewport) {
                this.setViewport(this.grid_col_count, this.grid_row_count);
            }
        }
    }, {
        key: "calculateColX",
        value: function calculateColX(index) {
            if (index === 0) {
                return 0;
            }
            var first_col_width = this.config.block_width + this.config.col_spacing / 2;
            var col_width = this.config.block_width + this.config.col_spacing;
            return first_col_width + (index - 1) * col_width;
        }
    }, {
        key: "calculateColWidth",
        value: function calculateColWidth(index) {
            var total_item_width = index === 0 ? this.config.block_width + this.config.col_spacing / 2 : this.config.block_width + this.config.col_spacing;
            return total_item_width;
        }
    }, {
        key: "calculateRowY",
        value: function calculateRowY(index) {
            var row_height = this.config.block_height + this.config.row_spacing;
            return index * row_height;
        }
    }, {
        key: "calculateRowHeight",
        value: function calculateRowHeight() {
            return this.config.block_height + this.config.row_spacing;
        }
    }, {
        key: "addLine",
        value: function addLine(source_coords, target_coords, connected) {
            if (target_coords[1] >= this.blocks.length) {
                return false;
            }

            var source_lock_coords = Utils.getCoords(source_coords[0], source_coords[1], _angularSvgNodesSettings.BLOCK_BOTTOM, this.config);
            var target_lock_coords = Utils.getCoords(target_coords[0], target_coords[1], _angularSvgNodesSettings.BLOCK_TOP, this.config);

            this.blocks[source_coords[1]].columns[source_coords[0]].lines.push({
                connected: !_.isUndefined(connected) ? connected : false,
                from: source_coords,
                to: target_coords,
                x1: source_lock_coords[0],
                y1: source_lock_coords[1],
                x2: target_lock_coords[0],
                y2: target_lock_coords[1]
            });

            if (connected) {}
        }
    }, {
        key: "updateLineTarget",
        value: function updateLineTarget(source_coords, target_coords) {
            var target_lock_coords = Utils.getCoords(target_coords[0], target_coords[1], _angularSvgNodesSettings.BLOCK_TOP, this.config);

            _.forEach(this.blocks[source_coords[1]].columns[source_coords[0]].lines, function (line) {

                if (_.isEqual(line.from, source_coords) && _.isEqual(line.to, target_coords)) {

                    line.x2 = target_lock_coords[0];
                    line.y2 = target_lock_coords[1];
                    line.to = target_coords;
                    return false;
                }
            });
        }
    }, {
        key: "removeLine",
        value: function removeLine(source_coords, target_coords) {
            var _this10 = this;

            this.is_connection_change_busy = true;

            var target_lock_coords = Utils.getCoords(source_coords[0], source_coords[1], _angularSvgNodesSettings.BLOCK_BOTTOM, this.config);

            _.forEach(this.blocks[source_coords[1]].columns[source_coords[0]].lines, function (line) {

                if (_.isEqual(line.from, source_coords) && _.isEqual(line.to, target_coords)) {

                    var block = _this10.blocks[target_coords[1]].columns[target_coords[0]];
                    var block_has_connected_parents = _this10.doesNodeHaveConnectedParents(target_coords[0], target_coords[1], source_coords);

                    if (block.lines.length === 0 && !block_has_connected_parents) {
                        _this10.setAsNotConnectedBlock(target_coords);
                    }

                    var block_has_active_parents = _this10.doesNodeHaveActiveParents(target_coords[0], target_coords[1], source_coords);

                    if (!block_has_active_parents) {
                        _this10.deactivateBlock(target_coords[0], target_coords[1]);
                    }

                    line.x2 = target_lock_coords[0];
                    line.y2 = target_lock_coords[1];
                    line.previous_to = line.to;
                    line.to = [source_coords[0], source_coords[1]];
                    return false;
                }
            });
        }
    }, {
        key: "removeUnconnectedLines",
        value: function removeUnconnectedLines(selection) {
            var _this11 = this;

            _.forEach(this.blocks[selection[0][1]].columns[selection[0][0]].lines, function (line) {
                if (!line.connected) {
                    _this11.removeLine(_this11.selection[0], _this11.selection[1]);
                }
            });
        }
    }, {
        key: "setAsConnectedLines",
        value: function setAsConnectedLines(selection) {
            var _this12 = this;

            _.forEach(this.blocks[selection[0][1]].columns[selection[0][0]].lines, function (line, line_index) {
                if (!line.connected) {
                    line.connected = true;

                    _this12.setAsConnectedBlock(line.from);
                    _this12.setAsConnectedBlock(line.to);

                    if (!_.isUndefined(_this12.onNodeConnectionChangeCallback)) {
                        _this12.was_connection_change_called = true;

                        var _params = {
                            source_row_index: line.from[1],
                            source_col_index: line.from[0],
                            target_row_index: line.to[1],
                            target_col_index: line.to[0],
                            is_connected: true
                        };
                        _this12.onNodeConnectionChangeCallback(_params);
                    }
                }
            });
        }
    }, {
        key: "setAsConnectedBlock",
        value: function setAsConnectedBlock(coords) {
            this.blocks[coords[1]].columns[coords[0]].connected = true;
        }
    }, {
        key: "setAsNotConnectedBlock",
        value: function setAsNotConnectedBlock(coords) {
            this.blocks[coords[1]].columns[coords[0]].connected = false;
        }
    }, {
        key: "addBlock",
        value: function addBlock(col_index, row_index, label, lines, data) {
            var _this13 = this;

            if (row_index > this.blocks.length) {
                throw new Error("Invalid row index");
            }

            if (row_index === this.blocks.length) {
                this.blocks.push({ columns: [] });
            }

            var removed_block;

            if (!_.isUndefined(this.blocks[row_index].columns[col_index])) {
                removed_block = this.blocks[row_index].columns.splice(col_index, 1);
            }

            var top_left_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_TOP_LEFT, this.config);

            var block_lines = [];
            var line_source_lock_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_BOTTOM, this.config);

            _.forEach(lines, function (line_target_col_index) {

                var line_target_coords = [line_target_col_index, row_index + 1];
                var line_target_lock_coords = Utils.getCoords(line_target_coords[0], line_target_coords[1], _angularSvgNodesSettings.BLOCK_TOP, _this13.config);

                block_lines.push({
                    connected: true,
                    from: [col_index, row_index],
                    to: line_target_coords,
                    x1: line_source_lock_coords[0],
                    y1: line_source_lock_coords[1],
                    x2: line_target_lock_coords[0],
                    y2: line_target_lock_coords[1]
                });

                _this13.blocks_waiting_for_connection.push(line_target_coords);
            });

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

            if (block.selected) {
                if (_.has(this.highlight_selected_node, 'row_index')) {
                    this.blocks[this.highlight_selected_node.row_index].columns[this.highlight_selected_node.col_index].selected = false;
                }

                this.highlight_selected_node.row_index = block.row_index;
                this.highlight_selected_node.col_index = block.col_index;
            }

            this.blocks[row_index].columns.push(block);

            this.checkViewport(col_index, row_index);

            if (!_.isUndefined(removed_block)) {
                this.addControl(removed_block[0].row_index);
            }

            this.new_node = { row_index: row_index, col_index: col_index };

            if (_.includes(this.config.highlight_node_on, _angularSvgNodesSettings.HIGHLIGHT_NODE_ON_ADD) && !this.is_initialising) {
                if (_.has(this.highlight_selected_node, 'row_index')) {
                    this.blocks[this.highlight_selected_node.row_index].columns[this.highlight_selected_node.col_index].selected = false;
                }

                this.highlight_selected_node.row_index = row_index;
                this.highlight_selected_node.col_index = col_index;

                this.blocks[row_index].columns[col_index].selected = true;
            }

            if (!_.isUndefined(this.onNodeAddedCallback) && !this.is_initialising) {
                this.onNodeAddedCallback({ row_index: row_index, col_index: col_index });
            }
        }
    }, {
        key: "updateBlock",
        value: function updateBlock(col_index, row_index, label) {
            var _this14 = this;

            var lines = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

            if (!_.isUndefined(label) && this.blocks[row_index].columns[col_index].label !== label) {
                this.blocks[row_index].columns[col_index].label = label;
            }

            if (!_.isUndefined(lines)) {

                var line_source_lock_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_BOTTOM, this.config);

                _.forEach(lines, function (line_target_col_index) {

                    var line_target_coords = [line_target_col_index, row_index + 1];
                    var line_target_lock_coords = Utils.getCoords(line_target_coords[0], line_target_coords[1], _angularSvgNodesSettings.BLOCK_TOP, _this14.config);

                    if (_.includes(_.map(_this14.blocks[row_index].columns[col_index].lines, function (line) {
                        return line.to[0];
                    }), line_target_col_index)) {
                        return;
                    }

                    _this14.blocks[row_index].columns[col_index].lines.push({
                        connected: true,
                        from: [col_index, row_index],
                        to: line_target_coords,
                        x1: line_source_lock_coords[0],
                        y1: line_source_lock_coords[1],
                        x2: line_target_lock_coords[0],
                        y2: line_target_lock_coords[1]
                    });

                    _this14.setNodeClass(col_index, row_index, 'connected', true);

                    _this14.blocks_waiting_for_connection.push(line_target_coords);
                });
            }
        }
    }, {
        key: "removeBlock",
        value: function removeBlock(col_index, row_index) {
            var _this15 = this;

            if (row_index >= this.blocks.length) {
                return true;
            }

            if (col_index >= this.blocks[row_index].columns.length - 1) {
                return true;
            }

            _.forEach(this.blocks[row_index].columns[col_index].lines, function (line) {
                _this15.removeLine(line.from, line.to);
            });

            this.blocks[row_index].columns.splice(col_index, 1);

            for (var i = col_index; i < this.blocks[row_index].columns.length; i++) {
                this.updateBlockAfterSiblingAddedOrRemoved(i, row_index);

                if (i < this.blocks[row_index].columns.length - 1) {}
            }

            if (row_index !== 0) {
                var parent_row_index = row_index - 1;
                _.forEach(this.blocks[parent_row_index].columns, function (column, parent_col_index) {
                    _.forEach(column.lines, function (line, line_index) {
                        if (_.isEqual(line.to, [col_index, row_index])) {
                            column.lines.splice(line_index, 1);

                            if (column.lines.length === 0) {
                                _this15.setAsNotConnectedBlock([parent_col_index, parent_row_index]);
                            }
                        }

                        if (line.to[0] > col_index) {
                            var new_line_to = [line.to[0] - 1, line.to[1]];

                            var target_lock_coords = Utils.getCoords(new_line_to[0], new_line_to[1], _angularSvgNodesSettings.BLOCK_TOP, _this15.config);

                            line.to = [new_line_to[0], new_line_to[1]];
                            line.x2 = target_lock_coords[0];
                            line.y2 = target_lock_coords[1];
                        }
                    });
                });
            }

            if (row_index !== this.blocks.length - 1) {
                var children_row_index = row_index + 1;
                _.forEach(this.blocks[children_row_index].columns, function (column, children_col_index) {
                    if (!_this15.doesNodeHaveConnectedParents(children_col_index, children_row_index)) {
                        _this15.setAsNotConnectedBlock([children_col_index, children_row_index]);
                    }
                });
            }
        }
    }, {
        key: "insertBlock",
        value: function insertBlock(col_index, row_index, label, joins) {
            var _this16 = this;

            if (row_index >= this.blocks.length) {
                return true;
            }

            if (col_index > this.blocks[row_index].columns.length - 1) {
                return true;
            }

            var top_left_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_TOP_LEFT, this.config);

            var block_lines = [];
            var line_source_lock_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_BOTTOM, this.config);

            _.forEach(joins, function (line_target_col_index) {

                var line_target_coords = [line_target_col_index, row_index + 1];
                var line_target_lock_coords = Utils.getCoords(line_target_coords[0], line_target_coords[1], _angularSvgNodesSettings.BLOCK_TOP, _this16.config);

                block_lines.push({
                    connected: true,
                    from: [col_index, row_index],
                    to: line_target_coords,
                    x1: line_source_lock_coords[0],
                    y1: line_source_lock_coords[1],
                    x2: line_target_lock_coords[0],
                    y2: line_target_lock_coords[1]
                });

                _this16.blocks_waiting_for_connection.push(line_target_coords);
            });

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

            this.blocks[row_index].columns.splice(col_index, 0, block);

            for (var i = col_index + 1; i < this.blocks[row_index].columns.length; i++) {

                this.updateBlockAfterSiblingAddedOrRemoved(i, row_index);
            }

            if (row_index !== 0) {
                var parent_row_index = row_index - 1;
                _.forEach(this.blocks[parent_row_index].columns, function (column) {
                    _.forEach(column.lines, function (line) {
                        if (line.to[0] >= col_index) {
                            var new_line_to = [line.to[0] + 1, line.to[1]];

                            var target_lock_coords = Utils.getCoords(new_line_to[0], new_line_to[1], _angularSvgNodesSettings.BLOCK_TOP, _this16.config);

                            line.to = [new_line_to[0], new_line_to[1]];
                            line.x2 = target_lock_coords[0];
                            line.y2 = target_lock_coords[1];
                        }
                    });
                });
            }
        }
    }, {
        key: "updateBlockAfterSiblingAddedOrRemoved",
        value: function updateBlockAfterSiblingAddedOrRemoved(col_index, row_index) {
            var _this17 = this;

            var top_left_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_TOP_LEFT, this.config);
            var center_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_CENTER, this.config);

            this.blocks[row_index].columns[col_index].col_index = col_index;
            this.blocks[row_index].columns[col_index].coords = top_left_coords;
            this.blocks[row_index].columns[col_index].x = top_left_coords[0];
            this.blocks[row_index].columns[col_index].y = top_left_coords[1];

            if (col_index === this.blocks[row_index].columns.length - 1) {
                this.blocks[row_index].columns[col_index].label_x = center_coords[0];
                this.blocks[row_index].columns[col_index].label_y = center_coords[1];
            } else {
                this.blocks[row_index].columns[col_index].label_x = top_left_coords[0] + this.config.label_spacing;
                this.blocks[row_index].columns[col_index].label_y = top_left_coords[1] + this.config.label_spacing;
            }

            _.forEach(this.blocks[row_index].columns[col_index].lines, function (line) {
                var source_lock_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_TOP, _this17.config);

                line.from = [col_index, row_index];
                line.x1 = source_lock_coords[0];
                line.y1 = source_lock_coords[1];
            });

            this.checkViewport(col_index, row_index);
        }
    }, {
        key: "updateBlockAfterChildAddedOrRemoved",
        value: function updateBlockAfterChildAddedOrRemoved(col_index, row_index) {
            var _this18 = this;

            var top_left_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_TOP_LEFT, this.config);
            var center_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_CENTER, this.config);

            this.blocks[row_index].columns[col_index].col_index = col_index;
            this.blocks[row_index].columns[col_index].coords = top_left_coords;
            this.blocks[row_index].columns[col_index].x = top_left_coords[0];
            this.blocks[row_index].columns[col_index].y = top_left_coords[1];

            if (col_index === this.blocks[row_index].columns.length - 1) {
                this.blocks[row_index].columns[col_index].label_x = center_coords[0];
                this.blocks[row_index].columns[col_index].label_y = center_coords[1];
            } else {
                this.blocks[row_index].columns[col_index].label_x = top_left_coords[0] + this.config.label_spacing;
                this.blocks[row_index].columns[col_index].label_y = top_left_coords[1] + this.config.label_spacing;
            }

            _.forEach(this.blocks[row_index].columns[col_index].lines, function (line) {
                var source_lock_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_TOP, _this18.config);

                line.from = [col_index, row_index];
                line.x1 = source_lock_coords[0];
                line.y1 = source_lock_coords[1];
            });

            this.checkViewport(col_index, row_index);
        }
    }, {
        key: "addControl",
        value: function addControl(row_index) {
            if (row_index === this.blocks.length) {
                this.blocks.push({ columns: [] });
            }

            if (row_index >= this.blocks.length) {
                throw new Error("Invalid row index");
            }

            var col_index = this.blocks[row_index].columns.length;

            var top_left_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_TOP_LEFT, this.config);
            var center_coords = Utils.getCoords(col_index, row_index, _angularSvgNodesSettings.BLOCK_CENTER, this.config);

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

            this.blocks[row_index].columns.push(block);

            this.checkViewport(col_index, row_index);
        }
    }, {
        key: "addBgGridCol",
        value: function addBgGridCol(index) {

            this.bg_col_grid.push({
                index: index,
                x: this.calculateColX(index),
                width: this.calculateColWidth(index)
            });
        }
    }, {
        key: "update",
        value: function update(data, column_property_name) {
            var _this19 = this;

            _.forEach(data, function (row, row_index) {
                if (row_index >= _this19.blocks.length) {
                    _this19.addControl(row_index);
                }
            });

            _.forEach(data, function (row, row_index) {
                _.forEach(row[column_property_name], function (col, col_index) {
                    _this19.updateBlock(col_index, row_index, col.label);

                    if (col_index >= _this19.blocks[row_index].columns.length - 1) {
                        var label = _.has(col, 'label') ? col.label : "";
                        var lines = _.has(col, 'join') ? col.join : [];
                        _this19.addBlock(col_index, row_index, label, lines);
                    }
                });
            });

            this.setViewport(this.grid_col_count, this.grid_row_count);

            this.checkActive();
        }
    }]);

    return AngularSvgNodesController;
}();

exports.default = AngularSvgNodesController;


AngularSvgNodesController.$inject = ['$scope'];
//# sourceMappingURL=sourcemaps/angular-svg-nodes-controller.js.map
