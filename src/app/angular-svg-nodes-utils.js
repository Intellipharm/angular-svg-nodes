import {
    BLOCK_TOP_LEFT,
    BLOCK_TOP,
    BLOCK_CENTER,
    BLOCK_BOTTOM
} from "./angular-svg-nodes-settings";

/**
 * getCoords
 *
 * @param position
 * @param col_index
 * @param row_index
 * @param config
 * @returns {*}
 */
export function getCoords(col_index, row_index, position, config) {

    let _total_width = config.block_width + config.col_spacing;
    let _total_height = config.block_height + config.row_spacing;

    let x = ( col_index + 1 ) * _total_width - _total_width;
    let y = ( row_index + 1 ) * _total_height - _total_height;

    let result = null;

    switch (position) {
        case BLOCK_TOP_LEFT:
            result = [x, y];
            break;

        case BLOCK_TOP:
            x += config.block_width / 2;
            result = [x, y];
            break;

        case BLOCK_CENTER:
            x += config.block_width / 2;
            y += config.block_height / 2;
            result = [x, y];
            break;

        case BLOCK_BOTTOM:
            x += config.block_width / 2;
            y += config.block_height;
            result = [x, y];
            break;
    }
    return result;
}