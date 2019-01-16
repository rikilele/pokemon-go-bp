/**
 * Maximizes the PL of a Pokemon given it's IV and maximum CP.
 */

import calcCP from './calcCP';
import { PL_VALUES } from '../constants';

export default function maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, maxCP) {
  let max = 1;
  PL_VALUES.every((pl) => {
    const cp = calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl]);
    if (cp <= maxCP) {
      max = pl;
      return false;
    }

    return true;
  });

  return max;
}
