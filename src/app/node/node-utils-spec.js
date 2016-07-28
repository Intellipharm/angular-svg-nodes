import deepFreeze from 'deep-freeze';

// local: constants
import {
        NODE_TOP_LEFT,
        NODE_TOP,
        NODE_CENTER,
        NODE_BOTTOM
} from "./node-settings";

// local: models
import AngularSvgNode from './node-model';
import AngularSvgNodeLine from '../line/line-model';

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

    //------------------------------------------------------------
    // isNodeIndexMatch (node, row_index, col_index)
    //------------------------------------------------------------

    describe("isNodeIndexMatch", () => {

        it("should return true because node matches provided indices", () => {

            let _node = {
                row_index: 123,
                col_index: 123
            };
            let _row_index = 123;
            let _col_index = 123;

            deepFreeze(_node);

            let _result = Utils.isNodeIndexMatch(_node, _row_index, _col_index);

            expect(_result).toEqual(true);
        });

        it("should return false because node's column index does not match provided indices", () => {

            let _node = {
                row_index: 123,
                col_index: 456
            };
            let _row_index = 123;
            let _col_index = 123;

            deepFreeze(_node);

            let _result = Utils.isNodeIndexMatch(_node, _row_index, _col_index);

            expect(_result).toEqual(false);
        });

        it("should return false because node's row index does not match provided indices", () => {

            let _node = {
                row_index: 456,
                col_index: 123
            };
            let _row_index = 123;
            let _col_index = 123;

            deepFreeze(_node);

            let _result = Utils.isNodeIndexMatch(_node, _row_index, _col_index);

            expect(_result).toEqual(false);
        });
    });

    //------------------------------------------------------------
    // updateNodeLineProperty
    //-----------------------------------------------------------

    describe("updateNodeLineProperty", () => {

        it("should update given property and return node line data", () => {

            let _line = new AngularSvgNodeLine({
                aaa: "AAA",
                bbb: 123
            });

            deepFreeze(_line);

            let _result = Utils.updateNodeLineProperty(_line, 'aaa', "BBB");
            let _expected_result = new AngularSvgNodeLine({
                aaa: "BBB",
                bbb: 123
            });

            expect(_result).toEqual(_expected_result);
        });
    });

    //------------------------------------------------------------
    // updateNodeProperty
    //-----------------------------------------------------------

    describe("updateNodeProperty", () => {

        it("should update given property and return node data", () => {

            let _node = new AngularSvgNode({
                aaa: "AAA",
                bbb: 123
            });

            deepFreeze(_node);

            let _result = Utils.updateNodeProperty(_node, 'aaa', "BBB");
            let _expected_result = new AngularSvgNode({
                aaa: "BBB",
                bbb: 123
            });

            expect(_result).toEqual(_expected_result);
        });
    });

    //------------------------------------------------------------
    // updateNodesActivateNode
    //------------------------------------------------------------

    describe("updateNodesActivateNode", () => {

        it("should set targeted node's 'active' property to true and return updated node array", () => {

            let _line1 = new AngularSvgNodeLine({ to: [ 2, 1 ], active: true });
            let _line2 = new AngularSvgNodeLine({ to: [ 0, 1 ], active: true });
            let _line3 = new AngularSvgNodeLine({ to: [ 1, 1 ], active: false });
            let _node1 = new AngularSvgNode({ row_index: 0, col_index: 0, active: false, lines: [ _line1 ] });
            let _node2 = new AngularSvgNode({ row_index: 0, col_index: 1, active: false, lines: [ _line2, _line3 ] });
            let _node3 = new AngularSvgNode({ row_index: 1, col_index: 0, active: false });
            let _node4 = new AngularSvgNode({ row_index: 1, col_index: 1, active: false });
            let _node5 = new AngularSvgNode({ row_index: 1, col_index: 2, active: false });

            let _nodes = [
                { columns: [ _node1, _node2 ] },
                { columns: [ _node3, _node4, _node5 ] }
            ];

            let _row_index = 0;
            let _col_index = 1;

            deepFreeze(_nodes);

            let _result = Utils.updateNodesActivateNode(_nodes, _row_index, _col_index);

            // should leave non targeted node's unchanged

            expect(_result[ _node1.row_index ].columns[ _node1.col_index ]).toEqual(jasmine.objectContaining(_node1));

            // should set 'active' property to true for targeted node

            expect(_result[ _row_index ].columns[ _col_index ]).toEqual(jasmine.objectContaining({
                row_index: _row_index,
                col_index: _col_index,
                active: true
            }));

            // should set 'active' property to true for all targeted node's lines

            expect(_result[ _row_index ].columns[ _col_index ].lines).toEqual(jasmine.arrayContaining([
                jasmine.objectContaining({
                    to: [ 0, 1 ],
                    active: true
                }),
                jasmine.objectContaining({
                    to: [ 1, 1 ],
                    active: true
                })
            ]));

            // should set 'active' property to true for all node's that targeted node's lines connect to

            expect(_result[ _line2.to[1] ].columns[ _line2.to[0] ]).toEqual(jasmine.objectContaining({
                row_index: _line2.to[1],
                col_index: _line2.to[0],
                active: true
            }));

            expect(_result[ _line3.to[1] ].columns[ _line3.to[0] ]).toEqual(jasmine.objectContaining({
                row_index: _line3.to[1],
                col_index: _line3.to[0],
                active: true
            }));
        });
    });
});