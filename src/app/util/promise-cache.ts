interface PromiseCacheOptions {
  softMs?: number;
  hardMs?: number;
}

interface PromiseHandler<T = any> {
  resolve: (t: T) => void;
  reject: (e: any) => void;
}

export class PromiseCache<T = any> {
  key: string;
  options: PromiseCacheOptions;
  lastReturn?: T;
  lastTimestamp?: number;
  resolveQueue: Array<PromiseHandler<T>>;
  fetching: boolean;

  constructor(key: string, options: PromiseCacheOptions = {}) {
    this.key = key;
    this.options = options;
    this.resolveQueue = [];
    this.fetching = false;
  }

  call(func: () => Promise<T>): Promise<T> {
    const { softMs } = this.options;

    return new Promise((resolve, reject) => {
      const now = Date.now();
      const { lastReturn, lastTimestamp, fetching } = this;
      if (
        lastReturn &&
        lastTimestamp &&
        softMs &&
        now - lastTimestamp < softMs
      ) {
        return resolve(lastReturn);
      } else {
        if (fetching) {
          this.resolveQueue.push({ resolve, reject });
        } else {
          this.resolveQueue = [{ resolve, reject }];
          this.fetching = true;
          func()
            .then(this.handleResolve, this.handleReject)
            .catch(this.handleReject);
        }
      }
    });
  }

  handleResolve = (v: T) => {
    this.lastReturn = v;
    this.lastTimestamp = Date.now();
    this.fetching = false;

    for (const h of this.resolveQueue) {
      h.resolve(v);
    }

    this.resolveQueue = [];
  };

  handleReject = (e: any) => {
    const { lastReturn, lastTimestamp, options } = this;
    const { hardMs } = options;
    this.fetching = false;

    if (
      lastReturn &&
      lastTimestamp &&
      hardMs &&
      Date.now() - lastTimestamp < hardMs
    ) {
      for (const h of this.resolveQueue) {
        h.resolve(lastReturn);
      }
      this.resolveQueue = [];
      return;
    }

    for (const h of this.resolveQueue) {
      h.reject(e);
    }
    this.resolveQueue = [];
  };
}

export class PromiseCacheManager {
  _internal: { [key: string]: PromiseCache } = {};

  call<T = any>(
    key: string,
    options: PromiseCacheOptions,
    func: () => Promise<T>
  ): Promise<T> {
    if (this._internal[key] === undefined) {
      this._internal[key] = new PromiseCache(key, options);
    }

    return this._internal[key].call(func);
  }
}
