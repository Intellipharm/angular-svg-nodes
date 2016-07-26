export default {
    restrict: 'A',
    scope: {
        coords:         "=angularSvgNodesNodeCoords",
        col_index:      "@angularSvgNodesNodeColIndex",
        row_index:      "@angularSvgNodesNodeRowIndex",
        onSelect:       "&angularSvgNodesNodeOnSelect",
        onDeselect:     "&angularSvgNodesNodeOnDeselect",
        onMouseOver:    "&angularSvgNodesNodeOnMouseOver",
        onMouseOut:     "&angularSvgNodesNodeOnMouseOut"
    },
    link: function (scope, element) {

        let curr_x = null;
        let ANIM_DURATION = 0.2;

        ////////////////////////////////////////////////
        //
        // handlers
        //
        ////////////////////////////////////////////////

        //----------------------------------
        // mouse down
        //----------------------------------

        element[0].addEventListener("mousedown", function() {

            let col_index = _.parseInt(scope.col_index);
            let row_index = _.parseInt(scope.row_index);

            // call external handler
            scope.onSelect({ row_index, col_index });
        });

        //----------------------------------
        // mouse down
        //----------------------------------

        element[0].addEventListener("mouseover", function() {

            let col_index = _.parseInt(scope.col_index);
            let row_index = _.parseInt(scope.row_index);

            // call external handler
            scope.onMouseOver({ row_index, col_index });
        });

        //----------------------------------
        // mouse out
        //----------------------------------

        element[0].addEventListener("mouseout", function(e) {

            let element_bounds  = element[0].getBoundingClientRect();
            let mouse_y         = e.clientY;
            let element_center  = element_bounds.top + (element_bounds.height / 2);
            //let element_top     = element_bounds.top + VERTICAL_ALLOWANCE;
            //let element_bottom  = element_bounds.bottom - VERTICAL_ALLOWANCE;

            //console.log(element_top, element_bottom);
            //console.log(e.clientY, e.layerY ,e.offsetY ,e.screenY, e.y);

            let col_index = _.parseInt(scope.col_index);
            let row_index = _.parseInt(scope.row_index);
            let exit_side = mouse_y < element_center ? 'top' : 'bottom';

            // call external handler
            scope.onMouseOut({ row_index, col_index, exit_side });
        });

        //----------------------------------
        // mouse up
        //----------------------------------

        element[0].addEventListener("mouseup", function() {

            let col_index = _.parseInt(scope.col_index);
            let row_index = _.parseInt(scope.row_index);

            // call external handler
            scope.onDeselect({ row_index, col_index });
        });

        //----------------------------------
        // position complete
        //----------------------------------

        let onPositionComplete = function() {

        };

        ////////////////////////////////////////////////
        //
        // watchers
        //
        ////////////////////////////////////////////////

        scope.$watch('coords', function(newValue) {

            if (!_.isUndefined(newValue)) {
                let duration = _.isNull(curr_x) ? 0 : ANIM_DURATION;

                TweenLite.to(element, duration, {
                    x: newValue[0], y: newValue[1],
                    ease: Power4.easeOut,
                    onComplete: onPositionComplete
                });

                curr_x = newValue[0];
            }
        });
    }
};