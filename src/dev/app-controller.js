export default class AppController {
    constructor ($timeout) {

        this.svg_nodes_api = {};

        this.data = [
            {
                id: 1,
                label: "A2",
                col_index: 1,
                row_index: 0,
                connections: [ 6 ]
            },
            {
                id: 2,
                label: "A1",
                col_index: 0,
                row_index: 0,
                connections: []//[ 5 ]
            },
            {
                id: 4,
                label: "A3",
                col_index: 0,
                row_index: 0,
                connections: []//[ 7, 5 ]
            },
            {
                id: 5,
                label: "B1",
                col_index: 1,
                row_index: 1,
                connections: []
            },
            {
                id: 6,
                label: "B2",
                col_index: 1,
                row_index: 1,
                connections: [ 8 ]
            },
            {
                id: 7,
                label: "B3",
                col_index: 2,
                row_index: 1,
                connections: []
            },
            {
                id: 8,
                label: "C1",
                col_index: 0,
                row_index: 2,
                connections: []
            }
        ];

        // completely empty

        this.svg_nodes_initial_state = [];

        $timeout(() => {

            // empty 2 rows

            // this.svg_nodes_initial_state = [
            //     { columns: [] },
            //     { columns: [] }
            // ];

            // nodes

            this.svg_nodes_initial_state = [
                {columns: [
                    {join: [0], label: "A1", highlight: true},
                    {join: [1], label: "A2", selected: true},
                    {join: [], label: "A3"}
                ]},
                {columns: [
                    {join: [], label: "B1"},
                    {join: [0], label: "B2"},
                    {join: [], label: "B3"}
                ]},
                {columns: [
                    {join: [], label: "C1"}
                ]}
            ];

        }, 1);

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
            // new_node_label:                 "ABC",
            new_node_label:                 (row_index, col_index) => {
                return row_index % 2 ? "New Action" : "New Trigger"
            },
            row_spacing:                    15,
            highlight_node_on:              [ "deselect", "add" ] // select | deselect | add
        };
    }

    onNodeSelection(row_index, col_index) {
        console.log("onNodeSelection", row_index, col_index);
    }

    onNodeDeselection(row_index, col_index) {
        console.log("onNodeDeselection", row_index, col_index);
    }

    onNodeConnectionChange(source_row_index, source_col_index, target_row_index, target_col_index, is_connected) {
        console.log("onNodeConnectionChange", source_row_index, source_col_index, target_row_index, target_col_index, is_connected);
    }

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

    removeNode() {
        this.svg_nodes_api.removeNode(1, 1);
    }

    insertNode() {
        this.svg_nodes_api.insertNode(1, 1, "ABC", [0]);
        this.svg_nodes_api.updateNodeConnections(0, 1, [1]);
    }

    updateNodeConnections() {
        this.svg_nodes_api.updateNodeConnections(0, 2, [ 2 ]);
    }
}

AppController.$inject = ['$timeout'];