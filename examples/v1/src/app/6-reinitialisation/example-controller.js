export default class Controller {
    constructor ($timeout) {

        this.svg_nodes_initial_state = undefined;

        this.svg_nodes_state1 = [];

        this.svg_nodes_state2 = [
            {columns: [
                {join: [], label: "A1"},
                {join: [0], label: "A2"},
                {join: [], label: "A3"}
            ]},
            {columns: [
                {join: [], label: "B1"}
            ]}
        ];

        this.svg_nodes_state3 = [
            {columns: [
                {join: [0], label: "A1"},
                {join: [], label: "A2"},
                {join: [2,0], label: "A3"},
                {join: [], label: "A4"},
                {join: [], label: "A5"},
                {join: [], label: "A6"}
            ]},
            {columns: [
                {join: [], label: "B1"},
                {join: [0, 2], label: "B2"},
                {join: [], label: "B3"}
            ]},
            {columns: [
                {join: [], label: "C1"},
                {join: [], label: "C2"},
                {join: [], label: "C3"},
                {join: [], label: "C4"}
            ]}
        ];

        $timeout(() => {

            this.svg_nodes_initial_state = this.svg_nodes_state1;

            $timeout(() => {

                this.svg_nodes_initial_state = this.svg_nodes_state2;

                $timeout(() => {

                    this.svg_nodes_initial_state = this.svg_nodes_state3;

                }, 2000);
            }, 2000);
        }, 2000);
    }
}

Controller.$inject = ['$timeout'];