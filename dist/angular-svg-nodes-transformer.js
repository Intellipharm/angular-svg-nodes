'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.transformIn = transformIn;
exports.transformRow = transformRow;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _rowModel = require('./row/row-model');

var _rowModel2 = _interopRequireDefault(_rowModel);

var _nodeModel = require('./node/node-model');

var _nodeModel2 = _interopRequireDefault(_nodeModel);

var _transformerConfigModel = require('./transformer-config/transformer-config-model');

var _transformerConfigModel2 = _interopRequireDefault(_transformerConfigModel);

var _angularSvgNodesUtils = require('./angular-svg-nodes-utils');

var Utils = _interopRequireWildcard(_angularSvgNodesUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function transformIn(data) {
    var _this = this;

    var config = arguments.length <= 1 || arguments[1] === undefined ? new _transformerConfigModel2.default({}) : arguments[1];


    if (!(config instanceof _transformerConfigModel2.default)) {
        console.error("AngularSvgNodes Error: invalid config provided to transformIn, must be instance of AngularSvgNodeTransformerConfig");
        return false;
    }

    var _rows = _lodash2.default.groupBy(data, config.row_index_field);

    return _lodash2.default.reduce(_rows, function (result, row, rowi) {

        var _rowi = _lodash2.default.parseInt(rowi);

        var _row = _lodash2.default.sortBy(row, function (col) {
            return col[config.col_index_field];
        });

        var columns = _lodash2.default.map(_row, function (col, coli) {

            var _coli = _lodash2.default.parseInt(coli);

            if (_rowi !== 0) {
                result[_rowi - 1] = _this.transformRow(data, result[_rowi - 1], col[config.connection_field], _coli, config);
            }

            var _result = new _nodeModel2.default({
                label: col[config.label_field]
            });

            return _result;
        }, result);

        return [].concat(_toConsumableArray(result), [new _rowModel2.default({ columns: columns })]);
    }, []);
}

function transformRow(data, row, target_ids, source_col_index) {
    var config = arguments.length <= 4 || arguments[4] === undefined ? new _transformerConfigModel2.default({}) : arguments[4];


    if (!(row instanceof _rowModel2.default)) {
        console.error("AngularSvgNodes Error: invalid row provided to setRowConnections, must be instance of AngularSvgNodeRow");
        return false;
    }

    if (!(config instanceof _transformerConfigModel2.default)) {
        console.error("AngularSvgNodes Error: invalid config provided to transformIn, must be instance of AngularSvgNodeTransformerConfig");
        return false;
    }

    var _target_col_indices = Utils.getValuesForKeyByIds(data, target_ids, config.col_index_field);

    var columns = _lodash2.default.map(row.columns, function (col, coli) {

        if (_lodash2.default.includes(_target_col_indices, coli)) {

            var connections = [].concat(_toConsumableArray(col.connections), [source_col_index]);

            var _node_data = Object.assign({}, col, { connections: connections });

            return new _nodeModel2.default(_node_data);
        }
        return col;
    });

    return new _rowModel2.default({ columns: columns });
}
//# sourceMappingURL=sourcemaps/angular-svg-nodes-transformer.js.map
