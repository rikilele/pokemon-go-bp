/**
 * Calculates the CP of a Pokemon, given it's base stats, IV, and CPM.
 */
function calcCP(baseS, baseA, baseD, ivS, ivA, ivD, cpm) {
  const s = baseS + ivS;
  const a = baseA + ivA;
  const d = baseD + ivD;
  return Math.floor(a * Math.sqrt(s) * Math.sqrt(d) * Math.pow(cpm, 2) / 10);
}

module.exports = calcCP;
