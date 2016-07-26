"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    restrict: 'A',
    scope: {
        coords: "=angularSvgNodesLineCoords",
        col_index: "@angularSvgNodesLineColIndex",
        row_index: "@angularSvgNodesLineRowIndex",
        line_index: "@angularSvgNodesLineLineIndex",
        onRemoveComplete: "&angularSvgNodesLineOnRemoveComplete",
        onMoveLineTargetComplete: "&angularSvgNodesLineonMoveLineTargetComplete",
        onDrawComplete: "&angularSvgNodesLineOnDrawComplete"
    },
    link: function link(scope, element) {

        var ANIM_DURATION = 0.5;

        var is_initialized = false;
        var source_coords = void 0;
        var target_coords = void 0;
        var previous_target_coords = void 0;

        var onRemoveComplete = function onRemoveComplete() {

            var line_index = _.parseInt(scope.line_index);

            scope.onRemoveComplete({ source_coords: source_coords, target_coords: previous_target_coords, line_index: line_index });
        };

        var onMoveLineTargetComplete = function onMoveLineTargetComplete() {

            var line_index = _.parseInt(scope.line_index);

            scope.onMoveLineTargetComplete({ source_coords: source_coords, target_coords: target_coords, line_index: line_index });
        };

        var onMoveLineSourceComplete = function onMoveLineSourceComplete() {};

        var onDrawComplete = function onDrawComplete() {

            var line_index = _.parseInt(scope.line_index);

            scope.onDrawComplete({ source_coords: source_coords, target_coords: target_coords, line_index: line_index });
        };

        scope.removeLineTarget = function (x, y) {

            TweenLite.to(element, ANIM_DURATION, {
                attr: { x2: x, y2: y },
                ease: Power4.easeOut,
                onComplete: onRemoveComplete
            });
        };

        scope.moveLineTarget = function (x) {

            TweenLite.to(element, ANIM_DURATION, {
                attr: { x2: x },
                ease: Power4.easeOut,
                onComplete: onMoveLineTargetComplete
            });
        };

        scope.moveLineSource = function (x) {

            TweenLite.to(element, ANIM_DURATION, {
                attr: { x1: x },
                ease: Power4.easeOut,
                onComplete: onMoveLineSourceComplete
            });
        };

        scope.drawLine = function (x1, y1, x2, y2) {

            TweenLite.set(element, { attr: { x1: x1, y1: y1, x2: x1, y2: y1 } });
            TweenLite.to(element, ANIM_DURATION, {
                attr: { x2: x2, y2: y2 },
                ease: Power4.easeOut,
                onComplete: onDrawComplete
            });
        };

        scope.$watch('coords', function (newValue, oldValue) {

            if (!_.isUndefined(newValue)) {

                source_coords = newValue.from;
                target_coords = newValue.to;
                previous_target_coords = newValue.previous_to;

                if (!is_initialized) {
                    scope.drawLine(newValue.x1, newValue.y1, newValue.x2, newValue.y2);
                    is_initialized = true;
                } else if (oldValue.to[1] === newValue.to[1] && oldValue.to[0] !== newValue.to[0]) {
                        scope.moveLineTarget(newValue.x2);
                    } else if (oldValue.to[0] === newValue.to[0] && oldValue.to[1] !== newValue.to[1]) {
                            scope.removeLineTarget(newValue.x2, newValue.y2);
                        } else if (oldValue.to[1] !== newValue.to[1] && oldValue.to[0] !== newValue.to[0]) {
                                if (newValue.to[1] < oldValue.to[1]) {
                                    scope.removeLineTarget(newValue.x2, newValue.y2);
                                } else {
                                        console.log("row increase");
                                    }
                            } else if (oldValue.from[0] !== newValue.from[0]) {
                                    scope.moveLineSource(newValue.x1);
                                }
            }
        }, true);
    }
};
//# sourceMappingURL=../sourcemaps/line/line-directive.js.map
