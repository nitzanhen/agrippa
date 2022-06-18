import { MaybePromise } from './types';

type Handler = (...args: any[]) => MaybePromise<void>;

export type HandlerMap<EventMap extends Record<string, Handler>> = {
  [K in keyof EventMap]: Set<EventMap[K]>;
}

/**
 * An async variant of EventEmitter, that runs event handlers one by one (as an async waterfall).
 * 
 * @todo find a better name
 */
export class AsyncEventEmitter<EventMap extends Record<string, Handler>> {
  private handlerMap: HandlerMap<EventMap> = Object.create(null);

  addListener<K extends keyof EventMap>(event: K, handler: EventMap[K]) {
    if (!this.handlerMap[event]) {
      this.handlerMap[event] = new Set();
    }

    this.handlerMap[event]!.add(handler);
  }

  on<K extends keyof EventMap>(event: K, handler: EventMap[K]) {
    return this.addListener(event, handler);
  };

  removeListener<K extends keyof EventMap>(event: K, handler: EventMap[K]) {
    this.handlerMap[event]?.delete(handler);
  }

  off<K extends keyof EventMap>(event: K, handler: EventMap[K]) {
    return this.removeListener(event, handler);
  };

  async emit<K extends keyof EventMap>(event: K, ...args: Parameters<EventMap[K]>) {
    const handlers = this.handlerMap[event];

    if(!handlers) {
      // No listeners to notify
      return;
    }

    for (const handler of handlers) {
      await handler(...args);
    }
  }
}