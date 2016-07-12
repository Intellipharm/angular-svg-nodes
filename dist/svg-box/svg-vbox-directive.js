'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    restrict: 'A',
    scope: {},
    link: function link(scope, element, attrs) {

        attrs.$observe('svgVbox', function (value) {
            element[0].setAttribute("viewBox", value);
        });
    }
};
//# sourceMappingURL=../sourcemaps/svg-box/svg-vbox-directive.js.map
