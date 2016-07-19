export default class Controller {
    constructor () {

        this.svg_nodes_initial_state = [
            {columns: [
                {join: [0], label: "A1"},
                {join: [], label: "A2"},
                {join: [2,0], label: "A3"},
                {join: [], label: "A4"},
                {join: [], label: "A5"},
                {join: [], label: "A6"}
            ]},
            {columns: [
                {join: [], label: "B1"},
                {join: [0, 2], label: "B2"},
                {join: [], label: "B3"}
            ]},
            {columns: [
                {join: [], label: "C1"},
                {join: [], label: "C2"},
                {join: [], label: "C3"},
                {join: [], label: "C4"}
            ]}
        ];

        this.svg_nodes_config = {
            block_width:                    40,
            block_height:                   60,
            col_spacing:                    5,
            disable_control_nodes:          true,
            row_spacing:                    15,
            initial_grid_cols:              8,
            initial_grid_rows:              4,
            label_spacing:                  20,
            max_viewport_width_increase:    200,
            max_viewport_height_increase:   200,
            new_node_label:                 "XXX",
            highlight_node_on:              [ "select", "add" ], // select | deselect | add
        };
    }
}