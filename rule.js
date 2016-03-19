import { flow, find, curry, getOr } from 'lodash/fp';

const matchesRule = curry(
  (cellState, liveNeighbors, rule) =>
    rule.cellStateCondition(cellState) &&
    rule.liveNeighborsCondition(liveNeighbors));

// [Rule] -> CellState -> Int -> CellState
export const applyRules = curry(
  (rules, cellState, liveNeighbors) => flow(
    find(matchesRule(cellState, liveNeighbors)),
    getOr(cellState, 'result')
  )(rules));

export const Rule =
  (cellStateCondition, liveNeighborsCondition, result) => ({
    cellStateCondition,
    liveNeighborsCondition,
    result,
  });
