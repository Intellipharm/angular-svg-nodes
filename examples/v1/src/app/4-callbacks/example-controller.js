export default class Controller {

    constructor () {

        this.svg_nodes_initial_state = [
            {columns: [
                {join: [0], label: "A1"},
                {join: [], label: "A2"},
                {join: [2,0], label: "A3"}
            ]},
            {columns: [
                {join: [], label: "B1"},
                {join: [], label: "B2"},
                {join: [], label: "B3"}
            ]}
        ];

        this.selection_row_index;
        this.selection_col_index;
        this.connection_source_row_index;
        this.connection_source_col_index;
        this.connection_target_row_index;
        this.connection_target_col_index;
        this.connection_is_selected;
        this.added_row_index;
        this.added_col_index;
    }

    onNodeSelection(row_index, col_index) {
        this.selection_row_index = row_index;
        this.selection_col_index = col_index;
    }

    onNodeConnectionChange(source_row_index, source_col_index, target_row_index, target_col_index, is_connected) {
        this.connection_source_row_index = source_row_index;
        this.connection_source_col_index = source_col_index;
        this.connection_target_row_index = target_row_index;
        this.connection_target_col_index = target_col_index;
        this.connection_is_connected = is_connected;
    }

    onNodeAdded(row_index, col_index) {
        this.added_row_index = row_index;
        this.added_col_index = col_index;
    }
}