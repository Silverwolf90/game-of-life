'use strict';

import { applyRulesToCellData } from './rule';
import { or, map2dIndexes } from './util';
import { isAlive, DEAD } from './cellState';

import { size, map, flow, filter, times, constant,
  range, curry, get, where } from 'lodash-fp';

const Board =
  (columns) => ({
    columns
  });

const CellPosition =
  (column, row) => ({
    column,
    row
  });

const CellData =
  (cellState, liveNeighbors) => ({
    cellState,
    liveNeighbors
  });

const neighborOffsets = [
  [-1, -1], [ 0, -1], [+1, -1],
  [-1,  0],           [+1,  0],
  [-1, +1], [ 0, +1], [+1, +1]
];

const getSeedCellState =
  (defaultCellState, seedCellStates, cellPosition) => flow(
    where({ cellPosition }),
    or(get('cellState'), constant(defaultCellState))
  )(seedCellStates);

const makeColumn =
  (numRows, seedCellStates, defaultCellState, columnIndex) => flow(
    map(rowIndex => CellPosition(columnIndex, rowIndex)),
    map(getSeedCellState(defaultCellState, seedCellStates))
  )(range(0, numRows));

const offsetCellPosition = curry(
  ({ column, row }, [x, y]) =>
    CellPosition(column + x, row + y));

const makeOffsetCellPositions = curry(
  (offsets, cellPosition) =>
    map(offsetCellPosition(cellPosition), offsets));

// CellPosition -> CellState
const getCellState = curry(
  (board, { column, row }) =>
    get([column, row], board.columns) || DEAD);

// CellPosition -> [CellState]
const getNeighborStates =
  (board, cellPosition) => flow(
    makeOffsetCellPositions(neighborOffsets),
    map(getCellState(board))
  )(cellPosition);

// CellPosition -> Number
const countLiveNeighbors =
  (board, cellPosition) => flow(
    getNeighborStates(board),
    filter(isAlive),
    size
  )(cellPosition);

// (CellPosition -> A) -> Board -> Board
const mapCellPositions = curry(
  (onCellPosition, board) =>
    map2dIndexes((column, row) =>
      onCellPosition(CellPosition(column, row)), board));

const cellPositionToCellData = curry(
  (board, cellPosition) =>
    CellData(
      getCellState(board, cellPosition),
      countLiveNeighbors(board, cellPosition)
    ));

const processCellPosition = curry(
  (rules, board, cellPosition) => flow(
    cellPositionToCellData(board),
    applyRulesToCellData(rules)
  )(cellPosition));

// Use to initialize a new Board
export const createBoard =
  (numColumns, numRows, seedCellStates, defaultCellState) => flow(
    times(makeColumn(numRows, seedCellStates, defaultCellState)),
    Board
  )(numColumns);

// The main generation function of the game.
// [Rule] -> Board -> Board
export const generateBoard = curry(
  (rules, board) =>
    mapCellPositions(processCellPosition(rules, board), board));