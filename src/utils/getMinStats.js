const {
  RAID_MIN_STATS,
  DISCOVERY_MIN_STATS,
  EGG_MIN_STATS,
  RAID_POKEMON,
  DISCOVERY_POKEMON,
  EGG_POKEMON,
} = require('./../constants');

/**
 * Returns the minimum stats (IV and PL) that the pokemon can have.
 */
function getMinStats(name) {
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

module.exports = getMinStats;
