(function() {
    'use strict';

    //----------------------------------
    // angular-svg-nodes-line directive
    //----------------------------------

    var directive = function() {
        return {
            restrict: 'EA',
            scope: {
                coords:     "=angularSvgNodesLineCoords",
                col_index:  "@angularSvgNodesLineColIndex",
                row_index:  "@angularSvgNodesLineRowIndex",
                line_index: "@angularSvgNodesLineLineIndex",
                onRemoveComplete:   "&angularSvgNodesLineOnRemoveComplete",
                onMoveComplete:     "&angularSvgNodesLineOnMoveComplete",
                onDrawComplete:     "&angularSvgNodesLineOnDrawComplete"
            },
            link: function (scope, element) {

                var ANIM_DURATION = 0.5;

                // control

                var is_initialized = false;
                var source_coords;
                var target_coords;

                ////////////////////////////////////////////////
                //
                // watchers
                //
                ////////////////////////////////////////////////

                scope.$watch('coords', function(newValue, oldValue) {

                    if (!_.isUndefined(newValue)) {

                        source_coords = newValue.from;
                        target_coords = newValue.to;

                        //console.log("COL: "+oldValue.to[0] +" === "+ newValue.to[0]);
                        //console.log("ROW: "+oldValue.to[1] +" === "+ newValue.to[1]);
                        //console.log("ROW: "+oldValue.y2 +" === "+ newValue.y2);

                        // init
                        if (!is_initialized) {
                            scope.drawLine(newValue.x1, newValue.y1, newValue.x2, newValue.y2);
                            is_initialized = true;
                        }

                        // if only target col coord has changed
                        else if (oldValue.to[1] === newValue.to[1] && oldValue.to[0] !== newValue.to[0]) {
                            scope.moveLine(newValue.x2);
                        }

                        // if only target row coord has changed
                        else if (oldValue.to[0] === newValue.to[0] && oldValue.to[1] !== newValue.to[1]) {
                            scope.removeLine(newValue.x2, newValue.y2);
                        }

                        // if col & row change
                        else if (oldValue.to[1] !== newValue.to[1] && oldValue.to[0] !== newValue.to[0]) {

                            // row decrease
                            if (newValue.to[1] < oldValue.to[1]) {
                                scope.removeLine(newValue.x2, newValue.y2);
                            }

                            // row increase
                            else {
                                // ???
                            }
                        }
                    }
                }, true);

                ////////////////////////////////////////////////
                //
                // utils
                //
                ////////////////////////////////////////////////

                /**
                 * removeLine
                 *
                 * @param x
                 * @param y
                 */
                scope.removeLine = function(x, y) {

                    TweenLite.to(element, ANIM_DURATION, {
                        attr: {x2: x, y2: y},
                        ease: Power4.easeOut,
                        onComplete: onRemoveComplete
                    });
                };

                /**
                 * moveLine
                 *
                 * @param x
                 */
                scope.moveLine = function(x) {

                    TweenLite.to(element, ANIM_DURATION, {
                        attr: {x2: x},
                        ease: Power4.easeOut,
                        onComplete: onMoveComplete
                    });
                };

                /**
                 * moveLine
                 *
                 * @param x1
                 * @param y1
                 * @param x2
                 * @param y2
                 */
                scope.drawLine = function(x1, y1, x2, y2) {

                    TweenLite.set(element, {attr: {x1: x1, y1: y1, x2: x1, y2: y1}});
                    TweenLite.to(element, ANIM_DURATION, {
                        attr: {x2: x2, y2: y2},
                        ease: Power4.easeOut,
                        onComplete: onDrawComplete
                    });
                };

                ////////////////////////////////////////////////
                //
                // handlers
                //
                ////////////////////////////////////////////////

                //----------------------------------
                // remove complete
                //----------------------------------

                var onRemoveComplete = function() {

                    var line_index = _.parseInt(scope.line_index);

                    scope.onRemoveComplete({source_coords: source_coords, target_coords: target_coords, line_index: line_index});
                };

                //----------------------------------
                // move complete
                //----------------------------------

                var onMoveComplete = function() {

                    var line_index = _.parseInt(scope.line_index);

                    scope.onMoveComplete({source_coords: source_coords, target_coords: target_coords, line_index: line_index});
                };

                //----------------------------------
                // draw complete
                //----------------------------------

                var onDrawComplete = function() {

                    var line_index = _.parseInt(scope.line_index);

                    scope.onDrawComplete({source_coords: source_coords, target_coords: target_coords, line_index: line_index});
                };
            }
        };
    };

    angular.module('AngularSvgNodes').directive('angularSvgNodesLine', directive);

})();
