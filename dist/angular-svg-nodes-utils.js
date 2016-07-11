"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCoords = getCoords;

var _angularSvgNodesSettings = require("./angular-svg-nodes-settings");

function getCoords(col_index, row_index, position) {

    var total_width = _angularSvgNodesSettings.BLOCK_WIDTH + _angularSvgNodesSettings.COL_SPACING;
    var total_height = _angularSvgNodesSettings.BLOCK_HEIGHT + _angularSvgNodesSettings.ROW_SPACING;

    var x = (col_index + 1) * total_width - total_width;
    var y = (row_index + 1) * total_height - total_height;

    var result = null;

    switch (position) {
        case _angularSvgNodesSettings.BLOCK_TOP_LEFT:
            result = [x, y];
            break;

        case _angularSvgNodesSettings.BLOCK_TOP:
            x += _angularSvgNodesSettings.BLOCK_WIDTH / 2;
            result = [x, y];
            break;

        case _angularSvgNodesSettings.BLOCK_CENTER:
            x += _angularSvgNodesSettings.BLOCK_WIDTH / 2;
            y += _angularSvgNodesSettings.BLOCK_HEIGHT / 2;
            result = [x, y];
            break;

        case _angularSvgNodesSettings.BLOCK_BOTTOM:
            x += _angularSvgNodesSettings.BLOCK_WIDTH / 2;
            y += _angularSvgNodesSettings.BLOCK_HEIGHT;
            result = [x, y];
            break;
    }
    return result;
}
//# sourceMappingURL=sourcemaps/angular-svg-nodes-utils.js.map
