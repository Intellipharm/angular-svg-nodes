'use strict';

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _angularSvgNodesUtils = require('./angular-svg-nodes-utils');

var Utils = _interopRequireWildcard(_angularSvgNodesUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("AngualrSvgNodes Utils", function () {

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
