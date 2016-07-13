# angular-svg-nodes

## Dependencies
angular-svg-nodes depends on [AngularJS](https://github.com/angular/angular.js), [GreenSock-JS](https://github.com/greensock/GreenSock-JS), [Lodash](https://github.com/lodash/lodash)

## Description

An AngularJS SVG node display that allows drag connection between nodes, extensively styleable.

## How it works

Takes config properties that determine how it looks and behaves.

Takes an array property that determines it's it's initial state ie. number of blocks, labels & connections.

Handles further state changes internally (does not mutate any external variables) and does not persist state changes.

exposes an API with the following methods:
 * addRow ( label )
 * setNodeLabel ( row_index, col_index, label )
 * setNodeHighlight ( row_index, col_index, label )
 
exposes callbacks for the following events:
 * onNodeSelection ( row_index, col_index )
 * onNodeConnectionChange ( source_row_index, source_col_index, target_row_index, target_col_index, is_connected )
 * onNodeAdded ( row_index, col_index )

## Installation

```
jspm install github:Intellipharm/angular-svg-nodes
```

## Getting Started

JavaScript
```
import * as AngularSvgNodes from 'angular-svg-nodes';

var module = angular.module('YourApp', [
    AngularSvgNodes.module.name
]);
```

HTML
```
<angular-svg-nodes initial-state="::App.data_array"></angular-svg-nodes>
```

#### Transformer

To create initial-state data from database, use the transformIn method exposed via AngularSvgNodes.Transformer.

JavaScript
```
import * as AngularSvgNodes from 'angular-svg-nodes';

let _initial_state = AngularSvgNodes.Transformer.transformIn( my_compatible_database_data );
```

#### Transformer Config

To configure transformer, pass it an instance of AngularSvgNodes.TransformerConfig.

JavaScript
```
import * as AngularSvgNodes from 'angular-svg-nodes';

let _transformer_config = new AngularSvgNodes.TransformerConfig({
    row_index_field: 'my_row_index',
    col_index_field: 'my_column_index',
    label_field: 'my_label',
    connection_field: 'my_connections'
});
let _initial_state = AngularSvgNodes.Transformer.transformIn( my_compatible_database_data, _transformer_config );
```

## Examples

for complete examples:

```
cd examples/v1
npm run run
```

## Tests

to run tests:
```
gulp tdd
```