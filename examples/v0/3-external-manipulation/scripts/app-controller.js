(function () {

    "use strict";

	//-------------------------
	// App Controller
	//-------------------------

	var controller = function () {

        var self = this;

        var highlight = 0;

        this.svg_nodes_api = {};

        this.selected_node_col_index = null;
        this.selected_node_col_index = null;

        this.disable_change_label_button = true;
        this.disable_remove_block_button = true;
        this.disable_insert_block_button = true;

        this.rows = [
            {columns: [
                {join: [0], label: "Delectus deleniti, doloremque ipsum dolor sit amet adipisicing elit", data: {id: 111, ui_column_index: 0, ui_row_index: 0}},
                {join: [1], label: "Asperiores et ex iusto magnam", data: {id: 222, ui_column_index: 10, ui_row_index: 0}},
            ]},
            {columns: [
                {join: [], label: "Tempora vitae", data: {id: 333, ui_column_index: 0, ui_row_index: 1}},
                {join: [], label: "Itaque nesciunt obcaecati quidem quo", data: {id: 444, ui_column_index: 1, ui_row_index: 1}},
            ]}
        ];

        /**
         * changeLabel
         */
        this.changeLabel = function() {
            this.rows[self.selected_node_row_index].columns[self.selected_node_col_index].label = "Hello "+Math.floor((Math.random() * 10) + 1);
        };

        /**
         * removeBlock
         */
        this.removeBlock = function() {
            this.svg_nodes_api.removeBlock(self.selected_node_col_index, self.selected_node_row_index);
        };

        /**
         * insertBlock
         */
        this.insertBlock = function() {
            this.svg_nodes_api.insertBlock(self.selected_node_col_index, self.selected_node_row_index, {join: [], label: "Brand New", data: {id: 555, ui_column_index: 0, ui_row_index: 0}});
        };

        /**
         * highlight
         */
        this.highlight = function() {
            highlight ^= 1;
            this.svg_nodes_api.highlightBlock(highlight, 1, 0);
            this.svg_nodes_api.highlightBlock(highlight, 1, 1);
            this.svg_nodes_api.highlightBlock(highlight, 0, 1);
        };

        /**
         * select
         */
        this.select = function() {
            this.svg_nodes_api.selectBlock(true, 1, 0);
        };

        /**
         * deselect
         */
        this.deselect = function() {
            this.svg_nodes_api.selectBlock(false);
        };

        /**
         * addRow
         */
        this.addRow = function() {
            this.rows.push({columns: []});
        }

        /**
         * add2Rows
         */
        this.add2Rows = function() {
            this.rows.push({columns: []}, {columns: []});
        };

        /**
         * add2RowsWithBlocks
         */
        this.add2RowsWithBlocks = function() {
            this.rows.push({columns: [{label: "Block1", data: {id: 666, ui_column_index: 0, ui_row_index: 0}}]}, {columns: [{label: "Block2", data: {id: 777, ui_column_index: 0, ui_row_index: 0}}]});
        };

        /**
         * onNodeMouseDown
         * @param node
         * @param data
         */
        this.onNodeMouseDown = function(node, data) {

            console.log(node.col_index, node.row_index);

            self.selected_node_col_index = node.col_index;
            self.selected_node_row_index = node.row_index;

            self.disable_change_label_button = false;
            self.disable_remove_block_button = false;
            self.disable_insert_block_button = false;
        };
	};

	angular.module('App').controller('AppController', controller);

})();
