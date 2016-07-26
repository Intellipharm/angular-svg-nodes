export const MESSAGE_ERROR_INVALID_NODES_DATA     = "AngularSvgNodes Error: invalid nodes data provided";
export const MESSAGE_ERROR_INVALID_CONNECTIONS    = "AngularSvgNodes Error: invalid connections provided";
export const MESSAGE_ERROR_INVALID_ROW_INDEX      = "AngularSvgNodes Error: invalid row index provided";
export const MESSAGE_ERROR_INVALID_COLUMN_INDEX   = "AngularSvgNodes Error: invalid column index provided";

/**
 * areApiConnectionsValid
 *
 * @param nodes
 * @param row_index
 * @param connections
 * @returns {boolean}
 */
export function areApiConnectionsValid(nodes, row_index, connections) {

    // nodes has only 1 row (cannot have connections)
    if (nodes.length === 1) {
        console.error(MESSAGE_ERROR_INVALID_NODES_DATA);
        return false;
    }

    // row index is last row (cannot have connections)
    if (row_index === nodes.length - 1) {
        console.error(MESSAGE_ERROR_INVALID_ROW_INDEX);
        return false;
    }

    // if no connections then nothing to do so return success
    // ... but only at this point because this is the first point at which all params are valid
    if (_.isEmpty(connections)) {
        return true;
    }

    return _.reduce(connections, (result, connection_col_index) => {

        // controls are nodes too, so check against length - 1
        if (connection_col_index >= nodes[row_index + 1].columns.length - 1) {
            console.error(MESSAGE_ERROR_INVALID_CONNECTIONS);
            result = false;
        }

        return result;
    }, true);
}

/**
 * areApiCoordsValid
 *
 * @param nodes
 * @param row_index
 * @param col_index
 * @returns {boolean}
 */
export function areApiCoordsValid(nodes, row_index, col_index) {

    if (row_index >= nodes.length) {
        console.error(MESSAGE_ERROR_INVALID_ROW_INDEX);
        return false;
    }

    // controls are nodes too, so check against length - 1
    if (col_index >= nodes[row_index].columns.length - 1) {
        console.error(MESSAGE_ERROR_INVALID_COLUMN_INDEX);
        return false;
    }

    return true;
}

/**
 * areApiCoordsValidForInsert
 *
 * @param nodes
 * @param row_index
 * @param col_index
 * @returns {boolean}
 */
export function areApiCoordsValidForInsert(nodes, row_index, col_index) {

    if (row_index !== 0 && row_index > nodes.length) {
        console.error(MESSAGE_ERROR_INVALID_ROW_INDEX);
        return false;
    }

    // controls are nodes too, so check against length - 1
    if (col_index !== 0 && col_index > nodes[row_index].columns.length - 1) {
        console.error(MESSAGE_ERROR_INVALID_COLUMN_INDEX);
        return false;
    }

    return true;
}