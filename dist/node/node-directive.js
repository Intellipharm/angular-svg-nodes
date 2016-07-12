"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    restrict: 'A',
    scope: {
        coords: "=angularSvgNodesNodeCoords",
        col_index: "@angularSvgNodesNodeColIndex",
        row_index: "@angularSvgNodesNodeRowIndex",
        onSelect: "&angularSvgNodesNodeOnSelect",
        onDeselect: "&angularSvgNodesNodeOnDeselect",
        onMouseOver: "&angularSvgNodesNodeOnMouseOver",
        onMouseOut: "&angularSvgNodesNodeOnMouseOut"
    },
    link: function link(scope, element) {

        var curr_x = null;
        var ANIM_DURATION = 0.2;

        element[0].addEventListener("mousedown", function () {

            var col_index = _.parseInt(scope.col_index);
            var row_index = _.parseInt(scope.row_index);

            scope.onSelect({ col_index: col_index, row_index: row_index });
        });

        element[0].addEventListener("mouseover", function () {

            var col_index = _.parseInt(scope.col_index);
            var row_index = _.parseInt(scope.row_index);

            scope.onMouseOver({ col_index: col_index, row_index: row_index });
        });

        element[0].addEventListener("mouseout", function (e) {

            var element_bounds = element[0].getBoundingClientRect();
            var mouse_y = e.clientY;
            var element_center = element_bounds.top + element_bounds.height / 2;


            var col_index = _.parseInt(scope.col_index);
            var row_index = _.parseInt(scope.row_index);
            var exit_side = mouse_y < element_center ? 'top' : 'bottom';

            scope.onMouseOut({ col_index: col_index, row_index: row_index, exit_side: exit_side });
        });

        element[0].addEventListener("mouseup", function () {

            var col_index = _.parseInt(scope.col_index);
            var row_index = _.parseInt(scope.row_index);

            scope.onDeselect({ col_index: col_index, row_index: row_index });
        });

        var onPositionComplete = function onPositionComplete() {};

        scope.$watch('coords', function (newValue) {

            if (!_.isUndefined(newValue)) {
                var duration = _.isNull(curr_x) ? 0 : ANIM_DURATION;

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
//# sourceMappingURL=../sourcemaps/node/node-directive.js.map
