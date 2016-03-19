import {
  size, map, flow, filter, forEach, constant, isEqual, getOr,
  range, curry, property, zip, spread, find, over, join,
} from 'lodash/fp';
import { mapIndexes2d, log, pairWith, printNewLine, makeArray } from './util';
import { applyRules } from './rule';
import { isAlive, ALIVE, DEAD } from './cellState';

const Column =
  (cellStates) => ({
    cellStates,
  });

const Board =
  (columns) => ({
    columns,
  });

export const CellPosition =
  (column, row) => ({
    column,
    row,
  });

const neighborOffsets = [
  [-1, -1], [0, -1], [+1, -1],
  [-1,  0],          [+1,  0],
  [-1, +1], [0, +1], [+1, +1],
];

// [CellPosition] -> Int -> Int -> [CellState]
const columnCellStates = curry(
  (seed, columnIndex, numRows) => flow(
    range(0),
    zip(makeArray(numRows, columnIndex)),
    map(spread(CellPosition)),
    map(cellPosition => find(isEqual(cellPosition), seed) ? ALIVE : DEAD)
  )(numRows));

// [CellPosition] -> (Int, Int) -> Column
const makeColumn = curry(
  (seed, [columnIndex, numRows]) => flow(
    columnCellStates(seed),
    Column
  )(columnIndex, numRows));

// CellPosition -> Offset -> CellPosition
const offsetCellPosition = curry(
  ({ column, row }, [x, y]) =>
    CellPosition(column + x, row + y));

// [Offset] -> CellPosition -> [CellPosition]
const cellPositionsFromOffsets = curry(
  (offsets, cellPosition) =>
    map(offsetCellPosition(cellPosition), offsets));

// Board -> CellPosition -> CellState
const getCellState = curry(
  (board, { column, row }) =>
    getOr(DEAD, [column, 'cellStates', row], board.columns));

// Board -> CellPosition -> [CellState]
const getNeighborStates = curry(
  (board, cellPosition) => flow(
    cellPositionsFromOffsets(neighborOffsets),
    map(getCellState(board))
  )(cellPosition));

// Board -> CellPosition -> Number
const countLiveNeighbors = curry(
  (board, cellPosition) => flow(
    getNeighborStates(board),
    filter(isAlive),
    size
  )(cellPosition));

const boardToArray2d =
  (board) =>
    map('cellStates', board.columns);

// [CellPosition] -> (Int, Int) -> Board
export const initBoard = curry(
  (seed, dimensions) => flow(
    ({ columns, rows }) => map(pairWith(rows), range(0, columns)),
    map(makeColumn(seed)),
    Board
  )(dimensions));

// [Rule] -> Board -> Board
export const generateBoard = curry(
  (rules, board) => flow(
    boardToArray2d,
    mapIndexes2d(flow(
      CellPosition,
      over([getCellState(board), countLiveNeighbors(board)]),
      spread(applyRules(rules))
    )),
    map(Column),
    Board
  )(board));

// String -> String -> CellState -> String
const getCellStateChar = curry(
  (aliveChar, deadChar, cellState) =>
    isAlive(cellState) ? aliveChar : deadChar);

// String -> String -> Column -> String
const printColumn = curry(
  (aliveChar, deadChar, column) => flow(
    property('cellStates'),
    map(getCellStateChar(aliveChar, deadChar)),
    join(' '),
    log
  )(column));

// String -> String -> Board -> Board
export const printBoard = curry(
  (aliveChar, deadChar, board) => flow(
    property('columns'),
    forEach(printColumn(aliveChar, deadChar)),
    printNewLine,
    constant(board) // Hacky way to force a return value
  )(board));
