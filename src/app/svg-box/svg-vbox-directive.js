export default {
    restrict: 'A',
    scope: {},
    link: function(scope, element, attrs) {

        attrs.$observe('svgVbox', function(value) {
            element[0].setAttribute("viewBox", value);
        });
    }
};