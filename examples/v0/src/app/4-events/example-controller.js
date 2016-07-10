export default class Controller {

    constructor () {

        this.svg_nodes_api = {};

        this.node_event_type;
        this.node_event_node;
        this.node_event_data;

        this.line_event_type;
        this.line_event_node;
        this.line_event_data;
        this.line_event_line_index;

        this.data = [
            {columns: [
                {join: [0, 1], label: "A1", data: {id: 111}},
                {join: [], label: "A2", data: {id: 555}},
                {join: [1], label: "A3", data: {id: 222}}
            ]},
            {columns: [
                {join: [], label: "B1", data: {id: 333}},
                {join: [], label: "B2", data: {id: 777}}
            ]},
            {columns: [
                {join: [], label: "C1", data: {id: 888}},
                {join: [], label: "C2", data: {id: 444}}
            ]}
        ];
    }

    onNodeMouseDown(node, data) {
        this.node_event_type = "Node Mouse Down";
        this.node_event_node = node;
        this.node_event_data = data;
    }

    onNodeMouseUp(node, data) {
        this.node_event_type = "Node Mouse Up";
        this.node_event_node = node;
        this.node_event_data = data;
    }

    onLineAdd(source_node, source_data, target_node, target_data, line_index) {
        this.line_event_type = "Line Add";
        this.line_event_source_node = source_node;
        this.line_event_source_data = source_data;
        this.line_event_target_node = target_node;
        this.line_event_target_data = target_data;
        this.line_event_line_index = line_index;
    }

    onLineRemove(source_node, source_data, target_node, target_data, line_index) {
        this.line_event_type = "Line Remove";
        this.line_event_source_node = source_node;
        this.line_event_source_data = source_data;
        this.line_event_target_node = target_node;
        this.line_event_target_data = target_data;
        this.line_event_line_index = line_index;
    }
}