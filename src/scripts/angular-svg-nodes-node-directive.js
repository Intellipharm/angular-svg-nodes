(function() {
    'use strict';

    //----------------------------------
    // angular-svg-nodes-node directive
    //----------------------------------

    var directive = function() {
        return {
            restrict: 'EA',
            scope: {
                col_index:      "@angularSvgNodesNodeColIndex",
                row_index:      "@angularSvgNodesNodeRowIndex",
                onSelect:       "&angularSvgNodesNodeOnSelect",
                onDeselect:     "&angularSvgNodesNodeOnDeselect",
                onMouseOver:    "&angularSvgNodesNodeOnMouseOver",
                onMouseOut:     "&angularSvgNodesNodeOnMouseOut"
            },
            link: function (scope, element) {

                ////////////////////////////////////////////////
                //
                // handlers
                //
                ////////////////////////////////////////////////

                //----------------------------------
                // mouse down
                //----------------------------------

                element[0].addEventListener("mousedown", function() {

                    var col_index = _.parseInt(scope.col_index);
                    var row_index = _.parseInt(scope.row_index);

                    // call external handler
                    scope.onSelect({col_index: col_index, row_index: row_index});
                });

                //----------------------------------
                // mouse down
                //----------------------------------

                element[0].addEventListener("mouseover", function() {

                    var col_index = _.parseInt(scope.col_index);
                    var row_index = _.parseInt(scope.row_index);

                    // call external handler
                    scope.onMouseOver({col_index: col_index, row_index: row_index});
                });

                //----------------------------------
                // mouse out
                //----------------------------------

                element[0].addEventListener("mouseout", function(e) {

                    var element_bounds  = element[0].getBoundingClientRect();
                    var mouse_y         = e.clientY;
                    var element_center  = element_bounds.top + (element_bounds.height / 2);
                    //var element_top     = element_bounds.top + VERTICAL_ALLOWANCE;
                    //var element_bottom  = element_bounds.bottom - VERTICAL_ALLOWANCE;

                    //console.log(element_top, element_bottom);
                    //console.log(e.clientY, e.layerY ,e.offsetY ,e.screenY, e.y);

                    var col_index = _.parseInt(scope.col_index);
                    var row_index = _.parseInt(scope.row_index);
                    var exit_side = mouse_y < element_center ? 'top' : 'bottom';

                    // call external handler
                    scope.onMouseOut({col_index: col_index, row_index: row_index, exit_side: exit_side});
                });

                //----------------------------------
                // mouse up
                //----------------------------------

                element[0].addEventListener("mouseup", function() {

                    var col_index = _.parseInt(scope.col_index);
                    var row_index = _.parseInt(scope.row_index);

                    // call external handler
                    scope.onDeselect({col_index: col_index, row_index: row_index});
                });
            }
        };
    };

    angular.module('AngularSvgNodes').directive('angularSvgNodesNode', directive);

})();
