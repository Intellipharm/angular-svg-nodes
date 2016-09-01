'use strict';

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _rowModel = require('./row/row-model');

var _rowModel2 = _interopRequireDefault(_rowModel);

var _nodeModel = require('./node/node-model');

var _nodeModel2 = _interopRequireDefault(_nodeModel);

var _transformerConfigModel = require('./transformer-config/transformer-config-model');

var _transformerConfigModel2 = _interopRequireDefault(_transformerConfigModel);

var _angularSvgNodesTransformer = require('./angular-svg-nodes-transformer');

var Transformer = _interopRequireWildcard(_angularSvgNodesTransformer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

describe("AngularSvgNodes Transformer", function () {

    describe("transformIn", function () {

        var _data = [{
            id: 1,
            label: "A2",
            col_index: 1,
            row_index: 0,
            connections: []
        }, {
            id: 2,
            label: "A1",
            col_index: 0,
            row_index: 0,
            connections: []
        }, {
            id: 4,
            label: "A3",
            col_index: 2,
            row_index: 0,
            connections: []
        }, {
            id: 5,
            label: "B1",
            col_index: 0,
            row_index: 1,
            connections: [2, 4]
        }, {
            id: 6,
            label: "B2",
            col_index: 1,
            row_index: 1,
            connections: []
        }, {
            id: 7,
            label: "B3",
            col_index: 2,
            row_index: 1,
            connections: [4]
        }, {
            id: 8,
            label: "C1",
            col_index: 0,
            row_index: 2,
            connections: [6]
        }];

        (0, _deepFreeze2.default)(_data);

        it("should return correctly formatted result", function () {

            var _result = Transformer.transformIn(_data);

            expect(_result.length).toBe(3);

            expect(_result[0] instanceof _rowModel2.default).toBe(true);
            expect(_result[1] instanceof _rowModel2.default).toBe(true);
            expect(_result[2] instanceof _rowModel2.default).toBe(true);

            expect(_result[0].columns.length).toBe(3);

            expect(_result[1].columns.length).toBe(3);

            expect(_result[2].columns.length).toBe(1);

            expect(_result[0].columns[0] instanceof _nodeModel2.default).toBe(true);
            expect(_result[0].columns[1] instanceof _nodeModel2.default).toBe(true);
            expect(_result[0].columns[2] instanceof _nodeModel2.default).toBe(true);
            expect(_result[1].columns[0] instanceof _nodeModel2.default).toBe(true);
            expect(_result[1].columns[1] instanceof _nodeModel2.default).toBe(true);
            expect(_result[1].columns[2] instanceof _nodeModel2.default).toBe(true);
            expect(_result[0].columns[0] instanceof _nodeModel2.default).toBe(true);
        });

        it("should sort columns correctly and set labels correctly with default data/config", function () {

            var _result = Transformer.transformIn(_data);

            var _labels = _.reduce(_result, function (result, row) {
                return [].concat(_toConsumableArray(result), _toConsumableArray(_.map(row.columns, function (col) {
                    return col.label;
                })));
            }, []);

            var _expected_labels = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1'];

            expect(_labels).toEqual(_expected_labels);
        });

        it("should sort columns correctly and set labels correctly with custom data/config", function () {

            var _custom_data = [{
                id: 1,
                name: "A2",
                ui_column_index: 1,
                ui_row_index: 0,
                connections: []
            }, {
                id: 2,
                name: "A1",
                ui_column_index: 0,
                ui_row_index: 0,
                connections: []
            }, {
                id: 4,
                name: "A3",
                ui_column_index: 2,
                ui_row_index: 0,
                connections: []
            }, {
                id: 5,
                name: "B1",
                ui_column_index: 0,
                ui_row_index: 1,
                connections: [2, 4]
            }, {
                id: 6,
                name: "B2",
                ui_column_index: 1,
                ui_row_index: 1,
                connections: []
            }, {
                id: 7,
                name: "B3",
                ui_column_index: 2,
                ui_row_index: 1,
                connections: [4]
            }, {
                id: 8,
                name: "C1",
                ui_column_index: 0,
                ui_row_index: 2,
                connections: [6]
            }];

            var _config = new _transformerConfigModel2.default({
                row_index_field: 'ui_row_index',
                col_index_field: 'ui_column_index',
                label_field: 'name'
            });

            (0, _deepFreeze2.default)(_custom_data);
            (0, _deepFreeze2.default)(_config);

            var _result = Transformer.transformIn(_custom_data, _config);

            var _labels = _.reduce(_result, function (result, row) {
                return [].concat(_toConsumableArray(result), _toConsumableArray(_.map(row.columns, function (col) {
                    return col.label;
                })));
            }, []);

            var _expected_labels = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1'];

            expect(_labels).toEqual(_expected_labels);
        });

        it("should sort columns correctly and set connections correctly with default data/config", function () {

            var _result = Transformer.transformIn(_data);

            var _joins = _.reduce(_result, function (result, row) {
                return [].concat(_toConsumableArray(result), _toConsumableArray(_.map(row.columns, function (col) {
                    return col.connections;
                })));
            }, []);

            var _expected_joins = [[0], [], [0, 2], [], [0], [], []];

            expect(_joins).toEqual(_expected_joins);
        });

        it("should sort columns correctly and set connections correctly with custom data/config", function () {

            var _custom_data = [{
                id: 1,
                name: "A2",
                ui_column_index: 1,
                ui_row_index: 0,
                my_connections: []
            }, {
                id: 2,
                name: "A1",
                ui_column_index: 0,
                ui_row_index: 0,
                my_connections: []
            }, {
                id: 4,
                name: "A3",
                ui_column_index: 2,
                ui_row_index: 0,
                my_connections: []
            }, {
                id: 5,
                name: "B1",
                ui_column_index: 0,
                ui_row_index: 1,
                my_connections: [2, 4]
            }, {
                id: 6,
                name: "B2",
                ui_column_index: 1,
                ui_row_index: 1,
                my_connections: []
            }, {
                id: 7,
                name: "B3",
                ui_column_index: 2,
                ui_row_index: 1,
                my_connections: [4]
            }, {
                id: 8,
                name: "C1",
                ui_column_index: 0,
                ui_row_index: 2,
                my_connections: [6]
            }];

            var _config = new _transformerConfigModel2.default({
                row_index_field: 'ui_row_index',
                col_index_field: 'ui_column_index',
                label_field: 'name',
                connection_field: 'my_connections'
            });

            (0, _deepFreeze2.default)(_custom_data);
            (0, _deepFreeze2.default)(_config);

            var _result = Transformer.transformIn(_custom_data, _config);

            var _joins = _.reduce(_result, function (result, row) {
                return [].concat(_toConsumableArray(result), _toConsumableArray(_.map(row.columns, function (col) {
                    return col.connections;
                })));
            }, []);

            var _expected_joins = [[0], [], [0, 2], [], [0], [], []];

            expect(_joins).toEqual(_expected_joins);
        });

        it("should convert compatible database data to AngularSvgNodes initial state data, using default data/config", function () {

            var _result = Transformer.transformIn(_data);

            var _expected_result = [new _rowModel2.default({
                columns: [new _nodeModel2.default({ connections: [0], label: "A1" }), new _nodeModel2.default({ connections: [], label: "A2" }), new _nodeModel2.default({ connections: [0, 2], label: "A3" })]
            }), new _rowModel2.default({
                columns: [new _nodeModel2.default({ connections: [], label: "B1" }), new _nodeModel2.default({ connections: [0], label: "B2" }), new _nodeModel2.default({ connections: [], label: "B3" })]
            }), new _rowModel2.default({
                columns: [new _nodeModel2.default({ connections: [], label: "C1" })]
            })];

            expect(_result).toEqual(_expected_result);
        });

        it("should convert compatible database data to AngularSvgNodes initial state data, using custom data/config", function () {

            var _custom_data = [{
                id: 1,
                name: "A2",
                ui_column_index: 1,
                ui_row_index: 0,
                my_connections: []
            }, {
                id: 2,
                name: "A1",
                ui_column_index: 0,
                ui_row_index: 0,
                my_connections: []
            }, {
                id: 4,
                name: "A3",
                ui_column_index: 2,
                ui_row_index: 0,
                my_connections: []
            }, {
                id: 5,
                name: "B1",
                ui_column_index: 0,
                ui_row_index: 1,
                my_connections: [2, 4]
            }, {
                id: 6,
                name: "B2",
                ui_column_index: 1,
                ui_row_index: 1,
                my_connections: []
            }, {
                id: 7,
                name: "B3",
                ui_column_index: 2,
                ui_row_index: 1,
                my_connections: [4]
            }, {
                id: 8,
                name: "C1",
                ui_column_index: 0,
                ui_row_index: 2,
                my_connections: [6]
            }];
            var _config = new _transformerConfigModel2.default({
                row_index_field: 'ui_row_index',
                col_index_field: 'ui_column_index',
                label_field: 'name',
                connection_field: 'my_connections'
            });

            (0, _deepFreeze2.default)(_custom_data);
            (0, _deepFreeze2.default)(_config);

            var _result = Transformer.transformIn(_custom_data, _config);

            var _expected_result = [new _rowModel2.default({
                columns: [new _nodeModel2.default({ connections: [0], label: "A1" }), new _nodeModel2.default({ connections: [], label: "A2" }), new _nodeModel2.default({ connections: [0, 2], label: "A3" })]
            }), new _rowModel2.default({
                columns: [new _nodeModel2.default({ connections: [], label: "B1" }), new _nodeModel2.default({ connections: [0], label: "B2" }), new _nodeModel2.default({ connections: [], label: "B3" })]
            }), new _rowModel2.default({
                columns: [new _nodeModel2.default({ connections: [], label: "C1" })]
            })];

            expect(_result).toEqual(_expected_result);
        });
    });

    describe("transformRow", function () {

        it("should return new AngularSvgNodeRow with updated column connections by appending source_col_index to columns that match target_ids", function () {

            var _custom_data = [{
                id: 11,
                label: "AAA",
                col_index: 1
            }, {
                id: 22,
                label: "BBB",
                col_index: 0
            }, {
                id: 33,
                label: "CCC",
                col_index: 2
            }];
            var _row = new _rowModel2.default({
                columns: [new _nodeModel2.default({ label: "BBB", connections: [] }), new _nodeModel2.default({ label: "AAA", connections: [444] }), new _nodeModel2.default({ label: "CCC", connections: [] })]
            });
            var _target_ids = [11, 33];
            var _source_col_index = 666;

            (0, _deepFreeze2.default)(_custom_data);
            (0, _deepFreeze2.default)(_row);
            (0, _deepFreeze2.default)(_target_ids);

            var _result = Transformer.transformRow(_custom_data, _row, _target_ids, _source_col_index);

            expect(_result instanceof _rowModel2.default).toBe(true);

            expect(_result.columns.length).toBe(3);

            expect(_result.columns[0] instanceof _nodeModel2.default).toBe(true);
            expect(_result.columns[1] instanceof _nodeModel2.default).toBe(true);
            expect(_result.columns[2] instanceof _nodeModel2.default).toBe(true);

            expect(_result.columns[0].connections).toEqual([]);
            expect(_result.columns[1].connections).toEqual([444, 666]);
            expect(_result.columns[2].connections).toEqual([666]);
        });
    });
});
//# sourceMappingURL=sourcemaps/angular-svg-nodes-transformer-spec.js.map
