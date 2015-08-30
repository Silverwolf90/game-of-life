'use strict';

import { find, get, curry } from 'lodash-fp';

const matchesRule = curry(
  ({ cellState, liveNeighbors }, { cellStateCondition, liveNeighborsCondition }) =>
    cellStateCondition(cellState) && liveNeighborsCondition(liveNeighbors));

const findRule =
  (cellData, rules) =>
    find(matchesRule(cellData), rules);

// Rule|Null -> CellState|Null
const maybeRuleResult =
  (rule) =>
    get('result', rule) || null;

// [Rule] -> CellData -> CellState
export const applyRulesToCellData = curry(
  (rules, cellData) =>
    maybeRuleResult(findRule(cellData, rules)) || cellData.cellState);

export const Rule =
  (cellStateCondition, liveNeighborsCondition, result) => ({
    cellStateCondition,
    liveNeighborsCondition,
    result
  });