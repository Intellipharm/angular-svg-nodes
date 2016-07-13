import * as AngularSvgNodes from 'angular-svg-nodes';

export default class Controller {

    constructor () {

        this.database_data = [
            {
                id: 1,
                name: "A2",
                ui_column_index: 1,
                ui_row_index: 0,
                my_connections: []
            },
            {
                id: 2,
                name: "A1",
                ui_column_index: 0,
                ui_row_index: 0,
                my_connections: []
            },
            {
                id: 4,
                name: "A3",
                ui_column_index: 2,
                ui_row_index: 0,
                my_connections: []
            },
            {
                id: 5,
                name: "B1",
                ui_column_index: 0,
                ui_row_index: 1,
                my_connections: [ 2, 4 ]
            },
            {
                id: 6,
                name: "B2",
                ui_column_index: 1,
                ui_row_index: 1,
                my_connections: []
            },
            {
                id: 7,
                name: "B3",
                ui_column_index: 2,
                ui_row_index: 1,
                my_connections: [ 4 ]
            },
            {
                id: 8,
                name: "C1",
                ui_column_index: 0,
                ui_row_index: 2,
                my_connections: [ 6 ]
            }
        ];

        let _svg_nodes_initial_state_transformer_config = new AngularSvgNodes.TransformerConfig({
            row_index_field: 'ui_row_index',
            col_index_field: 'ui_column_index',
            label_field: 'name',
            connection_field: 'my_connections'
        });

        this.svg_nodes_initial_state = AngularSvgNodes.Transformer.transformIn(this.database_data, _svg_nodes_initial_state_transformer_config);
    }
}