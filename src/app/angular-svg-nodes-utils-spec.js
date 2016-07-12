import * as Utils from './angular-svg-nodes-utils';

describe("AngualrSvgNodes Utils", () => {

    describe("getCoords", () => {
    
        it("should return correct coords", () => {
            let _r = Utils.getCoords(0, 0, 0);
            expect(_r).toEqual([ 0, 0 ]);
        });

    });
});