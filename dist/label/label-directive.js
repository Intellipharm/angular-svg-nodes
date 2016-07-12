'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    restrict: 'A',
    scope: {
        coords: "=angularSvgNodesLabelCoords"
    },
    link: function link(scope, element) {

        var curr_x = null;
        var ANIM_DURATION = 0.5;

        var onPositionComplete = function onPositionComplete() {};

        scope.$watch('coords', function (newValue) {

            if (!_.isUndefined(newValue)) {

                var duration = _.isNull(curr_x) ? 0 : ANIM_DURATION;

                TweenLite.to(element, duration, {
                    x: 200, y: 200, rotation: 10, skewX: 15,
                    ease: Power4.easeOut,
                    onComplete: onPositionComplete
                });
            }
        });
    }
};
//# sourceMappingURL=../sourcemaps/label/label-directive.js.map
