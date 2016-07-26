import deepFreeze from 'deep-freeze';

// local: constants
import {
    NODE_TOP_LEFT,
    NODE_TOP,
    NODE_CENTER,
    NODE_BOTTOM
} from "./node-settings";

// SUT
import * as Utils from './node-utils';

describe("Node Utils", () => {

    //------------------------------------------------------------
    // getNodeCoords
    //------------------------------------------------------------

    describe("getNodeCoords", () => {

        describe("should return correct x,y coordinates for given node", () => {

            it("should return 0,0 for first node 0,0", () => {

                let _col_index = 0;
                let _row_index = 0;
                let _position = NODE_TOP_LEFT; // NODE_TOP_LEFT, NODE_TOP, NODE_CENTER, NODE_BOTTOM
                let _config = {
                    col_spacing: 0,
                    row_spacing: 0,
                    node_width: 10,
                    node_height: 10
                };

                let _result = Utils.getNodeCoords(_row_index, _col_index, _position, _config);

                expect(_result).toEqual([ 0, 0 ]);
            });

            it("should take node width & height into account and return 15,10 for first node 1,1", () => {

                let _col_index = 1;
                let _row_index = 1;
                let _position = NODE_TOP_LEFT; // NODE_TOP_LEFT, NODE_TOP, NODE_CENTER, NODE_BOTTOM
                let _config = {
                    col_spacing: 0,
                    row_spacing: 0,
                    node_width: 15,
                    node_height: 10
                };

                let _result = Utils.getNodeCoords(_row_index, _col_index, _position, _config);

                expect(_result).toEqual([ 15, 10 ]);
            });

            it("should take row & column spacing into account and return 17,13 for first node 1,1", () => {

                let _col_index = 1;
                let _row_index = 1;
                let _position = NODE_TOP_LEFT; // NODE_TOP_LEFT, NODE_TOP, NODE_CENTER, NODE_BOTTOM
                let _config = {
                    col_spacing: 2,
                    row_spacing: 3,
                    node_width: 15,
                    node_height: 10
                };

                let _result = Utils.getNodeCoords(_row_index, _col_index, _position, _config);

                expect(_result).toEqual([ 17, 13 ]);
            });
        });
    });
});