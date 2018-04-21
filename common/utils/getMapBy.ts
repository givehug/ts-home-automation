import {keyBy, map, compose} from 'lodash/fp';

/**
 * Get map by given key from list of objects.
 * Modify each object with map function.
 * @param byKey key string indentifier
 * @param mapFn map function
 * @param list list of objects
 */
const getMapBy = (byKey: string, mapFn: Function, list: object[]): object => compose([
  keyBy(byKey),
  map(mapFn),
])(list);

export default getMapBy;
