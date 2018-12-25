const calcCP = require('./calcCP');

const { PL_VALUES } = require('./../constants');

/**
 * Maximizes the PL of a Pokemon given it's IV and maximum CP.
 */
function maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, maxCP) {
  let maxPL = 40;
  PL_VALUES.every((pl) => {
    const cp = calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl]);
    if (cp <= maxCP) {
      maxPL = pl;
      return false;
    }

    return true;
  });

  return maxPL;
}

module.exports = maxPL;
