/**
 * Asynchronously scrapes and returns the base stats for all Pokemon in the game.
 * Each Pokemon is represented as { name, baseS, baseA, baseD, }, and placed in an object.
 * See {@link https://pokemongo.gamewith.jp/article/show/35945} for full table.
 */

import rp from 'request-promise';
import $ from 'cheerio';

export default async function fetchBaseStats() {
  const baseStats = {};
  const html = await rp('https://pokemongo.gamewith.jp/article/show/35945');
  const table = $('tr', '.all_basestats_table', html);
  table.each((i, row) => {
    if (Object.keys(row.attribs).length !== 0) {
      const name = row.attribs['data-col1'];
      baseStats[name] = {
        baseS: parseInt(row.attribs['data-col2'], 10),
        baseA: parseInt(row.attribs['data-col3'], 10),
        baseD: parseInt(row.attribs['data-col4'], 10),
      };
    }
  });

  return baseStats;
}
