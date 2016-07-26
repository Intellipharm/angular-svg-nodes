'use strict';

var _rowModel = require('../row/row-model');

var _rowModel2 = _interopRequireDefault(_rowModel);

var _nodeModel = require('../node/node-model');

var _nodeModel2 = _interopRequireDefault(_nodeModel);

var _apiValidator = require('./api-validator');

var Validator = _interopRequireWildcard(_apiValidator);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("API Validator", function () {

    describe("areApiConnectionsValid", function () {

        it("should return false and log error if nodes data only has 1 row", function () {

            spyOn(console, 'error');

            var _node1 = new _nodeModel2.default({
                label: "AAA"
            });
            var _node2 = new _nodeModel2.default({
                label: "CONTROL NODE"
            });
            var _node_row1_columns = [_node1, _node2];
            var _node_row1 = new _rowModel2.default({
                columns: _node_row1_columns
            });
            var _nodes = [_node_row1];
            var _row_index = 0;
            var _connections = [];

            var _result = Validator.areApiConnectionsValid(_nodes, _row_index, _connections);

            expect(_result).toEqual(false);
            expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_NODES_DATA);
        });

        it("should return false and log error if row index is last row", function () {

            spyOn(console, 'error');

            var _node1 = new _nodeModel2.default({
                label: "AAA"
            });
            var _node2 = new _nodeModel2.default({
                label: "CONTROL NODE"
            });
            var _node3 = new _nodeModel2.default({
                label: "BBB"
            });
            var _node4 = new _nodeModel2.default({
                label: "CONTROL NODE"
            });
            var _node_row1_columns = [_node1, _node2];
            var _node_row1 = new _rowModel2.default({
                columns: _node_row1_columns
            });
            var _node_row2_columns = [_node3, _node4];
            var _node_row2 = new _rowModel2.default({
                columns: _node_row2_columns
            });
            var _nodes = [_node_row1, _node_row2];
            var _row_index = 1;
            var _connections = [];

            var _result = Validator.areApiConnectionsValid(_nodes, _row_index, _connections);

            expect(_result).toEqual(false);
            expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_ROW_INDEX);
        });

        it("should return true if all params are valid and no connections are provided", function () {

            var _node1 = new _nodeModel2.default({
                label: "AAA"
            });
            var _node2 = new _nodeModel2.default({
                label: "CONTROL NODE"
            });
            var _node3 = new _nodeModel2.default({
                label: "BBB"
            });
            var _node4 = new _nodeModel2.default({
                label: "CONTROL NODE"
            });
            var _node_row1_columns = [_node1, _node2];
            var _node_row1 = new _rowModel2.default({
                columns: _node_row1_columns
            });
            var _node_row2_columns = [_node3, _node4];
            var _node_row2 = new _rowModel2.default({
                columns: _node_row2_columns
            });
            var _nodes = [_node_row1, _node_row2];
            var _row_index = 0;
            var _connections = [];

            var _result = Validator.areApiConnectionsValid(_nodes, _row_index, _connections);

            expect(_result).toEqual(true);
        });

        it("should return false and log an error if a connection is invalid (greater than last non control node)", function () {

            spyOn(console, 'error');

            var _node1 = new _nodeModel2.default({
                label: "AAA"
            });
            var _node2 = new _nodeModel2.default({
                label: "CONTROL NODE"
            });
            var _node3 = new _nodeModel2.default({
                label: "BBB"
            });
            var _node4 = new _nodeModel2.default({
                label: "CONTROL NODE"
            });
            var _node_row1_columns = [_node1, _node2];
            var _node_row1 = new _rowModel2.default({
                columns: _node_row1_columns
            });
            var _node_row2_columns = [_node3, _node4];
            var _node_row2 = new _rowModel2.default({
                columns: _node_row2_columns
            });
            var _nodes = [_node_row1, _node_row2];
            var _row_index = 0;
            var _connections = [0, 1];

            var _result = Validator.areApiConnectionsValid(_nodes, _row_index, _connections);

            expect(_result).toEqual(false);
            expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_CONNECTIONS);
        });

        it("should return true if connections are all valid (less than or equal to last non control node)", function () {

            var _node1 = new _nodeModel2.default({
                label: "AAA"
            });
            var _node2 = new _nodeModel2.default({
                label: "CONTROL NODE"
            });
            var _node3 = new _nodeModel2.default({
                label: "BBB"
            });
            var _node4 = new _nodeModel2.default({
                label: "CONTROL NODE"
            });
            var _node_row1_columns = [_node1, _node2];
            var _node_row1 = new _rowModel2.default({
                columns: _node_row1_columns
            });
            var _node_row2_columns = [_node3, _node4];
            var _node_row2 = new _rowModel2.default({
                columns: _node_row2_columns
            });
            var _nodes = [_node_row1, _node_row2];
            var _row_index = 0;
            var _connections = [0];

            var _result = Validator.areApiConnectionsValid(_nodes, _row_index, _connections);

            expect(_result).toEqual(true);
        });
    });

    describe("areApiCoordsValid", function () {

        it("should return false and log error if row index param is invalid", function () {

            spyOn(console, 'error');

            var _node1 = new _nodeModel2.default({
                label: "AAA"
            });
            var _node2 = new _nodeModel2.default({
                label: "CONTROL NODE"
            });
            var _node_row1_columns = [_node1, _node2];
            var _node_row1 = new _rowModel2.default({
                columns: _node_row1_columns
            });
            var _nodes = [_node_row1];
            var _row_index = 1;
            var _col_index = 0;

            var _result = Validator.areApiCoordsValid(_nodes, _row_index, _col_index);

            expect(_result).toEqual(false);
            expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_ROW_INDEX);
        });

        it("should return false and log error if column index param is invalid", function () {

            spyOn(console, 'error');

            var _node1 = new _nodeModel2.default({
                label: "AAA"
            });
            var _node2 = new _nodeModel2.default({
                label: "CONTROL NODE"
            });
            var _node_row1_columns = [_node1, _node2];
            var _node_row1 = new _rowModel2.default({
                columns: _node_row1_columns
            });
            var _nodes = [_node_row1];
            var _row_index = 0;
            var _col_index = 1;

            var _result = Validator.areApiCoordsValid(_nodes, _row_index, _col_index);

            expect(_result).toEqual(false);
            expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_COLUMN_INDEX);
        });

        it("should return true if row & column index params are valid", function () {

            var _node1 = new _nodeModel2.default({
                label: "AAA"
            });
            var _node2 = new _nodeModel2.default({
                label: "CONTROL NODE"
            });
            var _node_row1_columns = [_node1, _node2];
            var _node_row1 = new _rowModel2.default({
                columns: _node_row1_columns
            });
            var _nodes = [_node_row1];
            var _row_index = 0;
            var _col_index = 0;

            var _result = Validator.areApiCoordsValid(_nodes, _row_index, _col_index);

            expect(_result).toEqual(true);
        });
    });

    describe("areApiCoordsValidForInsert", function () {

        describe("when inserting a node in a new column position", function () {

            it("should return false and log error if column index param is invalid (more than 1 place beyond last non control node)", function () {

                spyOn(console, 'error');

                var _node1 = new _nodeModel2.default({
                    label: "AAA"
                });
                var _node2 = new _nodeModel2.default({
                    label: "CONTROL NODE"
                });
                var _node_row1_columns = [_node1, _node2];
                var _node_row1 = new _rowModel2.default({
                    columns: _node_row1_columns
                });
                var _nodes = [_node_row1];
                var _row_index = 0;
                var _col_index = 2;

                var _result = Validator.areApiCoordsValidForInsert(_nodes, _row_index, _col_index);

                expect(_result).toEqual(false);
                expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_COLUMN_INDEX);
            });

            it("should return true if column index is valid (same as last non control node)", function () {

                var _node1 = new _nodeModel2.default({
                    label: "AAA"
                });
                var _node2 = new _nodeModel2.default({
                    label: "CONTROL NODE"
                });
                var _node_row1_columns = [_node1, _node2];
                var _node_row1 = new _rowModel2.default({
                    columns: _node_row1_columns
                });
                var _nodes = [_node_row1];
                var _row_index = 0;
                var _col_index = 0;

                var _result = Validator.areApiCoordsValidForInsert(_nodes, _row_index, _col_index);

                expect(_result).toEqual(true);
            });

            it("should return true if column index is valid (1 place beyond last non control node)", function () {

                var _node1 = new _nodeModel2.default({
                    label: "AAA"
                });
                var _node2 = new _nodeModel2.default({
                    label: "CONTROL NODE"
                });
                var _node_row1_columns = [_node1, _node2];
                var _node_row1 = new _rowModel2.default({
                    columns: _node_row1_columns
                });
                var _nodes = [_node_row1];
                var _row_index = 0;
                var _col_index = 1;

                var _result = Validator.areApiCoordsValidForInsert(_nodes, _row_index, _col_index);

                expect(_result).toEqual(true);
            });
        });

        describe("when inserting a node in a new row position", function () {

            it("should return false and log error if row index param is invalid (more than 1 place beyond last row)", function () {

                spyOn(console, 'error');

                var _node1 = new _nodeModel2.default({
                    label: "AAA"
                });
                var _node2 = new _nodeModel2.default({
                    label: "CONTROL NODE"
                });
                var _node_row1_columns = [_node1, _node2];
                var _node_row1 = new _rowModel2.default({
                    columns: _node_row1_columns
                });
                var _nodes = [_node_row1];
                var _row_index = 2;
                var _col_index = 0;

                var _result = Validator.areApiCoordsValidForInsert(_nodes, _row_index, _col_index);

                expect(_result).toEqual(false);
                expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_ROW_INDEX);
            });

            it("should return true if row index is valid (same as last row)", function () {

                var _node1 = new _nodeModel2.default({
                    label: "AAA"
                });
                var _node2 = new _nodeModel2.default({
                    label: "CONTROL NODE"
                });
                var _node_row1_columns = [_node1, _node2];
                var _node_row1 = new _rowModel2.default({
                    columns: _node_row1_columns
                });
                var _nodes = [_node_row1];
                var _row_index = 0;
                var _col_index = 0;

                var _result = Validator.areApiCoordsValidForInsert(_nodes, _row_index, _col_index);

                expect(_result).toEqual(true);
            });

            it("should return true if row index is valid (1 place beyond last row)", function () {

                var _node1 = new _nodeModel2.default({
                    label: "AAA"
                });
                var _node2 = new _nodeModel2.default({
                    label: "CONTROL NODE"
                });
                var _node_row1_columns = [_node1, _node2];
                var _node_row1 = new _rowModel2.default({
                    columns: _node_row1_columns
                });
                var _nodes = [_node_row1];
                var _row_index = 1;
                var _col_index = 0;

                var _result = Validator.areApiCoordsValidForInsert(_nodes, _row_index, _col_index);

                expect(_result).toEqual(true);
            });
        });
    });
});
//# sourceMappingURL=../sourcemaps/api/api-validator-spec.js.map
