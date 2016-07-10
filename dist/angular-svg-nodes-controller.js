"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AngularSvgNodesController = function AngularSvgNodesController($s, BLOCK_TOP_LEFT, BLOCK_TOP, BLOCK_CENTER, BLOCK_BOTTOM, ACTION_ADD, ACTION_REMOVE, ACTION_UPDATE, INITIAL_GRID_COLS, INITIAL_GRID_ROWS, BLOCK_WIDTH, BLOCK_HEIGHT, COL_SPACING, ROW_SPACING, LABEL_SPACING, DISABLE_CONTROL_NODES, MAX_VIEWPORT_WIDTH_INCREASE, MAX_VIEWPORT_HEIGHT_INCREASE) {
    _classCallCheck(this, AngularSvgNodesController);

    var self = this;

    this.api = $s.api || {};

    var initialized = false;

    this.blocks_waiting_for_connection = [];

    this.parent_coords = [];

    this.coords = [];

    this.blocks = [];

    this.bg_col_grid = [];
    this.bg_col_grid_hover_index = null;

    this.block_width = BLOCK_WIDTH;
    this.block_height = BLOCK_HEIGHT;
    this.col_spacing = COL_SPACING;
    this.row_spacing = ROW_SPACING;
    this.grid_col_count = INITIAL_GRID_COLS;
    this.grid_row_count = INITIAL_GRID_ROWS;
    this.label_width = BLOCK_WIDTH - LABEL_SPACING * 2;
    this.label_height = BLOCK_HEIGHT - LABEL_SPACING * 2;

    this.wrapper_style = "";
    this.viewport_style = "";
    this.viewport_width = 0;
    this.viewport_height = 0;
    this.viewport_viewbox = "";

    this.selection = [];
    this.source_exit_side = null;

    this.selected_node = [];

    this.onNodeSelect = function (col_index, row_index) {
        if (!_.isUndefined($s.onNodeMouseDown)) {
            $s.onNodeMouseDown(self.getExternalNodeEventHandlerData(col_index, row_index));
        }

        if (self.blocks[row_index].columns[col_index].control) {
            if (!DISABLE_CONTROL_NODES) {
                this.onControlNodeSelect(col_index, row_index);
            }
            return true;
        }

        this.onBlockNodeSelect(col_index, row_index);
    };

    this.onNodeDeselect = function (col_index, row_index) {
        if (!_.isUndefined($s.onNodeMouseUp)) {
            $s.onNodeMouseUp(self.getExternalNodeEventHandlerData(col_index, row_index));
        }

        if (self.blocks[row_index].columns[col_index].control) {
            return false;
        }

        this.onBlockNodeDeselect(col_index, row_index);
    };

    this.onNodeMouseOver = function (col_index, row_index) {
        if (self.blocks[row_index].columns[col_index].control) {
            self.onControlNodeMouseOver(col_index, row_index);
            return true;
        }

        self.onBlockNodeMouseOver(col_index, row_index);
    };

    this.onNodeMouseOut = function (col_index, row_index, exit_side) {
        if (self.blocks[row_index].columns[col_index].control) {
            self.onControlNodeMouseOut(col_index, row_index);
            return true;
        }

        self.onBlockNodeMouseOut(col_index, row_index, exit_side);
    };

    this.onControlNodeSelect = function (col_index, row_index) {

        self.addBlock(col_index, row_index, "NEW", []);

        $s.$apply();
    };

    this.onControlNodeMouseOver = function (col_index, row_index) {
        if (self.selection.length > 0) {
            return false;
        }

        self.setNodeClass(col_index, row_index, 'control_hover', true);

        $s.$apply();
    };

    this.onControlNodeMouseOut = function (col_index, row_index) {
        if (self.selection.length > 0) {
            return false;
        }

        self.setNodeClass(col_index, row_index, 'control_hover', false);

        $s.$apply();
    };

    this.onBlockNodeSelect = function (col_index, row_index) {

        self.setNodeClass(col_index, row_index, 'source_hover', false);
        self.setNodeClass(col_index, row_index, 'source', true);
        self.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', false);
        self.setPotentialNodeClasses(col_index, row_index, 'potential_target', true);

        self.selection = [[col_index, row_index]];
        self.selected_node = [col_index, row_index];

        $s.$apply();
    };

    this.onBlockNodeDeselect = function (col_index, row_index) {
        self.source_exit_side = null;

        if (self.selection.length === 1) {
            if (_.isEqual(self.selection[0], [col_index, row_index])) {

                self.setNodeClass(col_index, row_index, 'source', false);
                self.setNodeClass(col_index, row_index, 'source_hover', true);
                self.setPotentialNodeClasses(col_index, row_index, 'potential_target', false);
                self.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', true);
            }
        } else if (self.selection.length === 2) {
                if (_.isEqual(self.selection[1], [col_index, row_index])) {

                    self.setNodeClass(col_index, row_index, 'target', false);

                    if (!self.doesNodeHaveConnectedParents(col_index, row_index)) {
                        self.setPotentialNodeClasses(col_index, row_index, 'potential_target', false);
                    }

                    self.checkActive();
                }
            }

        if (self.selection.length === 2) {
            if (_.isEqual(self.selection[1], [col_index, row_index]) && self.isNodePotential(self.selection[0], [col_index, row_index])) {

                var is_target_parent = self.selection[0][1] > row_index;

                if (is_target_parent) {
                    self.removeLine(self.selection[1], self.selection[0]);
                } else {
                        self.setAsConnectedLines(self.selection, "A");

                        self.checkActive();
                    }
            }
        }
    };

    this.onBlockNodeMouseOver = function (col_index, row_index) {
        if (self.selection.length === 0) {

            self.setNodeClass(col_index, row_index, 'source_hover', true);
            self.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', true);
        }

        if (self.selection.length === 2) {
            if (self.isNodePotential(self.selection[0], [col_index, row_index])) {

                self.setNodeClass(col_index, row_index, 'potential_target', false);
                self.setNodeClass(col_index, row_index, 'target', true);
                self.setLineClass(self.selection[0], [col_index, row_index], 'target', true);
            }
        }

        if (self.bg_col_grid_hover_index !== col_index) {}

        $s.$apply();
    };

    this.onBlockNodeMouseOut = function (col_index, row_index, exit_side) {
        if (self.selection.length === 0) {

            self.setNodeClass(col_index, row_index, 'source_hover', false);
            self.setPotentialNodeClasses(col_index, row_index, 'potential_target_hover', false);
        } else if (self.selection.length === 2) {
                if (self.isNodePotential(self.selection[0], [col_index, row_index])) {

                    self.setNodeClass(col_index, row_index, 'target', false);
                    self.setNodeClass(col_index, row_index, 'potential_target', true);
                    self.setLineClass(self.selection[0], [col_index, row_index], 'target', false);
                }
            }

        if (_.isEqual(self.selection[0], [col_index, row_index]) && _.isNull(self.source_exit_side)) {
            if (exit_side === 'top') {
                self.setPotentialChildNodeClasses(col_index, row_index, 'potential_target', false);
            } else if (exit_side === 'bottom') {
                    self.setPotentialParentNodeClasses(col_index, row_index, 'potential_target', false);
                }
        }

        if (self.selection.length === 1) {
            if (_.isEqual(self.selection[0], [col_index, row_index])) {
                self.source_exit_side = exit_side;
            }

            var target_coords;

            if (exit_side === 'top') {

                target_coords = [self.bg_col_grid_hover_index, row_index - 1];

                if (self.isNodePotential([col_index, row_index], target_coords)) {
                    self.selection.push(target_coords);
                }
            } else if (exit_side === 'bottom') {

                    var target_row_index = row_index + 1;
                    target_coords = [self.bg_col_grid_hover_index, target_row_index];

                    if (Math.abs(self.selection[0][1] - target_row_index) <= 1 && self.isNodePotential([col_index, row_index], target_coords)) {

                        self.selection.push(target_coords);
                    }
                }
        }

        $s.$apply();
    };

    this.onRootDeselect = function () {
        self.source_exit_side = null;

        if (self.selection.length === 0) {
            return true;
        }

        if (self.selection.length > 0) {

            self.setNodeClass(self.selection[0][0], self.selection[0][1], 'source', false);
            self.setPotentialNodeClasses(self.selection[0][0], self.selection[0][1], 'target', false);
            self.setPotentialNodeClasses(self.selection[0][0], self.selection[0][1], 'potential_target', false);
        }

        if (self.selection.length === 2) {
            self.removeUnconnectedLines(self.selection);
        }

        if (self.selection.length > 0) {
            self.selection = [];
        }

        $s.$apply();
    };

    this.onBgColGridMouseOver = function (index) {
        if (self.bg_col_grid_hover_index === index) {
            return true;
        }

        self.bg_col_grid_hover_index = index;

        if (self.selection.length === 1) {

            var target_coords = self.source_exit_side === 'top' ? [index, self.selection[0][1] - 1] : [index, self.selection[0][1] + 1];

            if (self.isNodePotential(self.selection[0], target_coords)) {
                self.selection.push(target_coords);
            }
        } else if (self.selection.length === 2 && self.isNodePotential(self.selection[0], [index, self.selection[1][1]])) {
                self.selection[1][0] = index;
            }

        $s.$apply();
    };

    this.onRootMouseLeave = function () {
        if (self.selection.length === 1) {

            self.setNodeClass(self.selection[0][0], self.selection[0][1], 'source', false);
            self.setPotentialNodeClasses(self.selection[0][0], self.selection[0][1], 'potential_target', false);
        } else if (self.selection.length === 2) {

                self.setNodeClass(self.selection[0][0], self.selection[0][1], 'source', false);
                self.setNodeClass(self.selection[1][0], self.selection[1][1], 'target', false);
                self.setPotentialNodeClasses(self.selection[0][0], self.selection[0][1], 'potential_target', false);
            }

        if (self.selection.length === 2) {
            self.removeUnconnectedLines(self.selection);
        }

        self.selection = [];

        $s.$apply();
    };

    this.onLineRemoveComplete = function (source_coords, target_coords, line_index) {
        $s.rows[source_coords[1]].columns[source_coords[0]].join.splice(line_index, 1);

        var source = self.blocks[source_coords[1]].columns[source_coords[0]];

        source.lines.splice(line_index, 1);

        if (source.lines.length === 0) {
            if (!self.doesNodeHaveConnectedParents(source_coords[0], source_coords[1])) {
                self.setAsNotConnectedBlock([source_coords[0], source_coords[1]]);
            }
        }

        if (!_.isUndefined($s.onLineRemove)) {
            $s.onLineRemove(self.getExternalLineEventHandlerData(source_coords, target_coords, line_index));
        }

        $s.$apply();
    };

    this.onLineDrawComplete = function (source_coords, target_coords) {

        var is_block_waiting_for_connection = false;

        _.forEach(self.blocks_waiting_for_connection, function (block, index) {
            if (_.isEqual(block, target_coords)) {
                is_block_waiting_for_connection = true;
                self.blocks_waiting_for_connection.splice(index, 1);
                return false;
            }
        });

        if (is_block_waiting_for_connection) {
            self.setAsConnectedBlock(target_coords);
        }

        $s.$apply();
    };

    this.getExternalNodeEventHandlerData = function (col_index, row_index) {

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

    this.getExternalLineEventHandlerData = function (source_coords, target_coords, line_index) {

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

    this.checkActive = function () {

        if (self.blocks.length === 0) {
            return false;
        }

        _.forEach(self.blocks[0].columns, function (col, col_index) {
            if (col.lines.length > 0) {
                self.activateBlock(col_index, 0);
            }
        });
    };

    this.activateBlock = function (col_index, row_index) {

        var block = self.blocks[row_index].columns[col_index];
        block.active = true;

        if (block.lines.length > 0) {

            _.forEach(block.lines, function (line) {
                line.active = true;

                self.activateBlock(line.to[0], line.to[1]);
            });
        }
    };

    this.deactivateBlock = function (col_index, row_index) {

        var block = self.blocks[row_index].columns[col_index];
        block.active = false;

        if (block.lines.length > 0) {
            _.forEach(block.lines, function (line) {
                line.active = false;

                var does_parent_have_active_nodes = self.doesNodeHaveActiveParents(line.to[0], line.to[1]);

                if (!does_parent_have_active_nodes) {
                    self.deactivateBlock(line.to[0], line.to[1]);
                }
            });
        }
    };

    this.doesNodeHaveActiveParents = function (col_index, row_index, exclude_coords) {

        if (row_index === 0) {
            return false;
        }

        var result = false;
        var parent_row_index = row_index - 1;
        var parents = self.blocks[parent_row_index].columns;

        _.forEach(parents, function (parent, parent_col_index) {
            _.forEach(parent.lines, function (line) {
                if (!_.isEqual([parent_col_index, parent_row_index], exclude_coords) && _.isEqual(line.to, [col_index, row_index]) && parent.active) {
                    result = true;
                }
            });
        });

        return result;
    };

    this.doesNodeHaveConnectedParents = function (col_index, row_index, exclude_coords) {

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
            if (!_.isEqual([parent_col_index, parent_row_index], exclude_coords) && self.isNodePotential([col_index, row_index], [parent_col_index, parent_row_index])) {

                result = true;
                return false;
            }
        });

        return result;
    };

    this.isNodePotential = function (source_coords, target_coords) {
        if (_.isUndefined(self.blocks[target_coords[1]])) {
            return false;
        }
        if (_.isUndefined(self.blocks[target_coords[1]].columns[target_coords[0]])) {
            return false;
        }

        if (self.blocks[target_coords[1]].columns[target_coords[0]].control) {
            return false;
        }

        if (source_coords[1] === target_coords[1]) {
            return false;
        }

        if (Math.abs(source_coords[1] - target_coords[1]) > 1) {
            return false;
        }

        if (target_coords[1] >= self.blocks.length) {
            return false;
        }

        if (target_coords[0] >= self.blocks[target_coords[1]].columns.length) {
            return false;
        }

        var is_target_parent = target_coords[1] < source_coords[1];
        var source = self.blocks[source_coords[1]].columns[source_coords[0]];
        var target = self.blocks[target_coords[1]].columns[target_coords[0]];
        var result;

        if (is_target_parent) {

            result = false;

            if (self.source_exit_side === 'bottom') {
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

                if (self.source_exit_side === 'top') {
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
    };

    this.setLineClass = function (source_coords, target_coords, key, value) {
        _.forEach(self.blocks[source_coords[1]].columns[source_coords[0]].lines, function (line) {
            if (_.isEqual(line.to, target_coords)) {
                line[key] = value;
            }
        });
    };

    this.setNodeClass = function (col_index, row_index, key, value) {
        if (_.has(self.blocks[row_index].columns[col_index], key)) {
            self.blocks[row_index].columns[col_index][key] = value;
        }
    };

    this.setPotentialNodeClasses = function (col_index, row_index, key, value) {

        self.setPotentialChildNodeClasses(col_index, row_index, key, value);
        self.setPotentialParentNodeClasses(col_index, row_index, key, value);
    };

    this.setPotentialChildNodeClasses = function (col_index, row_index, key, value) {
        if (row_index + 1 < self.blocks.length) {
            _.forEach(self.blocks[row_index + 1].columns, function (child_col, child_col_index) {
                if (self.isNodePotential([col_index, row_index], [child_col_index, row_index + 1])) {
                    child_col[key] = value;
                }
            });
        }
    };

    this.setPotentialParentNodeClasses = function (col_index, row_index, key, value) {

        if (row_index > 0) {
            _.forEach(self.blocks[row_index - 1].columns, function (parent_col, parent_col_index) {
                if (self.isNodePotential([col_index, row_index], [parent_col_index, row_index - 1])) {
                    parent_col[key] = value;
                }
            });
        }
    };

    this.setViewport = function (cols, rows) {

        var total_item_width = BLOCK_WIDTH + COL_SPACING;
        var total_item_height = BLOCK_HEIGHT + ROW_SPACING;

        self.viewport_width = total_item_width * cols;
        self.viewport_height = total_item_height * rows;

        self.viewport_style = {
            'background-color': "#ccc",
            'min-width': self.viewport_width + "px",
            'min-height': self.viewport_height + "px"
        };

        self.wrapper_style = {
            'max-width': self.viewport_width + MAX_VIEWPORT_WIDTH_INCREASE + "px",
            'min-width': self.viewport_width + "px",
            'max-height': self.viewport_height + MAX_VIEWPORT_HEIGHT_INCREASE * rows + "px",
            'min-height': self.viewport_height + "px"
        };

        self.viewport_viewbox = " 0 0 " + self.viewport_width + " " + self.viewport_height;
    };

    this.checkViewport = function (col_index, row_index) {

        var should_update_viewport = false;

        if (row_index >= self.grid_row_count) {
            self.grid_row_count++;
            should_update_viewport = true;
        }

        if (col_index >= self.grid_col_count) {
            self.grid_col_count++;
            should_update_viewport = true;

            self.addBgGridCol(self.grid_col_count - 1);
        }

        if (should_update_viewport) {
            self.setViewport(self.grid_col_count, self.grid_row_count);
        }
    };

    this.calculateColX = function (index) {
        if (index === 0) {
            return 0;
        }
        var first_col_width = BLOCK_WIDTH + COL_SPACING / 2;
        var col_width = BLOCK_WIDTH + COL_SPACING;
        return first_col_width + (index - 1) * col_width;
    };

    this.calculateColWidth = function (index) {
        var total_item_width = index === 0 ? BLOCK_WIDTH + COL_SPACING / 2 : BLOCK_WIDTH + COL_SPACING;
        return total_item_width;
    };

    this.calculateRowY = function (index) {
        var row_height = BLOCK_HEIGHT + ROW_SPACING;
        return index * row_height;
    };

    this.calculateRowHeight = function () {
        return BLOCK_HEIGHT + ROW_SPACING;
    };

    this.getCoords = function (col_index, row_index, position) {

        var total_width = BLOCK_WIDTH + COL_SPACING;
        var total_height = BLOCK_HEIGHT + ROW_SPACING;

        var x = (col_index + 1) * total_width - total_width;
        var y = (row_index + 1) * total_height - total_height;

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

    this.addLine = function (source_coords, target_coords, connected) {
        if (target_coords[1] >= self.blocks.length) {
            return false;
        }

        var source_lock_coords = self.getCoords(source_coords[0], source_coords[1], BLOCK_BOTTOM);
        var target_lock_coords = self.getCoords(target_coords[0], target_coords[1], BLOCK_TOP);

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
            $s.rows[source_coords[1]].columns[source_coords[0]].join.push(target_coords[0]);
        }
    };

    this.updateLineTarget = function (source_coords, target_coords) {
        var target_lock_coords = self.getCoords(target_coords[0], target_coords[1], BLOCK_TOP);

        _.forEach(self.blocks[source_coords[1]].columns[source_coords[0]].lines, function (line) {

            if (_.isEqual(line.from, source_coords) && _.isEqual(line.to, target_coords)) {

                line.x2 = target_lock_coords[0];
                line.y2 = target_lock_coords[1];
                line.to = target_coords;
                return false;
            }
        });
    };

    this.removeLine = function (source_coords, target_coords) {
        var target_lock_coords = self.getCoords(source_coords[0], source_coords[1], BLOCK_BOTTOM);

        _.forEach(self.blocks[source_coords[1]].columns[source_coords[0]].lines, function (line) {

            if (_.isEqual(line.from, source_coords) && _.isEqual(line.to, target_coords)) {

                var block = self.blocks[target_coords[1]].columns[target_coords[0]];
                var block_has_connected_parents = self.doesNodeHaveConnectedParents(target_coords[0], target_coords[1], source_coords);

                if (block.lines.length === 0 && !block_has_connected_parents) {
                    self.setAsNotConnectedBlock(target_coords);
                }

                var block_has_active_parents = self.doesNodeHaveActiveParents(target_coords[0], target_coords[1], source_coords);

                if (!block_has_active_parents) {
                    self.deactivateBlock(target_coords[0], target_coords[1]);
                }

                line.x2 = target_lock_coords[0];
                line.y2 = target_lock_coords[1];
                line.previous_to = line.to;
                line.to = [source_coords[0], source_coords[1]];
                return false;
            }
        });
    };

    this.removeUnconnectedLines = function (selection) {

        _.forEach(self.blocks[selection[0][1]].columns[selection[0][0]].lines, function (line) {
            if (!line.connected) {
                self.removeLine(self.selection[0], self.selection[1]);
            }
        });
    };

    this.setAsConnectedLines = function (selection) {

        _.forEach(self.blocks[selection[0][1]].columns[selection[0][0]].lines, function (line, line_index) {
            if (!line.connected) {
                line.connected = true;

                self.setAsConnectedBlock(line.from);
                self.setAsConnectedBlock(line.to);

                $s.rows[line.from[1]].columns[line.from[0]].join.splice(line_index, 0, line.to[0]);

                if (!_.isUndefined($s.onLineAdd)) {
                    $s.onLineAdd(self.getExternalLineEventHandlerData(line.from, line.to, line_index));
                }
            }
        });
    };

    this.setAsConnectedBlock = function (coords) {
        self.blocks[coords[1]].columns[coords[0]].connected = true;
    };

    this.setAsNotConnectedBlock = function (coords) {
        self.blocks[coords[1]].columns[coords[0]].connected = false;
    };

    this.addBlock = function (col_index, row_index, label, lines) {

        if (row_index > self.blocks.length) {
            throw new Error("Invalid row index");
        }

        if (row_index === self.blocks.length) {
            self.blocks.push({ columns: [] });
        }

        var removed_block;

        if (!_.isUndefined(self.blocks[row_index].columns[col_index])) {
            removed_block = self.blocks[row_index].columns.splice(col_index, 1);
        }

        var top_left_coords = self.getCoords(col_index, row_index, BLOCK_TOP_LEFT);

        var block_lines = [];
        var line_source_lock_coords = self.getCoords(col_index, row_index, BLOCK_BOTTOM);

        _.forEach(lines, function (line_target_col_index) {

            var line_target_coords = [line_target_col_index, row_index + 1];
            var line_target_lock_coords = self.getCoords(line_target_coords[0], line_target_coords[1], BLOCK_TOP);

            block_lines.push({
                connected: true,
                from: [col_index, row_index],
                to: line_target_coords,
                x1: line_source_lock_coords[0],
                y1: line_source_lock_coords[1],
                x2: line_target_lock_coords[0],
                y2: line_target_lock_coords[1]
            });

            self.blocks_waiting_for_connection.push(line_target_coords);
        });

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

        self.blocks[row_index].columns.push(block);

        self.checkViewport(col_index, row_index);

        if (!_.isUndefined(removed_block)) {
            self.addControl(removed_block[0].row_index);
        }
    };

    this.updateBlock = function (col_index, row_index, label) {
        if (!_.isUndefined(label) && self.blocks[row_index].columns[col_index].label !== label) {
            self.blocks[row_index].columns[col_index].label = label;
        }
    };

    this.removeBlock = function (col_index, row_index) {

        if (row_index >= self.blocks.length) {
            return true;
        }

        if (col_index >= self.blocks[row_index].columns.length - 1) {
            return true;
        }

        _.forEach(self.blocks[row_index].columns[col_index].lines, function (line) {
            self.removeLine(line.from, line.to);
        });

        self.blocks[row_index].columns.splice(col_index, 1);

        $s.rows[row_index].columns.splice(col_index, 1);

        for (var i = col_index; i < self.blocks[row_index].columns.length; i++) {
            self.updateBlockAfterSiblingAddedOrRemoved(i, row_index);

            if (i < self.blocks[row_index].columns.length - 1) {
                $s.rows[row_index].columns[i].data.ui_column_index = i;
                $s.rows[row_index].columns[i].data.ui_row_index = row_index;
            }
        }

        if (row_index !== 0) {
            var parent_row_index = row_index - 1;
            _.forEach(self.blocks[parent_row_index].columns, function (column, parent_col_index) {
                _.forEach(column.lines, function (line, line_index) {
                    if (_.isEqual(line.to, [col_index, row_index])) {
                        column.lines.splice(line_index, 1);

                        $s.rows[parent_row_index].columns[parent_col_index].join.splice(line_index, 1);

                        if (column.lines.length === 0) {
                            self.setAsNotConnectedBlock([parent_col_index, parent_row_index]);
                        }
                    }

                    if (line.to[0] > col_index) {
                        var new_line_to = [line.to[0] - 1, line.to[1]];

                        var target_lock_coords = self.getCoords(new_line_to[0], new_line_to[1], BLOCK_TOP);

                        line.to = [new_line_to[0], new_line_to[1]];
                        line.x2 = target_lock_coords[0];
                        line.y2 = target_lock_coords[1];
                    }
                });
            });
        }

        if (row_index !== $s.rows.length - 1) {
            var children_row_index = row_index + 1;
            _.forEach(self.blocks[children_row_index].columns, function (column, children_col_index) {
                if (!self.doesNodeHaveConnectedParents(children_col_index, children_row_index)) {
                    self.setAsNotConnectedBlock([children_col_index, children_row_index]);
                }
            });
        }
    };

    this.insertBlock = function (col_index, row_index, data) {

        if (row_index >= self.blocks.length) {
            return true;
        }

        if (col_index > self.blocks[row_index].columns.length - 1) {
            return true;
        }

        var top_left_coords = self.getCoords(col_index, row_index, BLOCK_TOP_LEFT);

        var block_lines = [];
        var line_source_lock_coords = self.getCoords(col_index, row_index, BLOCK_BOTTOM);

        _.forEach(data.join, function (line_target_col_index) {

            var line_target_coords = [line_target_col_index, row_index + 1];
            var line_target_lock_coords = self.getCoords(line_target_coords[0], line_target_coords[1], BLOCK_TOP);

            block_lines.push({
                connected: true,
                from: [col_index, row_index],
                to: line_target_coords,
                x1: line_source_lock_coords[0],
                y1: line_source_lock_coords[1],
                x2: line_target_lock_coords[0],
                y2: line_target_lock_coords[1]
            });

            self.blocks_waiting_for_connection.push(line_target_coords);
        });

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

        self.blocks[row_index].columns.splice(col_index, 0, block);

        $s.rows[row_index].columns.splice(col_index, 0, data);

        for (var i = col_index + 1; i < self.blocks[row_index].columns.length; i++) {

            self.updateBlockAfterSiblingAddedOrRemoved(i, row_index);

            if (i < self.blocks[row_index].columns.length - 1) {
                $s.rows[row_index].columns[i].data.ui_column_index = i;
                $s.rows[row_index].columns[i].data.ui_row_index = row_index;
            }
        }

        if (row_index !== 0) {
            var parent_row_index = row_index - 1;
            _.forEach(self.blocks[parent_row_index].columns, function (column) {
                _.forEach(column.lines, function (line) {
                    if (line.to[0] >= col_index) {
                        var new_line_to = [line.to[0] + 1, line.to[1]];

                        var target_lock_coords = self.getCoords(new_line_to[0], new_line_to[1], BLOCK_TOP);

                        line.to = [new_line_to[0], new_line_to[1]];
                        line.x2 = target_lock_coords[0];
                        line.y2 = target_lock_coords[1];
                    }
                });
            });
        }
    };

    this.updateBlockAfterSiblingAddedOrRemoved = function (col_index, row_index) {

        var top_left_coords = self.getCoords(col_index, row_index, BLOCK_TOP_LEFT);
        var center_coords = self.getCoords(col_index, row_index, BLOCK_CENTER);

        self.blocks[row_index].columns[col_index].col_index = col_index;
        self.blocks[row_index].columns[col_index].coords = top_left_coords;
        self.blocks[row_index].columns[col_index].x = top_left_coords[0];
        self.blocks[row_index].columns[col_index].y = top_left_coords[1];

        if (col_index === self.blocks[row_index].columns.length - 1) {
            self.blocks[row_index].columns[col_index].label_x = center_coords[0];
            self.blocks[row_index].columns[col_index].label_y = center_coords[1];
        } else {
            self.blocks[row_index].columns[col_index].label_x = top_left_coords[0] + LABEL_SPACING;
            self.blocks[row_index].columns[col_index].label_y = top_left_coords[1] + LABEL_SPACING;
        }

        _.forEach(self.blocks[row_index].columns[col_index].lines, function (line) {
            var source_lock_coords = self.getCoords(col_index, row_index, BLOCK_TOP);

            line.from = [col_index, row_index];
            line.x1 = source_lock_coords[0];
            line.y1 = source_lock_coords[1];
        });

        self.checkViewport(col_index, row_index);
    };

    this.updateBlockAfterChildAddedOrRemoved = function (col_index, row_index) {

        var top_left_coords = self.getCoords(col_index, row_index, BLOCK_TOP_LEFT);
        var center_coords = self.getCoords(col_index, row_index, BLOCK_CENTER);

        self.blocks[row_index].columns[col_index].col_index = col_index;
        self.blocks[row_index].columns[col_index].coords = top_left_coords;
        self.blocks[row_index].columns[col_index].x = top_left_coords[0];
        self.blocks[row_index].columns[col_index].y = top_left_coords[1];

        if (col_index === self.blocks[row_index].columns.length - 1) {
            self.blocks[row_index].columns[col_index].label_x = center_coords[0];
            self.blocks[row_index].columns[col_index].label_y = center_coords[1];
        } else {
            self.blocks[row_index].columns[col_index].label_x = top_left_coords[0] + LABEL_SPACING;
            self.blocks[row_index].columns[col_index].label_y = top_left_coords[1] + LABEL_SPACING;
        }

        _.forEach(self.blocks[row_index].columns[col_index].lines, function (line) {
            var source_lock_coords = self.getCoords(col_index, row_index, BLOCK_TOP);

            line.from = [col_index, row_index];
            line.x1 = source_lock_coords[0];
            line.y1 = source_lock_coords[1];
        });

        self.checkViewport(col_index, row_index);
    };

    this.addControl = function (row_index) {
        if (row_index === self.blocks.length) {
            self.blocks.push({ columns: [] });
        }

        if (row_index >= self.blocks.length) {
            throw new Error("Invalid row index");
        }

        var col_index = self.blocks[row_index].columns.length;

        var top_left_coords = self.getCoords(col_index, row_index, BLOCK_TOP_LEFT);
        var center_coords = self.getCoords(col_index, row_index, BLOCK_CENTER);

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

        self.blocks[row_index].columns.push(block);

        self.checkViewport(col_index, row_index);
    };

    this.addBgGridCol = function (index) {

        self.bg_col_grid.push({
            index: index,
            x: self.calculateColX(index),
            width: self.calculateColWidth(index)
        });
    };

    $s.$watch('ctrl.selection', function (newValue, oldValue) {

        if (!_.isUndefined(newValue)) {
            if (newValue.length === 2 && newValue[1][1] > newValue[0][1]) {
                if (newValue.length > oldValue.length) {
                    self.addLine(self.selection[0], self.selection[1]);
                } else {
                        self.updateLineTarget(self.selection[0], self.selection[1]);
                    }
            }
        }
    }, true);

    $s.$watch('rows', function (newValue) {

        if (!_.isUndefined(newValue)) {
            if (!initialized) {
                self.init(newValue, 'columns');
                initialized = true;
                return true;
            }

            self.update(newValue, 'columns');
        }
    }, true);

    this.init = function (data, column_property_name) {
        for (var row_index = 0; row_index < INITIAL_GRID_ROWS; row_index++) {
            if (row_index >= data.length) {
                data.push({ columns: [] });
            }
        }

        _.forEach(data, function (row, row_index) {

            _.forEach(row[column_property_name], function (col, col_index) {
                self.addBlock(col_index, row_index, col.label, col.join);
            });

            self.addControl(row_index);
        });

        _.map(new Array(self.grid_col_count), function (col, index) {
            self.addBgGridCol(index);
        });

        self.setViewport(self.grid_col_count, self.grid_row_count);

        self.checkActive();
    };

    this.update = function (data, column_property_name) {
        _.forEach(data, function (row, row_index) {
            if (row_index >= self.blocks.length) {
                self.addControl(row_index);
            }
        });

        _.forEach(data, function (row, row_index) {
            _.forEach(row[column_property_name], function (col, col_index) {
                self.updateBlock(col_index, row_index, col.label);

                if (col_index >= self.blocks[row_index].columns.length - 1) {
                    var label = _.has(col, 'label') ? col.label : "";
                    var lines = _.has(col, 'join') ? col.join : [];
                    self.addBlock(col_index, row_index, label, lines);
                }
            });
        });

        self.setViewport(self.grid_col_count, self.grid_row_count);

        self.checkActive();
    };

    this.api.addLine = function (source_coords, target_coords, connected) {
        self.setNodeClass(source_coords[0], source_coords[1], 'connected', true);

        self.blocks_waiting_for_connection.push(target_coords);

        self.addLine(source_coords, target_coords, connected);
    };

    this.api.insertBlock = function (col_index, row_index, data) {
        self.insertBlock(col_index, row_index, data);
    };

    this.api.removeBlock = function (col_index, row_index) {
        self.removeBlock(col_index, row_index);
    };

    this.api.highlightBlock = function (value, col_index, row_index) {
        self.setNodeClass(col_index, row_index, 'highlight', value);
    };

    this.api.selectBlock = function (value, col_index, row_index) {

        if (!_.isUndefined(col_index) && !_.isUndefined(col_index) && value) {
            self.selected_node = [col_index, row_index];
            return true;
        }

        self.selected_node = null;
    };
};

exports.default = AngularSvgNodesController;


AngularSvgNodesController.$inject = ['$scope', 'BLOCK_TOP_LEFT', 'BLOCK_TOP', 'BLOCK_CENTER', 'BLOCK_BOTTOM', 'ACTION_ADD', 'ACTION_REMOVE', 'ACTION_UPDATE', 'INITIAL_GRID_COLS', 'INITIAL_GRID_ROWS', 'BLOCK_WIDTH', 'BLOCK_HEIGHT', 'COL_SPACING', 'ROW_SPACING', 'LABEL_SPACING', 'DISABLE_CONTROL_NODES', 'MAX_VIEWPORT_WIDTH_INCREASE', 'MAX_VIEWPORT_HEIGHT_INCREASE'];
//# sourceMappingURL=sourcemaps/angular-svg-nodes-controller.js.map
