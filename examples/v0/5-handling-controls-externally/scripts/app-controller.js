(function () {

    "use strict";

	//-------------------------
	// App Controller
	//-------------------------

	var controller = function () {

        var self = this;

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

        /**
         * onNodeMouseDown
         * @param node
         * @param data
         */
        this.onNodeMouseDown = function(node, data) {

            // if no data then this is a control node
            if (_.isNull(data)) {
                console.log("CONTROL: "+node.row_index);

                self.rows[node.row_index].columns.push({label: "New Node", join: []});
                console.log(self.rows);
                return true;
            }
        };
	};

	angular.module('App').controller('AppController', controller);

})();