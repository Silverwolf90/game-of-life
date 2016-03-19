import { eq } from 'lodash/fp';

export const ALIVE = true;
export const DEAD  = false;

export const isAlive = eq(ALIVE);
export const isDead  = eq(DEAD); 
