// local: constants
import {
    NODE_TOP_LEFT,
    NODE_TOP,
    NODE_CENTER,
    NODE_BOTTOM
} from "./node-settings";

// local: models
import AngularSvgNode from './node-model';
import AngularSvgNodeRow from '../row/row-model';
import AngularSvgNodeLine from '../line/line-model';

/**
 * returns the x,y location coordinates of the node identified by row & column indices
 *
 * @param row_index
 * @param col_index
 * @param position
 * @param config
 * @returns {*}
 */
export function getNodeCoords (row_index, col_index, position, config) {

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

/**
 * checks whether node matches provided indices
 *
 * @param node
 * @param row_index
 * @param col_index
 * @returns {boolean}
 */
export function isNodeIndexMatch (node, row_index, col_index) {
    return node.row_index === row_index && node.col_index === col_index;
}

/**
 * updates the line's property and returns new AngularSvgNode instance
 *
 * @param line
 * @param prop
 * @param value
 * @returns {AngularSvgNodeLine}
 */
export function updateNodeLineProperty (line, prop, value) {
    return new AngularSvgNodeLine(Object.assign({}, line, {
        [ prop ]: value
    }));
}

/**
 * updates the node's property and returns new AngularSvgNode instance
 *
 * @param node
 * @param prop
 * @param value
 * @returns {AngularSvgNode}
 */
export function updateNodeProperty (node, prop, value) {
    return new AngularSvgNode(Object.assign({}, node, {
        [ prop ]: value
    }));
}

/**
 * updates provided nodes array by
 * ... activating the targeted node
 * ... activating all the targeted node's lines
 * ... activating all nodes that the targeted node's lines connects to
 *
 * @param nodes
 * @param row_index
 * @param col_index
 */
export function updateNodesActivateNode (nodes, row_index, col_index) {

    // this keeps track of which nodes need to be activated
    let _activate_indices = [ { row_index, col_index } ];

    return _.map(nodes, (row) => {

        // row
        return new AngularSvgNodeRow(Object.assign({}, {
            columns: _.map(row.columns, (node) => {

                let _node_indices = {
                    row_index: node.row_index,
                    col_index: node.col_index
                };

                // if node matches indices
                if (!_.isEmpty(_.find(_activate_indices, _node_indices))) {

                    // activate node

                    node = this.updateNodeProperty(node, 'active', true);

                    // lines
                    node.lines = _.map(node.lines, (line) => {

                        // update indices array with indices for node that lines connects to, so that it will be activated on the next iteration
                        _activate_indices.push({ row_index: line.to[1], col_index: line.to[0] });

                        // activate line
                        return this.updateNodeLineProperty(line, 'active', true);
                    });
                }

                return node;
            })
        }));
    });
}