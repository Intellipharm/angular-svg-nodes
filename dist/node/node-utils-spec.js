'use strict';

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _nodeSettings = require('./node-settings');

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
});
//# sourceMappingURL=../sourcemaps/node/node-utils-spec.js.map
