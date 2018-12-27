const calcCP = require('./calcCP');

const { PL_VALUES } = require('./../constants');

/**
 * Maximizes the PL of a Pokemon given it's IV and maximum CP.
 */
function maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, maxCP) {
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

module.exports = maxPL;
