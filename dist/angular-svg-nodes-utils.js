"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getValuesForKeyByIds = getValuesForKeyByIds;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getValuesForKeyByIds(data, ids, key) {

    return _lodash2.default.reduce(data, function (result, item) {
        if (_lodash2.default.has(item, 'id') && _lodash2.default.has(item, key) && _lodash2.default.includes(ids, item.id)) {
            result = [].concat(_toConsumableArray(result), [item[key]]);
        }
        return result;
    }, []);
}
//# sourceMappingURL=sourcemaps/angular-svg-nodes-utils.js.map
