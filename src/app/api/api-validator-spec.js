// local: models
import AngularSvgNodeRow from '../row/row-model';
import AngularSvgNode from '../node/node-model';

// SUT
import * as Validator from './api-validator';

describe("API Validator", () => {

    //------------------------------------------------------------
    // areApiConnectionsValid
    //------------------------------------------------------------

    describe("areApiConnectionsValid", () => {

        it("should return false and log error if nodes data only has 1 row", () => {

            spyOn(console, 'error');

            let _node1 = new AngularSvgNode({
                label: "AAA"
            });
            let _node2 = new AngularSvgNode({
                label: "CONTROL NODE"
            });
            let _node_row1_columns = [ _node1, _node2 ];
            let _node_row1 = new AngularSvgNodeRow({
                columns: _node_row1_columns
            });
            let _nodes = [ _node_row1 ];
            let _row_index = 0;
            let _connections = [];

            let _result = Validator.areApiConnectionsValid(_nodes, _row_index, _connections);

            expect(_result).toEqual(false);
            expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_NODES_DATA);
        });

        it("should return false and log error if row index is last row", () => {

            spyOn(console, 'error');

            let _node1 = new AngularSvgNode({
                label: "AAA"
            });
            let _node2 = new AngularSvgNode({
                label: "CONTROL NODE"
            });
            let _node3 = new AngularSvgNode({
                label: "BBB"
            });
            let _node4 = new AngularSvgNode({
                label: "CONTROL NODE"
            });
            let _node_row1_columns = [ _node1, _node2 ];
            let _node_row1 = new AngularSvgNodeRow({
                columns: _node_row1_columns
            });
            let _node_row2_columns = [ _node3, _node4 ];
            let _node_row2 = new AngularSvgNodeRow({
                columns: _node_row2_columns
            });
            let _nodes = [ _node_row1, _node_row2 ];
            let _row_index = 1;
            let _connections = [];

            let _result = Validator.areApiConnectionsValid(_nodes, _row_index, _connections);

            expect(_result).toEqual(false);
            expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_ROW_INDEX);
        });

        it("should return true if all params are valid and no connections are provided", () => {

            let _node1 = new AngularSvgNode({
                label: "AAA"
            });
            let _node2 = new AngularSvgNode({
                label: "CONTROL NODE"
            });
            let _node3 = new AngularSvgNode({
                label: "BBB"
            });
            let _node4 = new AngularSvgNode({
                label: "CONTROL NODE"
            });
            let _node_row1_columns = [ _node1, _node2 ];
            let _node_row1 = new AngularSvgNodeRow({
                columns: _node_row1_columns
            });
            let _node_row2_columns = [ _node3, _node4 ];
            let _node_row2 = new AngularSvgNodeRow({
                columns: _node_row2_columns
            });
            let _nodes = [ _node_row1, _node_row2 ];
            let _row_index = 0;
            let _connections = [];

            let _result = Validator.areApiConnectionsValid(_nodes, _row_index, _connections);

            expect(_result).toEqual(true);
        });

        it("should return false and log an error if a connection is invalid (greater than last non control node)", () => {

            spyOn(console, 'error');

            let _node1 = new AngularSvgNode({
                label: "AAA"
            });
            let _node2 = new AngularSvgNode({
                label: "CONTROL NODE"
            });
            let _node3 = new AngularSvgNode({
                label: "BBB"
            });
            let _node4 = new AngularSvgNode({
                label: "CONTROL NODE"
            });
            let _node_row1_columns = [ _node1, _node2 ];
            let _node_row1 = new AngularSvgNodeRow({
                columns: _node_row1_columns
            });
            let _node_row2_columns = [ _node3, _node4 ];
            let _node_row2 = new AngularSvgNodeRow({
                columns: _node_row2_columns
            });
            let _nodes = [ _node_row1, _node_row2 ];
            let _row_index = 0;
            let _connections = [
                0, // valid
                1 // invalid
            ];

            let _result = Validator.areApiConnectionsValid(_nodes, _row_index, _connections);

            expect(_result).toEqual(false);
            expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_CONNECTIONS);
        });

        it("should return true if connections are all valid (less than or equal to last non control node)", () => {

            let _node1 = new AngularSvgNode({
                label: "AAA"
            });
            let _node2 = new AngularSvgNode({
                label: "CONTROL NODE"
            });
            let _node3 = new AngularSvgNode({
                label: "BBB"
            });
            let _node4 = new AngularSvgNode({
                label: "CONTROL NODE"
            });
            let _node_row1_columns = [ _node1, _node2 ];
            let _node_row1 = new AngularSvgNodeRow({
                columns: _node_row1_columns
            });
            let _node_row2_columns = [ _node3, _node4 ];
            let _node_row2 = new AngularSvgNodeRow({
                columns: _node_row2_columns
            });
            let _nodes = [ _node_row1, _node_row2 ];
            let _row_index = 0;
            let _connections = [
                0 // valid
            ];

            let _result = Validator.areApiConnectionsValid(_nodes, _row_index, _connections);

            expect(_result).toEqual(true);
        });
    });

    //------------------------------------------------------------
    // areApiCoordsValid
    //------------------------------------------------------------

    describe("areApiCoordsValid", () => {

        it("should return false and log error if row index param is invalid", () => {

            spyOn(console, 'error');

            let _node1 = new AngularSvgNode({
                label: "AAA"
            });
            let _node2 = new AngularSvgNode({
                label: "CONTROL NODE"
            });
            let _node_row1_columns = [ _node1, _node2 ];
            let _node_row1 = new AngularSvgNodeRow({
                columns: _node_row1_columns
            });
            let _nodes = [ _node_row1 ];
            let _row_index = 1;
            let _col_index = 0;

            let _result = Validator.areApiCoordsValid(_nodes, _row_index, _col_index);

            expect(_result).toEqual(false);
            expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_ROW_INDEX);
        });

        it("should return false and log error if column index param is invalid", () => {

            spyOn(console, 'error');

            let _node1 = new AngularSvgNode({
                label: "AAA"
            });
            let _node2 = new AngularSvgNode({
                label: "CONTROL NODE"
            });
            let _node_row1_columns = [ _node1, _node2 ];
            let _node_row1 = new AngularSvgNodeRow({
                columns: _node_row1_columns
            });
            let _nodes = [ _node_row1 ];
            let _row_index = 0;
            let _col_index = 1;

            let _result = Validator.areApiCoordsValid(_nodes, _row_index, _col_index);

            expect(_result).toEqual(false);
            expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_COLUMN_INDEX);
        });

        it("should return true if row & column index params are valid", () => {

            let _node1 = new AngularSvgNode({
                label: "AAA"
            });
            let _node2 = new AngularSvgNode({
                label: "CONTROL NODE"
            });
            let _node_row1_columns = [ _node1, _node2 ];
            let _node_row1 = new AngularSvgNodeRow({
                columns: _node_row1_columns
            });
            let _nodes = [ _node_row1 ];
            let _row_index = 0;
            let _col_index = 0;

            let _result = Validator.areApiCoordsValid(_nodes, _row_index, _col_index);

            expect(_result).toEqual(true);
        });
    });

    //------------------------------------------------------------
    // areApiCoordsValidForInsert
    //------------------------------------------------------------

    describe("areApiCoordsValidForInsert", () => {

        describe("when inserting a node in a new column position", () => {

            it("should return false and log error if column index param is invalid (more than 1 place beyond last non control node)", () => {

                spyOn(console, 'error');

                let _node1 = new AngularSvgNode({
                    label: "AAA"
                });
                let _node2 = new AngularSvgNode({
                    label: "CONTROL NODE"
                });
                let _node_row1_columns = [ _node1, _node2 ];
                let _node_row1 = new AngularSvgNodeRow({
                    columns: _node_row1_columns
                });
                let _nodes = [ _node_row1 ];
                let _row_index = 0;
                let _col_index = 2;

                let _result = Validator.areApiCoordsValidForInsert(_nodes, _row_index, _col_index);

                expect(_result).toEqual(false);
                expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_COLUMN_INDEX);
            });

            it("should return true if column index is valid (same as last non control node)", () => {

                let _node1 = new AngularSvgNode({
                    label: "AAA"
                });
                let _node2 = new AngularSvgNode({
                    label: "CONTROL NODE"
                });
                let _node_row1_columns = [ _node1, _node2 ];
                let _node_row1 = new AngularSvgNodeRow({
                    columns: _node_row1_columns
                });
                let _nodes = [ _node_row1 ];
                let _row_index = 0;
                let _col_index = 0;

                let _result = Validator.areApiCoordsValidForInsert(_nodes, _row_index, _col_index);

                expect(_result).toEqual(true);
            });

            it("should return true if column index is valid (1 place beyond last non control node)", () => {

                let _node1 = new AngularSvgNode({
                    label: "AAA"
                });
                let _node2 = new AngularSvgNode({
                    label: "CONTROL NODE"
                });
                let _node_row1_columns = [ _node1, _node2 ];
                let _node_row1 = new AngularSvgNodeRow({
                    columns: _node_row1_columns
                });
                let _nodes = [ _node_row1 ];
                let _row_index = 0;
                let _col_index = 1;

                let _result = Validator.areApiCoordsValidForInsert(_nodes, _row_index, _col_index);

                expect(_result).toEqual(true);
            });
        });

        describe("when inserting a node in a new row position", () => {

            it("should return false and log error if row index param is invalid (more than 1 place beyond last row)", () => {

                spyOn(console, 'error');

                let _node1 = new AngularSvgNode({
                    label: "AAA"
                });
                let _node2 = new AngularSvgNode({
                    label: "CONTROL NODE"
                });
                let _node_row1_columns = [ _node1, _node2 ];
                let _node_row1 = new AngularSvgNodeRow({
                    columns: _node_row1_columns
                });
                let _nodes = [ _node_row1 ];
                let _row_index = 2;
                let _col_index = 0;

                let _result = Validator.areApiCoordsValidForInsert(_nodes, _row_index, _col_index);

                expect(_result).toEqual(false);
                expect(console.error).toHaveBeenCalledWith(Validator.MESSAGE_ERROR_INVALID_ROW_INDEX);
            });

            it("should return true if row index is valid (same as last row)", () => {

                let _node1 = new AngularSvgNode({
                    label: "AAA"
                });
                let _node2 = new AngularSvgNode({
                    label: "CONTROL NODE"
                });
                let _node_row1_columns = [ _node1, _node2 ];
                let _node_row1 = new AngularSvgNodeRow({
                    columns: _node_row1_columns
                });
                let _nodes = [ _node_row1 ];
                let _row_index = 0;
                let _col_index = 0;

                let _result = Validator.areApiCoordsValidForInsert(_nodes, _row_index, _col_index);

                expect(_result).toEqual(true);
            });

            it("should return true if row index is valid (1 place beyond last row)", () => {

                let _node1 = new AngularSvgNode({
                    label: "AAA"
                });
                let _node2 = new AngularSvgNode({
                    label: "CONTROL NODE"
                });
                let _node_row1_columns = [ _node1, _node2 ];
                let _node_row1 = new AngularSvgNodeRow({
                    columns: _node_row1_columns
                });
                let _nodes = [ _node_row1 ];
                let _row_index = 1;
                let _col_index = 0;

                let _result = Validator.areApiCoordsValidForInsert(_nodes, _row_index, _col_index);

                expect(_result).toEqual(true);
            });
        });
    });
});