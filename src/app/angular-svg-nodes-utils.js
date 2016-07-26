import _ from "lodash";

// local: constants
import {
    BLOCK_TOP_LEFT,
    BLOCK_TOP,
    BLOCK_CENTER,
    BLOCK_BOTTOM
} from "./angular-svg-nodes-settings";

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

    let _total_width = config.block_width + config.col_spacing;
    let _total_height = config.block_height + config.row_spacing;

    let x = ( col_index + 1 ) * _total_width - _total_width;
    let y = ( row_index + 1 ) * _total_height - _total_height;

    switch (position) {
        default:
        case BLOCK_TOP_LEFT:
            break;

        case BLOCK_TOP:
            x += config.block_width / 2;
            break;

        case BLOCK_CENTER:
            x += config.block_width / 2;
            y += config.block_height / 2;
            break;

        case BLOCK_BOTTOM:
            x += config.block_width / 2;
            y += config.block_height;
            break;
    }

    return [x, y];
}

/**
 * returns an array of values for given key, for each item whose id is in given ids array
 *
 * @param data
 * @param ids
 * @param key
 * @returns {Array}
 */
export function getValuesForKeyByIds(data, ids, key) {

    return _.reduce(data, (result, item) => {
        if (_.has(item, 'id') && _.has(item, key) && _.includes(ids, item.id)) {
            result = [
                ...result,
                ...[ item[ key ] ]
            ];
        }
        return result;
    }, []);
}