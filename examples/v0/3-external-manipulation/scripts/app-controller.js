(function () {

    "use strict";

	//-------------------------
	// App Controller
	//-------------------------

	var controller = function () {


        this.svg_nodes_api = {};

        this.rows = [
            {columns: [
                {join: [0], label: "Delectus deleniti, doloremque ipsum dolor sit amet adipisicing elit"},
                {join: [1], label: "Asperiores et ex iusto magnam"}
            ]},
            {columns: [
                {join: [], label: "Tempora vitae"},
                {join: [], label: "Itaque nesciunt obcaecati quidem quo"},
            ]}
        ];

        this.changeLabel = function() {
            this.rows[0].columns[1].label = "Hello "+Math.floor((Math.random() * 10) + 1);

            console.log(this.rows);
        };
        this.removeBlock = function() {
            this.svg_nodes_api.removeBlock(0,1);
            //this.rows[0].columns.splice(0,1);
        };
        this.insertBlock = function() {
            this.svg_nodes_api.insertBlock(1,0, {join: [1]});
            //this.rows[0].columns.splice(0,1);
        };
        this.addRow = function() {
            this.rows.push({columns: []});
        };
        this.add2Rows = function() {
            this.rows.push({columns: []}, {columns: []});
        };
        this.add2RowsWithBlocks = function() {
            this.rows.push({columns: []}, {columns: [{label: "Block2"}]});
        };


        /**
         * onNodeMouseDown
         * @param node
         * @param data
         */
        this.onNodeMouseDown = function(node, data) {
            console.log(node);
            console.log(data);
        };
	};

	angular.module('App').controller('AppController', controller);

})();
