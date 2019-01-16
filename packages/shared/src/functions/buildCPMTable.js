/**
 * Builds a JavaScript object mapping PL to CPM.
 * See {@link https://pokemongo.gamepress.gg/cp-multiplier} for formula details.
 */

import { PL_VALUES } from '../constants';

export default function buildCPMTable() {
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
