import {
  size, map, flow, filter, constant, range, curry, find, join, getOr, forEach,
} from 'lodash/fp';
import { mapWithIndexes2d, log, printNewLine, createFilledArray } from './util';
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

const neighborVectors = [
  [-1, -1], [0, -1], [+1, -1],
  [-1,  0],          [+1,  0],
  [-1, +1], [0, +1], [+1, +1],
];

const cellStatePath =
  ({ column, row }) =>
    ['columns', column, 'cellStates', row];

const getCellState = curry(
  (board, cellPosition) =>
    getOr(DEAD, cellStatePath(cellPosition), board));

const addVectorToCellPosition = curry(
  (cellPosition, [x, y]) =>
    CellPosition(cellPosition.column + x, cellPosition.row + y));

const getNeighborStates = curry(
  (board, cellPosition) => flow(
    map(addVectorToCellPosition(cellPosition)),
    map(getCellState(board))
  )(neighborVectors));

const countLiveNeighbors = curry(
  (board, cellPosition) => flow(
    getNeighborStates(board),
    filter(isAlive),
    size
  )(cellPosition));

const boardToArray2d =
  (board) =>
    map('cellStates', board.columns);

const mapBoard = curry(
  (callback, board) => flow(
    boardToArray2d,
    mapWithIndexes2d((cellState, x, y) => {
      const cellPosition = CellPosition(x, y);
      const liveNeighbors = countLiveNeighbors(board, cellPosition);
      return callback({ cellState, cellPosition, liveNeighbors });
    }),
    map(Column),
    Board
  )(board));

const createEmptyBoard = curry(
  ({ columns, rows }) => flow(
    range(0),
    map(() => Column(createFilledArray(rows, DEAD))),
    Board
  )(columns));

export const initBoard = curry(
  (seed, dimensions) => flow(
    createEmptyBoard,
    mapBoard(({ cellPosition }) =>
      find(cellPosition, seed) ? ALIVE : DEAD)
  )(dimensions));

export const generateBoard = curry(
  (rules, board) =>
    mapBoard(({ cellState, liveNeighbors }) =>
      applyRules(rules, cellState, liveNeighbors),
      board));

export const printBoard = curry(
  (aliveChar, deadChar, board) => flow(
    mapBoard(({ cellState }) =>
      cellState === ALIVE ? aliveChar : deadChar),
    boardToArray2d,
    forEach(flow(join(' '), log)),
    printNewLine,
    constant(board) // Hacky way to force return values using flow
  )(board));
