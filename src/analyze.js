const inquirer = require('inquirer');

const { maxPL, calcBP, calcCP, buildCPMTable, fetchBaseStats } = require('./utils');
const { CP_MAX_GREAT, CP_MAX_ULTRA, AVG_STATS_GREAT, AVG_STATS_ULTRA } = require('./constants');

async function run() {

  const baseStats = await fetchBaseStats();

  console.log('+ Please enter Pokemon details\n');

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: "What is the name of the Pokemon?",
      validate: (name) => {
        if (baseStats.find(stats => stats['name'] === name)) return true;
        return 'Couldn\'t identify Pokemon. Make sure to type the complete name in Japanese';
      }
    },
    {
      type: 'confirm',
      name: 'knownPL',
      message: 'Do you know the PL of the Pokemon?',
      default: false
    },
    {
      type: 'input',
      name: 'pl',
      message: 'What is its PL? (1 ~ 40)',
      validate: (val) => {
        const pl = parseFloat(val);
        if (
          !isNaN(pl)
          && 1 <= pl
          && pl <= 40
          && (pl - Math.trunc(pl) === 0 || pl - Math.trunc(pl) === 0.5)
        ) {
          return true;
        }

        return 'Please enter a valid number between 1 and 40, step by 0.5';
      },
      when: (answers) => answers['knownPL']
    },
    {
      type: 'input',
      name: 'cp',
      message: 'What is its CP?',
      validate: (val) => {
        const cp = parseInt(val, 10);
        if (!isNaN(cp) && 10 <= cp) return true;
        return 'Please enter a valid number';
      },
      when: (answers) => !answers['knownPL']
    },
    {
      type: 'input',
      name: 'ivS',
      message: 'What is its Stamina IV? (0 ~ 15)',
      validate: (val) => {
        const ivS = parseInt(val, 10);
        if (
          !isNaN(ivS)
          && 0 <= ivS
          && ivS <= 15
        ) {
          return true;
        }
        
        return 'Please enter a valid number between 0 and 15';
      }
    },
    {
      type: 'input',
      name: 'ivA',
      message: 'What is its Attack IV? (0 ~ 15)',
      validate: (val) => {
        const ivA = parseInt(val, 10);
        if (
          !isNaN(ivA)
          && 0 <= ivA
          && ivA <= 15
        ) {
          return true;
        }

        return 'Please enter a valid number between 0 and 15';
      }
    },
    {
      type: 'input',
      name: 'ivD',
      message: 'What is its Defense IV? (0 ~ 15)',
      validate: (val) => {
        const ivD = parseInt(val, 10);
        if (
          !isNaN(ivD)
          && 0 <= ivD
          && ivD <= 15
        ) {
          return true;
        }

        return 'Please enter a valid number between 0 and 15';
      }
    }
  ];

  inquirer.prompt(questions).then((answer) => {
    const bs = baseStats.find(stats => stats['name'] === answer['name']);
    const ct = buildCPMTable();
    const ivS = parseInt(answer['ivS'], 10);
    const ivA = parseInt(answer['ivA'], 10);
    const ivD = parseInt(answer['ivD'], 10);
    let pl = parseFloat(answer['pl']);
    if (!answer['knownPL']) {
      pl = maxPL(ct, bs['baseS'], bs['baseA'], bs['baseD'], ivS, ivA, ivD, answer['cp']);
    }
    const cp = calcCP(bs['baseS'], bs['baseA'], bs['baseD'], ivS, ivA, ivD, ct[pl]);

    console.log(
        `\n+ Name:    ${answer['name']}`
      + `\n+ CP:      ${cp}`
      + `\n+ PL:      ${pl}`
      + `\n+ Stamina: ${ivS}`
      + `\n+ Attack:  ${ivA}`
      + `\n+ Defense: ${ivD}\n`
    );

    let bp = 0;
    if (cp <= CP_MAX_GREAT) {
      bp = calcBP(bs['baseS'], bs['baseA'], bs['baseD'], ivS, ivA, ivD, ct[pl], AVG_STATS_GREAT);
      console.log(`+ This Pokemon's Great League BP is ${bp}`);
    } else {
      console.log('+ This Pokemon is not eligible for the Great League');
    }

    if (cp <= CP_MAX_ULTRA) {
      bp = calcBP(bs['baseS'], bs['baseA'], bs['baseD'], ivS, ivA, ivD, ct[pl], AVG_STATS_ULTRA);
      console.log(`+ This Pokemon's Ultra League BP is ${bp}`);
    } else {
      console.log('+ This Pokemon is not eligible for the Ultra League');
    }

    console.log('\n+ Try `npm run optimize` to see optimum stats for all Pokemon')
  });
}

run();
