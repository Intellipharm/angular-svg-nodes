import {
    BLOCK_TOP_LEFT,
    BLOCK_TOP,
    BLOCK_CENTER,
    BLOCK_BOTTOM,
    ACTION_ADD,
    ACTION_REMOVE,
    ACTION_UPDATE,
    INITIAL_GRID_COLS,
    INITIAL_GRID_ROWS,
    BLOCK_WIDTH,
    BLOCK_HEIGHT,
    COL_SPACING,
    ROW_SPACING,
    LABEL_SPACING,
    DISABLE_CONTROL_NODES,
    MAX_VIEWPORT_WIDTH_INCREASE,
    MAX_VIEWPORT_HEIGHT_INCREASE
} from "./angular-svg-nodes-settings";

/**
 * getCoords
 *
 * @param position
 * @param col_index
 * @param row_index
 * @returns {*}
 */
export function getCoords(col_index, row_index, position) {

    let total_width = BLOCK_WIDTH + COL_SPACING;
    let total_height = BLOCK_HEIGHT + ROW_SPACING;

    let x = ( col_index + 1 ) * total_width - total_width;
    let y = ( row_index + 1 ) * total_height - total_height;

    let result = null;

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
}