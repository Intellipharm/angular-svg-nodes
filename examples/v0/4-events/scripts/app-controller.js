(function () {

    "use strict";

	//-------------------------
	// App Controller
	//-------------------------

	var controller = function () {

        var self = this;

        this.event_type;
        this.event_node;
        this.event_data;

        this.rows = [
            {columns: [
                {join: [0], label: "Delectus deleniti, doloremque ipsum dolor sit amet adipisicing elit", id: 111},
                {join: [], label: "Asperiores et ex iusto magnam", id: 555}
            ]},
            {columns: [
                {join: [], label: "Tempora vitae", id: 333},
                {join: [], label: "Itaque nesciunt obcaecati quidem quo", id: 777},
            ]}
        ];

        /**
         * onNodeMouseDown
         * @param node
         * @param data
         */
        this.onNodeMouseDown = function(node, data) {
            self.event_type = "Node Mouse Down";
            self.event_node = node;
            self.event_data = data;
        };

        /**
         * onNodeMouseUp
         * @param node
         * @param data
         */
        this.onNodeMouseUp = function(node, data) {
            self.event_type = "Node Mouse Up";
            self.event_node = node;
            self.event_data = data;
        };
	};

	angular.module('App').controller('AppController', controller);

})();