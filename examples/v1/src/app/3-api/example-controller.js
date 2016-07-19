export default class Controller {

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

        this.label_row_index = 0;
        this.label_col_index = 0;
        this.label = "NEW NAME";

        this.highlight_row_index = 0;
        this.highlight_col_index = 0;
        this.should_highlight = true;

        this.remove_row_index = 0;
        this.remove_col_index = 0;
    }

    addRows() {
        this.svg_nodes_api.addRow("C1");
    }

    setNodeLabel() {
        this.svg_nodes_api.setNodeLabel(this.label_row_index, this.label_col_index, this.label);
    }

    setNodeHighlight() {
        this.svg_nodes_api.setNodeHighlight(this.highlight_row_index, this.highlight_col_index, this.should_highlight);
    }

    removeNode() {
        this.svg_nodes_api.removeNode(this.remove_row_index, this.remove_col_index);
    }
}