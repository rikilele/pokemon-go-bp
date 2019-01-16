/**
 * An interactive command-line interface to analyze the BP of Pokemon input by user.
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import {
  maxPL,
  calcBP,
  calcCP,
  getMinStats,
  buildCPMTable,
  CP_MAX_GREAT,
  CP_MAX_ULTRA,
} from 'shared';

import fetchBaseStatsWithSpinner from './utils/fetchBaseStatsWithSpinner';

/**
 * Displays BP optimization results based on league param.
 */
function displayCurrAndOptBP(
  cp,
  pl,
  baseS,
  baseA,
  baseD,
  ivS,
  ivA,
  ivD,
  cpmTable,
  maxCP,
  leagueName,
) {
  if (cp <= maxCP) {
    const bp = calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl], maxCP);
    const optPL = maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, maxCP);
    const optBP = calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[optPL], maxCP);
    const optCP = calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[optPL]);
    const msg1 = `+ This Pokemon's ${leagueName} BP is ${chalk.cyan.bold.underline(bp)}`;
    const msg2 = `+ At PL ${optPL} and CP ${optCP}, this Pokemon's BP is optimized to ${chalk.red.underline(optBP)}`;
    console.log(msg1);
    console.log(msg2);
  } else {
    console.log(`- This Pokemon is not eligible for the ${leagueName}`);
  }
}

/**
 * Analyzes input pokemon stats for Great and Ultra League BP optimization,
 * and displays the results on the console.
 */
function displayBPAnalysis(pokemon, baseStats, cpmTable) {
  const {
    baseS,
    baseA,
    baseD,
  } = baseStats[pokemon.name];
  const ivS = parseInt(pokemon.ivS, 10);
  const ivA = parseInt(pokemon.ivA, 10);
  const ivD = parseInt(pokemon.ivD, 10);
  let pl = parseFloat(pokemon.pl);
  if (!pokemon.plKnown) {
    pl = maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, pokemon.cp);
  }

  const cp = calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl]);
  console.log(
    `\n+ Name:    ${pokemon.name}`
    + `\n+ CP:      ${cp}`
    + `\n+ PL:      ${pl}`
    + `\n+ Stamina: ${ivS}`
    + `\n+ Attack:  ${ivA}`
    + `\n+ Defense: ${ivD}\n`,
  );

  const {
    minS,
    minA,
    minD,
    minPL,
  } = getMinStats(pokemon.name);
  if (
    ivS >= minS
    && ivA >= minA
    && ivD >= minD
    && pl >= minPL
  ) {
    displayCurrAndOptBP(
      cp,
      pl,
      baseS,
      baseA,
      baseD,
      ivS,
      ivA,
      ivD,
      cpmTable,
      CP_MAX_GREAT,
      'Great League',
    );
    console.log();
    displayCurrAndOptBP(
      cp,
      pl,
      baseS,
      baseA,
      baseD,
      ivS,
      ivA,
      ivD,
      cpmTable,
      CP_MAX_ULTRA,
      'Ultra League',
    );
  } else {
    console.log('- This Pokemon has illegal IV or PL stats');
  }
  console.log();
}

/**
 * The command-line interface of the app.
 */
async function cli() {
  console.log();
  const cpmTable = buildCPMTable();
  const baseStats = await fetchBaseStatsWithSpinner();
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the Pokemon?',
      validate: (name) => {
        if (name in baseStats) return true;
        return 'Couldn\'t identify Pokemon. Make sure to type the complete name in Japanese';
      },
    },
    {
      type: 'confirm',
      name: 'plKnown',
      message: 'Do you know the PL of the Pokemon?',
      default: false,
    },
    {
      type: 'input',
      name: 'pl',
      message: 'What is its PL? (1 ~ 40)',
      validate: (val) => {
        const pl = parseFloat(val);
        if (
          !Number.isNaN(pl)
          && pl >= 1
          && pl <= 40
          && (pl - Math.trunc(pl) === 0 || pl - Math.trunc(pl) === 0.5)
        ) {
          return true;
        }

        return 'Please enter a valid number between 1 and 40, step by 0.5';
      },
      when: answers => answers.plKnown,
    },
    {
      type: 'input',
      name: 'cp',
      message: 'What is its CP?',
      validate: (val) => {
        const cp = parseInt(val, 10);
        if (!Number.isNaN(cp) && cp >= 10) return true;
        return 'Please enter a valid number';
      },
      when: answers => !answers.plKnown,
    },
    {
      type: 'input',
      name: 'ivS',
      message: 'What is its Stamina IV? (0 ~ 15)',
      validate: (val) => {
        const ivS = parseInt(val, 10);
        if (
          !Number.isNaN(ivS)
          && ivS >= 0
          && ivS <= 15
        ) {
          return true;
        }

        return 'Please enter a valid number between 0 and 15';
      },
    },
    {
      type: 'input',
      name: 'ivA',
      message: 'What is its Attack IV? (0 ~ 15)',
      validate: (val) => {
        const ivA = parseInt(val, 10);
        if (
          !Number.isNaN(ivA)
          && ivA >= 0
          && ivA <= 15
        ) {
          return true;
        }

        return 'Please enter a valid number between 0 and 15';
      },
    },
    {
      type: 'input',
      name: 'ivD',
      message: 'What is its Defense IV? (0 ~ 15)',
      validate: (val) => {
        const ivD = parseInt(val, 10);
        if (
          !Number.isNaN(ivD)
          && ivD >= 0
          && ivD <= 15
        ) {
          return true;
        }

        return 'Please enter a valid number between 0 and 15';
      },
    },
  ];

  let prompt = true;
  while (prompt) { /* eslint-disable no-await-in-loop */
    const pokemon = await inquirer.prompt(questions);
    displayBPAnalysis(pokemon, baseStats, cpmTable);
    const { keepGoing } = await inquirer.prompt({
      type: 'confirm',
      name: 'keepGoing',
      message: 'Do you want to continue with your analysis?',
      default: true,
    });
    console.log();
    prompt = keepGoing;
  }
}

// Start command-line interface
cli(process.argv)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
