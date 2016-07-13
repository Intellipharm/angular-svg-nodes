export default class AngularSvgNode {
    constructor(data) {
        this.label  = !_.isUndefined(data.label)    ? data.label    : "";
        this.join   = !_.isUndefined(data.join)     ? data.join     : [];
    }
}