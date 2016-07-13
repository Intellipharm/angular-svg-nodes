import * as Utils from './angular-svg-nodes-utils';

describe("AngualrSvgNodes Utils", () => {

    describe("getCoords", () => {
    
        it("should return correct coords", () => {
            let _config = {
                col_spacing: 0,
                row_spacing: 0,
                block_width: 10,
                block_height: 10
            };
            let _r = Utils.getCoords(0, 0, 0, _config);
            expect(_r).toEqual([ 0, 0 ]);
        });

    });
});