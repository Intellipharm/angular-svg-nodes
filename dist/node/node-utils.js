'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getNodeCoords = getNodeCoords;
exports.isNodeIndexMatch = isNodeIndexMatch;
exports.updateNodeLineProperty = updateNodeLineProperty;
exports.updateNodeProperty = updateNodeProperty;
exports.updateNodesActivateNode = updateNodesActivateNode;

var _nodeSettings = require('./node-settings');

var _nodeModel = require('./node-model');

var _nodeModel2 = _interopRequireDefault(_nodeModel);

var _rowModel = require('../row/row-model');

var _rowModel2 = _interopRequireDefault(_rowModel);

var _lineModel = require('../line/line-model');

var _lineModel2 = _interopRequireDefault(_lineModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getNodeCoords(row_index, col_index, position, config) {

    var _total_width = config.node_width + config.col_spacing;
    var _total_height = config.node_height + config.row_spacing;

    var x = (col_index + 1) * _total_width - _total_width;
    var y = (row_index + 1) * _total_height - _total_height;

    switch (position) {
        default:
        case _nodeSettings.NODE_TOP_LEFT:
            break;

        case _nodeSettings.NODE_TOP:
            x += config.node_width / 2;
            break;

        case _nodeSettings.NODE_CENTER:
            x += config.node_width / 2;
            y += config.node_height / 2;
            break;

        case _nodeSettings.NODE_BOTTOM:
            x += config.node_width / 2;
            y += config.node_height;
            break;
    }

    return [x, y];
}

function isNodeIndexMatch(node, row_index, col_index) {
    return node.row_index === row_index && node.col_index === col_index;
}

function updateNodeLineProperty(line, prop, value) {
    return new _lineModel2.default(Object.assign({}, line, _defineProperty({}, prop, value)));
}

function updateNodeProperty(node, prop, value) {
    return new _nodeModel2.default(Object.assign({}, node, _defineProperty({}, prop, value)));
}

function updateNodesActivateNode(nodes, row_index, col_index) {
    var _this = this;

    var _activate_indices = [{ row_index: row_index, col_index: col_index }];

    return _.map(nodes, function (row) {
        return new _rowModel2.default(Object.assign({}, {
            columns: _.map(row.columns, function (node) {

                var _node_indices = {
                    row_index: node.row_index,
                    col_index: node.col_index
                };

                if (!_.isEmpty(_.find(_activate_indices, _node_indices))) {

                    node = _this.updateNodeProperty(node, 'active', true);

                    node.lines = _.map(node.lines, function (line) {
                        _activate_indices.push({ row_index: line.to[1], col_index: line.to[0] });

                        return _this.updateNodeLineProperty(line, 'active', true);
                    });
                }

                return node;
            })
        }));
    });
}
//# sourceMappingURL=../sourcemaps/node/node-utils.js.map
