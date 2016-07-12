"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCoords = getCoords;

var _angularSvgNodesSettings = require("./angular-svg-nodes-settings");

function getCoords(col_index, row_index, position, config) {

    var _total_width = config.block_width + config.col_spacing;
    var _total_height = config.block_height + config.row_spacing;

    var x = (col_index + 1) * _total_width - _total_width;
    var y = (row_index + 1) * _total_height - _total_height;

    var result = null;

    switch (position) {
        case _angularSvgNodesSettings.BLOCK_TOP_LEFT:
            result = [x, y];
            break;

        case _angularSvgNodesSettings.BLOCK_TOP:
            x += config.block_width / 2;
            result = [x, y];
            break;

        case _angularSvgNodesSettings.BLOCK_CENTER:
            x += config.block_width / 2;
            y += config.block_height / 2;
            result = [x, y];
            break;

        case _angularSvgNodesSettings.BLOCK_BOTTOM:
            x += config.block_width / 2;
            y += config.block_height;
            result = [x, y];
            break;
    }
    return result;
}
//# sourceMappingURL=sourcemaps/angular-svg-nodes-utils.js.map
