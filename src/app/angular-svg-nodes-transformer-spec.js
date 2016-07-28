import deepFreeze from 'deep-freeze';

import AngularSvgNodeRow from './row/row-model';
import AngularSvgNode from './node/node-model';
import AngularSvgNodeTransformerConfig from './transformer-config/transformer-config-model';

import * as Transformer from './angular-svg-nodes-transformer';

describe("AngularSvgNodes Transformer", () => {

    //------------------------------------------------------------
    // transformIn
    //------------------------------------------------------------

    describe("transformIn", () => {

        let _data = [
            {
                id: 1,
                label: "A2",
                col_index: 1,
                row_index: 0,
                connections: []
            },
            {
                id: 2,
                label: "A1",
                col_index: 0,
                row_index: 0,
                connections: []
            },
            {
                id: 4,
                label: "A3",
                col_index: 2,
                row_index: 0,
                connections: []
            },
            {
                id: 5,
                label: "B1",
                col_index: 0,
                row_index: 1,
                connections: [ 2, 4 ]
            },
            {
                id: 6,
                label: "B2",
                col_index: 1,
                row_index: 1,
                connections: []
            },
            {
                id: 7,
                label: "B3",
                col_index: 2,
                row_index: 1,
                connections: [ 4 ]
            },
            {
                id: 8,
                label: "C1",
                col_index: 0,
                row_index: 2,
                connections: [ 6 ]
            }
        ];

        deepFreeze(_data);

        it("should return correctly formatted result", () => {

            let _result = Transformer.transformIn(_data);

            // should return 3 rows
            expect(_result.length).toBe(3);

            // ... rows should be AngularSvgNodeRow instances
            expect(_result[0] instanceof AngularSvgNodeRow).toBe(true);
            expect(_result[1] instanceof AngularSvgNodeRow).toBe(true);
            expect(_result[2] instanceof AngularSvgNodeRow).toBe(true);

            // ... 1st row should have 3 columns
            expect(_result[0].columns.length).toBe(3);

            // ... 2nd row should have 3 columns
            expect(_result[1].columns.length).toBe(3);

            // ... 3rd row should have 1 column
            expect(_result[2].columns.length).toBe(1);

            // ... columns property should contain an array of AngularSvgNode instances
            expect(_result[0].columns[0] instanceof AngularSvgNode).toBe(true);
            expect(_result[0].columns[1] instanceof AngularSvgNode).toBe(true);
            expect(_result[0].columns[2] instanceof AngularSvgNode).toBe(true);
            expect(_result[1].columns[0] instanceof AngularSvgNode).toBe(true);
            expect(_result[1].columns[1] instanceof AngularSvgNode).toBe(true);
            expect(_result[1].columns[2] instanceof AngularSvgNode).toBe(true);
            expect(_result[0].columns[0] instanceof AngularSvgNode).toBe(true);
        });

        it("should sort columns correctly and set labels correctly with default data/config", () => {

            let _result = Transformer.transformIn(_data);

            let _labels = _.reduce(_result, (result, row) => {
                return [ ...result, ..._.map(row.columns, (col) => {
                    return col.label;
                }) ];
            }, []);

            let _expected_labels = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1'];

            expect(_labels).toEqual(_expected_labels);
        });

        it("should sort columns correctly and set labels correctly with custom data/config", () => {

            let _custom_data = [
                {
                    id: 1,
                    name: "A2",
                    ui_column_index: 1,
                    ui_row_index: 0,
                    connections: []
                },
                {
                    id: 2,
                    name: "A1",
                    ui_column_index: 0,
                    ui_row_index: 0,
                    connections: []
                },
                {
                    id: 4,
                    name: "A3",
                    ui_column_index: 2,
                    ui_row_index: 0,
                    connections: []
                },
                {
                    id: 5,
                    name: "B1",
                    ui_column_index: 0,
                    ui_row_index: 1,
                    connections: [ 2, 4 ]
                },
                {
                    id: 6,
                    name: "B2",
                    ui_column_index: 1,
                    ui_row_index: 1,
                    connections: []
                },
                {
                    id: 7,
                    name: "B3",
                    ui_column_index: 2,
                    ui_row_index: 1,
                    connections: [ 4 ]
                },
                {
                    id: 8,
                    name: "C1",
                    ui_column_index: 0,
                    ui_row_index: 2,
                    connections: [ 6 ]
                }
            ];

            let _config = new AngularSvgNodeTransformerConfig({
                row_index_field: 'ui_row_index',
                col_index_field: 'ui_column_index',
                label_field: 'name'
            });

            deepFreeze(_custom_data);
            deepFreeze(_config);

            let _result = Transformer.transformIn(_custom_data, _config);

            let _labels = _.reduce(_result, (result, row) => {
                return [ ...result, ..._.map(row.columns, (col) => {
                    return col.label;
                }) ];
            }, []);

            let _expected_labels = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1'];

            expect(_labels).toEqual(_expected_labels);
        });

        it("should sort columns correctly and set connections correctly with default data/config", () => {

            let _result = Transformer.transformIn(_data);

            let _joins = _.reduce(_result, (result, row) => {
                return [ ...result, ..._.map(row.columns, (col) => {
                    return col.connections;
                }) ];
            }, []);

            let _expected_joins =   [ [0], [], [0, 2], [], [0], [], [] ];

            expect(_joins).toEqual(_expected_joins);
        });

        it("should sort columns correctly and set connections correctly with custom data/config", () => {

            let _custom_data = [
                {
                    id: 1,
                    name: "A2",
                    ui_column_index: 1,
                    ui_row_index: 0,
                    my_connections: []
                },
                {
                    id: 2,
                    name: "A1",
                    ui_column_index: 0,
                    ui_row_index: 0,
                    my_connections: []
                },
                {
                    id: 4,
                    name: "A3",
                    ui_column_index: 2,
                    ui_row_index: 0,
                    my_connections: []
                },
                {
                    id: 5,
                    name: "B1",
                    ui_column_index: 0,
                    ui_row_index: 1,
                    my_connections: [ 2, 4 ]
                },
                {
                    id: 6,
                    name: "B2",
                    ui_column_index: 1,
                    ui_row_index: 1,
                    my_connections: []
                },
                {
                    id: 7,
                    name: "B3",
                    ui_column_index: 2,
                    ui_row_index: 1,
                    my_connections: [ 4 ]
                },
                {
                    id: 8,
                    name: "C1",
                    ui_column_index: 0,
                    ui_row_index: 2,
                    my_connections: [ 6 ]
                }
            ];

            let _config = new AngularSvgNodeTransformerConfig({
                row_index_field: 'ui_row_index',
                col_index_field: 'ui_column_index',
                label_field: 'name',
                connection_field: 'my_connections'
            });

            deepFreeze(_custom_data);
            deepFreeze(_config);

            let _result = Transformer.transformIn(_custom_data, _config);

            let _joins = _.reduce(_result, (result, row) => {
                return [ ...result, ..._.map(row.columns, (col) => {
                    return col.connections;
                }) ];
            }, []);

            let _expected_joins =  [ [0], [], [0, 2], [], [0], [], [] ];

            expect(_joins).toEqual(_expected_joins);
        });

        it("should convert compatible database data to AngularSvgNodes initial state data, using default data/config", () => {

            let _result = Transformer.transformIn(_data);

            let _expected_result = [
                new AngularSvgNodeRow({
                    columns: [
                        new AngularSvgNode({ connections: [ 0 ], label: "A1" }),
                        new AngularSvgNode({ connections: [], label: "A2" }),
                        new AngularSvgNode({ connections: [ 0, 2 ], label: "A3" })
                    ]
                }),
                new AngularSvgNodeRow({
                    columns: [
                        new AngularSvgNode({ connections: [], label: "B1" }),
                        new AngularSvgNode({ connections: [ 0 ], label: "B2" }),
                        new AngularSvgNode({ connections: [], label: "B3" })
                    ]
                }),
                new AngularSvgNodeRow({
                    columns: [
                        new AngularSvgNode({ connections: [], label: "C1" })
                    ]
                })
            ];

            expect(_result).toEqual(_expected_result);
        });

        it("should convert compatible database data to AngularSvgNodes initial state data, using custom data/config", () => {

            let _custom_data = [
                {
                    id: 1,
                    name: "A2",
                    ui_column_index: 1,
                    ui_row_index: 0,
                    my_connections: []
                },
                {
                    id: 2,
                    name: "A1",
                    ui_column_index: 0,
                    ui_row_index: 0,
                    my_connections: []
                },
                {
                    id: 4,
                    name: "A3",
                    ui_column_index: 2,
                    ui_row_index: 0,
                    my_connections: []
                },
                {
                    id: 5,
                    name: "B1",
                    ui_column_index: 0,
                    ui_row_index: 1,
                    my_connections: [ 2, 4 ]
                },
                {
                    id: 6,
                    name: "B2",
                    ui_column_index: 1,
                    ui_row_index: 1,
                    my_connections: []
                },
                {
                    id: 7,
                    name: "B3",
                    ui_column_index: 2,
                    ui_row_index: 1,
                    my_connections: [ 4 ]
                },
                {
                    id: 8,
                    name: "C1",
                    ui_column_index: 0,
                    ui_row_index: 2,
                    my_connections: [ 6 ]
                }
            ];
            let _config = new AngularSvgNodeTransformerConfig({
                row_index_field: 'ui_row_index',
                col_index_field: 'ui_column_index',
                label_field: 'name',
                connection_field: 'my_connections'
            });

            deepFreeze(_custom_data);
            deepFreeze(_config);

            let _result = Transformer.transformIn(_custom_data, _config);

            let _expected_result = [
                new AngularSvgNodeRow({
                    columns: [
                        new AngularSvgNode({ connections: [ 0 ], label: "A1" }),
                        new AngularSvgNode({ connections: [], label: "A2" }),
                        new AngularSvgNode({ connections: [ 0, 2 ], label: "A3" })
                    ]
                }),
                new AngularSvgNodeRow({
                    columns: [
                        new AngularSvgNode({ connections: [], label: "B1" }),
                        new AngularSvgNode({ connections: [ 0 ], label: "B2" }),
                        new AngularSvgNode({ connections: [], label: "B3" })
                    ]
                }),
                new AngularSvgNodeRow({
                    columns: [
                        new AngularSvgNode({ connections: [], label: "C1" })
                    ]
                })
            ];

            expect(_result).toEqual(_expected_result);
        });
    });

    //------------------------------------------------------------
    // transformRow
    //------------------------------------------------------------

    describe("transformRow", () => {

        it("should return new AngularSvgNodeRow with updated column connections by appending source_col_index to columns that match target_ids", () => {

            let _custom_data = [
                {
                    id: 11,
                    label: "AAA",
                    col_index: 1
                },
                {
                    id: 22,
                    label: "BBB",
                    col_index: 0
                },
                {
                    id: 33,
                    label: "CCC",
                    col_index: 2
                }
            ];
            let _row = new AngularSvgNodeRow({
                columns: [
                    new AngularSvgNode({ label: "BBB", connections: [] }), // 22
                    new AngularSvgNode({ label: "AAA", connections: [ 444 ] }), // 11
                    new AngularSvgNode({ label: "CCC", connections: [] }) // 33
                ]
            });
            let _target_ids = [ 11, 33 ];
            let _source_col_index = 666;

            deepFreeze(_custom_data);
            deepFreeze(_row);
            deepFreeze(_target_ids);

            let _result = Transformer.transformRow(_custom_data, _row, _target_ids, _source_col_index);

            // result should be an AngularSvgNodeRow instance
            expect(_result instanceof AngularSvgNodeRow).toBe(true);

            // ... should contain 3 columns
            expect(_result.columns.length).toBe(3);

            // ... each column be an AngularSvgNode instance
            expect(_result.columns[0] instanceof AngularSvgNode).toBe(true);
            expect(_result.columns[1] instanceof AngularSvgNode).toBe(true);
            expect(_result.columns[2] instanceof AngularSvgNode).toBe(true);

            // ... should correctly update each node's connections property
            expect(_result.columns[0].connections).toEqual([]);
            expect(_result.columns[1].connections).toEqual([ 444, 666 ]);
            expect(_result.columns[2].connections).toEqual([ 666 ]);
        });

    });

});




