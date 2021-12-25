import { format, indent, joinLines } from './utils/strings';
import { styles } from './utils/styles';

export class Logger {
  
  info(...messages: unknown[]) {
    const prefixedMesssages = messages
      .map(msg => format(msg))
      .join('\n');
    console.info(prefixedMesssages);
  }

  error(...errs: unknown[]) {
    const prefixedErrs = errs
      .map(err => format(err))
      .map(err => styles.error(err))
      .join('\n');
    console.error(prefixedErrs);
  }

  debug(...messages: unknown[]) {
    if (process.env.DEBUG) {
      const prefixedMesssages = messages
        .map(msg => format(msg))
        .map(msg => styles.debug(msg))
        .join('\n');
      console.log(prefixedMesssages);
    }
  }

  warn(...warnings: unknown[]) {
    const prefixedErrs = warnings
      .map(wrn => format(wrn))
      .map(wrn => styles.warning(wrn))
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

    const header = styles[status].bold(`${bullet} ${summary}`);

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