/**
 * Calculates the BP (Battle Power) of a Pokemon given it's IV, CPM, and the average stat.
 */
function calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpm, avgStats) {
  const s = Math.floor((baseS + ivS) * cpm);
  const a = Math.floor((baseA + ivA) * cpm);
  const d = Math.floor((baseD + ivD) * cpm);
  return (s * d / avgStats[1]) - (avgStats[0] * avgStats[2] / a);
}

module.exports = calcBP;
