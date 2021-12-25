import { italic } from 'chalk';
import { logger } from '../logger';
import { pkgJson } from './package';

/**
 * Logs the given errors along with an issues prompt, then exits with code 1.
 */
export function panic(...errs: unknown[]): never {
  logger.error(
    ...errs,
    'Generation failed.',
    `If you believe you've found a bug, please visit ${italic(pkgJson.bugs.url)} to submit an issue.`);

  process.exit(1);
}