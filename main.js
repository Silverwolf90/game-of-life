'use strict';

import { reduce, lt, gt, eq, range } from 'lodash-fp';
import { generateBoard, createBoard, CellPosition } from './board';
import { ALIVE, DEAD, isAlive, isDead, SeedCellState } from './cellState';
import { Rule } from './rule';
import { or, log } from './util';

const initializeBoard = createBoard;

const numGenerations = 5;
const numColumns = 5;
const numRows = 5;
const rules = [
  Rule(isAlive, lt(2),            DEAD  ),
  Rule(isAlive, or(eq(2), eq(3)), ALIVE ),
  Rule(isAlive, gt(3),            DEAD  ),
  Rule(isDead,  eq(3),            ALIVE )
];

const seedCellStates = [
  SeedCellState(CellPosition(3, 3), ALIVE),
  SeedCellState(CellPosition(3, 4), ALIVE),
  SeedCellState(CellPosition(2, 3), ALIVE),
  SeedCellState(CellPosition(2, 4), ALIVE)
];

const runGame =
  (rules, numColumns, numRows, numGenerations, seedCellStates = []) =>
    reduce(
      generateBoard(rules),
      initializeBoard(numColumns, numRows, seedCellStates, DEAD),
      range(0, numGenerations));

log(runGame(rules, numColumns, numRows, numGenerations, seedCellStates));