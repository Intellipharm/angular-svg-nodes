export default class AppController {
    constructor () {

        this.svg_nodes_api = {};

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

        this.svg_nodes_config = {
            block_width:                    40,
            block_height:                   60,
            col_spacing:                    5,
            disable_control_nodes:          true,
            initial_grid_cols:              8,
            initial_grid_rows:              2,
            label_spacing:                  20,
            max_viewport_width_increase:    200,
            max_viewport_height_increase:   200,
            row_spacing:                    15
        };
    }

    /**
     * onNodeSelectiond
     *
     * @param row_index
     * @param col_index
     */
    onNodeSelection(row_index, col_index) {
        console.log("onNodeSelection", row_index, col_index);
    }

    /**
     * onNodeConnectionChange
     *
     * @param source_row_index
     * @param source_col_index
     * @param target_row_index
     * @param target_col_index
     * @param is_connected
     */
    onNodeConnectionChange(source_row_index, source_col_index, target_row_index, target_col_index, is_connected) {
        console.log("onNodeConnectionChange", source_row_index, source_col_index, target_row_index, target_col_index, is_connected);
    }

    /**
     * onNodeAdded
     *
     * @param row_index
     * @param col_index
     */
    onNodeAdded(row_index, col_index) {
        console.log("onNodeAdded", row_index, col_index);
    }

    addRows() {
        this.svg_nodes_api.addRow("C1");
        this.svg_nodes_api.addRow("D1");
    }

    setNodeLabel() {
        this.svg_nodes_api.setNodeLabel(0, 1, "NEW NAME");
    }

    setNodeHighlight() {
        this.svg_nodes_api.setNodeHighlight(0, 1, true);
    }
}