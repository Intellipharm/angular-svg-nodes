(function() {

    "use strict";

    //----------------------------------
    // svg-vbox directive
    //----------------------------------

    var directive = function() {
        return {
            link: function(scope, element, attrs) {
                attrs.$observe('svgVbox', function(value) {
                    element[0].setAttribute("viewBox", value);
                });
            }
        };
    };

    angular.module('AngularSvgNodes').directive('svgVbox', directive);

})();
