'use strict';

/**
 * Experimenting with a fairly different JavaScript style than what
 * I would commonly use. This code has not even been run. It's merely a
 * stylistic experiment.
 *
 * Note that I'm using lodash-fp has auto-curried callback-first functions.
 *
 * flow() is left-to-right function composition
 */

import { reduce, lt, gt, eq, range } from 'lodash-fp';
import { generateBoard, createBoard, CellPosition } from './board';
import { ALIVE, DEAD, isAlive, isDead, SeedCellState } from './cellState';
import { Rule } from './rule';
import { or } from './util';

const initializeBoard = createBoard;

const numGenerations = 50;
const numColumns = 10;
const numRows = 10;
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

runGame(rules, numColumns, numRows, numGenerations, seedCellStates);