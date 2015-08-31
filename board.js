'use strict';

import { applyRulesToCellData } from './rule';
import { mapIndexes2d, defaultValue, log, join, pairWith,
  printNewLine, makeArray, spreadMap } from './util';
import { isAlive, DEAD } from './cellState';

import _, { size, map, flow, filter, find, each, constant,
  range, curry, get, property, zip } from 'lodash-fp';

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

// CellState -> [SeedCellState] -> CellPosition -> CellState
const getSeedCellState = curry(
  (defaultCellState, seedCellStates, cellPosition) => flow(
    find(_, seedCellStates),
    property('cellState'),
    defaultValue(defaultCellState)
  )({ cellPosition }));

// (Int, Int) -> [(Int, Int)]
const columnCoords =
  (columnIndex, numRows) =>
    zip(makeArray(numRows, columnIndex), range(0, numRows));

// CellState -> [SeedCellState] -> (Int, Int) -> [CellState]
const makeColumn = curry(
  (defaultCellState, seedCellStates, [columnIndex, numRows]) => flow(
    columnCoords,
    spreadMap(CellPosition),
    map(getSeedCellState(defaultCellState, seedCellStates))
  )(columnIndex, numRows));

// CellPosition -> Offset -> CellPosition
const offsetCellPosition = curry(
  ({ column, row }, [x, y]) =>
    CellPosition(column + x, row + y));

// [Offset] -> CellPosition -> [CellPosition]
const makeOffsetCellPositions = curry(
  (offsets, cellPosition) =>
    map(offsetCellPosition(cellPosition), offsets));

// Board -> CellPosition -> CellState
const getCellState = curry(
  (board, { column, row }) =>
    get([column, row], board.columns) || DEAD);

// Board -> CellPosition -> [CellState]
const getNeighborStates = curry(
  (board, cellPosition) => flow(
    makeOffsetCellPositions(neighborOffsets),
    map(getCellState(board))
  )(cellPosition));

// Board -> CellPosition -> Number
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

// Board -> CellPosition -> CellData
const cellPositionToCellData = curry(
  (board, cellPosition) =>
    CellData(
      getCellState(board, cellPosition),
      countLiveNeighbors(board, cellPosition)
    ));

// [Rule] -> Board -> CellPosition -> CellState
const processCellPosition = curry(
  (rules, board, cellPosition) => flow(
    cellPositionToCellData(board),
    applyRulesToCellData(rules)
  )(cellPosition));

// CellState -> [SeedCellState] -> Int -> (Int -> Board
export const initBoard = curry(
  (defaultCellState, seedCellStates, numColumns, numRows) => flow(
    (numColumns, numRows) =>
      map(pairWith(numRows), range(0, numColumns)),
    map(makeColumn(defaultCellState, seedCellStates)),
    Board
  )(numColumns, numRows));

// [Rule] -> Board -> Board
export const generateBoard = curry(
  (rules, board) => flow(
    mapBoardCellPositions(processCellPosition(rules, board)),
    Board
  )(board));

// String -> String -> CellState -> String
const getCellStateChar = curry(
  (aliveChar, deadChar, state) =>
    isAlive(state) ? aliveChar : deadChar);

// String -> String -> [CellState] -> String
const printCellStates = curry(
  (aliveChar, deadChar, column) => flow(
    map(getCellStateChar(aliveChar, deadChar)),
    join(' '),
    log
  )(column));

// String -> String -> Board -> Board
export const printBoard = curry(
  (aliveChar, deadChar, board) => flow(
    property('columns'),
    each(printCellStates(aliveChar, deadChar)),
    printNewLine,
    constant(board)
  )(board));