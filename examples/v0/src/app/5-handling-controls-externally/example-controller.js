export default class Controller {

    constructor () {

        this.data = [
            {columns: [
                {join: [0], label: "A1"},
                {join: [], label: "A2"}
            ]},
            {columns: [
                {join: [], label: "B1"},
                {join: [], label: "B2"}
            ]}
        ];

        this.selected_node_is_control = null;
        this.selected_node_col_index = null;
        this.selected_node_col_index = null;
    }

    onNodeMouseDown(node, data) {

        this.selected_node_is_control = _.isNull(data);
        this.selected_node_col_index = node.col_index;
        this.selected_node_row_index = node.row_index;

        if (this.selected_node_is_control) {
            return this.data[node.row_index].columns.push({label: "New Node", join: []});
        }
    };
}