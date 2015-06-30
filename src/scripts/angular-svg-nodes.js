(function() {

    'use strict';

    //----------------------------------
    // Angular SVG Nodes
    //----------------------------------
    //
    // issues:
    // firefox foreignobject (solution: use d3 to wrap text)
    // ie 9 small size (solution: ???)
    // blocks connected out of bounds on init (solution: draw lines after blocks, and validate targets)

    angular.module('AngularSvgNodes', []);
})();
