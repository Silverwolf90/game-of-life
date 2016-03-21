import {
  size, map, flow, filter, forEach, constant, getOr,
  range, curry, spread, find, over, join,
} from 'lodash/fp';
import { mapIndexes2d, log, printNewLine, createFilledArray } from './util';
import { applyRules } from './rule';
import { isAlive, getCellStateChar, ALIVE, DEAD } from './cellState';

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

const neighborVectors = [
  [-1, -1], [0, -1], [+1, -1],
  [-1,  0],          [+1,  0],
  [-1, +1], [0, +1], [+1, +1],
];

const cellStatePath =
  ({ column, row }) =>
    ['columns', column, 'cellStates', row];

// Board -> CellPosition -> CellState
const getCellState = curry(
  (board, cellPosition) =>
    getOr(DEAD, cellStatePath(cellPosition), board));

const addVectorToCellPosition = curry(
  (cellPosition, [x, y]) =>
    CellPosition(cellPosition.column + x, cellPosition.row + y));

// Board -> CellPosition -> [CellState]
const getNeighborStates = curry(
  (board, cellPosition) => flow(
    map(addVectorToCellPosition(cellPosition)),
    map(getCellState(board))
  )(neighborVectors));

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

const mapBoardIndexes = curry(
  (cb, board) => flow(
    boardToArray2d,
    mapIndexes2d(cb),
    map(Column),
    Board
  )(board));

// [CellPosition] -> (Int, Int) -> Board
const emptyBoard = curry(
  ({ columns, rows }) => flow(
    range(0),
    map(() => Column(createFilledArray(rows, DEAD))),
    Board
  )(columns));

// [CellPosition] -> (Int, Int) -> Board
export const initBoard = curry(
  (seed, dimensions) => flow(
    emptyBoard,
    mapBoardIndexes(flow(
      CellPosition,
      cellPosition => find(cellPosition, seed) ? ALIVE : DEAD
    ))
  )(dimensions));

// [Rule] -> Board -> Board
export const generateBoard = curry(
  (rules, board) =>
    mapBoardIndexes(flow(
      CellPosition,
      over([getCellState(board), countLiveNeighbors(board)]),
      spread(applyRules(rules))
    ), board));

// String -> String -> Board -> Board
export const printBoard = curry(
  (aliveChar, deadChar, board) => flow(
    mapBoardIndexes(flow(
      CellPosition,
      getCellState(board),
      getCellStateChar(aliveChar, deadChar)
    )),
    boardToArray2d,
    forEach(flow(join(' '), log)),
    printNewLine,
    constant(board) // Hacky way to force return values using flow
  )(board));
