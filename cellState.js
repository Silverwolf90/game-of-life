import { eq, curry } from 'lodash/fp';

export const ALIVE = true;
export const DEAD  = false;

export const isAlive = eq(ALIVE);
export const isDead  = eq(DEAD);

// String -> String -> CellState -> String
export const getCellStateChar = curry(
  (aliveChar, deadChar, cellState) =>
    isAlive(cellState) ? aliveChar : deadChar);
