"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getNodeCoords = getNodeCoords;

var _nodeSettings = require("./node-settings");

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
//# sourceMappingURL=../sourcemaps/node/node-utils.js.map
