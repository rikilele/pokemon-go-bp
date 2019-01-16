/**
 * Calculates the BP of a Pokemon given it's IV, CPM, and the max CP.
 */

export default function calcBP(baseS, baseA, baseD, ivS, ivA, ivD, cpm, maxCP) {
  const s = baseS + ivS;
  const a = baseA + ivA;
  const d = baseD + ivD;
  return Math.floor(s * (a ** 1.3) * d * (cpm ** 3) / (Math.sqrt(maxCP) * 180));
}
