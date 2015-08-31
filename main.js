'use strict';

import { reduce, lt, gt, eq, range, flow } from 'lodash-fp';
import { generateBoard, createBoard, printBoard, CellPosition } from './board';
import { ALIVE, DEAD, isAlive, isDead, SeedCellState } from './cellState';
import { Rule } from './rule';
import { or } from './util';

const numGenerations = 100;
const numColumns     = 30;
const numRows        = 30;

const rules = [
  Rule(isAlive, lt(2),            DEAD  ),
  Rule(isAlive, or(eq(2), eq(3)), ALIVE ),
  Rule(isAlive, gt(3),            DEAD  ),
  Rule(isDead,  eq(3),            ALIVE )
];

const seedCellStates = [
  // Glider pattern
  SeedCellState(CellPosition(2, 2), ALIVE),
  SeedCellState(CellPosition(3, 0), ALIVE),
  SeedCellState(CellPosition(3, 2), ALIVE),
  SeedCellState(CellPosition(4, 2), ALIVE),
  SeedCellState(CellPosition(4, 1), ALIVE)
];

const ALIVE_CHAR = 'X';
const DEAD_CHAR  = '-';
const prettyPrint = printBoard(ALIVE_CHAR, DEAD_CHAR);

const initializeBoard = createBoard(DEAD);

const runGame =
  (rules, numColumns, numRows, numGenerations, seedCellStates = []) =>
    reduce(
      flow(prettyPrint, generateBoard(rules)),
      initializeBoard(seedCellStates, numRows, numColumns),
      range(0, numGenerations));

prettyPrint(runGame(rules, numColumns, numRows, numGenerations, seedCellStates));