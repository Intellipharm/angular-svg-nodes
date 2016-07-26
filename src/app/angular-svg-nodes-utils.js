import _ from "lodash";

/**
 * returns an array of values for given key, for each item whose id is in given ids array
 *
 * @param data
 * @param ids
 * @param key
 * @returns {Array}
 */
export function getValuesForKeyByIds(data, ids, key) {

    return _.reduce(data, (result, item) => {
        if (_.has(item, 'id') && _.has(item, key) && _.includes(ids, item.id)) {
            result = [
                ...result,
                ...[ item[ key ] ]
            ];
        }
        return result;
    }, []);
}