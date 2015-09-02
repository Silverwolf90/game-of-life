'use strict';

import { find, property, curry } from 'lodash-fp';

const matchesRule = curry(
  ({ cellState, liveNeighbors }, { cellStateCondition, liveNeighborsCondition }) =>
    cellStateCondition(cellState) && liveNeighborsCondition(liveNeighbors));

const findRule =
  (cellData, rules) =>
    find(matchesRule(cellData), rules);

const ruleResult = property('result');

// Rule|Undefined -> CellState -> CellState
const applyRule =
  (rule, cellState) =>
    rule ? ruleResult(rule) : cellState;

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