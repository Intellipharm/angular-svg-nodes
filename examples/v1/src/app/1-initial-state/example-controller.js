export default class Controller {
    constructor () {
        this.svg_nodes_initial_state = [
            {columns: [
                {join: [0], label: "A1"},
                {join: [], label: "A2"},
                {join: [2,0], label: "A3"},
                {join: [], label: "A4", highlight: true},
                {join: [], label: "A5", highlight: true},
                {join: [], label: "A6"}
            ]},
            {columns: [
                {join: [], label: "B1"},
                {join: [0, 2], label: "B2", selected: true},
                {join: [], label: "B3"}
            ]},
            {columns: [
                {join: [], label: "C1"},
                {join: [], label: "C2"},
                {join: [], label: "C3"},
                {join: [], label: "C4"}
            ]}
        ];
    }
}