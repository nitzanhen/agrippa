import { ConsoleLogger } from '../logger';
import { run } from '../run';

console.log('cli run');

run({
  logObserver: new ConsoleLogger()
});

