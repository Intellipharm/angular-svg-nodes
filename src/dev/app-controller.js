export default class AppController {
    constructor () {

        this.data = [
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

        this.svg_nodes_api = {};

        this.node_event_type;
        this.node_event_node;
        this.node_event_data;

        this.line_event_type;
        this.line_event_node;
        this.line_event_data;
        this.line_event_line_index;
    }

    onNodeMouseDown(node, data) {
        
    }

    onNodeMouseUp(node, data) {

    }

    onLineAdd(source_node, source_data, target_node, target_data, line_index) {

    }

    onLineRemove(source_node, source_data, target_node, target_data, line_index) {

    }
}