// local: constants
import {
    NODE_TOP_LEFT,
    NODE_TOP,
    NODE_CENTER,
    NODE_BOTTOM
} from "./node-settings";

/**
 * returns the x,y location coordinates of the node identified by row & column indices
 *
 * @param row_index
 * @param col_index
 * @param position
 * @param config
 * @returns {*}
 */
export function getNodeCoords(row_index, col_index, position, config) {

    let _total_width = config.node_width + config.col_spacing;
    let _total_height = config.node_height + config.row_spacing;

    let x = ( col_index + 1 ) * _total_width - _total_width;
    let y = ( row_index + 1 ) * _total_height - _total_height;

    switch (position) {
        default:
        case NODE_TOP_LEFT:
            break;

        case NODE_TOP:
            x += config.node_width / 2;
            break;

        case NODE_CENTER:
            x += config.node_width / 2;
            y += config.node_height / 2;
            break;

        case NODE_BOTTOM:
            x += config.node_width / 2;
            y += config.node_height;
            break;
    }

    return [x, y];
}