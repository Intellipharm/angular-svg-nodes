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

        this.insert_row_index = 0;
        this.insert_col_index = 0;
        this.insert_label = "NEW NAME";

        this.connect_source_row_index = 0;
        this.connect_source_col_index = 0;
        this.connect_target_col_index = 0;
    }

    addRows() {
        this.svg_nodes_api.addRow("C1");
    }

    setNodeLabel() {
        this.svg_nodes_api.setNodeLabel(_.parseInt(this.label_row_index), _.parseInt(this.label_col_index), this.label);
    }

    setNodeHighlight() {
        this.svg_nodes_api.setNodeHighlight(_.parseInt(this.highlight_row_index), _.parseInt(this.highlight_col_index), this.should_highlight);
    }

    removeNode() {
        this.svg_nodes_api.removeNode(_.parseInt(this.remove_row_index), _.parseInt(this.remove_col_index));
    }

    insertNode() {
        let _connections = [];
        this.svg_nodes_api.insertNode(_.parseInt(this.insert_row_index), _.parseInt(this.insert_col_index), this.insert_label, _connections);
    }

    connectNodes() {
        let _source_row_index = _.parseInt(this.connect_source_row_index);
        let _source_col_index = _.parseInt(this.connect_source_col_index);
        let _target_col_index = _.parseInt(this.connect_target_col_index);
        let _connections = [ _target_col_index ];
        this.svg_nodes_api.updateNodeConnections(_source_row_index, _source_col_index, _connections);
    }
}