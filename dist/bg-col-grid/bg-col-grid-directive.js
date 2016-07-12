"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    restrict: 'A',
    scope: {
        index: "@angularSvgNodesBgColGridIndex",
        onMouseOver: "&angularSvgNodesBgColGridOnMouseOver"
    },
    link: function link(scope, element) {

        element[0].addEventListener("mouseover", function () {

            var index = _.parseInt(scope.index);

            scope.onMouseOver({ index: index });
        });
    }
};
//# sourceMappingURL=../sourcemaps/bg-col-grid/bg-col-grid-directive.js.map
