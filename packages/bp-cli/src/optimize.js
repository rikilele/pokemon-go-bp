import fs from 'fs';
import progress from 'cli-progress';
import { Spinner } from 'cli-spinner';

import {
  maxPL,
  calcBP,
  calcCP,
  getMinStats,
  buildCPMTable,
  fetchBaseStats,
  IV_VALUES,
  CP_MAX_GREAT,
  CP_MAX_ULTRA,
} from 'shared';

/**
 * Maximizes the BP of a Pokemon, by altering it's IV and PL.
 * This algorithm will prioritize Attack > Defense > Stamina.
 * This is because Attack can be multiplied during battle time,
 * Defense is what diverts Attack, and Stamina is always constant.
 */
function maxBP(cpmTable, baseS, baseA, baseD, maxCP, minS, minA, minD, minPL) {
  let bestBP = Number.MIN_SAFE_INTEGER;
  const bestStats = {};
  IV_VALUES.forEach((ivA) => {
    if (ivA >= minA) {
      IV_VALUES.forEach((ivD) => {
        if (ivD >= minD) {
          IV_VALUES.forEach((ivS) => {
            if (ivS >= minS) {
              const pl = maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, maxCP);
              if (pl >= minPL) {
                const bp = calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl], maxCP);
                if (bp > bestBP) {
                  bestBP = bp;
                  bestStats.pl = pl;
                  bestStats.ivS = ivS;
                  bestStats.ivA = ivA;
                  bestStats.ivD = ivD;
                  bestStats.bp = bp;
                }
              }
            }
          });
        }
      });
    }
  });
  return bestStats;
}

/**
 * For each Pokemon (in baseStats), optimize BP given maxCP and avgStats for reference.
 * A progress bar is set up for visualization on the commandline.
 */
function optimizeAllPokemonBP(baseStats, cpmTable, maxCP) {
  const names = Object.keys(baseStats);
  const progressBar = new progress.Bar({ clearOnComplete: true }, progress.Presets.shades_grey);
  progressBar.start(names.length, 0);
  const results = [];
  names.forEach((name) => {
    const {
      baseS, baseA, baseD,
    } = baseStats[name];
    const {
      minS, minA, minD, minPL,
    } = getMinStats(name);
    if (calcCP(baseS, baseA, baseD, minS, minA, minD, cpmTable[minPL]) <= maxCP) {
      const {
        pl, ivS, ivA, ivD, bp,
      } = maxBP(cpmTable, baseS, baseA, baseD, maxCP, minS, minA, minD, minPL);
      const cp = calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl]);
      results.push([name, pl, ivS, ivA, ivD, cp, bp]);
    }
    progressBar.increment();
  });
  progressBar.stop();
  return results;
}

/**
 * Given results of {@link optimizeAllPokemonBP}, write out results as CSV file.
 */
function writeResultsToCSV(results, fileName) {
  try {
    const pathToOut = `${__dirname}/../out`;
    if (!fs.existsSync(pathToOut)) {
      fs.mkdirSync(pathToOut);
    }

    const pathToFile = `${pathToOut}/${fileName}`;
    fs.writeFileSync(pathToFile, 'Name,PL,IV_S,IV_A,IV_D,CP,BP\n');
    results.forEach((result) => {
      fs.appendFileSync(pathToFile, `${result}\n`);
    });
    console.log(`+ Output results to file out/${fileName}`);
  } catch (err) {
    console.log('- Error in writeResultsToCSV()');
    console.log('- See below for error\n');
    console.error(err);
  }
}

/**
 * Optimizes the BP of all Pokemon, and outputs the result in a CSV file.
 */
async function runBPAnalysis() {
  const cpmTable = buildCPMTable();
  const wheel = new Spinner('%s  Fetching Pokemon stats');
  wheel.start();
  wheel.setSpinnerString(20);
  const baseStats = await fetchBaseStats();
  wheel.stop(true);
  console.log('+ Optimizing for Great League');
  const resultsGreat = optimizeAllPokemonBP(baseStats, cpmTable, CP_MAX_GREAT);
  console.log('+ Optimizing for Ultra League');
  const resultsUltra = optimizeAllPokemonBP(baseStats, cpmTable, CP_MAX_ULTRA);
  const sortByBP = (a, b) => {
    if (a[6] < b[6]) return 1;
    if (a[6] > b[6]) return -1;
    return 0;
  };

  resultsGreat.sort(sortByBP);
  resultsUltra.sort(sortByBP);

  writeResultsToCSV(resultsGreat, 'great.csv');
  writeResultsToCSV(resultsUltra, 'ultra.csv');
}

console.log('\n+ Starting BP optimization for all Pokemon');
runBPAnalysis().then(() => console.log('+ BP optimization complete\n'));
