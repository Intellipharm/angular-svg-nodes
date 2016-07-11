"use strict";

var _angularSvgNodesUtils = require("./angular-svg-nodes-utils");

var Utils = _interopRequireWildcard(_angularSvgNodesUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe("AngualrSvgNodes Utils", function () {

    describe("getCoords", function () {

        it("should return correct coords", function () {
            var _r = Utils.getCoords(0, 0, 0);
            expect(_r).toEqual([0, 0]);
        });
    });
});
//# sourceMappingURL=sourcemaps/angular-svg-nodes-utils-spec.js.map
