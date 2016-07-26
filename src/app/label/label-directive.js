export default {
    restrict: 'A',
    scope: {
        coords:         "=angularSvgNodesLabelCoords"
    },
    link: function (scope, element) {

        let curr_x = null;
        let ANIM_DURATION = 0.5;

        ////////////////////////////////////////////////
        //
        // handlers
        //
        ////////////////////////////////////////////////

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

                // TODO: not working
                TweenLite.to(element, duration, {
                    x: 200, y: 200, rotation: 10, skewX: 15,
                    ease: Power4.easeOut,
                    onComplete: onPositionComplete
                });
            }
        });
    }
};