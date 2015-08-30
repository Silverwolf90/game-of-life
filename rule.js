'use strict';

import { find, get, curry } from 'lodash-fp';

const matchesRule = curry(
  ({ cellState, liveNeighbors }, { cellStateCondition, liveNeighborsCondition }) =>
    cellStateCondition(cellState) && liveNeighborsCondition(liveNeighbors));

const findRule =
  (cellData, rules) =>
    find(matchesRule(cellData), rules);

// Rule|Undefined -> CellState
const applyRule =
  (rule, cellState) =>
    rule ? get('result', rule) : cellState;

// [Rule] -> CellData -> CellState
export const applyRulesToCellData = curry(
  (rules, cellData) =>
    applyRule(findRule(cellData, rules), cellData.cellState));

export const Rule =
  (cellStateCondition, liveNeighborsCondition, result) => ({
    cellStateCondition,
    liveNeighborsCondition,
    result
  });