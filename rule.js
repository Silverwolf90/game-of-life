'use strict';

import { find, get, curry } from 'lodash-fp';

const matchesRule = curry(
  (cellState, liveNeighbors, { cellStateCondition, liveNeighborsCondition }) =>
    cellStateCondition(cellState) && liveNeighborsCondition(liveNeighbors));

const findRule =
  (cellState, liveNeighbors, rules) =>
    find(matchesRule(cellState, liveNeighbors), rules);

// Rule|Null -> CellState|Null
const maybeRuleResult =
  (rule) =>
    get('result', rule) || null;

// [Rule] -> CellData -> CellState
export const applyRulesToCellData = curry(
  (rules, { cellState, liveNeighbors }) =>
    maybeRuleResult(findRule(cellState, liveNeighbors, rules)) || cellState);

export const Rule =
  (cellStateCondition, liveNeighborsCondition, result) => ({
    cellStateCondition,
    liveNeighborsCondition,
    result
  });