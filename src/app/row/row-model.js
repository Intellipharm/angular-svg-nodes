export default class AngularSvgNodeRow {
    constructor(data) {
        this.columns = !_.isUndefined(data.columns) ? data.columns : [];
    }
}