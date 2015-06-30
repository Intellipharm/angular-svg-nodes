(function() {

    "use strict";

    //----------------------------------
    // AngularSvgNodes Settings
    //----------------------------------

    angular.module('App')
        .constant('BLOCK_TOP_LEFT',    0)
        .constant('BLOCK_TOP',         1)
        .constant('BLOCK_CENTER',      2)
        .constant('BLOCK_BOTTOM',      3)
        .constant('ACTION_ADD',        0)
        .constant('ACTION_REMOVE',     1)
        .constant('ACTION_UPDATE',     2)
        .constant('INITIAL_GRID_COLS', 4)
        .constant('INITIAL_GRID_ROWS', 2)
        .constant('BLOCK_WIDTH',       80)
        .constant('BLOCK_HEIGHT',      80)
        .constant('COL_SPACING',       20)
        .constant('ROW_SPACING',       40)
        .constant('LABEL_SPACING',     5)
        .constant('MAX_VIEWPORT_WIDTH_INCREASE',   100)
        .constant('MAX_VIEWPORT_HEIGHT_INCREASE',  100);
})();
