/**
 * Wrapper for fetchBaseStats.
 * Spinner appears while waiting for fetch.
 * @see fetchBaseStats
 */

import { Spinner } from 'cli-spinner';
import { fetchBaseStats } from 'shared';

export default async function fetchBaseStatsWithSpinner() {
  const spinner = new Spinner('%s Fetching Pokemon stats');
  spinner.start();
  const baseStats = await fetchBaseStats();
  spinner.stop(true);
  return baseStats;
}
