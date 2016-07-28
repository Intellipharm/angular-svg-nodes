export default {
    restrict: 'A',
    scope: {
        coords:                     "=angularSvgNodesLineCoords",
        col_index:                  "@angularSvgNodesLineColIndex",
        row_index:                  "@angularSvgNodesLineRowIndex",
        line_index:                 "@angularSvgNodesLineLineIndex",
        onRemoveComplete:           "&angularSvgNodesLineOnRemoveComplete",
        onMoveLineTargetComplete:   "&angularSvgNodesLineonMoveLineTargetComplete",
        onDrawComplete:             "&angularSvgNodesLineOnDrawComplete"
    },
    link: function (scope, element) {

        let ANIM_DURATION = 0.5;

        // control

        let is_initialized = false;
        let source_coords;
        let target_coords;
        let previous_target_coords; // TODO: this feels hacky

        ////////////////////////////////////////////////
        //
        // handlers
        //
        ////////////////////////////////////////////////

        //----------------------------------
        // remove complete
        //----------------------------------

        let onRemoveComplete = function() {

            let line_index = _.parseInt(scope.line_index);

            scope.onRemoveComplete({source_coords: source_coords, target_coords: previous_target_coords, line_index: line_index});
        };

        //----------------------------------
        // move line target complete
        //----------------------------------

        let onMoveLineTargetComplete = function() {

            let line_index = _.parseInt(scope.line_index);

            scope.onMoveLineTargetComplete({source_coords: source_coords, target_coords: target_coords, line_index: line_index});
        };

        //----------------------------------
        // move line source complete
        //----------------------------------

        let onMoveLineSourceComplete = function() {

            // let line_index = _.parseInt(scope.line_index);
            //
            // scope.onMoveLineTargetComplete({source_coords: source_coords, target_coords: target_coords, line_index: line_index});
        };

        //----------------------------------
        // draw complete
        //----------------------------------

        let onDrawComplete = function() {

            let line_index = _.parseInt(scope.line_index);

            scope.onDrawComplete({source_coords: source_coords, target_coords: target_coords, line_index: line_index});
        };

        ////////////////////////////////////////////////
        //
        // utils
        //
        ////////////////////////////////////////////////

        /**
         * removeLineTarget
         *
         * @param x
         * @param y
         */
        scope.removeLineTarget = function(x, y) {

            // console.log(scope.$id+" ::: removeLineTarget "+scope.coords.from[1]+" "+scope.coords.from[0]);

            TweenLite.to(element, ANIM_DURATION, {
                attr: {x2: x, y2: y},
                ease: Power4.easeOut,
                onComplete: onRemoveComplete
            });
        };

        /**
         * moveLineTarget
         *
         * @param x
         */
        scope.moveLineTarget = function(x) {

            // console.log(scope.$id+" ::: moveLineTarget "+scope.coords.from[1]+" "+scope.coords.from[0]);

            TweenLite.to(element, ANIM_DURATION, {
                attr: {x2: x},
                ease: Power4.easeOut,
                onComplete: onMoveLineTargetComplete
            });
        };

        /**
         * moveLineSource
         *
         * @param x
         */
        scope.moveLineSource = function(x) {

            // console.log(scope.$id+" ::: moveLineSource "+scope.coords.from[1]+" "+scope.coords.from[0]);

            TweenLite.to(element, ANIM_DURATION, {
                attr: {x1: x},
                ease: Power4.easeOut,
                onComplete: onMoveLineSourceComplete
            });
        };

        /**
         * drawLine
         *
         * @param x1
         * @param y1
         * @param x2
         * @param y2
         * @param should_animate
         */
        scope.drawLine = function(x1, y1, x2, y2, should_animate = false) {

            // console.log(scope.$id+" ::: drawLine "+scope.coords.from[1]+" "+scope.coords.from[0]+" "+should_animate);

            // draw with animation

            // if (should_animate) {
                TweenLite.set(element, {attr: {x1: x1, y1: y1, x2: x1, y2: y1}});
                TweenLite.to(element, ANIM_DURATION, {
                    attr: {x2: x2, y2: y2},
                    ease: Power4.easeOut,
                    onComplete: onDrawComplete
                });
            //     return;
            // }
            //
            // // draw without animation
            //
            // TweenLite.set(element, {attr: {x1: x1, y1: y1, x2: x2, y2: y2}});
            // window.setTimeout(onDrawComplete.bind(this), 1); // hack because external handler does $s.$apply TODO: remove when we can remove handler $s.$apply
        };

        ////////////////////////////////////////////////
        //
        // watchers
        //
        ////////////////////////////////////////////////

        // scope.$watch('coords.active', function(newValue, oldValue) {
        //
        //     console.log(_.cloneDeep(newValue));
        //     console.log(_.cloneDeep(oldValue));
        //     console.log("----------------------------");
        // }, true);

        scope.$watch('coords', function(newValue, oldValue) {

            if (!_.isUndefined(newValue)) {

                source_coords = newValue.from;
                target_coords = newValue.to;
                previous_target_coords = newValue.previous_to;

                // init
                if (!is_initialized) {
                    scope.drawLine(newValue.x1, newValue.y1, newValue.x2, newValue.y2, newValue.should_animate);
                    // newValue.should_animate = false;
                    is_initialized = true;
                }

                // if only target col coord has changed
                else if (oldValue.to[1] === newValue.to[1] && oldValue.to[0] !== newValue.to[0]) {
                    scope.moveLineTarget(newValue.x2);
                }

                // if only target row coord has changed
                else if (oldValue.to[0] === newValue.to[0] && oldValue.to[1] !== newValue.to[1]) {
                    scope.removeLineTarget(newValue.x2, newValue.y2);
                }

                // if col & row change
                else if (oldValue.to[1] !== newValue.to[1] && oldValue.to[0] !== newValue.to[0]) {

                    // row decrease
                    if (newValue.to[1] < oldValue.to[1]) {
                        scope.removeLineTarget(newValue.x2, newValue.y2);
                    }

                    // row increase
                    else {
                        // ???
                        console.log("row increase");
                    }
                }
                // if source col change
                else if (oldValue.from[0] !== newValue.from[0]) {
                    scope.moveLineSource(newValue.x1);
                }
            }
        }, true);

    }
};