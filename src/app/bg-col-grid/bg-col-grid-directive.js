export default {
    restrict: 'A',
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

            let index = _.parseInt(scope.index);

            // call external handler
            scope.onMouseOver({index: index});
        });
    }
};