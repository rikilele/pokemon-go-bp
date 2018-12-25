const rp = require('request-promise');
const $ = require('cheerio');
const spinner = require('cli-spinner');

/**
 * Asynchronously scrapes and returns the base stats for all Pokemon in the game.
 * Each Pokemon is represented as {name, baseS, baseA, baseD}, and placed in an array.
 * See {@link https://pokemongo.gamewith.jp/article/show/35945} for full table.
 */
async function fetchBaseStats() {
  const wheel = new spinner.Spinner('%s  Fetching Pokemon stats');
  wheel.start();
  wheel.setSpinnerString(20);

  const baseStats = [];
  const html = await rp('https://pokemongo.gamewith.jp/article/show/35945');
  const table = $('tr', '.all_basestats_table', html);

  table.each((i, row) => {
    if (Object.keys(row.attribs).length !== 0) {
      baseStats.push({
        name:  row.attribs['data-col1'],
        baseS: parseInt(row.attribs['data-col2'], 10),
        baseA: parseInt(row.attribs['data-col3'], 10),
        baseD: parseInt(row.attribs['data-col4'], 10)
      });
    }
  });

  wheel.stop(true);
  return baseStats;
}

module.exports = fetchBaseStats;
