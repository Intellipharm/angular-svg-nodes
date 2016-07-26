'use strict';

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _angularSvgNodesSettings = require('./angular-svg-nodes-settings');

var _angularSvgNodesUtils = require('./angular-svg-nodes-utils');

var Utils = _interopRequireWildcard(_angularSvgNodesUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("AngualrSvgNodes Utils", function () {

    describe("getNodeCoords", function () {

        describe("should return correct x,y coordinates for given node", function () {

            it("should return 0,0 for first node 0,0", function () {

                var _col_index = 0;
                var _row_index = 0;
                var _position = _angularSvgNodesSettings.NODE_TOP_LEFT;
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
                var _position = _angularSvgNodesSettings.NODE_TOP_LEFT;
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
                var _position = _angularSvgNodesSettings.NODE_TOP_LEFT;
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

    describe("getValuesForKeyByIds", function () {

        it("return an array of values for given key, for each item whose id is in given ids array", function () {

            var _ids = [11, 22];
            var _custom_data = [{
                id: 11,
                col_index: 111
            }, {
                id: 33,
                col_index: 333
            }, {
                id: 22,
                col_index: 222
            }];

            (0, _deepFreeze2.default)(_ids);
            (0, _deepFreeze2.default)(_custom_data);

            var _result = Utils.getValuesForKeyByIds(_custom_data, _ids, 'col_index');

            var _expected_result = [111, 222];

            expect(_result).toEqual(_expected_result);
        });
    });
});
//# sourceMappingURL=sourcemaps/angular-svg-nodes-utils-spec.js.map
