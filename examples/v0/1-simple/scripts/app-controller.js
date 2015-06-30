(function () {

    "use strict";

	//-------------------------
	// App Controller
	//-------------------------

	var controller = function () {

        this.rows = [
            {columns: [
                {join: [0], label: "Delectus deleniti, doloremque ipsum dolor sit amet adipisicing elit"},
                {join: [], label: "Asperiores et ex iusto magnam"},
                {join: [2,0], label: "Lorem ipsum dolor sit amet"},
                {join: [], label: "Consectetur adipisicing elit"},
                {join: [], label: "Aliquid assumenda"},
                {join: [], label: "Delectus deleniti, doloremque, eos"}
            ]},
            {columns: [
                {join: [], label: "Tempora vitae"},
                {join: [0, 2], label: "Itaque nesciunt obcaecati quidem quo"},
                {join: [], label: "Asperiores et ex iusto magnam"}
            ]},
            {columns: [
                {join: [], label: "Magnam sapiente"},
                {join: [], label: "Obcaecati quidem"},
                {join: [], label: "Tempora obcaecati quidem quo"},
                {join: [], label: "Ipsum dolor sit"}
            ]}
        ];
	};

	controller.$inject = ['$scope'];

	angular.module('App').controller('AppController', controller);

})();