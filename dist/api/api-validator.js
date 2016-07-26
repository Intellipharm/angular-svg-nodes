"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.areApiConnectionsValid = areApiConnectionsValid;
exports.areApiCoordsValid = areApiCoordsValid;
exports.areApiCoordsValidForInsert = areApiCoordsValidForInsert;
var MESSAGE_ERROR_INVALID_NODES_DATA = exports.MESSAGE_ERROR_INVALID_NODES_DATA = "AngularSvgNodes Error: invalid nodes data provided";
var MESSAGE_ERROR_INVALID_CONNECTIONS = exports.MESSAGE_ERROR_INVALID_CONNECTIONS = "AngularSvgNodes Error: invalid connections provided";
var MESSAGE_ERROR_INVALID_ROW_INDEX = exports.MESSAGE_ERROR_INVALID_ROW_INDEX = "AngularSvgNodes Error: invalid row index provided";
var MESSAGE_ERROR_INVALID_COLUMN_INDEX = exports.MESSAGE_ERROR_INVALID_COLUMN_INDEX = "AngularSvgNodes Error: invalid column index provided";

function areApiConnectionsValid(nodes, row_index, connections) {
    if (nodes.length === 1) {
        console.error(MESSAGE_ERROR_INVALID_NODES_DATA);
        return false;
    }

    if (row_index === nodes.length - 1) {
        console.error(MESSAGE_ERROR_INVALID_ROW_INDEX);
        return false;
    }

    if (_.isEmpty(connections)) {
        return true;
    }

    return _.reduce(connections, function (result, connection_col_index) {
        if (connection_col_index >= nodes[row_index + 1].columns.length - 1) {
            console.error(MESSAGE_ERROR_INVALID_CONNECTIONS);
            result = false;
        }

        return result;
    }, true);
}

function areApiCoordsValid(nodes, row_index, col_index) {

    if (row_index >= nodes.length) {
        console.error(MESSAGE_ERROR_INVALID_ROW_INDEX);
        return false;
    }

    if (col_index >= nodes[row_index].columns.length - 1) {
        console.error(MESSAGE_ERROR_INVALID_COLUMN_INDEX);
        return false;
    }

    return true;
}

function areApiCoordsValidForInsert(nodes, row_index, col_index) {

    if (row_index !== 0 && row_index > nodes.length) {
        console.error(MESSAGE_ERROR_INVALID_ROW_INDEX);
        return false;
    }

    if (col_index !== 0 && col_index > nodes[row_index].columns.length - 1) {
        console.error(MESSAGE_ERROR_INVALID_COLUMN_INDEX);
        return false;
    }

    return true;
}
//# sourceMappingURL=../sourcemaps/api/api-validator.js.map
