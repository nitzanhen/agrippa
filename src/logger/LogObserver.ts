
export interface LogObserver {
  stdout: (msg: string) => void;
  stderr: (msg: string) => void;
}

export class ConsoleLogger implements LogObserver {
  constructor() {}

  stdout = (msg: string) => console.log(msg);
  stderr = (msg: string) => console.error(msg);
}
