const chalk = require('chalk');
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

  const ask = () => {
    inquirer.prompt(questions).then((answer) => {
      const baseStat = baseStats.find(stats => stats['name'] === answer['name']);
      const cpmTable = buildCPMTable();
      const { baseS, baseA, baseD } = baseStat;
      const ivS = parseInt(answer['ivS'], 10);
      const ivA = parseInt(answer['ivA'], 10);
      const ivD = parseInt(answer['ivD'], 10);
      let pl = parseFloat(answer['pl']);
      if (!answer['knownPL']) {
        pl = maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, answer['cp']);
      }
      const cp = calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl]);

      console.log(
        `\n+ Name:    ${answer['name']}`
        + `\n+ CP:      ${cp}`
        + `\n+ PL:      ${pl}`
        + `\n+ Stamina: ${ivS}`
        + `\n+ Attack:  ${ivA}`
        + `\n+ Defense: ${ivD}\n`
      );

      let bp = 0;
      let optPL = 0;
      let optBP = 0;
      let optCP = 0;
      let msg1 = '';
      let msg2 = '';
      if (cp <= CP_MAX_GREAT) {
        bp = calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl], AVG_STATS_GREAT);
        optPL = maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, CP_MAX_GREAT);
        optBP = calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[optPL], AVG_STATS_GREAT);
        optCP = calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[optPL]);
        msg1 = `+ This Pokemon's current Great League BP is ${chalk.cyan.bold.underline(bp)}`;
        msg2 = `+ This Pokemon's BP is optimized to ${chalk.red.bold.underline(optBP)} at PL ${optPL} and CP ${optCP}`;
        console.log(msg1);
        console.log(msg2);
      } else {
        console.log('+ This Pokemon is not eligible for the Great League');
      }

      console.log('');

      if (cp <= CP_MAX_ULTRA) {
        bp = calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl], AVG_STATS_ULTRA);
        optPL = maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, CP_MAX_ULTRA);
        optBP = calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[optPL], AVG_STATS_ULTRA);
        optCP = calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[optPL]);
        msg1 = `+ This Pokemon's current Ultra League BP is ${chalk.cyan.bold.underline(bp)}`;
        msg2 = `+ This Pokemon's BP is optimized to ${chalk.red.bold.underline(optBP)} at PL ${optPL} and CP ${optCP}`;
        console.log(msg1);
        console.log(msg2);
      } else {
        console.log('+ This Pokemon is not eligible for the Ultra League');
      }

      console.log('');

      inquirer.prompt({
        type: 'confirm',
        name: 'keepGoing',
        message: 'Do you want to continue analyzing?',
        default: false
      })
        .then((ans) => {
          if (ans['keepGoing']) {
            ask();
          }
        });
    });
  };

  ask();
}

run();
