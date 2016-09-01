'use strict';

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _nodeSettings = require('./node-settings');

var _nodeModel = require('./node-model');

var _nodeModel2 = _interopRequireDefault(_nodeModel);

var _lineModel = require('../line/line-model');

var _lineModel2 = _interopRequireDefault(_lineModel);

var _nodeUtils = require('./node-utils');

var Utils = _interopRequireWildcard(_nodeUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("Node Utils", function () {

    describe("getNodeCoords", function () {

        describe("should return correct x,y coordinates for given node", function () {

            it("should return 0,0 for first node 0,0", function () {

                var _col_index = 0;
                var _row_index = 0;
                var _position = _nodeSettings.NODE_TOP_LEFT;
                var _config = {
                    col_spacing: 0,
                    row_spacing: 0,
                    node_width: 10,
                    node_height: 10
                };

                var _result = Utils.getNodeCoords(_row_index, _col_index, _position, _config);

                expect(_result).toEqual([0, 0]);
            });

            it("should take node width & height into account and return 15,10 for first node 1,1", function () {

                var _col_index = 1;
                var _row_index = 1;
                var _position = _nodeSettings.NODE_TOP_LEFT;
                var _config = {
                    col_spacing: 0,
                    row_spacing: 0,
                    node_width: 15,
                    node_height: 10
                };

                var _result = Utils.getNodeCoords(_row_index, _col_index, _position, _config);

                expect(_result).toEqual([15, 10]);
            });

            it("should take row & column spacing into account and return 17,13 for first node 1,1", function () {

                var _col_index = 1;
                var _row_index = 1;
                var _position = _nodeSettings.NODE_TOP_LEFT;
                var _config = {
                    col_spacing: 2,
                    row_spacing: 3,
                    node_width: 15,
                    node_height: 10
                };

                var _result = Utils.getNodeCoords(_row_index, _col_index, _position, _config);

                expect(_result).toEqual([17, 13]);
            });
        });
    });

    describe("isNodeIndexMatch", function () {

        it("should return true because node matches provided indices", function () {

            var _node = {
                row_index: 123,
                col_index: 123
            };
            var _row_index = 123;
            var _col_index = 123;

            (0, _deepFreeze2.default)(_node);

            var _result = Utils.isNodeIndexMatch(_node, _row_index, _col_index);

            expect(_result).toEqual(true);
        });

        it("should return false because node's column index does not match provided indices", function () {

            var _node = {
                row_index: 123,
                col_index: 456
            };
            var _row_index = 123;
            var _col_index = 123;

            (0, _deepFreeze2.default)(_node);

            var _result = Utils.isNodeIndexMatch(_node, _row_index, _col_index);

            expect(_result).toEqual(false);
        });

        it("should return false because node's row index does not match provided indices", function () {

            var _node = {
                row_index: 456,
                col_index: 123
            };
            var _row_index = 123;
            var _col_index = 123;

            (0, _deepFreeze2.default)(_node);

            var _result = Utils.isNodeIndexMatch(_node, _row_index, _col_index);

            expect(_result).toEqual(false);
        });
    });

    describe("updateNodeLineProperty", function () {

        it("should update given property and return node line data", function () {

            var _line = new _lineModel2.default({
                aaa: "AAA",
                bbb: 123
            });

            (0, _deepFreeze2.default)(_line);

            var _result = Utils.updateNodeLineProperty(_line, 'aaa', "BBB");
            var _expected_result = new _lineModel2.default({
                aaa: "BBB",
                bbb: 123
            });

            expect(_result).toEqual(_expected_result);
        });
    });

    describe("updateNodeProperty", function () {

        it("should update given property and return node data", function () {

            var _node = new _nodeModel2.default({
                aaa: "AAA",
                bbb: 123
            });

            (0, _deepFreeze2.default)(_node);

            var _result = Utils.updateNodeProperty(_node, 'aaa', "BBB");
            var _expected_result = new _nodeModel2.default({
                aaa: "BBB",
                bbb: 123
            });

            expect(_result).toEqual(_expected_result);
        });
    });

    describe("updateNodesActivateNode", function () {

        it("should set targeted node's 'active' property to true and return updated node array", function () {

            var _line1 = new _lineModel2.default({ to: [2, 1], active: true });
            var _line2 = new _lineModel2.default({ to: [0, 1], active: true });
            var _line3 = new _lineModel2.default({ to: [1, 1], active: false });
            var _node1 = new _nodeModel2.default({ row_index: 0, col_index: 0, active: false, lines: [_line1] });
            var _node2 = new _nodeModel2.default({ row_index: 0, col_index: 1, active: false, lines: [_line2, _line3] });
            var _node3 = new _nodeModel2.default({ row_index: 1, col_index: 0, active: false });
            var _node4 = new _nodeModel2.default({ row_index: 1, col_index: 1, active: false });
            var _node5 = new _nodeModel2.default({ row_index: 1, col_index: 2, active: false });

            var _nodes = [{ columns: [_node1, _node2] }, { columns: [_node3, _node4, _node5] }];

            var _row_index = 0;
            var _col_index = 1;

            (0, _deepFreeze2.default)(_nodes);

            var _result = Utils.updateNodesActivateNode(_nodes, _row_index, _col_index);

            expect(_result[_node1.row_index].columns[_node1.col_index]).toEqual(jasmine.objectContaining(_node1));

            expect(_result[_row_index].columns[_col_index]).toEqual(jasmine.objectContaining({
                row_index: _row_index,
                col_index: _col_index,
                active: true
            }));

            expect(_result[_row_index].columns[_col_index].lines).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
                to: [0, 1],
                active: true
            }), jasmine.objectContaining({
                to: [1, 1],
                active: true
            })]));

            expect(_result[_line2.to[1]].columns[_line2.to[0]]).toEqual(jasmine.objectContaining({
                row_index: _line2.to[1],
                col_index: _line2.to[0],
                active: true
            }));

            expect(_result[_line3.to[1]].columns[_line3.to[0]]).toEqual(jasmine.objectContaining({
                row_index: _line3.to[1],
                col_index: _line3.to[0],
                active: true
            }));
        });
    });
});
//# sourceMappingURL=../sourcemaps/node/node-utils-spec.js.map
