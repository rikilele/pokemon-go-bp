const fs = require('fs');
const progress = require('cli-progress');

const { maxBP, calcCP, buildCPMTable, fetchBaseStats } = require('./utils');
const { CP_MAX_GREAT, CP_MAX_ULTRA, AVG_STATS_GREAT, AVG_STATS_ULTRA } = require('./constants');

/**
 * For each Pokemon (in baseStats), optimize BP given maxCP and avgStats for reference.
 * A progress bar is set up for visualization on the commandline.
 */
function optimizeAllPokemonBP(baseStats, maxCP, cpmTable, avgStats) {
  const progressBar = new progress.Bar({ clearOnComplete: true }, progress.Presets.shades_grey);
  progressBar.start(baseStats.length, 0);
  const results = baseStats.map((pokemon) => {
    const { name, baseS, baseA, baseD } = pokemon;
    const { pl, ivS, ivA, ivD, bp } = maxBP(cpmTable, baseS, baseA, baseD, maxCP, avgStats);
    const cp = calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl]);
    progressBar.increment();
    return [name, pl, ivS, ivA, ivD, cp, bp];
  });
  progressBar.stop();
  return results;
}

/**
 * Given results of {@link optimizeAllPokemonBP}, write out results as CSV file.
 */
function writeResultsToCSV(results, fileName) {
  try {
    const pathToFile = __dirname + '/../' + fileName;
    fs.writeFileSync(pathToFile, 'Name,PL,IV_S,IV_A,IV_D,CP,BP\n');
    results.forEach((result) => {
      fs.appendFileSync(pathToFile, result + '\n');
    });
    console.log(`+ Output results to file ${fileName}`);
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
  const baseStats = await fetchBaseStats();
  console.log('+ Optimizing for Great League');
  const resultsGreat = optimizeAllPokemonBP(baseStats, CP_MAX_GREAT, cpmTable, AVG_STATS_GREAT);
  console.log('+ Optimizing for Ultra League');
  const resultsUltra = optimizeAllPokemonBP(baseStats, CP_MAX_ULTRA, cpmTable, AVG_STATS_ULTRA);
  const sortByBP = (a, b) => {
    if (a[6] < b[6])      return 1;
    else if (a[6] > b[6]) return -1;
    else                  return 0;
  };

  resultsGreat.sort(sortByBP);
  resultsUltra.sort(sortByBP);
  writeResultsToCSV(resultsGreat, 'out/great.csv');
  writeResultsToCSV(resultsUltra, 'out/ultra.csv');
}

console.log('+ Starting BP optimization for all Pokemon');
runBPAnalysis().then(() => console.log('+ BP optimization complete'));
