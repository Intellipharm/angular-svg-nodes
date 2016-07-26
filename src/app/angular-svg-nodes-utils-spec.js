import deepFreeze from 'deep-freeze';

// local: constants
import {
    BLOCK_TOP_LEFT,
    BLOCK_TOP,
    BLOCK_CENTER,
    BLOCK_BOTTOM
} from "./angular-svg-nodes-settings";

// SUT
import * as Utils from './angular-svg-nodes-utils';

describe("AngualrSvgNodes Utils", () => {

    //------------------------------------------------------------
    // getNodeCoords
    //------------------------------------------------------------

    describe("getNodeCoords", () => {

        describe("should return correct x,y coordinates for given node", () => {

            it("should return 0,0 for first node 0,0", () => {

                let _col_index = 0;
                let _row_index = 0;
                let _position = BLOCK_TOP_LEFT; // BLOCK_TOP_LEFT, BLOCK_TOP, BLOCK_CENTER, BLOCK_BOTTOM
                let _config = {
                    col_spacing: 0,
                    row_spacing: 0,
                    block_width: 10,
                    block_height: 10
                };

                let _result = Utils.getNodeCoords(_row_index, _col_index, _position, _config);

                expect(_result).toEqual([ 0, 0 ]);
            });

            it("should take block width & height into account and return 15,10 for first node 1,1", () => {

                let _col_index = 1;
                let _row_index = 1;
                let _position = BLOCK_TOP_LEFT; // BLOCK_TOP_LEFT, BLOCK_TOP, BLOCK_CENTER, BLOCK_BOTTOM
                let _config = {
                    col_spacing: 0,
                    row_spacing: 0,
                    block_width: 15,
                    block_height: 10
                };

                let _result = Utils.getNodeCoords(_row_index, _col_index, _position, _config);

                expect(_result).toEqual([ 15, 10 ]);
            });

            it("should take row & column spacing into account and return 17,13 for first node 1,1", () => {

                let _col_index = 1;
                let _row_index = 1;
                let _position = BLOCK_TOP_LEFT; // BLOCK_TOP_LEFT, BLOCK_TOP, BLOCK_CENTER, BLOCK_BOTTOM
                let _config = {
                    col_spacing: 2,
                    row_spacing: 3,
                    block_width: 15,
                    block_height: 10
                };

                let _result = Utils.getNodeCoords(_row_index, _col_index, _position, _config);

                expect(_result).toEqual([ 17, 13 ]);
            });
        });

    });

    //------------------------------------------------------------
    // getValuesForKeyByIds
    //------------------------------------------------------------

    describe("getValuesForKeyByIds", () => {

        it("return an array of values for given key, for each item whose id is in given ids array", () => {

            let _ids = [ 11, 22 ];
            let _custom_data = [
                {
                    id: 11,
                    col_index: 111
                },
                {
                    id: 33,
                    col_index: 333
                },
                {
                    id: 22,
                    col_index: 222
                }
            ];

            deepFreeze(_ids);
            deepFreeze(_custom_data);

            let _result = Utils.getValuesForKeyByIds(_custom_data, _ids, 'col_index');

            let _expected_result = [ 111, 222 ];

            expect(_result).toEqual(_expected_result);
        });

    });
});