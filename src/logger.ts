import chalk from 'chalk';

import { format, indent, joinLines } from './utils/strings';

const colors = {
  error: chalk.red,
  warning: chalk.yellow,
  debug: chalk.cyan,
  success: chalk.green,
  NA: chalk.hex('#B6B6B6')
};

export class Logger {
  constructor() { }

  info(...messages: unknown[]) {
    const prefixedMesssages = messages
      .map(msg => format(msg))
      .join('\n');
    console.info(prefixedMesssages);
  }

  error(...errs: unknown[]) {
    const prefixedErrs = errs
      .map(err => format(err))
      .map(err => colors.error(err))
      .join('\n');
    console.error(prefixedErrs);
  }

  debug(...messages: unknown[]) {
    if (process.env.DEBUG) {
      const prefixedMesssages = messages
        .map(msg => format(msg))
        .map(msg => colors.debug(msg))
        .join('\n');
      console.log(prefixedMesssages);
    }
  }

  warn(...warnings: unknown[]) {
    const prefixedErrs = warnings
      .map(wrn => format(wrn))
      .map(wrn => colors.warning(wrn))
      .join('\n');
    console.log(prefixedErrs);
  }

  stage(
    status: 'success' | 'warning' | 'error' | 'NA',
    summary: string,
    ...messages: unknown[]
  ) {
    const bullet = ({
      success: '✓',
      warning: '✓',
      error: '✗',
      NA: '•',
    })[status];

    const header = colors[status].bold(`${bullet} ${summary}`);

    const logFn = status === 'error' ? console.error : console.log;

    logFn(joinLines(
      header,
      ...messages.map(
        line => indent(format(line), 1)
      ),
      ''
    ));
  }
}

export const logger = new Logger();