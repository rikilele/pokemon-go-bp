import chalk from 'chalk';
import inquirer from 'inquirer';

import {
  maxPL,
  calcBP,
  calcCP,
  getMinStats,
  buildCPMTable,
  fetchBaseStats,
  CP_MAX_GREAT,
  CP_MAX_ULTRA,
} from 'shared';

async function run() {
  const baseStats = await fetchBaseStats();

  console.log('\n+ Please enter Pokemon details\n');

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
      name: 'knownPL',
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
      when: answers => answers.knownPL,
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
      when: answers => !answers.knownPL,
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

  const ask = () => {
    inquirer.prompt(questions).then((answer) => {
      const {
        baseS, baseA, baseD,
      } = baseStats[answer.name];
      const cpmTable = buildCPMTable();
      const ivS = parseInt(answer.ivS, 10);
      const ivA = parseInt(answer.ivA, 10);
      const ivD = parseInt(answer.ivD, 10);
      let pl = parseFloat(answer.pl);
      if (!answer.knownPL) {
        pl = maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, answer.cp);
      }

      const cp = calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl]);

      console.log(
        `\n+ Name:    ${answer.name}`
        + `\n+ CP:      ${cp}`
        + `\n+ PL:      ${pl}`
        + `\n+ Stamina: ${ivS}`
        + `\n+ Attack:  ${ivA}`
        + `\n+ Defense: ${ivD}\n`,
      );

      const {
        minS, minA, minD, minPL,
      } = getMinStats(answer.name);
      if (
        ivS >= minS
        && ivA >= minA
        && ivD >= minD
        && pl >= minPL
      ) {
        let bp = 0;
        let optPL = 0;
        let optBP = 0;
        let optCP = 0;
        let msg1 = '';
        let msg2 = '';
        if (cp <= CP_MAX_GREAT) {
          bp = calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl], CP_MAX_GREAT);
          optPL = maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, CP_MAX_GREAT);
          optBP = calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[optPL], CP_MAX_GREAT);
          optCP = calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[optPL]);
          msg1 = `+ This Pokemon's Great League BP is ${chalk.cyan.bold.underline(bp)}`;
          msg2 = `+ At PL ${optPL} and CP ${optCP}, this Pokemon's BP is optimized to ${chalk.red.underline(optBP)}`;
          console.log(msg1);
          console.log(msg2);
        } else {
          console.log('- This Pokemon is not eligible for the Great League');
        }

        console.log('');

        if (cp <= CP_MAX_ULTRA) {
          bp = calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[pl], CP_MAX_ULTRA);
          optPL = maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, CP_MAX_ULTRA);
          optBP = calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[optPL], CP_MAX_ULTRA);
          optCP = calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpmTable[optPL]);
          msg1 = `+ This Pokemon's Ultra League BP is ${chalk.cyan.bold.underline(bp)}`;
          msg2 = `+ At PL ${optPL} and CP ${optCP}, this Pokemon's BP is optimized to ${chalk.red.underline(optBP)}`;
          console.log(msg1);
          console.log(msg2);
        } else {
          console.log('- This Pokemon is not eligible for the Ultra League');
        }
      } else {
        console.log('- This Pokemon has illegal IV or PL stats');
      }

      console.log('');

      inquirer.prompt({
        type: 'confirm',
        name: 'keepGoing',
        message: 'Do you want to continue with your analysis?',
        default: true,
      })
        .then((ans) => {
          console.log('');
          if (ans.keepGoing) {
            ask();
          }
        });
    });
  };

  ask();
}

run();
