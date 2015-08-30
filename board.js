'use strict';

import { applyRulesToCellData } from './rule';
import { mapIndexes2d, defaultValue, log, join, printNewLine } from './util';
import { isAlive, DEAD } from './cellState';

import { size, map, flow, filter, find, each, constant,
  range, curry, get, property } from 'lodash-fp';

const Board =
  (columns) => ({
    columns
  });

export const CellPosition =
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

const getSeedCellState = curry(
  (defaultCellState, seedCellStates, cellPosition) => flow(
    find({ cellPosition }),
    property('cellState'),
    defaultValue(defaultCellState)
  )(seedCellStates));

const makeColumn = curry(
  (numRows, seedCellStates, defaultCellState, columnIndex) => flow(
    range(0),
    map(rowIndex => CellPosition(columnIndex, rowIndex)),
    map(getSeedCellState(defaultCellState, seedCellStates))
  )(numRows));

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
const getNeighborStates = curry(
  (board, cellPosition) => flow(
    makeOffsetCellPositions(neighborOffsets),
    map(getCellState(board))
  )(cellPosition));

// CellPosition -> Number
const countLiveNeighbors = curry(
  (board, cellPosition) => flow(
    getNeighborStates(board),
    filter(isAlive),
    size
  )(cellPosition));

// (CellPosition -> A) -> Board -> Board
const mapBoardCellPositions = curry(
  (onCellPosition, board) =>
    mapIndexes2d((column, row) =>
      onCellPosition(CellPosition(column, row)), board.columns));

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
    range(0),
    map(makeColumn(numRows, seedCellStates, defaultCellState)),
    Board
  )(numColumns);

// The main generation function of the game.
// [Rule] -> Board -> Board
export const generateBoard = curry(
  (rules, board) => flow(
    mapBoardCellPositions(processCellPosition(rules, board)),
    Board
  )(board));

const printColumn = curry(
  (aliveChar, deadChar, column) => flow(
    map((state) =>
      isAlive(state) ? aliveChar : deadChar),
    join(' '),
    log
  )(column));

export const printBoard = curry(
  (aliveChar, deadChar, board) => flow(
    each(printColumn(aliveChar, deadChar)),
    printNewLine,
    constant(board)
  )(board.columns));