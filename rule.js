import { flow, find, curry, getOr } from 'lodash/fp';

const matchesRule = curry(
  (cellState, liveNeighbors, rule) =>
    rule.inputCellState === cellState &&
    rule.liveNeighborsCondition(liveNeighbors));

export const applyRules = curry(
  (rules, cellState, liveNeighbors) => flow(
    find(matchesRule(cellState, liveNeighbors)),
    getOr(cellState, 'outputCellState')
  )(rules));

export const Rule =
  (inputCellState, liveNeighborsCondition, outputCellState) => ({
    inputCellState,
    liveNeighborsCondition,
    outputCellState,
  });
