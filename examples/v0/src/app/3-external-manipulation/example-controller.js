export default class Controller {

    constructor () {

        this.svg_nodes_api = {};

        this.highlight = 0;

        this.selected_node_col_index = null;
        this.selected_node_col_index = null;

        this.disable_change_label_button = true;
        this.disable_remove_block_button = true;
        this.disable_insert_block_button = true;

        this.data = [
            {columns: [
                {join: [0], label: "A1", data: {id: 111, ui_column_index: 0, ui_row_index: 0}},
                {join: [1], label: "A2", data: {id: 222, ui_column_index: 10, ui_row_index: 0}}
            ]},
            {columns: [
                {join: [], label: "B1", data: {id: 333, ui_column_index: 0, ui_row_index: 1}},
                {join: [], label: "B2", data: {id: 444, ui_column_index: 1, ui_row_index: 1}}
            ]}
        ];
    }

    changeLabel() {
        this.data[this.selected_node_row_index].columns[this.selected_node_col_index].label = "Hello "+Math.floor((Math.random() * 10) + 1);
    }

    removeBlock() {
        this.svg_nodes_api.removeBlock(this.selected_node_col_index, this.selected_node_row_index);
    }

    insertBlock() {
        this.svg_nodes_api.insertBlock(this.selected_node_col_index, this.selected_node_row_index, {join: [], label: "Brand New", data: {id: 555, ui_column_index: 0, ui_row_index: 0}});
    }

    highlight() {
        this.highlight ^= 1;
        this.svg_nodes_api.highlightBlock(this.highlight, 1, 0);
        this.svg_nodes_api.highlightBlock(this.highlight, 1, 1);
        this.svg_nodes_api.highlightBlock(this.highlight, 0, 1);
    };

    select() {
        this.svg_nodes_api.selectBlock(true, 1, 0);
    };

    deselect() {
        this.svg_nodes_api.selectBlock(false);
    };

    addRow() {
        this.data.push({columns: []});
    }

    add2Rows() {
        this.data.push({columns: []}, {columns: []});
    }

    add2RowsWithBlocks() {
        this.data.push({columns: [{label: "Block1", data: {id: 666, ui_column_index: 0, ui_row_index: 0}}]}, {columns: [{label: "Block2", data: {id: 777, ui_column_index: 0, ui_row_index: 0}}]});
    }

    onNodeMouseDown(node, data) {

        this.selected_node_col_index = node.col_index;
        this.selected_node_row_index = node.row_index;

        this.disable_change_label_button = false;
        this.disable_remove_block_button = false;
        this.disable_insert_block_button = false;
    }
}