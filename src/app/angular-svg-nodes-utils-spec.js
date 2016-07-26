import deepFreeze from 'deep-freeze';

// SUT
import * as Utils from './angular-svg-nodes-utils';

describe("AngualrSvgNodes Utils", () => {

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