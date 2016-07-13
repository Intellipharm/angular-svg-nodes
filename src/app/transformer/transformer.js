import _ from "lodash";

import AngularSvgNodeRow from '../row/row-model';
import AngularSvgNode from '../node/node-model';
import AngularSvgNodeTransformerConfig from './transformer-config-model';

/**
 * transformIn
 * transforms compatible database data for use as AngularSvgNodes initial state data
 *
 * @param data
 * @param config
 * @returns {*}
 */
export function transformIn(data, config = new AngularSvgNodeTransformerConfig({})) {

    if (!(config instanceof AngularSvgNodeTransformerConfig)) {
        console.error("AngularSvgNodes Error: invalid config provided to transformIn, must be instance of AngularSvgNodeTransformerConfig");
        return false;
    }

    // group into rows (using row index field)
    let _rows = _.groupBy(data, config.row_index_field);

    return _.reduce(_rows, (result, row, rowi) => {

        let _rowi = _.parseInt(rowi);

        // sort row data (using col index field)
        let _row = _.sortBy(row, (col) => col[ config.col_index_field ]);

        // create columns array
        let columns = _.map(_row, (col, coli) => {

            let _coli = _.parseInt(coli);

            // update parent columns with connections
            if (_rowi !== 0) {
                result[ _rowi - 1 ] = this.transformRow(data, result[ _rowi - 1 ], col[ config.connection_field ], _coli, config);
            }

            let _r = new AngularSvgNode({
                label: col[ config.label_field ]
            });

            return _r;

        }, result);

        // append new AngularSvgNodeRow to result
        return [
            ...result,
            ...[ new AngularSvgNodeRow({ columns }) ]
        ];
    }, []);
};

/**
 * transformRow
 * returns new AngularSvgNodeRow with updated column joins by appending source_col_index to columns that match target_ids
 *
 * @param data (the database data we will use to find target col index using target_ids)
 * @param row (the row we are updating)
 * @param target_ids (the database ids of the target nodes that the source node is connecting to)
 * @param source_col_index (the col index of the source node)
 * @param config
 */
export function transformRow(data, row, target_ids, source_col_index, config = new AngularSvgNodeTransformerConfig({})) {

    if (!(row instanceof AngularSvgNodeRow)) {
        console.error("AngularSvgNodes Error: invalid row provided to setRowConnections, must be instance of AngularSvgNodeRow");
        return false;
    }

    if (!(config instanceof AngularSvgNodeTransformerConfig)) {
        console.error("AngularSvgNodes Error: invalid config provided to transformIn, must be instance of AngularSvgNodeTransformerConfig");
        return false;
    }

    // get col indices of target nodes by ids
    let _target_col_indices = this.getValuesForKeyByIds(data, target_ids, config.col_index_field);

    let columns = _.map(row.columns, (col, coli) => {

        if (_.includes(_target_col_indices, coli)) {

            let join = [
                ...col.join,
                ...[ source_col_index ]
            ];

            let _node_data = Object.assign({}, col, { join } );

            return new AngularSvgNode( _node_data );
        }
        return col;
    });

    return new AngularSvgNodeRow({ columns });
}

/**
 * getValuesForKeyByIds
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