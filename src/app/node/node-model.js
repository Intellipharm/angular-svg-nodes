export default class AngularSvgNode {
    constructor(data) {
        this.active                 = !_.isUndefined(data.active)                   ? data.active                   : false;
        this.col_index              = !_.isUndefined(data.col_index)                ? data.col_index                : null;
        this.control                = !_.isUndefined(data.control)                  ? data.control                  : null;
        this.connected              = !_.isUndefined(data.connected)                ? data.connected                : false;
        this.connections            = !_.isUndefined(data.connections)              ? data.connections              : [];
        this.coords                 = !_.isUndefined(data.coords)                   ? data.coords                   : [];
        this.highlight              = !_.isUndefined(data.highlight)                ? data.highlight                : false;
        this.label                  = !_.isUndefined(data.label)                    ? data.label                    : "";
        this.label_x                = !_.isUndefined(data.label_x)                  ? data.label_x                  : null;
        this.label_y                = !_.isUndefined(data.label_y)                  ? data.label_y                  : null;
        this.lines                  = !_.isUndefined(data.lines)                    ? data.lines                    : [];
        this.potential_target_hover = !_.isUndefined(data.potential_target_hover)   ? data.potential_target_hover   : false;
        this.row_index              = !_.isUndefined(data.row_index)                ? data.row_index                : null;
        this.selected               = !_.isUndefined(data.selected)                 ? data.selected                 : false;
        this.source_hover           = !_.isUndefined(data.source_hover)             ? data.source_hover             : false;
        this.x                      = !_.isUndefined(data.x)                        ? data.x                        : [];
        this.y                      = !_.isUndefined(data.y)                        ? data.y                        : [];
    }
}