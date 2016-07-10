"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angularSvgNodesController = require("./angular-svg-nodes-controller");

var _angularSvgNodesController2 = _interopRequireDefault(_angularSvgNodesController);

var _angularSvgNodes = require("./angular-svg-nodes.html!text");

var _angularSvgNodes2 = _interopRequireDefault(_angularSvgNodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    bindings: {
        rows: "=angularSvgNodes",
        onNodeMouseDown: "&angularSvgNodesNodeMouseDown",
        onNodeMouseUp: "&angularSvgNodesNodeMouseUp",
        onLineAdd: "&angularSvgNodesLineAdd",
        onLineRemove: "&angularSvgNodesLineRemove",
        api: "=?angularSvgNodesApi"
    },
    controller: _angularSvgNodesController2.default,
    controllerAs: "AngularSvgNodes",
    template: _angularSvgNodes2.default,
    link: function link(scope, element, attrs, controller) {

        controller.parent_coords = element[0].getBoundingClientRect();

        element.addClass('angular-svg-nodes');

        element[0].addEventListener("mouseup", controller.onRootDeselect);

        element[0].addEventListener("mouseleave", controller.onRootMouseLeave);
    }
};
//# sourceMappingURL=sourcemaps/angular-svg-nodes-component.js.map
