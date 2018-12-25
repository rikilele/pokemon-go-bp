const maxPL = require('./maxPL');
const calcBP = require('./calcBP');

const { IV_VALUES } = require('./../constants');


/**
 * Maximizes the BP of a Pokemon, by altering it's IV and PL.
 * This algorithm will prioritize Attack > Defense > Stamina.
 * This is because Attack can be multiplied during battle time,
 * Defense is what diverts Attack, and Stamina is always constant.
 */
function maxBP(cpmTable, baseS, baseA, baseD, maxCP, avgStats) {
  let bestBP = Number.MIN_SAFE_INTEGER;
  let bestStats = {};
  IV_VALUES.forEach((ivA) => {
    IV_VALUES.forEach((ivD) => {
      IV_VALUES.forEach((ivS) => {
        const pl = maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, maxCP);
        const bp = calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl], avgStats);
        if (bp > bestBP) {
          bestBP = bp;
          bestStats['pl'] = pl;
          bestStats['ivS'] = ivS;
          bestStats['ivA'] = ivA;
          bestStats['ivD'] = ivD;
          bestStats['bp'] = bp;
        }
      })
    });
  });
  return bestStats;
}

module.exports = maxBP;
