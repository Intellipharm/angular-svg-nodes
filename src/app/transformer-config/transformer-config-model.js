export const DEFAULT_ROW_INDEX_FIELD    = 'row_index';
export const DEFAULT_COLUMN_INDEX_FIELD = 'col_index';
export const DEFAULT_LABEL_FIELD        = 'label';
export const DEFAULT_CONNECTION_FIELD   = 'connections';

export default class AngularSvgNodeTransformerConfig {
    constructor(data) {
        this.row_index_field    = !_.isUndefined(data.row_index_field)  ? data.row_index_field  : DEFAULT_ROW_INDEX_FIELD;
        this.col_index_field    = !_.isUndefined(data.col_index_field)  ? data.col_index_field  : DEFAULT_COLUMN_INDEX_FIELD;
        this.label_field        = !_.isUndefined(data.label_field)      ? data.label_field      : DEFAULT_LABEL_FIELD;
        this.connection_field   = !_.isUndefined(data.connection_field) ? data.connection_field : DEFAULT_CONNECTION_FIELD;
    }
}