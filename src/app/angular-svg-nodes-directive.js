import _controller from "./angular-svg-nodes-controller";
import _template from "./angular-svg-nodes.html!text";

export default {
    restrict: 'E',
    scope: {
        rows:               "=?",
        onNodeMouseDown:    "&nodeMouseDown",
        onNodeMouseUp:      "&nodeMouseUp",
        onLineAdd:          "&lineAdd",
        onLineRemove:       "&lineRemove",
        api:                "=?"
    },
    controller:     _controller,
    controllerAs:   "AngularSvgNodes",
    bindToController: true,
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

        element[0].addEventListener("mouseup", controller.onRootDeselect.bind(controller));

        //----------------------------------
        // mouse leave
        //----------------------------------

        element[0].addEventListener("mouseleave", controller.onRootMouseLeave.bind(controller));

    }
};