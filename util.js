'use strict';

import { map, range, curry, isUndefined, constant } from 'lodash-fp';

export const log =
  (arg) =>
    console.log(arg) || arg;

export const trace = curry(
  (msg, val) =>
    console.log(msg, val) || val);

export const or = curry(
  (func1, func2, arg) =>
    func1(arg) || func2(arg));

export const indexes =
  (array) =>
    range(0, array.length);

export const mapIndexes = curry(
  (cb, array) =>
    map(cb, indexes(array)));

export const mapIndexes2d = curry(
  (cb, array2d) =>
    mapIndexes((x) =>
      mapIndexes((y) =>
        cb(x, y), array2d[x]), array2d));

export const ifThen = curry(
  (predicate, then, val) =>
    predicate(val) ? then(val) : val);

export const defaultValue = curry(
  (defaultVal, val) =>
    ifThen(isUndefined, constant(defaultVal), val));