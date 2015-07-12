(function() {

    "use strict";

    //----------------------------------
    // angular-svg-nodes directive
    //----------------------------------

    var directive = function() {
        return {
            restrict: 'EA',
            scope: {
                rows: "=angularSvgNodes",
                onNodeMouseDown: "&angularSvgNodesNodeMouseDown",
                onNodeMouseUp: "&angularSvgNodesNodeMouseUp",
                onLineAdd: "&angularSvgNodesLineAdd",
                onLineRemove: "&angularSvgNodesLineRemove",
                api: "=angularSvgNodesApi"
            },
            replace: true,
            controller: "AngularSvgNodesController as ctrl",
            link: function (scope, element, attrs, controller) {

                controller.parent_coords = element[0].getBoundingClientRect();

                element.addClass('angular-svg-nodes');

                ////////////////////////////////////////////////
                //
                // handlers
                //
                ////////////////////////////////////////////////

                //----------------------------------
                // mouse up
                //----------------------------------

                element[0].addEventListener("mouseup", controller.onRootDeselect);

                //----------------------------------
                // mouse leave
                //----------------------------------

                element[0].addEventListener("mouseleave", controller.onRootMouseLeave);

            },
            templateUrl: 'views/angular-svg-nodes.html'
        };
    };

    angular.module('AngularSvgNodes').directive('angularSvgNodes', directive);

})();
