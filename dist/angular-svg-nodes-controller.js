"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _angularSvgNodesSettings = require("./angular-svg-nodes-settings");

var _nodeSettings = require("./node/node-settings");

var _angularSvgNodesUtils = require("./angular-svg-nodes-utils");

var Utils = _interopRequireWildcard(_angularSvgNodesUtils);

var _nodeUtils = require("./node/node-utils");

var NodeUtils = _interopRequireWildcard(_nodeUtils);

var _apiValidator = require("./api/api-validator");

var ApiValidator = _interopRequireWildcard(_apiValidator);

var _nodeModel = require("./node/node-model");

var _nodeModel2 = _interopRequireDefault(_nodeModel);

var _rowModel = require("./row/row-model");

var _rowModel2 = _interopRequireDefault(_rowModel);

var _lineModel = require("./line/line-model");

var _lineModel2 = _interopRequireDefault(_lineModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
            new_node_label: !_.isUndefined(this.config_new_node_label) ? this.config_new_node_label : _nodeSettings.DEFAULT_NEW_NODE_LABEL,
            initial_grid_cols: !_.isUndefined(this.config_initial_grid_cols) ? this.config_initial_grid_cols : _angularSvgNodesSettings.DEFAULT_INITIAL_GRID_COLS,
            initial_grid_rows: !_.isUndefined(this.config_initial_grid_rows) ? this.config_initial_grid_rows : _angularSvgNodesSettings.DEFAULT_INITIAL_GRID_ROWS,
            highlight_node_on: !_.isUndefined(this.config_highlight_node_on) ? this.config_highlight_node_on : _angularSvgNodesSettings.DEFAULT_HIGHLIGHT_NODE_ON,
            node_width: !_.isUndefined(this.config_node_width) ? this.config_node_width : _angularSvgNodesSettings.DEFAULT_NODE_WIDTH,
            node_height: !_.isUndefined(this.config_node_height) ? this.config_node_height : _angularSvgNodesSettings.DEFAULT_NODE_HEIGHT,
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

        this.nodes_waiting_for_connection = [];

        this.parent_coords = [];

        this.coords = [];

        this.nodes = [];

        this.bg_col_grid = [];
        this.bg_col_grid_hover_index = null;

        this.grid_col_count = this.config.initial_grid_cols;
        this.grid_row_count = this.config.initial_grid_rows;
        this.label_width = this.config.node_width - this.config.label_spacing * 2;
        this.label_height = this.config.node_height - this.config.label_spacing * 2;

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

        this.$s.$watch('AngularSvgNodes.selection', this.onSelectionChange.bind(this), true);
        this.$s.$watch('AngularSvgNodes.initial_state', this.onInitialStateChange.bind(this));

        this.api.addRow = function () {
            var label = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];


            var _row_index = _this.nodes.length;
            var _col_index = 0;

            _this.addNode(_row_index, _col_index, label, []);
            _this.addControlNode(_row_index);
        };

        this.api.removeNode = function (row_index, col_index) {

            if (!ApiValidator.areApiCoordsValid(_this.nodes, row_index, col_index)) {
                return;
            }

            _this.removeNode(row_index, col_index);
        };

        this.api.insertNode = function (row_index, col_index, label, connections) {

            if (!ApiValidator.areApiCoordsValidForInsert(_this.nodes, row_index, col_index)) {
                return;
            }
            if (!ApiValidator.areApiConnectionsValid(_this.nodes, row_index - 1, connections)) {
                return;
            }

            _this.insertNode(row_index, col_index, label, connections);
        };

        this.api.updateNodeConnections = function (row_index, col_index, connections) {

            if (!ApiValidator.areApiCoordsValid(_this.nodes, row_index, col_index)) {
                return;
            }
            if (!ApiValidator.areApiConnectionsValid(_this.nodes, row_index, connections)) {
                return;
            }

            var _label = _this.nodes[row_index].columns[col_index].label;
            var _lines = _.map(_this.nodes[row_index].columns[col_index].lines, function (line) {
                return _.has(line, 'to') ? line.to[0] : line;
            });
            var _connections = _.uniq([].concat(_toConsumableArray(_lines), _toConsumableArray(connections)));

            _this.updateNode(row_index, col_index, _label, _connections);
        };

        this.api.setNodeLabel = function (row_index, col_index, label) {

            if (!ApiValidator.areApiCoordsValid(_this.nodes, row_index, col_index)) {
                return;
            }

            _this.updateNode(row_index, col_index, label);
        };

        this.api.setNodeHighlight = function (row_index, col_index, value) {

            if (!ApiValidator.areApiCoordsValid(_this.nodes, row_index, col_index)) {
                return;
            }

            _this.nodes[row_index].columns[col_index].highlight = value;
        };
    }

    _createClass(AngularSvgNodesController, [{
        key: "init",
        value: function init() {
            var _this2 = this;

            this.is_initialising = true;

            this.nodes = [];

            var _column_property_name = 'columns';
            var _data = !_.isUndefined(this.initial_state) ? this.initial_state : [];

            _.forEach(_data, function (row, row_index) {

                _.forEach(row[_column_property_name], function (col, col_index) {

                    _this2.addNode(row_index, col_index, col.label, col.connections, col);
                });

                _this2.addControlNode(row_index);
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
        key: "onSelectionChange",
        value: function onSelectionChange(newValue, oldValue) {

            if (_.isUndefined(newValue)) {
                return;
            }

            if (newValue.length === 2 && newValue[1][1] > newValue[0][1]) {
                if (newValue.length > oldValue.length) {
                    this.addLine(this.selection[0], this.selection[1]);
                } else {
                        this.updateLineTarget(this.selection[0], this.selection[1]);
                    }
            }
        }
    }, {
        key: "onInitialStateChange",
        value: function onInitialStateChange(newValue, oldValue) {
            this.init();
        }
    }, {
        key: "onNodeSelect",
        value: function onNodeSelect(row_index, col_index) {
            if (this.nodes[row_index].columns[col_index].control) {
                if (!this.config.disable_control_nodes) {
                    this.onControlNodeSelect(row_index, col_index);
                }
                return true;
            }

            this.onNodeNodeSelect(row_index, col_index);

            if (_.includes(this.config.highlight_node_on, _angularSvgNodesSettings.HIGHLIGHT_NODE_ON_SELECT)) {
                if (_.has(this.highlight_selected_node, 'row_index')) {
                    this.nodes[this.highlight_selected_node.row_index].columns[this.highlight_selected_node.col_index].selected = false;
                }

                this.highlight_selected_node.row_index = row_index;
                this.highlight_selected_node.col_index = col_index;

                this.nodes[row_index].columns[col_index].selected = true;
            }

            if (!_.isUndefined(this.onNodeSelectionCallback)) {
                this.onNodeSelectionCallback({ row_index: row_index, col_index: col_index });
            }
        }
    }, {
        key: "onNodeDeselect",
        value: function onNodeDeselect(row_index, col_index) {
            if (this.nodes[row_index].columns[col_index].control) {
                return false;
            }

            this.onNodeNodeDeselect(row_index, col_index);

            var _is_new_node = _.isEqual(this.new_node, { row_index: row_index, col_index: col_index });

            if (_.includes(this.config.highlight_node_on, _angularSvgNodesSettings.HIGHLIGHT_NODE_ON_DESELECT) && !_is_new_node && !this.was_connection_change_called && !this.is_connection_change_busy) {
                if (_.has(this.highlight_selected_node, 'row_index')) {
                    this.nodes[this.highlight_selected_node.row_index].columns[this.highlight_selected_node.col_index].selected = false;
                }

                this.highlight_selected_node.row_index = row_index;
                this.highlight_selected_node.col_index = col_index;

                this.nodes[row_index].columns[col_index].selected = true;
            }

            if (!_.isUndefined(this.onNodeDeselectionCallback) && !_is_new_node && !this.was_connection_change_called && !this.is_connection_change_busy) {
                this.onNodeDeselectionCallback({ row_index: row_index, col_index: col_index });
            }

            this.new_node = {};
            this.was_connection_change_called = false;
        }
    }, {
        key: "onNodeMouseOver",
        value: function onNodeMouseOver(row_index, col_index) {
            if (this.nodes[row_index].columns[col_index].control) {
                this.onControlNodeMouseOver(row_index, col_index);
                return true;
            }

            this.onNodeNodeMouseOver(row_index, col_index);
        }
    }, {
        key: "onNodeMouseOut",
        value: function onNodeMouseOut(row_index, col_index, exit_side) {
            if (this.nodes[row_index].columns[col_index].control) {
                this.onControlNodeMouseOut(row_index, col_index);
                return true;
            }

            this.onNodeNodeMouseOut(row_index, col_index, exit_side);
        }
    }, {
        key: "onControlNodeSelect",
        value: function onControlNodeSelect(row_index, col_index) {

            var _label = _.isFunction(this.config.new_node_label) ? this.config.new_node_label(row_index, col_index) : this.config.new_node_label;

            this.addNode(row_index, col_index, _label, []);

            this.$s.$apply();
        }
    }, {
        key: "onControlNodeMouseOver",
        value: function onControlNodeMouseOver(row_index, col_index) {
            if (this.selection.length > 0) {
                return false;
            }

            this.setNodeClass(row_index, col_index, 'control_hover', true);

            this.$s.$apply();
        }
    }, {
        key: "onControlNodeMouseOut",
        value: function onControlNodeMouseOut(row_index, col_index) {
            if (this.selection.length > 0) {
                return false;
            }

            this.setNodeClass(row_index, col_index, 'control_hover', false);

            this.$s.$apply();
        }
    }, {
        key: "onNodeNodeSelect",
        value: function onNodeNodeSelect(row_index, col_index) {

            this.setNodeClass(row_index, col_index, 'source_hover', false);
            this.setNodeClass(row_index, col_index, 'source', true);
            this.setPotentialNodeClasses(row_index, col_index, 'potential_target_hover', false);
            this.setPotentialNodeClasses(row_index, col_index, 'potential_target', true);

            this.selection = [[col_index, row_index]];
            this.selected_node = [col_index, row_index];

            this.$s.$apply();
        }
    }, {
        key: "onNodeNodeDeselect",
        value: function onNodeNodeDeselect(row_index, col_index) {
            this.source_exit_side = null;

            if (this.selection.length === 1) {
                if (_.isEqual(this.selection[0], [col_index, row_index])) {

                    this.setNodeClass(row_index, col_index, 'source', false);
                    this.setNodeClass(row_index, col_index, 'source_hover', true);
                    this.setPotentialNodeClasses(row_index, col_index, 'potential_target', false);
                    this.setPotentialNodeClasses(row_index, col_index, 'potential_target_hover', true);
                }
            } else if (this.selection.length === 2) {
                    if (_.isEqual(this.selection[1], [col_index, row_index])) {

                        this.setNodeClass(row_index, col_index, 'target', false);

                        if (!this.doesNodeHaveConnectedParents(row_index, col_index)) {
                            this.setPotentialNodeClasses(row_index, col_index, 'potential_target', false);
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
                            this.setAsConnectedLines(this.selection);

                            this.checkActive();
                        }
                }
            }
        }
    }, {
        key: "onNodeNodeMouseOver",
        value: function onNodeNodeMouseOver(row_index, col_index) {
            if (this.selection.length === 0) {

                this.setNodeClass(row_index, col_index, 'source_hover', true);
                this.setPotentialNodeClasses(row_index, col_index, 'potential_target_hover', true);
            }

            if (this.selection.length === 2) {
                if (this.isNodePotential(this.selection[0], [col_index, row_index])) {
                    this.setNodeClass(row_index, col_index, 'potential_target', false);
                    this.setNodeClass(row_index, col_index, 'target', true);
                    this.setLineClass(this.selection[0], [col_index, row_index], 'target', true);
                }
            }

            if (this.bg_col_grid_hover_index !== col_index) {}

            this.$s.$apply();
        }
    }, {
        key: "onNodeNodeMouseOut",
        value: function onNodeNodeMouseOut(row_index, col_index, exit_side) {
            if (this.selection.length === 0) {

                this.setNodeClass(row_index, col_index, 'source_hover', false);
                this.setPotentialNodeClasses(row_index, col_index, 'potential_target_hover', false);
            } else if (this.selection.length === 2) {
                    if (this.isNodePotential(this.selection[0], [col_index, row_index])) {

                        this.setNodeClass(row_index, col_index, 'target', false);
                        this.setNodeClass(row_index, col_index, 'potential_target', true);
                        this.setLineClass(this.selection[0], [col_index, row_index], 'target', false);
                    }
                }

            if (_.isEqual(this.selection[0], [col_index, row_index]) && _.isNull(this.source_exit_side)) {
                if (exit_side === 'top') {
                    this.setPotentialChildNodeClasses(row_index, col_index, 'potential_target', false);
                } else if (exit_side === 'bottom') {
                        this.setPotentialParentNodeClasses(row_index, col_index, 'potential_target', false);
                    }
            }

            if (this.selection.length === 1) {
                if (_.isEqual(this.selection[0], [col_index, row_index])) {
                    this.source_exit_side = exit_side;
                }

                var target_coords = void 0;

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

                this.setNodeClass(this.selection[0][1], this.selection[0][0], 'source', false);
                this.setPotentialNodeClasses(this.selection[0][1], this.selection[0][0], 'target', false);
                this.setPotentialNodeClasses(this.selection[0][1], this.selection[0][0], 'potential_target', false);
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

                this.setNodeClass(this.selection[0][1], this.selection[0][0], 'source', false);
                this.setPotentialNodeClasses(this.selection[0][1], this.selection[0][0], 'potential_target', false);
            } else if (this.selection.length === 2) {

                    this.setNodeClass(this.selection[0][1], this.selection[0][0], 'source', false);
                    this.setNodeClass(this.selection[1][1], this.selection[1][0], 'target', false);
                    this.setPotentialNodeClasses(this.selection[0][1], this.selection[0][0], 'potential_target', false);
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
            var source = this.nodes[source_coords[1]].columns[source_coords[0]];

            var _was_line_connected = source.lines[line_index].connected;

            source.lines.splice(line_index, 1);

            if (source.lines.length === 0) {
                if (!this.doesNodeHaveConnectedParents(source_coords[1], source_coords[0])) {
                    this.setAsNotConnectedNode([source_coords[0], source_coords[1]]);
                }
            }

            if (!_.isUndefined(this.onNodeConnectionChangeCallback) && _was_line_connected) {

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

            var is_node_waiting_for_connection = false;

            _.forEach(this.nodes_waiting_for_connection, function (node, index) {
                if (_.isEqual(node, target_coords)) {
                    is_node_waiting_for_connection = true;
                    _this3.nodes_waiting_for_connection.splice(index, 1);
                    return false;
                }
            });

            if (is_node_waiting_for_connection) {
                this.setAsConnectedNode(target_coords);

                this.checkActive();
            }

            this.$s.$apply();
        }
    }, {
        key: "checkActive",
        value: function checkActive() {
            var _this4 = this;

            this.count = 0;

            if (this.nodes.length === 0) {
                return false;
            }

            _.forEach(this.nodes[0].columns, function (col, col_index) {
                if (col.lines.length > 0) {
                    _this4.activateNode(0, col_index);
                }
            });
        }
    }, {
        key: "activateNode",
        value: function activateNode(row_index, col_index) {
            var _this5 = this;

            var node = Object.assign({}, this.nodes[row_index].columns[col_index]);

            node.active = true;

            if (node.lines.length > 0) {

                _.forEach(node.lines, function (line) {
                    line.active = true;

                    _this5.activateNode(line.to[1], line.to[0]);
                });
            }

            this.nodes[row_index].columns[col_index] = node;
        }
    }, {
        key: "deactivateNode",
        value: function deactivateNode(row_index, col_index) {
            var _this6 = this;

            var node = this.nodes[row_index].columns[col_index];
            node.active = false;

            if (node.lines.length > 0) {
                _.forEach(node.lines, function (line) {
                    line.active = false;

                    var does_parent_have_active_nodes = _this6.doesNodeHaveActiveParents(line.to[1], line.to[0]);

                    if (!does_parent_have_active_nodes) {
                        _this6.deactivateNode(line.to[1], line.to[0]);
                    }
                });
            }
        }
    }, {
        key: "doesNodeHaveActiveParents",
        value: function doesNodeHaveActiveParents(row_index, col_index, exclude_coords) {

            if (row_index === 0) {
                return false;
            }

            var result = false;
            var parent_row_index = row_index - 1;
            var parents = this.nodes[parent_row_index].columns;

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
        value: function doesNodeHaveConnectedParents(row_index, col_index, exclude_coords) {
            var _this7 = this;

            if (row_index === 0) {
                return false;
            }

            if (_.isUndefined(exclude_coords)) {
                exclude_coords = [];
            }

            var result = false;
            var parent_row_index = row_index - 1;
            var parents = this.nodes[parent_row_index].columns;

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
            if (_.isUndefined(this.nodes[target_coords[1]])) {
                return false;
            }
            if (_.isUndefined(this.nodes[target_coords[1]].columns[target_coords[0]])) {
                return false;
            }

            if (this.nodes[target_coords[1]].columns[target_coords[0]].control) {
                return false;
            }

            if (source_coords[1] === target_coords[1]) {
                return false;
            }

            if (Math.abs(source_coords[1] - target_coords[1]) > 1) {
                return false;
            }

            if (target_coords[1] >= this.nodes.length) {
                return false;
            }

            if (target_coords[0] >= this.nodes[target_coords[1]].columns.length) {
                return false;
            }

            var is_target_parent = target_coords[1] < source_coords[1];
            var source = this.nodes[source_coords[1]].columns[source_coords[0]];
            var target = this.nodes[target_coords[1]].columns[target_coords[0]];
            var result = void 0;

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
            _.forEach(this.nodes[source_coords[1]].columns[source_coords[0]].lines, function (line) {
                if (_.isEqual(line.to, target_coords)) {
                    line[key] = value;
                }
            });
        }
    }, {
        key: "setNodeClass",
        value: function setNodeClass(row_index, col_index, key, value) {

            this.nodes[row_index].columns[col_index][key] = value;
        }
    }, {
        key: "setPotentialNodeClasses",
        value: function setPotentialNodeClasses(row_index, col_index, key, value) {

            this.setPotentialChildNodeClasses(row_index, col_index, key, value);
            this.setPotentialParentNodeClasses(row_index, col_index, key, value);
        }
    }, {
        key: "setPotentialChildNodeClasses",
        value: function setPotentialChildNodeClasses(row_index, col_index, key, value) {
            var _this8 = this;

            if (row_index + 1 < this.nodes.length) {
                _.forEach(this.nodes[row_index + 1].columns, function (child_col, child_col_index) {
                    if (_this8.isNodePotential([col_index, row_index], [child_col_index, row_index + 1])) {
                        child_col[key] = value;
                    }
                });
            }
        }
    }, {
        key: "setPotentialParentNodeClasses",
        value: function setPotentialParentNodeClasses(row_index, col_index, key, value) {
            var _this9 = this;

            if (row_index > 0) {
                _.forEach(this.nodes[row_index - 1].columns, function (parent_col, parent_col_index) {
                    if (_this9.isNodePotential([col_index, row_index], [parent_col_index, row_index - 1])) {
                        parent_col[key] = value;
                    }
                });
            }
        }
    }, {
        key: "setViewport",
        value: function setViewport(cols, rows) {

            var total_item_width = this.config.node_width + this.config.col_spacing;
            var total_item_height = this.config.node_height + this.config.row_spacing;

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
            var first_col_width = this.config.node_width + this.config.col_spacing / 2;
            var col_width = this.config.node_width + this.config.col_spacing;
            return first_col_width + (index - 1) * col_width;
        }
    }, {
        key: "calculateColWidth",
        value: function calculateColWidth(index) {
            var total_item_width = index === 0 ? this.config.node_width + this.config.col_spacing / 2 : this.config.node_width + this.config.col_spacing;
            return total_item_width;
        }
    }, {
        key: "calculateRowY",
        value: function calculateRowY(index) {
            var row_height = this.config.node_height + this.config.row_spacing;
            return index * row_height;
        }
    }, {
        key: "calculateRowHeight",
        value: function calculateRowHeight() {
            return this.config.node_height + this.config.row_spacing;
        }
    }, {
        key: "addLine",
        value: function addLine(source_coords, target_coords, connected) {
            if (target_coords[1] >= this.nodes.length) {
                return false;
            }

            var source_lock_coords = NodeUtils.getNodeCoords(source_coords[1], source_coords[0], _nodeSettings.NODE_BOTTOM, this.config);
            var target_lock_coords = NodeUtils.getNodeCoords(target_coords[1], target_coords[0], _nodeSettings.NODE_TOP, this.config);

            this.nodes[source_coords[1]].columns[source_coords[0]].lines.push({
                connected: !_.isUndefined(connected) ? connected : false,
                from: source_coords,
                to: target_coords,
                x1: source_lock_coords[0],
                y1: source_lock_coords[1],
                x2: target_lock_coords[0],
                y2: target_lock_coords[1],
                init: true
            });

            if (connected) {}
        }
    }, {
        key: "updateLineTarget",
        value: function updateLineTarget(source_coords, target_coords) {
            var target_lock_coords = NodeUtils.getNodeCoords(target_coords[1], target_coords[0], _nodeSettings.NODE_TOP, this.config);

            _.forEach(this.nodes[source_coords[1]].columns[source_coords[0]].lines, function (line) {

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
        value: function removeLine(source_coords, target_coords, set_as_busy) {
            var _this10 = this;

            if (set_as_busy) {
                this.is_connection_change_busy = true;
            }

            var target_lock_coords = NodeUtils.getNodeCoords(source_coords[1], source_coords[0], _nodeSettings.NODE_BOTTOM, this.config);

            _.forEach(this.nodes[source_coords[1]].columns[source_coords[0]].lines, function (line) {

                if (_.isEqual(line.from, source_coords) && _.isEqual(line.to, target_coords)) {

                    var node = _this10.nodes[target_coords[1]].columns[target_coords[0]];
                    var node_has_connected_parents = _this10.doesNodeHaveConnectedParents(target_coords[1], target_coords[0], source_coords);

                    if (node.lines.length === 0 && !node_has_connected_parents) {
                        _this10.setAsNotConnectedNode(target_coords);
                    }

                    var node_has_active_parents = _this10.doesNodeHaveActiveParents(target_coords[1], target_coords[0], source_coords);

                    if (!node_has_active_parents) {
                        _this10.deactivateNode(target_coords[1], target_coords[0]);
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

            _.forEach(this.nodes[selection[0][1]].columns[selection[0][0]].lines, function (line) {
                if (!line.connected) {
                    _this11.removeLine(_this11.selection[0], _this11.selection[1]);
                }
            });
        }
    }, {
        key: "setAsConnectedLines",
        value: function setAsConnectedLines(selection) {
            var _this12 = this;

            _.forEach(this.nodes[selection[0][1]].columns[selection[0][0]].lines, function (line, line_index) {
                if (!line.connected) {
                    line.connected = true;

                    _this12.setAsConnectedNode(line.from);
                    _this12.setAsConnectedNode(line.to);

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
        key: "setAsConnectedNode",
        value: function setAsConnectedNode(coords) {
            this.nodes[coords[1]].columns[coords[0]].connected = true;
        }
    }, {
        key: "setAsNotConnectedNode",
        value: function setAsNotConnectedNode(coords) {
            this.nodes[coords[1]].columns[coords[0]].connected = false;
        }
    }, {
        key: "addNode",
        value: function addNode(row_index, col_index, label, connections, data) {
            var _this13 = this;

            if (row_index === this.nodes.length) {
                this.nodes.push({ columns: [] });
            }

            var removed_node = void 0;

            if (!_.isUndefined(this.nodes[row_index].columns[col_index])) {
                removed_node = this.nodes[row_index].columns.splice(col_index, 1);
            }

            var top_left_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_TOP_LEFT, this.config);

            var node_lines = [];
            var line_source_lock_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_BOTTOM, this.config);

            _.forEach(connections, function (line_target_col_index) {

                var line_target_coords = [line_target_col_index, row_index + 1];
                var line_target_lock_coords = NodeUtils.getNodeCoords(line_target_coords[1], line_target_coords[0], _nodeSettings.NODE_TOP, _this13.config);

                node_lines.push({
                    connected: true,
                    from: [col_index, row_index],
                    to: line_target_coords,
                    x1: line_source_lock_coords[0],
                    y1: line_source_lock_coords[1],
                    x2: line_target_lock_coords[0],
                    y2: line_target_lock_coords[1]
                });

                _this13.nodes_waiting_for_connection.push(line_target_coords);
            });

            var node = {
                coords: top_left_coords,
                x: top_left_coords[0],
                y: top_left_coords[1],
                label_x: top_left_coords[0] + this.config.label_spacing,
                label_y: top_left_coords[1] + this.config.label_spacing,
                label: label,
                connected: node_lines.length > 0,
                control: false,
                row_index: row_index,
                col_index: col_index,
                lines: node_lines,
                selected: _.has(data, "selected") ? data.selected : false,
                highlight: _.has(data, "highlight") ? data.highlight : false
            };

            if (node.selected) {
                if (_.has(this.highlight_selected_node, 'row_index')) {
                    this.nodes[this.highlight_selected_node.row_index].columns[this.highlight_selected_node.col_index].selected = false;
                }

                this.highlight_selected_node.row_index = node.row_index;
                this.highlight_selected_node.col_index = node.col_index;
            }

            this.nodes[row_index].columns.push(node);

            this.checkViewport(col_index, row_index);

            if (!_.isUndefined(removed_node)) {
                this.addControlNode(removed_node[0].row_index);
            }

            this.new_node = { row_index: row_index, col_index: col_index };

            if (_.includes(this.config.highlight_node_on, _angularSvgNodesSettings.HIGHLIGHT_NODE_ON_ADD) && !this.is_initialising) {
                if (_.has(this.highlight_selected_node, 'row_index')) {
                    this.nodes[this.highlight_selected_node.row_index].columns[this.highlight_selected_node.col_index].selected = false;
                }

                this.highlight_selected_node.row_index = row_index;
                this.highlight_selected_node.col_index = col_index;

                this.nodes[row_index].columns[col_index].selected = true;
            }

            if (!_.isUndefined(this.onNodeAddedCallback) && !this.is_initialising) {
                this.onNodeAddedCallback({ row_index: row_index, col_index: col_index });
            }
        }
    }, {
        key: "updateNode",
        value: function updateNode(row_index, col_index, label) {
            var _this14 = this;

            var lines = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

            if (!_.isUndefined(label) && this.nodes[row_index].columns[col_index].label !== label) {
                this.nodes[row_index].columns[col_index].label = label;
            }

            if (!_.isUndefined(lines)) {
                (function () {

                    var line_source_lock_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_BOTTOM, _this14.config);

                    _.forEach(lines, function (line_target_col_index) {

                        var line_target_coords = [line_target_col_index, row_index + 1];
                        var line_target_lock_coords = NodeUtils.getNodeCoords(line_target_coords[1], line_target_coords[0], _nodeSettings.NODE_TOP, _this14.config);

                        if (_.includes(_.map(_this14.nodes[row_index].columns[col_index].lines, function (line) {
                            return line.to[0];
                        }), line_target_col_index)) {
                            return;
                        }

                        _this14.nodes[row_index].columns[col_index].lines.push({
                            connected: true,
                            from: [col_index, row_index],
                            to: line_target_coords,
                            x1: line_source_lock_coords[0],
                            y1: line_source_lock_coords[1],
                            x2: line_target_lock_coords[0],
                            y2: line_target_lock_coords[1]
                        });

                        _this14.setNodeClass(row_index, col_index, 'connected', true);

                        _this14.nodes_waiting_for_connection.push(line_target_coords);
                    });
                })();
            }
        }
    }, {
        key: "removeNode",
        value: function removeNode(row_index, col_index) {
            var _this15 = this;

            var _set_as_busy = false;
            _.forEach(this.nodes[row_index].columns[col_index].lines, function (line) {
                _this15.removeLine(line.from, line.to, _set_as_busy);
            });

            this.nodes[row_index].columns.splice(col_index, 1);

            for (var i = col_index; i < this.nodes[row_index].columns.length; i++) {
                this.updateNodeAfterSiblingAddedOrRemoved(row_index, i);

                if (i < this.nodes[row_index].columns.length - 1) {}
            }

            if (row_index !== 0) {
                (function () {
                    var parent_row_index = row_index - 1;
                    var remove_lines = [];

                    _.forEach(_this15.nodes[parent_row_index].columns, function (column, parent_col_index) {
                        _.forEach(column.lines, function (line, line_index) {
                            if (_.isEqual(line.to, [col_index, row_index])) {
                                remove_lines.push({
                                    row_index: parent_row_index,
                                    col_index: parent_col_index,
                                    line_index: line_index
                                });

                                if (column.lines.length === 0) {
                                    _this15.setAsNotConnectedNode([parent_col_index, parent_row_index]);
                                }
                            }

                            if (line.to[0] > col_index) {
                                var new_line_to = [line.to[0] - 1, line.to[1]];

                                var target_lock_coords = NodeUtils.getNodeCoords(new_line_to[1], new_line_to[0], _nodeSettings.NODE_TOP, _this15.config);

                                line.to = [new_line_to[0], new_line_to[1]];
                                line.x2 = target_lock_coords[0];
                                line.y2 = target_lock_coords[1];
                            }
                        });
                    });

                    _.map(remove_lines, function (data) {
                        _this15.nodes[data.row_index].columns[data.col_index].lines.splice(data.line_index, 1);
                    });
                })();
            }

            if (row_index !== this.nodes.length - 1) {
                (function () {
                    var children_row_index = row_index + 1;
                    _.forEach(_this15.nodes[children_row_index].columns, function (column, children_col_index) {
                        if (!_this15.doesNodeHaveConnectedParents(children_row_index, children_col_index)) {
                            _this15.setAsNotConnectedNode([children_col_index, children_row_index]);
                        }
                    });
                })();
            }
        }
    }, {
        key: "insertNode",
        value: function insertNode(row_index, col_index, label, joins) {
            var _this16 = this;

            var top_left_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_TOP_LEFT, this.config);

            var node_lines = [];
            var line_source_lock_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_BOTTOM, this.config);

            _.forEach(joins, function (line_target_col_index) {

                var line_target_coords = [line_target_col_index, row_index + 1];
                var line_target_lock_coords = NodeUtils.getNodeCoords(line_target_coords[1], line_target_coords[0], _nodeSettings.NODE_TOP, _this16.config);

                node_lines.push({
                    connected: true,
                    from: [col_index, row_index],
                    to: line_target_coords,
                    x1: line_source_lock_coords[0],
                    y1: line_source_lock_coords[1],
                    x2: line_target_lock_coords[0],
                    y2: line_target_lock_coords[1]
                });

                _this16.nodes_waiting_for_connection.push(line_target_coords);
            });

            var node = {
                coords: top_left_coords,
                x: top_left_coords[0],
                y: top_left_coords[1],
                label_x: top_left_coords[0] + this.config.label_spacing,
                label_y: top_left_coords[1] + this.config.label_spacing,
                label: label,
                connected: node_lines.length > 0,
                control: false,
                row_index: row_index,
                col_index: col_index,
                lines: node_lines
            };

            this.nodes[row_index].columns.splice(col_index, 0, node);

            for (var i = col_index + 1; i < this.nodes[row_index].columns.length; i++) {

                this.updateNodeAfterSiblingAddedOrRemoved(row_index, i);
            }

            if (row_index !== 0) {
                var parent_row_index = row_index - 1;
                _.forEach(this.nodes[parent_row_index].columns, function (column) {
                    _.forEach(column.lines, function (line) {
                        if (line.to[0] >= col_index) {
                            var new_line_to = [line.to[0] + 1, line.to[1]];

                            var target_lock_coords = NodeUtils.getNodeCoords(new_line_to[1], new_line_to[0], _nodeSettings.NODE_TOP, _this16.config);

                            line.to = [new_line_to[0], new_line_to[1]];
                            line.x2 = target_lock_coords[0];
                            line.y2 = target_lock_coords[1];
                        }
                    });
                });
            }
        }
    }, {
        key: "updateNodeAfterSiblingAddedOrRemoved",
        value: function updateNodeAfterSiblingAddedOrRemoved(row_index, col_index) {
            var _this17 = this;

            var top_left_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_TOP_LEFT, this.config);
            var center_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_CENTER, this.config);

            this.nodes[row_index].columns[col_index].col_index = col_index;
            this.nodes[row_index].columns[col_index].coords = top_left_coords;
            this.nodes[row_index].columns[col_index].x = top_left_coords[0];
            this.nodes[row_index].columns[col_index].y = top_left_coords[1];

            if (col_index === this.nodes[row_index].columns.length - 1) {
                this.nodes[row_index].columns[col_index].label_x = center_coords[0];
                this.nodes[row_index].columns[col_index].label_y = center_coords[1];
            } else {
                this.nodes[row_index].columns[col_index].label_x = top_left_coords[0] + this.config.label_spacing;
                this.nodes[row_index].columns[col_index].label_y = top_left_coords[1] + this.config.label_spacing;
            }

            _.forEach(this.nodes[row_index].columns[col_index].lines, function (line) {
                var source_lock_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_TOP, _this17.config);

                line.from = [col_index, row_index];
                line.x1 = source_lock_coords[0];
                line.y1 = source_lock_coords[1];
            });

            this.checkViewport(col_index, row_index);
        }
    }, {
        key: "updateNodeAfterChildAddedOrRemoved",
        value: function updateNodeAfterChildAddedOrRemoved(row_index, col_index) {
            var _this18 = this;

            var top_left_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_TOP_LEFT, this.config);
            var center_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_CENTER, this.config);

            this.nodes[row_index].columns[col_index].col_index = col_index;
            this.nodes[row_index].columns[col_index].coords = top_left_coords;
            this.nodes[row_index].columns[col_index].x = top_left_coords[0];
            this.nodes[row_index].columns[col_index].y = top_left_coords[1];

            if (col_index === this.nodes[row_index].columns.length - 1) {
                this.nodes[row_index].columns[col_index].label_x = center_coords[0];
                this.nodes[row_index].columns[col_index].label_y = center_coords[1];
            } else {
                this.nodes[row_index].columns[col_index].label_x = top_left_coords[0] + this.config.label_spacing;
                this.nodes[row_index].columns[col_index].label_y = top_left_coords[1] + this.config.label_spacing;
            }

            _.forEach(this.nodes[row_index].columns[col_index].lines, function (line) {
                var source_lock_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_TOP, _this18.config);

                line.from = [col_index, row_index];
                line.x1 = source_lock_coords[0];
                line.y1 = source_lock_coords[1];
            });

            this.checkViewport(row_index, col_index);
        }
    }, {
        key: "addControlNode",
        value: function addControlNode(row_index) {
            if (row_index === this.nodes.length) {
                this.nodes.push({ columns: [] });
            }

            if (row_index >= this.nodes.length) {
                throw new Error("Invalid row index");
            }

            var col_index = this.nodes[row_index].columns.length;

            var top_left_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_TOP_LEFT, this.config);
            var center_coords = NodeUtils.getNodeCoords(row_index, col_index, _nodeSettings.NODE_CENTER, this.config);

            var node = {
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

            this.nodes[row_index].columns.push(node);

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
                if (row_index >= _this19.nodes.length) {
                    _this19.addControlNode(row_index);
                }
            });

            _.forEach(data, function (row, row_index) {
                _.forEach(row[column_property_name], function (col, col_index) {
                    _this19.updateNode(row_index, col_index, col.label);

                    if (col_index >= _this19.nodes[row_index].columns.length - 1) {
                        var label = _.has(col, 'label') ? col.label : "";
                        var lines = _.has(col, 'connections') ? col.connections : [];
                        _this19.addNode(row_index, col_index, label, lines);
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
