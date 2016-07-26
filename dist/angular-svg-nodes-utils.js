"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getNodeCoords = getNodeCoords;
exports.getValuesForKeyByIds = getValuesForKeyByIds;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _angularSvgNodesSettings = require("./angular-svg-nodes-settings");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getNodeCoords(row_index, col_index, position, config) {

    var _total_width = config.node_width + config.col_spacing;
    var _total_height = config.node_height + config.row_spacing;

    var x = (col_index + 1) * _total_width - _total_width;
    var y = (row_index + 1) * _total_height - _total_height;

    switch (position) {
        default:
        case _angularSvgNodesSettings.NODE_TOP_LEFT:
            break;

        case _angularSvgNodesSettings.NODE_TOP:
            x += config.node_width / 2;
            break;

        case _angularSvgNodesSettings.NODE_CENTER:
            x += config.node_width / 2;
            y += config.node_height / 2;
            break;

        case _angularSvgNodesSettings.NODE_BOTTOM:
            x += config.node_width / 2;
            y += config.node_height;
            break;
    }

    return [x, y];
}

function getValuesForKeyByIds(data, ids, key) {

    return _lodash2.default.reduce(data, function (result, item) {
        if (_lodash2.default.has(item, 'id') && _lodash2.default.has(item, key) && _lodash2.default.includes(ids, item.id)) {
            result = [].concat(_toConsumableArray(result), [item[key]]);
        }
        return result;
    }, []);
}
//# sourceMappingURL=sourcemaps/angular-svg-nodes-utils.js.map
