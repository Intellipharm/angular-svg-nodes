(function () {

    "use strict";

	//-------------------------
	// App Controller
	//-------------------------

	var controller = function () {

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

        this.addRow = function() {
            this.rows.push({columns: []});
        };
        this.add2Rows = function() {
            this.rows.push({columns: []}, {columns: []});
        };
        this.add2RowsWithBlocks = function() {
            this.rows.push({columns: []}, {columns: [{label: "Block2"}]});
        };
	};

	angular.module('App').controller('AppController', controller);

})();