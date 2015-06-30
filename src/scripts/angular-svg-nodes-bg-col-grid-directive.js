(function() {

    'use strict';

    //------------------------------------------
    // angular-svg-nodes-bg-col-grid directive
    //------------------------------------------

    var directive = function() {
        return {
            restrict: 'EA',
            scope: {
                index: "@angularSvgNodesBgColGridIndex",
                onMouseOver: "&angularSvgNodesBgColGridOnMouseOver"
            },
            link: function (scope, element) {

                ////////////////////////////////////////////////
                //
                // handlers
                //
                ////////////////////////////////////////////////

                //----------------------------------
                // mouse over
                //----------------------------------

                element[0].addEventListener("mouseover", function() {

                    var index = _.parseInt(scope.index);

                    // call external handler
                    scope.onMouseOver({index: index});
                });
            }
        };
    };

    angular.module('AngularSvgNodes').directive('angularSvgNodesBgColGrid', directive);

})();
