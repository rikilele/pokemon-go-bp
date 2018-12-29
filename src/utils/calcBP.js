/**
 * Calculates the BP (Battle Power) of a Pokemon given it's IV, CPM, and the max CP.
 */
function calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpm, maxCP) {
  const s = baseS + ivS;
  const a = baseA + ivA;
  const d = baseD + ivD;
  return Math.floor(s * (a ** 1.4) * d * (cpm ** 3) / (Math.sqrt(maxCP) * 300));
}

module.exports = calcBP;
