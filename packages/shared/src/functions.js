import rp from 'request-promise';
import $ from 'cheerio';
import spinner from 'cli-spinner';

import {
  PL_VALUES,
  RAID_POKEMON,
  DISCOVERY_POKEMON,
  EGG_POKEMON,
  RAID_MIN_STATS,
  DISCOVERY_MIN_STATS,
  EGG_MIN_STATS,
} from './constants';

/**
 * Builds a JavaScript object mapping PL to CPM.
 * See {@link https://pokemongo.gamepress.gg/cp-multiplier} for formula details.
 */
export function buildCPMTable() {
  const table = {};

  // Using reduce because next CPM is dependent on prev CPM.
  [...PL_VALUES].reverse().reduce((cpm, pl) => {
    table[pl] = cpm;
    let step = 0.009426125469;
    if (pl >= 30) step = 0.004459460790;
    else if (pl >= 20) step = 0.008924905903;
    else if (pl >= 10) step = 0.008919025675;
    return Math.sqrt((cpm ** 2) + step);
  }, 0.094);

  return table;
}

/**
 * Calculates the BP of a Pokemon given it's IV, CPM, and the max CP.
 */
export function calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpm, maxCP) {
  const s = baseS + ivS;
  const a = baseA + ivA;
  const d = baseD + ivD;
  return Math.floor(s * (a ** 1.3) * d * (cpm ** 3) / (Math.sqrt(maxCP) * 180));
}

/**
 * Calculates the CP of a Pokemon, given it's IV and CPM.
 */
export function calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpm) {
  const s = baseS + ivS;
  const a = baseA + ivA;
  const d = baseD + ivD;
  let cp = Math.floor(a * Math.sqrt(s) * Math.sqrt(d) * (cpm ** 2) / 10);
  if (cp < 10) {
    cp = 10;
  }

  return cp;
}

/**
 * Asynchronously scrapes and returns the base stats for all Pokemon in the game.
 * Each Pokemon is represented as {name, baseS, baseA, baseD}, and placed in an array.
 * See {@link https://pokemongo.gamewith.jp/article/show/35945} for full table.
 */
export async function fetchBaseStats() {
  const wheel = new spinner.Spinner('%s  Fetching Pokemon stats');
  wheel.start();
  wheel.setSpinnerString(20);

  const baseStats = [];
  const html = await rp('https://pokemongo.gamewith.jp/article/show/35945');
  const table = $('tr', '.all_basestats_table', html);

  table.each((i, row) => {
    if (Object.keys(row.attribs).length !== 0) {
      baseStats.push({
        name: row.attribs['data-col1'],
        baseS: parseInt(row.attribs['data-col2'], 10),
        baseA: parseInt(row.attribs['data-col3'], 10),
        baseD: parseInt(row.attribs['data-col4'], 10),
      });
    }
  });

  wheel.stop(true);
  return baseStats;
}

/**
 * Returns the minimum IV and PL that a Pokemon can have given its name.
 */
export function getMinStats(name) {
  if (RAID_POKEMON.includes(name)) {
    return RAID_MIN_STATS;
  }
  if (DISCOVERY_POKEMON.includes(name)) {
    return DISCOVERY_MIN_STATS;
  }
  if (EGG_POKEMON.includes(name)) {
    return EGG_MIN_STATS;
  }
  return {
    minS: 0,
    minA: 0,
    minD: 0,
    minPL: 1,
  };
}

/**
 * Maximizes the PL of a Pokemon given it's IV and maximum CP.
 */
export function maxPL(cpmTable, baseS, baseA, baseD, ivS, ivA, ivD, maxCP) {
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
