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
                {join: [0], label: "Tempora vitae"},
                {join: [0], label: "Itaque nesciunt obcaecati quidem quo"},
            ]}
        ];

        this.add2Rows = function() {
            this.rows.push({columns: []}, {columns: []});
        };
	};

	angular.module('App').controller('AppController', controller);

})();