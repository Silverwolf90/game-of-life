'use strict';

import { map, range, curry } from 'lodash-fp';

export const or = curry(
  (func1, func2, ...args) =>
    func1(...args) || func2(...args));

export const indexes =
  (array) =>
    range(0, array.length);

export const mapIndexes = curry(
  (cb, array) =>
    map(cb, indexes(array)));

export const map2dIndexes = curry(
  (cb, array2d) =>
    mapIndexes((x) =>
      mapIndexes((y) =>
        cb(x, y), array2d[x]), array2d));