import _controller from "./angular-svg-nodes-controller";
import _template from "./angular-svg-nodes.html!text";

export default {
    bindings: {
        rows:               "=angularSvgNodes",
        onNodeMouseDown:    "&angularSvgNodesNodeMouseDown",
        onNodeMouseUp:      "&angularSvgNodesNodeMouseUp",
        onLineAdd:          "&angularSvgNodesLineAdd",
        onLineRemove:       "&angularSvgNodesLineRemove",
        api:                "=?angularSvgNodesApi"
    },
    controller:     _controller,
    controllerAs:   "AngularSvgNodes",
    template:       _template,
    link: function(scope, element, attrs, controller) {

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

    }
};