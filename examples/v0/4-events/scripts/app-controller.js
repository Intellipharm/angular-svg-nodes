(function () {

    "use strict";

	//-------------------------
	// App Controller
	//-------------------------

	var controller = function () {

        var self = this;

        this.svg_nodes_api = {};

        this.node_event_type;
        this.node_event_node;
        this.node_event_data;

        this.line_event_type;
        this.line_event_node;
        this.line_event_data;
        this.line_event_line_index;

        this.rows = [
            {columns: [
                {join: [0, 2], label: "Delectus deleniti, doloremque ipsum dolor sit amet adipisicing elit", data: {id: 111}},
                {join: [], label: "This is Sutin", data: {id: 555}},
                {join: [2], label: "Asperiores et ex iusto magnam", data: {id: 222}}
            ]},
            {columns: [
                {join: [], label: "Tempora vitae", data: {id: 333}},
                {join: [], label: "Itaque nesciunt obcaecati quidem quo", data: {id: 777}},
                {join: [1], label: "asdsadsadsadsadsa", data: {id: 887}},
            ]},
            {columns: [
                {join: [], label: "Tempora vitae", data: {id: 888}},
                {join: [], label: "Itaque nesciunt obcaecati quidem quo", data: {id: 444}},
            ]}
        ];

        this.removeBlock = function() {
            this.svg_nodes_api.removeBlock(1, 1);
            //this.rows[0].columns.splice(0,1);
        };
        this.insertBlock = function() {
            this.svg_nodes_api.insertBlock(1, 2, {join: [], label: "Lorem Sutin", data: {id: 999}});
            //this.rows[0].columns.splice(0,1);
        };
        this.addLine = function() {
            this.svg_nodes_api.addLine([1, 0], [1, 1], true);
            //this.rows[1].columns[1].join = [1];
        };

        /**
         * onNodeMouseDown
         * @param node
         * @param data
         */
        this.onNodeMouseDown = function(node, data) {
            self.node_event_type = "Node Mouse Down";
            self.node_event_node = node;
            self.node_event_data = data;
        };

        /**
         * onNodeMouseUp
         * @param node
         * @param data
         */
        this.onNodeMouseUp = function(node, data) {
            self.node_event_type = "Node Mouse Up";
            self.node_event_node = node;
            self.node_event_data = data;
        };

        /**
         * onLineAdd
         * @param source_node
         * @param source_data
         * @param target_node
         * @param target_data
         * @param line_index
         */
        this.onLineAdd = function(source_node, source_data, target_node, target_data, line_index) {
            self.line_event_type = "Line Add";
            self.line_event_source_node = source_node;
            self.line_event_source_data = source_data;
            self.line_event_target_node = target_node;
            self.line_event_target_data = target_data;
            self.line_event_line_index = line_index;
        };

        /**
         * onLineRemove
         * @param source_node
         * @param source_data
         * @param target_node
         * @param target_data
         * @param line_index
         */
        this.onLineRemove = function(source_node, source_data, target_node, target_data, line_index) {

            self.line_event_type = "Line Remove";
            self.line_event_source_node = source_node;
            self.line_event_source_data = source_data;
            self.line_event_target_node = target_node;
            self.line_event_target_data = target_data;
            self.line_event_line_index = line_index;
        };
	};

	angular.module('App').controller('AppController', controller);

})();
