import { map, range, curry, partial, fill } from 'lodash/fp';

export const log =
  (arg) =>
    console.log(arg) || arg;

export const debug =
  (arg) => {
    debugger;
    return arg;
  };

export const trace = curry(
  (msg, val) =>
    console.log(msg, val) || val);

export const indexes =
  (array) =>
    range(0, array.length);

export const mapIndexes = curry(
  (cb, array) =>
    map(cb, indexes(array)));

export const mapWithIndexes2d = curry(
  (cb, array2d) =>
    mapIndexes((x) =>
      mapIndexes((y) => cb(array2d[x][y], x, y), array2d[x]), array2d));

export const printNewLine =
  partial(log, ['\n']);

export const createFilledArray =
  (length, initValue) =>
    fill(0, length, initValue, new Array(length));
