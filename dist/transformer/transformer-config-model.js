'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_ROW_INDEX_FIELD = exports.DEFAULT_ROW_INDEX_FIELD = 'row_index';
var DEFAULT_COLUMN_INDEX_FIELD = exports.DEFAULT_COLUMN_INDEX_FIELD = 'col_index';
var DEFAULT_LABEL_FIELD = exports.DEFAULT_LABEL_FIELD = 'label';
var DEFAULT_CONNECTION_FIELD = exports.DEFAULT_CONNECTION_FIELD = 'connections';

var AngularSvgNodeTransformerConfig = function AngularSvgNodeTransformerConfig(data) {
    _classCallCheck(this, AngularSvgNodeTransformerConfig);

    this.row_index_field = !_.isUndefined(data.row_index_field) ? data.row_index_field : DEFAULT_ROW_INDEX_FIELD;
    this.col_index_field = !_.isUndefined(data.col_index_field) ? data.col_index_field : DEFAULT_COLUMN_INDEX_FIELD;
    this.label_field = !_.isUndefined(data.label_field) ? data.label_field : DEFAULT_LABEL_FIELD;
    this.connection_field = !_.isUndefined(data.connection_field) ? data.connection_field : DEFAULT_CONNECTION_FIELD;
};

exports.default = AngularSvgNodeTransformerConfig;
//# sourceMappingURL=../sourcemaps/transformer/transformer-config-model.js.map
