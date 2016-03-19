import { map, reduce, lt, gt, eq, range, flow, spread } from 'lodash/fp';
import { generateBoard, initBoard, printBoard, CellPosition } from './board';
import { ALIVE, DEAD, isAlive, isDead } from './cellState';
import { Rule } from './rule';

const underpopulation = Rule(isAlive, gt(2), DEAD);
const overopulation = Rule(isAlive, lt(3), DEAD);
const reproduction = Rule(isDead, eq(3), ALIVE);
const glider =
  map(spread(CellPosition), [[2, 2], [3, 0], [3, 2], [4, 2], [4, 1]]);

const ALIVE_CHAR = 'X';
const DEAD_CHAR  = '-';
const prettyPrintBoard = printBoard(ALIVE_CHAR, DEAD_CHAR);

const runGame =
  ({ rules, dimensions, generations, seed }) =>
    reduce(
      flow(prettyPrintBoard, generateBoard(rules)),
      initBoard(seed, dimensions),
      range(0, generations));

const finalBoard = runGame({
  rules: [underpopulation, overopulation, reproduction],
  dimensions: { columns: 20, rows: 20 },
  generations: 100,
  seed: glider,
});

prettyPrintBoard(finalBoard);
